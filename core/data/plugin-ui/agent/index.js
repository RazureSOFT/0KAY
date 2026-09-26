var xs = Object.defineProperty;
var Ss = (n, e, t) => e in n ? xs(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var J = (n, e, t) => Ss(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Ts, defineComponent as At, computed as ne, openBlock as b, createElementBlock as _, ref as F, onMounted as yn, onUnmounted as _n, normalizeClass as ie, createElementVNode as i, toDisplayString as g, createCommentVNode as U, Fragment as oe, renderList as ve, withModifiers as Ie, watch as Re, nextTick as rt, mergeProps as As, unref as re, createBlock as St, Teleport as Vn, createVNode as Me, Transition as jr, withCtx as Wr, normalizeStyle as jt, withDirectives as Ft, vModelText as gn, withKeys as yt, createTextVNode as Se, vModelCheckbox as Es } from "vue";
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
  let u = null, o = !1;
  function m(C) {
    C.reset && a.clear();
    for (const D of C.removed || []) a.delete(D);
    for (const D of C.tasks || []) a.set(D.task_id, D);
    s = C.cursor || "";
    const N = [...a.values()].sort((D, G) => (G.started_at || "").localeCompare(D.started_at || "") || D.task_id.localeCompare(G.task_id));
    n.tasks = N.filter((D) => D.kind !== "agent_session"), n.sessions = N.filter((D) => D.kind === "agent_session");
  }
  function k() {
    u?.close(), o = !1, u = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(s)}`), u.onopen = () => {
      o = !0;
    }, u.onerror = () => {
      o = !1;
    }, u.addEventListener("tasks", (C) => {
      try {
        m(JSON.parse(C.data));
      } catch {
        o = !1;
      }
    });
  }
  function A() {
    return t ? (r || (r = t.then(() => (r = null, A()))), r) : (t = T().finally(() => {
      t = null;
    }), t);
  }
  async function T() {
    n.loading = !0, n.error = "";
    try {
      const C = await fetch("/api/agents", { signal: AbortSignal.timeout(8e3) });
      if (!C.ok) throw new Error(`HTTP ${C.status}`);
      const N = await C.json();
      n.agents = N.agents || [], n.onlineCount = N.online_count ?? n.agents.length;
    } catch (C) {
      n.error = C.message || "failed";
    }
    if (!o)
      try {
        const C = await fetch(`/api/tasks?incremental=1&cursor=${encodeURIComponent(s)}`, { signal: AbortSignal.timeout(8e3) });
        if (!C.ok) throw new Error(`任务记录 HTTP ${C.status}`);
        const N = await C.json();
        m(N);
      } catch (C) {
        n.error = C.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function P() {
    A().then(() => {
      e && k();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && A();
    }, 2e3);
  }
  function z() {
    u?.close(), u = null, o = !1, e && (clearInterval(e), e = null);
  }
  function $(C) {
    return !C.missing_dependencies?.length && (C.status === "PLUGIN_STATUS_HEALTHY" || C.status === "HEALTHY");
  }
  async function q(C) {
    const N = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: C }) });
    if (!N.ok) throw new Error(await N.text());
    const D = await N.json();
    return await A(), D.session_id;
  }
  async function B(C, N, D) {
    const G = await fetch("/api/agent/sessions", { method: N === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, action: N, title: D }) });
    if (!G.ok) throw new Error(await G.text());
    await A();
  }
  async function Q(C, N, D, G = {}) {
    const X = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: C, prompt: N, agent_type: D, ...G }) }), x = await X.text();
    if (await A(), !X.ok) {
      let v = x;
      try {
        v = JSON.parse(x).message || x;
      } catch {
      }
      throw new Error(v);
    }
  }
  async function se(C) {
    const N = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: C }) });
    if (!N.ok) throw new Error(await N.text());
    const D = await N.json();
    if (!D.success) throw new Error(D.message);
    await A();
  }
  return Object.assign(n, {
    fetchAgents: A,
    connect: P,
    disconnect: z,
    isHealthy: $,
    createSession: q,
    manageSession: B,
    sendTask: Q,
    cancelTask: se
  });
}
const $s = Rs();
function Cs() {
  return $s;
}
function qn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ut = qn();
function Vr(n) {
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
    let u = typeof a == "string" ? a : a.source;
    return u = u.replace(me.caret, "$1"), t = t.replace(s, u), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Ls = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), me = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: _t((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: _t((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: _t((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: _t((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: _t((n) => new RegExp(`^ {0,${n}}(?:</?(?:${Vt})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: _t((n) => new RegExp(`^ {0,${n}}>`)) }, Is = /^(?:[ \t]*(?:\n|$))+/, Os = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ps = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Wt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ns = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, qr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = H(qr).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ds = H(qr).replace(/bull/g, Gn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Yn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Ms = /^[^\n]+/, Zn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zs = H(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Zn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Us = H(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Gn).getRegex(), Vt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Kn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fs = H("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Kn).replace("tag", Vt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Yr = (n) => H(Yn).replace("hr", Wt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), Bs = Yr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hs = Yr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), js = H(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hs).getRegex(), Xn = { blockquote: js, code: Os, def: zs, fences: Ps, heading: Ns, hr: Wt, html: Fs, lheading: Gr, list: Us, newline: Is, paragraph: Bs, table: ot, text: Ms }, kr = H("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Wt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex(), Ws = { ...Xn, lheading: Ds, table: kr, paragraph: H(Yn).replace("hr", Wt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vt).getRegex() }, Vs = { ...Xn, html: H(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Kn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ot, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: H(Yn).replace("hr", Wt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Zr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Ys = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ze = /[\p{P}\p{S}]/u, Et = /[\s\p{P}\p{S}]/u, qt = /[^\s\p{P}\p{S}]/u, Zs = H(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Et).getRegex(), Ks = /[\p{Pi}\p{Ps}"']/u, Kr = /(?!~)[\p{P}\p{S}]/u, Xs = /(?!~)[\s\p{P}\p{S}]/u, Qs = /(?:[^\s\p{P}\p{S}]|~)/u, Js = H(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ls ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Xr = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = H(Xr, "u").replace(/punct/g, Ze).getRegex(), tl = H(Xr, "u").replace(/punct/g, Kr).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, rl = H(nl, "u").replace(/openQuote/g, Ks).replace(/punct/g, Ze).getRegex(), Qr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sl = H(Qr, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ze).getRegex(), ll = H(Qr, "gu").replace(/notPunctSpace/g, Qs).replace(/punctSpace/g, Xs).replace(/punct/g, Kr).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = H(al, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ze).getRegex(), il = H("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ze).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = H(ul, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ze).getRegex(), dl = H(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ze).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hl = H(pl, "gu").replace(/notPunctSpace/g, qt).replace(/punctSpace/g, Et).replace(/punct/g, Ze).getRegex(), fl = H(/\\(punct)/, "gu").replace(/punct/g, Ze).getRegex(), gl = H(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = H(Kn).replace("(?:-->|$)", "-->").getRegex(), kl = H("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Jr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, mn = H(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", Jr).getRegex(), vl = H(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", mn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), bl = H(/^!?\[(label)\]\[(ref)\]/).replace("label", mn).replace("ref", Zn).getRegex(), yl = H(/^!?\[(ref)\](?:\[\])?/).replace("ref", Zn).getRegex(), vr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = H(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", Jr).getRegex(), wl = H("reflink|nolink(?!\\()", "g").replace("reflink", H(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", vr).getRegex()).replace("nolink", H(/^!?\[(ref)\](?:\[\])?/).replace("ref", vr).getRegex()).getRegex(), br = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Sl = H(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), Qn = { _backpedal: ot, anyPunctuation: fl, autolink: gl, blockSkip: Js, br: Zr, code: Gs, del: ot, delLDelim: ot, delRDelim: ot, emStrongLDelim: el, emStrongRDelimAst: sl, emStrongRDelimUnd: il, escape: qs, link: vl, nolink: yl, punctuation: Zs, reflink: bl, reflinkSearch: wl, tag: kl, text: Ys, url: ot }, Tl = { ...Qn, emStrongLDelim: rl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: H(/^!?\[(label)\]\((.*?)\)/).replace("label", mn).getRegex(), reflink: H(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", mn).getRegex() }, Fn = { ...Qn, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: hl, url: H(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Sl).replace("protocol", br).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: H(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", br).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...Fn, br: H(Zr).replace("{2,}", "*").getRegex(), text: H(Fn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, cn = { normal: Xn, gfm: Ws, pedantic: Vs }, Dt = { normal: Qn, gfm: Fn, breaks: Al, pedantic: Tl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, yr = (n) => El[n];
function Ae(n, e) {
  if (e) {
    if (me.escapeTest.test(n)) return n.replace(me.escapeReplace, yr);
  } else if (me.escapeTestNoEncode.test(n)) return n.replace(me.escapeReplaceNoEncode, yr);
  return n;
}
function Rl(n) {
  return n.replace(me.numericCharacterReference, (e, t, r) => {
    let s = t === void 0 ? Number.parseInt(r, 16) : Number.parseInt(t, 10);
    return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "�" : String.fromCodePoint(s);
  });
}
function _r(n) {
  try {
    n = encodeURI(n).replace(me.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function wr(n, e) {
  let t = n.replace(me.findPipe, (a, u, o) => {
    let m = !1, k = u;
    for (; --k >= 0 && o[k] === "\\"; ) m = !m;
    return m ? "|" : " |";
  }), r = t.split(me.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(me.slashPipe, "|");
  return r;
}
function et(n, e, t) {
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
  for (; t >= 0 && me.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function kn(n) {
  return n.trim().toLowerCase().toUpperCase().toLowerCase();
}
function $l(n, e) {
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
  let a = e.href, u = e.title || null, o = n[1].replace(s.other.outputLinkReplace, "$1"), m = n[0].charAt(0) === "!";
  r.state.inLink = !0;
  let k = r.state.linkEmitted, A = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let T = r.inlineTokens(o), P = r.state.linkEmitted;
  if (r.state.linkEmitted = k, r.state.inLink = !1, !m) {
    if (P) {
      r.state.inRawBlock = A;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return { type: m ? "image" : "link", raw: t, href: a, title: u, text: o, tokens: T };
}
function Cl(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let s = r[1];
  return e.split(`
`).map((a) => {
    let u = a.match(t.other.beginningSpace);
    if (u === null) return a;
    let [o] = u;
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
    let a = n.slice(t + s), u = r.inline.tag.exec(a) || r.inline.autolink.exec(a);
    if (u) {
      if (u[0].length > e.length - s) return !0;
      s += u[0].length - 1;
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
      let t = e[0], r = Cl(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = et(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: et(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: et(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = et(e[0], `
`).split(`
`), r = "", s = "", a = [];
      for (; t.length > 0; ) {
        let u = !1, o = [], m;
        for (m = 0; m < t.length; m++) if (this.rules.other.blockquoteStart.test(t[m])) o.push(t[m]), u = !0;
        else if (!u) o.push(t[m]);
        else break;
        t = t.slice(m);
        let k = o.join(`
`), A = k.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${k}` : k, s = s ? `${s}
${A}` : A;
        let T = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(A, a, !0), this.lexer.state.top = T, t.length === 0) break;
        let P = a.at(-1);
        if (P?.type === "code") break;
        if (P?.type === "blockquote") {
          let z = P, $ = t.join(`
`), q = z.raw + `
` + $.replace(this.rules.other.blockquoteSetextReplace2, ""), B = this.blockquote(q);
          a[a.length - 1] = B;
          let Q = q.substring(B.raw.length).replace(/^\n/, ""), se = Q ? Q.split(`
`).length : 0, C = se ? t.slice(0, -se) : t;
          C.length > 0 && (r = `${r}
${C.join(`
`)}`), s = s.substring(0, s.length - z.text.length) + B.text;
          break;
        } else if (P?.type === "list") {
          let z = P, $ = z.raw + `
` + t.join(`
`), q = this.list($);
          a[a.length - 1] = q, r = r.substring(0, r.length - P.raw.length) + q.raw, s = s.substring(0, s.length - z.raw.length) + q.raw, t = $.substring(a.at(-1).raw.length).split(`
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
      let a = this.rules.other.listItemRegex(t), u = !1;
      for (; n; ) {
        let m = !1, k = "", A = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        k = e[0], n = n.substring(k.length);
        let T = e[2].split(`
`, 1)[0], P = e[1].length, z = this.options.pedantic ? Sr(T, P) : T.replace(this.rules.other.leadingSpaceTab, (Q) => Sr(Q, P)), $ = n.split(`
`, 1)[0], q = !z.trim(), B = 0;
        if (this.options.pedantic ? (B = 2, A = z.trimStart()) : q ? B = P + 1 : (B = z.search(this.rules.other.nonSpaceChar), B = B > 4 ? 1 : B, A = z.slice(B), B += P), q && this.rules.other.blankLine.test($) && (k += $ + `
`, n = n.substring($.length + 1), m = !0), !m) {
          let Q = this.rules.other.nextBulletRegex(B), se = this.rules.other.hrRegex(B), C = this.rules.other.fencesBeginRegex(B), N = this.rules.other.headingBeginRegex(B), D = this.rules.other.htmlBeginRegex(B), G = this.rules.other.blockquoteBeginRegex(B);
          for (; n; ) {
            let X = n.split(`
`, 1)[0], x;
            if ($ = X, this.options.pedantic ? ($ = $.replace(this.rules.other.listReplaceNesting, "  "), x = $) : x = $.replace(this.rules.other.leadingSpaceTab, (v) => v.replace(this.rules.other.tabCharGlobal, "    ")), C.test($) || N.test($) || D.test($) || G.test($) || Q.test($) || se.test($)) break;
            if (x.search(this.rules.other.nonSpaceChar) >= B || !$.trim()) A += `
` + x.slice(B);
            else {
              if (q || z.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || C.test(z) || N.test(z) || se.test(z)) break;
              A += `
` + $;
            }
            q = !$.trim(), k += X + `
`, n = n.substring(X.length + 1), z = x.slice(B);
          }
        }
        s.loose || (u ? s.loose = !0 : this.rules.other.doubleBlankLine.test(k) && (u = !0)), s.items.push({ type: "list_item", raw: k, task: !!this.options.gfm && this.rules.other.listIsTask.test(A), loose: !1, text: A, tokens: [] }), s.raw += k;
      }
      let o = s.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let m of s.items) if (this.lexer.state.top = !1, m.tokens = this.lexer.blockTokens(m.text, []), !s.loose) {
        let k = m.tokens.filter((T) => T.type === "space"), A = k.length > 0 && k.some((T) => this.rules.other.anyLine.test(T.raw));
        s.loose = A;
      }
      for (let m of s.items) {
        let k = m.tokens[0];
        if (m.task && (k?.type === "text" || k?.type === "paragraph")) {
          m.text = m.text.replace(this.rules.other.listReplaceTask, ""), k.raw = k.raw.replace(this.rules.other.listReplaceTask, ""), k.text = k.text.replace(this.rules.other.listReplaceTask, "");
          for (let T = this.lexer.inlineQueue.length - 1; T >= 0; T--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[T].src)) {
            this.lexer.inlineQueue[T].src = this.lexer.inlineQueue[T].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let A = this.rules.other.listTaskCheckbox.exec(m.raw);
          if (A) {
            let T = { type: "checkbox", raw: A[0] + " ", checked: A[0] !== "[ ]" };
            m.checked = T.checked, s.loose ? m.tokens[0] && ["paragraph", "text"].includes(m.tokens[0].type) && "tokens" in m.tokens[0] && m.tokens[0].tokens ? (m.tokens[0].raw = T.raw + m.tokens[0].raw, m.tokens[0].text = T.raw + m.tokens[0].text, m.tokens[0].tokens.unshift(T)) : m.tokens.unshift({ type: "paragraph", raw: T.raw, text: T.raw, tokens: [T] }) : m.tokens.unshift(T);
          }
        } else m.task && (m.task = !1);
      }
      if (s.loose) for (let m of s.items) {
        m.loose = !0;
        for (let k of m.tokens) k.type === "text" && (k.type = "paragraph");
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
      return { type: "def", tag: t, raw: et(e[0], `
`), href: r, title: s };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = wr(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: et(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let u of r) this.rules.other.tableAlignRight.test(u) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(u) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(u) ? a.align.push("left") : a.align.push(null);
      for (let u = 0; u < t.length; u++) a.header.push({ text: t[u], tokens: this.lexer.inline(t[u]), header: !0, align: a.align[u] });
      for (let u of s) a.rows.push(wr(u, a.header.length).map((o, m) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[m] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: et(e[0], `
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
        let u = et(r.slice(0, -1), "\\");
        if ((r.length - u.length) % 2 === 0) return;
      } else {
        let u = $l(e[2], "()");
        if (u === -2) return;
        if (u > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + u;
          e[2] = e[2].substring(0, u), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let s = e[2], a = "";
      if (this.options.pedantic) {
        let u = this.rules.other.pedanticHrefTitle.exec(s);
        u && (s = u[1], a = u[3]);
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
        let u = t[0].charAt(0);
        return { type: "text", raw: u, text: u };
      }
      return Tr(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, a, u, o = s, m = 0, k = r[0][0], A = t === k, T = k === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (T.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = T.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (u = [...a].length, r[3] || r[4]) {
          o += u;
          continue;
        } else if (r[5] || r[6]) {
          if (s % 3 && !((s + u) % 3)) {
            m += u;
            continue;
          }
          if (A) break;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o + m);
        let P = [...r[0]][0].length, z = n.slice(0, s + r.index + P + u);
        if (Math.min(s, u) % 2) {
          let q = z.slice(1, -1);
          return { type: "em", raw: z, text: q, tokens: this.lexer.inlineTokens(q) };
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
      let s = [...r[0]].length - 1, a, u, o = s, m = this.rules.inline.delRDelim;
      for (m.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = m.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (u = [...a].length, u !== s)) continue;
        if (r[3] || r[4]) {
          o += u;
          continue;
        }
        if (o -= u, o > 0) continue;
        u = Math.min(u, u + o);
        let k = [...r[0]][0].length, A = n.slice(0, s + r.index + k + u), T = A.slice(s, -s);
        return { type: "del", raw: A, text: T, tokens: this.lexer.inlineTokens(T) };
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
}, ze = class Bn {
  constructor(e) {
    J(this, "tokens");
    J(this, "options");
    J(this, "state");
    J(this, "inlineQueue");
    J(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ut, this.options.tokenizer = this.options.tokenizer || new vn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: me, block: cn.normal, inline: Dt.normal };
    this.options.pedantic ? (t.block = cn.pedantic, t.inline = Dt.pedantic) : this.options.gfm && (t.block = cn.gfm, this.options.breaks ? t.inline = Dt.breaks : t.inline = Dt.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: cn, inline: Dt };
  }
  static lex(e, t) {
    return new Bn(t).lex(e);
  }
  static lexInline(e, t) {
    return new Bn(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(me.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(me.tabCharGlobal, "    ").replace(me.spaceLine, ""));
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
      let u = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, m = e.slice(1), k;
        this.options.extensions.startBlock.forEach((A) => {
          k = A.call({ lexer: this }, m), typeof k == "number" && k >= 0 && (o = Math.min(o, k));
        }), o < 1 / 0 && o >= 0 && (u = e.substring(0, o + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(u))) {
        let o = t.at(-1);
        r && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + a.raw, o.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(a), r = u.length !== e.length, e = e.substring(a.raw.length);
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
      let o = this.tokenizer.rules.inline.reflinkSearch, m = (k) => {
        let A = k.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, kn(k.slice(A + 1, -1)))) return k;
        if (A > 1 && k.charAt(0) !== "!") {
          let T = k.slice(1, A - 1);
          if (this.linkInText(T)) return "[" + T.replace(o, m) + "][" + "a".repeat(k.length - A - 2) + "]";
        }
        return "[" + "a".repeat(k.length - 2) + "]";
      };
      r = r.replace(o, m);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (o, m, k) => {
      let A = k ? k.length : 0;
      return o.slice(0, A) + "[" + "a".repeat(o.length - A - 2) + "]";
    }), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let s = !1, a = "", u = 1 / 0;
    for (; e; ) {
      if (e.length < u) u = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      s || (a = ""), s = !1;
      let o;
      if (this.options.extensions?.inline?.some((k) => (o = k.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
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
        let k = t.at(-1);
        o.type === "text" && k?.type === "text" ? (k.raw += o.raw, k.text += o.text) : t.push(o);
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
      let m = e;
      if (this.options.extensions?.startInline) {
        let k = 1 / 0, A = e.slice(1), T;
        this.options.extensions.startInline.forEach((P) => {
          T = P.call({ lexer: this }, A), typeof T == "number" && T >= 0 && (k = Math.min(k, T));
        }), k < 1 / 0 && k >= 0 && (m = e.substring(0, k + 1));
      }
      if (o = this.tokenizer.inlineText(m)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = !0;
        let k = t.at(-1);
        k?.type === "text" ? (k.raw += o.raw, k.text += o.text) : t.push(o);
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
    let r = (e || "").match(me.notSpaceStart)?.[0], s = n ? n.replace(me.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + Ae(r) + '">' + (t ? s : Ae(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : Ae(s, !0)) + `</code></pre>
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
    for (let u = 0; u < n.items.length; u++) {
      let o = n.items[u];
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
      for (let u = 0; u < a.length; u++) t += this.tablecell(a[u]);
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
    return `<code>${Ae(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: r, autolink: s }) {
    let a = s ? Ae(t, !0) : this.parser.parseInline(r), u = _r(n);
    if (u === null) return a;
    n = Ae(u, s);
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + Ae(e) + '"'), o += ">" + a + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = _r(n);
    if (s === null) return Ae(t);
    n = s;
    let a = `<img src="${Ae(n)}" alt="${Ae(t)}"`;
    return e && (a += ` title="${Ae(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : Ae(n.text);
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
}, Ue = class Hn {
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
        let u = s, o = this.options.extensions.renderers[u.type].call({ parser: this }, u);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(u.type)) {
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
      let u = a;
      switch (u.type) {
        case "escape": {
          r += t.text(u);
          break;
        }
        case "html": {
          r += t.html(u);
          break;
        }
        case "link": {
          r += t.link(u);
          break;
        }
        case "image": {
          r += t.image(u);
          break;
        }
        case "checkbox": {
          r += t.checkbox(u);
          break;
        }
        case "strong": {
          r += t.strong(u);
          break;
        }
        case "em": {
          r += t.em(u);
          break;
        }
        case "codespan": {
          r += t.codespan(u);
          break;
        }
        case "br": {
          r += t.br(u);
          break;
        }
        case "del": {
          r += t.del(u);
          break;
        }
        case "text": {
          r += t.text(u);
          break;
        }
        default: {
          let o = 'Token with "' + u.type + '" type was not found.';
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
    return n ? ze.lex : ze.lexInline;
  }
  provideParser(n = this.block) {
    return n ? Ue.parse : Ue.parseInline;
  }
}, J(fn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), J(fn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), fn), Ll = class {
  constructor(...n) {
    J(this, "defaults", qn());
    J(this, "options", this.setOptions);
    J(this, "parse", this.parseMarkdown(!0));
    J(this, "parseInline", this.parseMarkdown(!1));
    J(this, "Parser", Ue);
    J(this, "Renderer", bn);
    J(this, "TextRenderer", Jn);
    J(this, "Lexer", ze);
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
        for (let a of s.rows) for (let u of a) t = t.concat(this.walkTokens(u.tokens, e));
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
          let u = s[a].flat(1 / 0);
          t = t.concat(this.walkTokens(u, e));
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
          a ? e.renderers[s.name] = function(...u) {
            let o = s.renderer.apply(this, u);
            return o === !1 && (o = a.apply(this, u)), o;
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
          let u = a, o = t.renderer[u], m = s[u];
          s[u] = (...k) => {
            let A = o.apply(s, k);
            return A === !1 && (A = m.apply(s, k)), A || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new vn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in s)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let u = a, o = t.tokenizer[u], m = s[u];
          s[u] = (...k) => {
            let A = o.apply(s, k);
            return A === !1 && (A = m.apply(s, k)), A;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new Bt();
        for (let a in t.hooks) {
          if (!(a in s)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let u = a, o = t.hooks[u], m = s[u];
          Bt.passThroughHooks.has(a) ? s[u] = (k) => {
            if (this.defaults.async && Bt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let T = await o.call(s, k);
              return m.call(s, T);
            })();
            let A = o.call(s, k);
            return m.call(s, A);
          } : s[u] = (...k) => {
            if (this.defaults.async) return (async () => {
              let T = await o.apply(s, k);
              return T === !1 && (T = await m.apply(s, k)), T;
            })();
            let A = o.apply(s, k);
            return A === !1 && (A = m.apply(s, k)), A;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, a = t.walkTokens;
        r.walkTokens = function(u) {
          let o = [];
          return o.push(a.call(this, u)), s && (o = o.concat(s.call(this, u))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return ze.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Ue.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let u = s.hooks ? await s.hooks.preprocess(e) : e, o = await (s.hooks ? await s.hooks.provideLexer(n) : n ? ze.lex : ze.lexInline)(u, s), m = s.hooks ? await s.hooks.processAllTokens(o) : o;
        s.walkTokens && await Promise.all(this.walkTokens(m, s.walkTokens));
        let k = await (s.hooks ? await s.hooks.provideParser(n) : n ? Ue.parse : Ue.parseInline)(m, s);
        return s.hooks ? await s.hooks.postprocess(k) : k;
      })().catch(a);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let u = (s.hooks ? s.hooks.provideLexer(n) : n ? ze.lex : ze.lexInline)(e, s);
        s.hooks && (u = s.hooks.processAllTokens(u)), s.walkTokens && this.walkTokens(u, s.walkTokens);
        let o = (s.hooks ? s.hooks.provideParser(n) : n ? Ue.parse : Ue.parseInline)(u, s);
        return s.hooks && (o = s.hooks.postprocess(o)), o;
      } catch (u) {
        return a(u);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + Ae(t.message + "", !0) + "</pre>";
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
  return it.setOptions(n), ee.defaults = it.defaults, Vr(ee.defaults), ee;
};
ee.getDefaults = qn;
ee.defaults = ut;
function Il(...n) {
  return it.use(...n), ee.defaults = it.defaults, Vr(ee.defaults), ee;
}
ee.use = Il;
ee.walkTokens = function(n, e) {
  return it.walkTokens(n, e);
};
ee.parseInline = it.parseInline;
ee.Parser = Ue;
ee.parser = Ue.parse;
ee.Renderer = bn;
ee.TextRenderer = Jn;
ee.Lexer = ze;
ee.lexer = ze.lex;
ee.Tokenizer = vn;
ee.Hooks = Bt;
ee.parse = ee;
ee.options;
ee.setOptions;
ee.walkTokens;
ee.parseInline;
Ue.parse;
ze.lex;
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
    var r, s, a, u, o = [], m = !0, k = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(m = (r = a.call(t)).done) && (o.push(r.value), o.length !== e); m = !0) ;
    } catch (A) {
      k = !0, s = A;
    } finally {
      try {
        if (!m && t.return != null && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (k) throw s;
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
    if (typeof n == "string") return Er(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Er(n, e) : void 0;
  }
}
const es = Object.entries, Rr = Object.setPrototypeOf, zl = Object.isFrozen, Ul = Object.getPrototypeOf, Fl = Object.getOwnPropertyDescriptor;
let he = Object.freeze, ge = Object.seal, xt = Object.create, ts = typeof Reflect < "u" && Reflect, jn = ts.apply, Wn = ts.construct;
he || (he = function(e) {
  return e;
});
ge || (ge = function(e) {
  return e;
});
jn || (jn = function(e, t) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) s[a - 2] = arguments[a];
  return e.apply(t, s);
});
Wn || (Wn = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
  return new e(...r);
});
const at = pe(Array.prototype.forEach), Bl = pe(Array.prototype.lastIndexOf), $r = pe(Array.prototype.pop), Mt = pe(Array.prototype.push), Hl = pe(Array.prototype.splice), Tt = Array.isArray, Ht = pe(String.prototype.toLowerCase), Pn = pe(String.prototype.toString), Cr = pe(String.prototype.match), zt = pe(String.prototype.replace), Lr = pe(String.prototype.indexOf), jl = pe(String.prototype.trim), Wl = pe(Number.prototype.toString), Vl = pe(Boolean.prototype.toString), Ir = typeof BigInt > "u" ? null : pe(BigInt.prototype.toString), Or = typeof Symbol > "u" ? null : pe(Symbol.prototype.toString), _e = pe(Object.prototype.hasOwnProperty), Ut = pe(Object.prototype.toString), ke = pe(RegExp.prototype.test), tt = ql(TypeError);
function pe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
    return jn(n, e, r);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return Wn(n, t);
  };
}
function Z(n, e) {
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
  for (let e = 0; e < n.length; e++) _e(n, e) || (n[e] = null);
  return n;
}
function Ee(n) {
  const e = xt(null);
  for (const r of es(n)) {
    var t = Dl(r, 2);
    const s = t[0], a = t[1];
    _e(n, s) && (Tt(a) ? e[s] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[s] = Ee(a) : e[s] = a);
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
      return Ir ? Ir(n) : "0";
    case "symbol":
      return Or ? Or(n) : "Symbol()";
    case "undefined":
      return Ut(n);
    case "function":
    case "object": {
      if (n === null) return Ut(n);
      const e = n, t = Le(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : Ut(r);
      }
      return Ut(n);
    }
    default:
      return Ut(n);
  }
}
function Le(n, e) {
  for (; n !== null; ) {
    const r = Fl(n, e);
    if (r) {
      if (r.get) return pe(r.get);
      if (typeof r.value == "function") return pe(r.value);
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
    return ke(n, ""), !0;
  } catch {
    return !1;
  }
}
const Pr = he([
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
]), Nn = he([
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
]), Dn = he([
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
]), Kl = he([
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
]), Mn = he([
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
]), Xl = he([
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
]), Nr = he(["#text"]), Dr = he([
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
]), zn = he([
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
]), Mr = he([
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
]), dn = he([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = ge(/{{[\w\W]*|^[\w\W]*}}/g), Jl = ge(/<%[\w\W]*|^[\w\W]*%>/g), ea = ge(/\${[\w\W]*/g), ta = ge(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = ge(/^aria-[\-\w]+$/), zr = ge(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), ra = ge(/^(?:\w+script|data):/i), sa = ge(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = ge(/^html$/i), aa = ge(/^[a-z][.\w]*(-[.\w]+)+$/i), Ur = ge(/<[/\w!]/g), Fr = ge(/<[/\w]/g), oa = ge(/<\/no(script|embed|frames)/i), ia = ge(/\/>/i), Te = {
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
], ua = he(Z({}, ns)), ca = function() {
  const n = {};
  return at(ns, (e) => {
    n[e] = ge(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), he(n);
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
}, nt = function(e, t, r, s) {
  return _e(e, t) && Tt(e[t]) ? Z(s.base ? Ee(s.base) : {}, e[t], s.transform) : r;
}, Un = function(e, t, r) {
  const s = _e(e, t) ? e[t] : void 0;
  return s && typeof s == "object" ? Ee(s) : r();
};
function rs() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (S) => rs(S);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== Te.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, s = r.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, u = n.Node, o = n.Element, m = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const k = n.DOMParser, A = n.trustedTypes, T = o.prototype, P = Le(T, "cloneNode"), z = Le(T, "remove"), $ = Le(T, "removeAttributeNode"), q = Le(T, "nextSibling"), B = Le(T, "childNodes"), Q = Le(T, "parentNode"), se = Le(T, "shadowRoot"), C = Le(T, "attributes"), N = u && u.prototype ? Le(u.prototype, "nodeType") : null, D = u && u.prototype ? Le(u.prototype, "nodeName") : null, G = u && u.prototype ? Le(u.prototype, "ownerDocument") : null, X = function(l) {
    return N ? N(l) : l.nodeType;
  }, x = function(l) {
    return D ? D(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const S = t.createElement("template");
    S.content && S.content.ownerDocument && (t = S.content.ownerDocument);
  }
  let v, h = "", y, R = !1, L = 0;
  const ae = function() {
    if (L > 0) throw tt('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, W = function(l) {
    ae(), L++;
    try {
      return v.createHTML(l);
    } finally {
      L--;
    }
  }, fe = function(l) {
    ae(), L++;
    try {
      return v.createScriptURL(l);
    } finally {
      L--;
    }
  }, wn = function() {
    return R || (y = pa(A, s), R = !0), y;
  }, ct = t, Fe = ct.implementation, Gt = ct.createNodeIterator, Rt = ct.createDocumentFragment, Yt = ct.getElementsByTagName, xn = r.importNode;
  let I = Br();
  e.isSupported = typeof es == "function" && typeof Q == "function" && Fe && Fe.createHTMLDocument !== void 0;
  const Zt = Ql, Kt = Jl, Xt = ea, Sn = ta, Qt = na, Jt = ra, le = sa, be = aa;
  let Be = zr, K = null;
  const $e = Z({}, [
    ...Pr,
    ...Nn,
    ...Dn,
    ...Mn,
    ...Nr
  ]);
  let j = null;
  const Ke = Z({}, [
    ...Dr,
    ...zn,
    ...Mr,
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
  })), Oe = null, $t = null;
  const Pe = Object.seal(xt(null, {
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
  let de = !0, Ne = !0, Xe = !1, dt = !0, we = !1, He = !0, je = !1, Ct = !1, pt = null, Qe = null, De = !1, Ge = !1, st = !1, ht = !1, Lt = !0, It = !1;
  const en = "user-content-";
  let ft = !0, Ot = !1, We = {}, d = null;
  const f = Z({}, [
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
  const M = Z({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Tn = null;
  const tr = Z({}, [
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
  const os = Z({}, [
    tn,
    nn,
    Ve
  ], Pn), nr = he([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Rn = Z({}, nr);
  const rr = he(["annotation-xml"]);
  let $n = Z({}, rr);
  const is = Z({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Pt = null;
  const us = ["application/xhtml+xml", "text/html"], cs = "text/html";
  let ce = null, mt = null;
  const ds = t.createElement("form"), sr = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, Cn = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (mt && mt === l) return;
    (!l || typeof l != "object") && (l = {}), l = Ee(l), Pt = us.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? cs : l.PARSER_MEDIA_TYPE, ce = Pt === "application/xhtml+xml" ? Pn : Ht, K = nt(l, "ALLOWED_TAGS", $e, { transform: ce }), j = nt(l, "ALLOWED_ATTR", Ke, { transform: ce }), En = nt(l, "ALLOWED_NAMESPACES", os, { transform: Pn }), Tn = nt(l, "ADD_URI_SAFE_ATTR", tr, {
      transform: ce,
      base: tr
    }), p = nt(l, "ADD_DATA_URI_TAGS", M, {
      transform: ce,
      base: M
    }), d = nt(l, "FORBID_CONTENTS", f, { transform: ce }), Oe = nt(l, "FORBID_TAGS", Ee({}), { transform: ce }), $t = nt(l, "FORBID_ATTR", Ee({}), { transform: ce }), We = _e(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? Ee(l.USE_PROFILES) : l.USE_PROFILES : !1, de = l.ALLOW_ARIA_ATTR !== !1, Ne = l.ALLOW_DATA_ATTR !== !1, Xe = l.ALLOW_UNKNOWN_PROTOCOLS || !1, dt = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, we = l.SAFE_FOR_TEMPLATES || !1, He = l.SAFE_FOR_XML !== !1, je = l.WHOLE_DOCUMENT || !1, Ge = l.RETURN_DOM || !1, st = l.RETURN_DOM_FRAGMENT || !1, ht = l.RETURN_TRUSTED_TYPE || !1, De = l.FORCE_BODY || !1, Lt = l.SANITIZE_DOM !== !1, It = l.SANITIZE_NAMED_PROPS || !1, ft = l.KEEP_CONTENT !== !1, Ot = l.IN_PLACE || !1, Be = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : zr, gt = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Ve, Rn = Un(l, "MATHML_TEXT_INTEGRATION_POINTS", () => Z({}, nr)), $n = Un(l, "HTML_INTEGRATION_POINTS", () => Z({}, rr));
    const c = Un(l, "CUSTOM_ELEMENT_HANDLING", () => xt(null));
    if (te = xt(null), _e(c, "tagNameCheck") && sr(c.tagNameCheck) && (te.tagNameCheck = c.tagNameCheck), _e(c, "attributeNameCheck") && sr(c.attributeNameCheck) && (te.attributeNameCheck = c.attributeNameCheck), _e(c, "allowCustomizedBuiltInElements") && typeof c.allowCustomizedBuiltInElements == "boolean" && (te.allowCustomizedBuiltInElements = c.allowCustomizedBuiltInElements), ge(te), we && (Ne = !1), st && (Ge = !0), We && (K = Z({}, Nr), j = xt(null), We.html === !0 && (Z(K, Pr), Z(j, Dr)), We.svg === !0 && (Z(K, Nn), Z(j, zn), Z(j, dn)), We.svgFilters === !0 && (Z(K, Dn), Z(j, zn), Z(j, dn)), We.mathMl === !0 && (Z(K, Mn), Z(j, Mr), Z(j, dn))), Pe.tagCheck = null, Pe.attributeCheck = null, _e(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Pe.tagCheck = l.ADD_TAGS : Tt(l.ADD_TAGS) && (K === $e && (K = Ee(K)), Z(K, l.ADD_TAGS, ce))), _e(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Pe.attributeCheck = l.ADD_ATTR : Tt(l.ADD_ATTR) && (j === Ke && (j = Ee(j)), Z(j, l.ADD_ATTR, ce))), _e(l, "ADD_FORBID_CONTENTS") && Tt(l.ADD_FORBID_CONTENTS) && (d === f && (d = Ee(d)), Z(d, l.ADD_FORBID_CONTENTS, ce)), ft && (K["#text"] = !0), je && Z(K, [
      "html",
      "head",
      "body"
    ]), K.table && (Z(K, ["tbody"]), delete Oe.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw tt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw tt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const w = v;
      v = l.TRUSTED_TYPES_POLICY;
      try {
        h = W("");
      } catch (E) {
        throw v = w, E;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (v = void 0, h = "") : (v === void 0 && (v = wn()), v && typeof h == "string" && (h = W("")));
    he && he(l), mt = l;
  }, lr = Z({}, [
    ...Nn,
    ...Dn,
    ...Kl
  ]), ar = Z({}, [...Mn, ...Xl]), ps = function(l, c, w) {
    return c.namespaceURI === Ve ? l === "svg" : c.namespaceURI === tn ? l === "svg" && (w === "annotation-xml" || Rn[w]) : !!lr[l];
  }, hs = function(l, c, w) {
    return c.namespaceURI === Ve ? l === "math" : c.namespaceURI === nn ? l === "math" && $n[w] : !!ar[l];
  }, fs = function(l, c, w) {
    return c.namespaceURI === nn && !$n[w] || c.namespaceURI === tn && !Rn[w] ? !1 : !ar[l] && (is[l] || !lr[l]);
  }, gs = function(l) {
    let c = Q(l);
    (!c || !c.tagName) && (c = {
      namespaceURI: gt,
      tagName: "template"
    });
    const w = Ht(l.tagName), E = Ht(c.tagName);
    return En[l.namespaceURI] ? l.namespaceURI === nn ? ps(w, c, E) : l.namespaceURI === tn ? hs(w, c, E) : l.namespaceURI === Ve ? fs(w, c, E) : !!(Pt === "application/xhtml+xml" && En[l.namespaceURI]) : !1;
  }, Je = function(l) {
    Mt(e.removed, { element: l });
    try {
      Q(l).removeChild(l);
    } catch {
      if (z(l), !Q(l)) throw tt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, or = function(l, c, w) {
    try {
      $(l, c);
    } catch {
      try {
        l.removeAttribute(w);
      } catch {
      }
    }
  }, rn = function(l) {
    sn(l);
    const c = B(l);
    if (c) {
      const E = [];
      at(c, (O) => {
        Mt(E, O);
      }), at(E, (O) => {
        try {
          z(O);
        } catch {
        }
      });
    }
    const w = C(l);
    if (w) for (let E = w.length - 1; E >= 0; --E) {
      const O = w[E], V = O && O.name;
      typeof V == "string" && or(l, O, V);
    }
  }, lt = function(l, c, w) {
    if (!w) try {
      w = c.getAttributeNode(l);
    } catch {
      w = null;
    }
    Mt(e.removed, {
      attribute: w || null,
      from: c
    });
    try {
      w ? $(c, w) : c.removeAttribute(l);
    } catch {
      try {
        c.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (Ge || st) try {
        Je(c);
      } catch {
      }
      else try {
        c.setAttribute(l, "");
      } catch {
      }
  }, ms = function(l) {
    const c = C(l);
    if (c)
      for (let w = c.length - 1; w >= 0; --w) {
        const E = c[w], O = E && E.name;
        typeof O != "string" || j[ce(O)] || or(l, E, O);
      }
  }, sn = function(l) {
    const c = [l];
    for (; c.length > 0; ) {
      const w = c.pop();
      X(w) === Te.element && ms(w);
      const E = B(w);
      if (E) for (let O = E.length - 1; O >= 0; --O) c.push(E[O]);
    }
  }, ir = function(l, c) {
    return He ? l === "patchsrc" ? !0 : l === "for" && c !== "label" && c !== "output" : !1;
  }, ks = function(l) {
    if (!He) return;
    const c = [l];
    for (; c.length > 0; ) {
      const w = c.pop(), E = X(w);
      if (E === Te.processingInstruction || E === Te.comment && ke(Fr, w.data)) {
        try {
          z(w);
        } catch {
        }
        continue;
      }
      if (E === Te.element) {
        const V = w, Y = ce(x(w));
        try {
          V.hasAttribute && V.hasAttribute("patchsrc") && V.removeAttribute("patchsrc"), V.hasAttribute && V.hasAttribute("for") && ir("for", Y) && V.removeAttribute("for");
        } catch {
        }
      }
      const O = B(w);
      if (O) for (let V = O.length - 1; V >= 0; --V) c.push(O[V]);
    }
  }, ur = function(l) {
    let c = null, w = null;
    if (De) l = "<remove></remove>" + l;
    else {
      const V = Cr(l, /^[\r\n\t ]+/);
      w = V && V[0];
    }
    Pt === "application/xhtml+xml" && gt === Ve && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const E = v ? W(l) : l;
    if (gt === Ve) try {
      c = new k().parseFromString(E, Pt);
    } catch {
    }
    if (!c || !c.documentElement) {
      c = Fe.createDocument(gt, "template", null);
      try {
        c.documentElement.innerHTML = An ? h : E;
      } catch {
      }
    }
    const O = c.body || c.documentElement;
    return l && w && O.insertBefore(t.createTextNode(w), O.childNodes[0] || null), gt === Ve ? Yt.call(c, je ? "html" : "body")[0] : je ? c.documentElement : O;
  }, cr = function(l) {
    const c = G ? G(l) : l.ownerDocument;
    return Gt.call(c || l, l, m.SHOW_ELEMENT | m.SHOW_COMMENT | m.SHOW_TEXT | m.SHOW_PROCESSING_INSTRUCTION | m.SHOW_CDATA_SECTION, null);
  }, ln = function(l) {
    return l = zt(l, Zt, " "), l = zt(l, Kt, " "), l = zt(l, Xt, " "), l;
  }, Ln = function(l) {
    var c;
    l.normalize();
    const w = G ? G(l) : l.ownerDocument, E = Gt.call(w || l, l, m.SHOW_TEXT | m.SHOW_COMMENT | m.SHOW_CDATA_SECTION | m.SHOW_PROCESSING_INSTRUCTION, null);
    let O = E.nextNode();
    for (; O; )
      O.data = ln(O.data), O = E.nextNode();
    const V = (c = l.querySelectorAll) === null || c === void 0 ? void 0 : c.call(l, "template");
    V && at(V, (Y) => {
      kt(Y.content) && Ln(Y.content);
    });
  }, an = function(l) {
    const c = D ? D(l) : null;
    return typeof c != "string" || ce(c) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== C(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== N(l) || l.childNodes !== B(l);
  }, kt = function(l) {
    if (!N || typeof l != "object" || l === null) return !1;
    try {
      return N(l) === Te.documentFragment;
    } catch {
      return !1;
    }
  }, Nt = function(l) {
    if (!N || typeof l != "object" || l === null) return !1;
    try {
      return typeof N(l) == "number";
    } catch {
      return !1;
    }
  };
  function qe(S, l, c) {
    S.length !== 0 && at(S, (w) => {
      w.call(e, l, c, mt);
    });
  }
  const vs = function(l, c) {
    return !!(He && l.hasChildNodes() && !Nt(l.firstElementChild) && ke(Ur, l.textContent) && ke(Ur, l.innerHTML) || He && l.namespaceURI === Ve && ua[c] && (Nt(l.firstElementChild) || typeof l.textContent == "string" && ke(ca[c], l.textContent)) || l.nodeType === Te.processingInstruction || He && l.nodeType === Te.comment && ke(Fr, l.data));
  }, on = function(l, c) {
    if (l instanceof RegExp) return ke(l, c);
    if (l instanceof Function) {
      for (var w = arguments.length, E = new Array(w > 2 ? w - 2 : 0), O = 2; O < w; O++) E[O - 2] = arguments[O];
      return !!l(c, ...E);
    }
    return !1;
  }, bs = function(l, c, w) {
    if (!Oe[c] && fr(c) && on(te.tagNameCheck, c)) return !1;
    if (ft && !d[c]) {
      const E = Q(l), O = B(l);
      if (O && E) {
        const V = O.length;
        for (let Y = V - 1; Y >= 0; --Y) {
          const ue = l === w ? P(O[Y], !0) : O[Y];
          E.insertBefore(ue, q(l));
        }
      }
    }
    return Je(l), !0;
  }, dr = function(l, c, w, E) {
    return l.length === 0 ? c : c === w || c === E ? Ee(c) : c;
  }, vt = function(l, c) {
    return l === c || Q(l) !== null ? !1 : (Ot && sn(l), !0);
  }, pr = function(l, c) {
    if (qe(I.beforeSanitizeElements, l, null), vt(l, c)) return !0;
    if (an(l))
      return Je(l), !0;
    const w = ce(x(l));
    if (K = dr(I.uponSanitizeElement, K, $e, pt), qe(I.uponSanitizeElement, l, {
      tagName: w,
      allowedTags: K
    }), vt(l, c)) return !0;
    if (vs(l, w))
      return Je(l), !0;
    if (Oe[w] || !(Pe.tagCheck instanceof Function && Pe.tagCheck(w)) && !K[w]) {
      const E = bs(l, w, c);
      return E === !1 && (qe(I.afterSanitizeElements, l, null), vt(l, c)) ? !0 : E;
    }
    if (X(l) === Te.element && !gs(l) || (w === "noscript" || w === "noembed" || w === "noframes") && ke(oa, l.innerHTML))
      return Je(l), !0;
    if (we && l.nodeType === Te.text) {
      const E = ln(l.textContent);
      l.textContent !== E && (Mt(e.removed, { element: l.cloneNode() }), l.textContent = E);
    }
    return qe(I.afterSanitizeElements, l, null), vt(l, c);
  }, hr = function(l, c, w) {
    if ($t[c] || ir(c, l) || Lt && (c === "id" || c === "name") && (w in t || w in ds)) return !1;
    const E = j[c] || Pe.attributeCheck instanceof Function && Pe.attributeCheck(c, l);
    return Ne && ke(Sn, c) || de && ke(Qt, c) ? !0 : E ? Tn[c] || ke(Be, zt(w, le, "")) || (c === "src" || c === "xlink:href" || c === "href") && l !== "script" && Lr(w, "data:") === 0 && p[l] || Xe && !ke(Jt, zt(w, le, "")) ? !0 : !w : fr(l) && on(te.tagNameCheck, l) && on(te.attributeNameCheck, c, l) || c === "is" && te.allowCustomizedBuiltInElements && on(te.tagNameCheck, w);
  }, ys = Z({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), fr = function(l) {
    return !ys[Ht(l)] && ke(be, l);
  }, _s = function(l, c, w, E) {
    if (v && typeof A == "object" && typeof A.getAttributeType == "function" && !w) switch (A.getAttributeType(l, c)) {
      case "TrustedHTML":
        return W(E);
      case "TrustedScriptURL":
        return fe(E);
    }
    return E;
  }, ws = function(l, c, w, E) {
    try {
      return w ? l.setAttributeNS(w, c, E) : l.setAttribute(c, E), an(l) ? (Je(l), !1) : !0;
    } catch {
      return lt(c, l), !1;
    }
  }, gr = function(l, c) {
    if (qe(I.beforeSanitizeAttributes, l, null), vt(l, c)) return;
    const w = l.attributes;
    if (!w || an(l)) return;
    j = dr(I.uponSanitizeAttribute, j, Ke, Qe);
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: j,
      forceKeepAttr: void 0
    };
    let O = w.length;
    const V = ce(l.nodeName);
    for (; O--; ) {
      const Y = w[O], ue = Y.name, Ce = Y.namespaceURI, xe = Y.value, bt = ce(ue), On = xe;
      let ye = ue === "value" ? On : jl(On), mr = !1;
      if (E.attrName = bt, E.attrValue = ye, E.keepAttr = !0, E.forceKeepAttr = void 0, qe(I.uponSanitizeAttribute, l, E), ye = E.attrValue, It && (bt === "id" || bt === "name") && Lr(ye, en) !== 0 && (lt(ue, l, Y), ye = en + ye, mr = !0), He && ke(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ye)) {
        lt(ue, l, Y);
        continue;
      }
      if (bt === "attributename" && Cr(ye, "href")) {
        lt(ue, l, Y);
        continue;
      }
      if (!E.forceKeepAttr) {
        if (!E.keepAttr) {
          lt(ue, l, Y);
          continue;
        }
        if (!dt && ke(ia, ye)) {
          lt(ue, l, Y);
          continue;
        }
        if (we && (ye = ln(ye)), !hr(V, bt, ye)) {
          lt(ue, l, Y);
          continue;
        }
        ye = _s(V, bt, Ce, ye), ye !== On && ws(l, ue, Ce, ye) && mr && $r(e.removed);
      }
    }
    qe(I.afterSanitizeAttributes, l, null), vt(l, c);
  }, un = function(l) {
    let c = null;
    const w = cr(l);
    for (qe(I.beforeSanitizeShadowDOM, l, null); c = w.nextNode(); )
      if (qe(I.uponSanitizeShadowNode, c, null), pr(c, l), gr(c, l), kt(c.content) && un(c.content), X(c) === Te.element) {
        const E = se(c);
        kt(E) && (In(E), un(E));
      }
    qe(I.afterSanitizeShadowDOM, l, null);
  }, In = function(l) {
    const c = [{
      node: l,
      shadow: null
    }];
    for (; c.length > 0; ) {
      const w = c.pop();
      if (w.shadow) {
        un(w.shadow);
        continue;
      }
      const E = w.node, O = X(E) === Te.element, V = B(E);
      if (V) for (let Y = V.length - 1; Y >= 0; --Y) c.push({
        node: V[Y],
        shadow: null
      });
      if (O) {
        const Y = D ? D(E) : null;
        if (typeof Y == "string" && ce(Y) === "template") {
          const ue = E.content;
          kt(ue) && c.push({
            node: ue,
            shadow: null
          });
        }
      }
      if (O) {
        const Y = se(E);
        kt(Y) && c.push({
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
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, c = null, w = null, E = null, O = null;
    if (An = !S, An && (S = "<!-->"), typeof S != "string" && !Nt(S) && (S = Yl(S), typeof S != "string"))
      throw tt("dirty is not a string, aborting");
    if (!e.isSupported) return S;
    Ct ? (K = pt, j = Qe) : Cn(l), (I.uponSanitizeElement.length > 0 || I.uponSanitizeAttribute.length > 0) && (K = Ee(K)), I.uponSanitizeAttribute.length > 0 && (j = Ee(j)), e.removed = [];
    const V = Ot && typeof S != "string" && Nt(S);
    if (V) {
      ks(S);
      const Ce = x(S);
      if (typeof Ce == "string") {
        const xe = ce(Ce);
        if (!K[xe] || Oe[xe])
          throw rn(S), tt("root node is forbidden and cannot be sanitized in-place");
      }
      if (an(S))
        throw rn(S), tt("root node is clobbered and cannot be sanitized in-place");
      try {
        In(S);
      } catch (xe) {
        throw rn(S), xe;
      }
    } else if (Nt(S))
      c = ur("<!---->"), w = c.ownerDocument.importNode(S, !0), w.nodeType === Te.element && w.nodeName === "BODY" || w.nodeName === "HTML" ? c = w : c.appendChild(w), In(c);
    else {
      if (!Ge && !we && !je && S.indexOf("<") === -1) return v && ht ? W(S) : S;
      if (c = ur(S), !c) return Ge ? null : ht ? h : "";
    }
    c && De && Je(c.firstChild);
    const Y = V ? S : c;
    try {
      const Ce = cr(Y);
      for (; E = Ce.nextNode(); )
        pr(E, Y), gr(E, Y), kt(E.content) && un(E.content);
    } catch (Ce) {
      throw V && (rn(S), at(e.removed, (xe) => {
        xe.element && sn(xe.element);
      })), Ce;
    }
    if (V) {
      let Ce = !1;
      if (at(e.removed, (xe) => {
        xe.element && (xe.element === S && (Ce = !0), sn(xe.element));
      }), Ce) throw tt("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return we && Ln(S), S;
    }
    if (Ge) {
      if (we && Ln(c), st)
        for (O = Rt.call(c.ownerDocument); c.firstChild; ) O.appendChild(c.firstChild);
      else O = c;
      return (j.shadowroot || j.shadowrootmode) && (O = xn.call(r, O, !0)), O;
    }
    let ue = je ? c.outerHTML : c.innerHTML;
    return je && K["!doctype"] && c.ownerDocument && c.ownerDocument.doctype && c.ownerDocument.doctype.name && ke(la, c.ownerDocument.doctype.name) && (ue = "<!DOCTYPE " + c.ownerDocument.doctype.name + `>
` + ue), we && (ue = ln(ue)), v && ht ? W(ue) : ue;
  }, e.setConfig = function() {
    let S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Cn(S), Ct = !0, pt = K, Qe = j;
  }, e.clearConfig = function() {
    mt = null, Ct = !1, pt = null, Qe = null, v = y, h = "";
  }, e.isValidAttribute = function(S, l, c) {
    mt || Cn({});
    const w = ce(S), E = ce(l);
    return hr(w, E, c);
  }, e.addHook = function(S, l) {
    typeof l == "function" && _e(I, S) && Mt(I[S], l);
  }, e.removeHook = function(S, l) {
    if (_e(I, S)) {
      if (l !== void 0) {
        const c = Bl(I[S], l);
        return c === -1 ? void 0 : Hl(I[S], c, 1)[0];
      }
      return $r(I[S]);
    }
  }, e.removeHooks = function(S) {
    _e(I, S) && (I[S] = []);
  }, e.removeAllHooks = function() {
    I = Br();
  }, e;
}
var ha = rs();
const fa = ["innerHTML"], ga = /* @__PURE__ */ At({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = ne(() => ha.sanitize(ee.parse(e.content, { async: !1, breaks: !0 })));
    return (r, s) => (b(), _("div", {
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
const Ye = F(ss());
function ma() {
  Ye.value = ss();
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
  class: "diff-wrap"
}, Sa = { class: "diff-file-head" }, Ta = ["title"], Aa = {
  key: 0,
  class: "diff-file-stat"
}, Ea = { class: "diff-body" }, Ra = { class: "diff-no" }, $a = { class: "diff-no" }, Ca = { class: "diff-sign" }, La = { class: "diff-text" }, Ia = {
  key: 0,
  class: "tool-section-label"
}, Oa = { key: 1 }, Pa = {
  key: 2,
  class: "tool-section-text"
}, Na = {
  key: 3,
  class: "muted"
}, Da = {
  key: 4,
  class: "tool-error"
}, Ma = ["aria-label"], za = ["aria-label", "title"], Ua = {
  key: 0,
  class: "muted"
}, Fa = {
  key: 1,
  class: "tool-search-results"
}, Ba = ["href"], Ha = { key: 0 }, ja = { key: 1 }, Wa = {
  key: 2,
  class: "muted"
}, Va = {
  key: 3,
  class: "tool-error"
}, qa = /* @__PURE__ */ At({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (x, v) => Ye.value === "en" ? v : x, r = F(!1), s = F(!1), a = ne(() => (e.step.prompt || "").trim() || "tool"), u = ne(() => ["websearch", "web_search", "search"].includes(a.value)), o = ne(() => {
      if (!e.step.args) return null;
      try {
        const x = JSON.parse(e.step.args);
        return x && typeof x == "object" && !Array.isArray(x) ? x : null;
      } catch {
        return null;
      }
    }), m = ne(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), k = ne(() => {
      const x = m.value;
      return !x || typeof x != "object" || Array.isArray(x) ? null : x.data !== void 0 && x.data !== null && typeof x.data == "object" && !Array.isArray(x.data) ? x.data : "success" in x ? null : x;
    }), A = ne(() => {
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
    }), T = (x) => (Ye.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[x] || x;
    function P(x) {
      let v = 0, h = 0;
      for (const y of String(x || "").split(`
`))
        y.startsWith("---") || y.startsWith("+++") || (y.startsWith("+") ? v++ : y.startsWith("-") && h++);
      return { added: v, removed: h };
    }
    const z = ne(() => {
      const x = a.value, v = k.value;
      if (!v) return "";
      if (x === "write") return typeof v.lines == "number" ? `+${v.lines} ${t("行", "lines")}` : "";
      if (x === "edit") {
        const { added: h, removed: y } = P(v.diff);
        return h || y ? `+${h} −${y}` : "";
      }
      if (x === "apply_patch" && Array.isArray(v.files)) {
        let h = 0, y = 0;
        for (const R of v.files) {
          const L = P(R?.diff);
          h += L.added, y += L.removed;
        }
        return h || y ? `+${h} −${y}` : "";
      }
      return "";
    });
    function $(x, v) {
      const h = [];
      let y = null, R = 0, L = 0;
      const ae = (W) => {
        y || (y = { path: v, lines: [] }, h.push(y)), y.lines.push(W);
      };
      for (const W of String(x || "").split(`
`)) {
        if (W.startsWith("+++ ")) {
          const fe = W.slice(4).split("	")[0].trim().replace(/^[ab]\//, "");
          y = { path: fe === "/dev/null" ? v : fe, lines: [] }, h.push(y);
          continue;
        }
        if (!W.startsWith("--- ")) {
          if (W.startsWith("diff --git")) {
            y || (y = { path: v, lines: [] }, h.push(y));
            continue;
          }
          if (W.startsWith("@@")) {
            const fe = /@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(W);
            fe && (R = parseInt(fe[1], 10), L = parseInt(fe[2], 10)), ae({ kind: "hunk", oldNo: "", newNo: "", text: W });
            continue;
          }
          if (/^(index |new file|deleted file|old mode|new mode|similarity |rename |copy )/.test(W)) {
            ae({ kind: "meta", oldNo: "", newNo: "", text: W });
            continue;
          }
          if (W.startsWith("+")) {
            ae({ kind: "add", oldNo: "", newNo: String(L++), text: W.slice(1) });
            continue;
          }
          if (W.startsWith("-")) {
            ae({ kind: "del", oldNo: String(R++), newNo: "", text: W.slice(1) });
            continue;
          }
          if (W.startsWith("\\")) {
            ae({ kind: "meta", oldNo: "", newNo: "", text: W });
            continue;
          }
          ae({ kind: "ctx", oldNo: String(R++), newNo: String(L++), text: W });
        }
      }
      return h;
    }
    const q = ne(() => {
      const x = a.value, v = k.value, h = o.value;
      if (x === "edit" && v) return $(String(v.diff || ""), String(h?.filePath || v.path || ""));
      if (x === "apply_patch") {
        const y = [];
        if (Array.isArray(v?.files)) {
          for (const R of v.files) {
            const L = $(String(R?.diff || ""), String(R?.path || ""));
            L.length ? y.push(...L) : y.push({ path: String(R?.path || ""), lines: [] });
          }
          return y;
        }
        if (Array.isArray(h?.patches)) {
          const R = h.patches.map((L) => String(L?.patch ?? L?.diff ?? L?.text ?? "")).join(`
`);
          return $(R, "");
        }
        return y;
      }
      return [];
    });
    function B(x) {
      const v = x.lines || [], h = v.filter((R) => R.kind === "add").length, y = v.filter((R) => R.kind === "del").length;
      return h || y ? `+${h} −${y}` : "";
    }
    const Q = ne(() => {
      const x = a.value, v = o.value, h = k.value, y = (R, L = 160) => (R || "").length > L ? `${R.slice(0, L)}…` : R || "";
      if (u.value) {
        const R = y(String(h?.query ?? v?.query ?? "")), L = Array.isArray(h?.results) ? h.results.length : 0;
        return R + (L ? ` · ${L} ${t("条结果", "results")}` : "");
      }
      if (x === "bash") {
        const R = y(String(v?.command ?? "")), L = h && h.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${h.exitCode}` : "";
        return R + L;
      }
      if (x === "webfetch")
        return y(String(h?.url ?? v?.url ?? "")) + (h?.status !== void 0 && h?.status !== null ? ` · HTTP ${h.status}` : "");
      if (x === "read" || x === "write") return y(String(h?.path ?? v?.filePath ?? ""));
      if (x === "edit") return y(String(v?.filePath ?? h?.path ?? ""));
      if (x === "apply_patch") {
        const R = Array.isArray(v?.patches) ? v.patches.map((L) => L?.filePath).filter(Boolean) : Array.isArray(h?.files) ? h.files.map((L) => L?.path).filter(Boolean) : [];
        return y(R.join(", "));
      }
      if (x === "todowrite") {
        const R = Array.isArray(v?.todos) ? v.todos : Array.isArray(h?.todos) ? h.todos : [];
        if (!R.length) return y(String(e.step.args || ""));
        const L = R.length, ae = R.filter((fe) => fe?.status === "completed").length, W = R.filter((fe) => fe?.status === "in_progress").length;
        return `${L} ${t("项", "items")} · ${t("完成", "done")} ${ae}${W ? ` · ${t("进行中", "running")} ${W}` : ""}`;
      }
      if (v && Object.keys(v).length)
        try {
          return y(JSON.stringify(v));
        } catch {
        }
      return y(String(e.step.args || ""));
    }), se = ne(() => String(k.value?.query ?? o.value?.query ?? e.step.args ?? "")), C = ne(() => Array.isArray(k.value?.results) ? k.value.results : []), N = ne(() => typeof m.value == "string" ? m.value : m.value === null && e.step.result ? e.step.result : ""), D = ne(() => {
      const x = a.value, v = k.value;
      if (x === "bash" && v) {
        const y = [{ label: t("工作目录", "cwd"), text: String(v.cwd || "") }];
        return v.stdout && y.push({ label: "stdout", text: String(v.stdout), mono: !0 }), v.stderr && y.push({ label: "stderr", text: String(v.stderr), mono: !0 }), !v.stdout && !v.stderr && y.push({ label: "", text: t("（无输出）", "(no output)") }), y;
      }
      if (x === "write" && v) {
        const y = [{ label: t("文件", "File"), text: String(v.path || "") }];
        return y.push({ label: t("内容", "Content"), text: `${typeof v.lines == "number" ? v.lines : "—"} ${t("行", "lines")}${v.created ? ` · ${t("新建文件", "created")}` : ""} · ${v.bytes ?? "—"} B` }), y;
      }
      if (x === "edit" || x === "apply_patch") return [];
      if (x === "read" && v) {
        const y = [{ label: t("文件", "File"), text: String(v.path || "") }];
        return y.push({ label: `${t("第", "line")} ${v.offset ?? "—"} ${t("行起", "onward")}`, text: String(v.content || ""), mono: !0 }), y;
      }
      if (x === "webfetch" && v)
        return [
          { label: "URL", text: String(v.url || "") },
          { label: t("内容", "Content"), text: String(v.content || ""), mono: !0 }
        ];
      const h = e.step.result;
      if (!h) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(m.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(h), mono: !0 }];
      }
    });
    function G() {
      if (u.value) {
        s.value = !s.value;
        return;
      }
      r.value = !r.value;
    }
    function X(x) {
      x.key === "Escape" && s.value && (s.value = !1);
    }
    return yn(() => window.addEventListener("keydown", X)), _n(() => window.removeEventListener("keydown", X)), (x, v) => (b(), _("div", {
      class: ie(["tool-card", { expanded: r.value }])
    }, [
      i("button", {
        type: "button",
        class: "tool-card-head",
        onClick: G
      }, [
        i("span", {
          class: ie(["tool-dot", n.step.state])
        }, "●", 2),
        i("strong", ka, g(A.value), 1),
        i("span", va, g(Q.value), 1),
        z.value ? (b(), _("small", ba, g(z.value), 1)) : U("", !0),
        i("small", ya, g(T(n.step.state)), 1),
        v[2] || (v[2] = i("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      r.value && !u.value ? (b(), _("div", _a, [
        n.step.state === "running" && !D.value.length && !q.value.length ? (b(), _("p", wa, g(t("执行中…", "Running…")), 1)) : U("", !0),
        q.value.length ? (b(), _("div", xa, [
          (b(!0), _(oe, null, ve(q.value, (h, y) => (b(), _("div", {
            key: y,
            class: "diff-file"
          }, [
            i("div", Sa, [
              i("span", {
                class: "diff-file-path",
                title: h.path
              }, g(h.path || "—"), 9, Ta),
              B(h) ? (b(), _("span", Aa, g(B(h)), 1)) : U("", !0)
            ]),
            i("div", Ea, [
              (b(!0), _(oe, null, ve(h.lines, (R, L) => (b(), _("div", {
                key: L,
                class: ie(["diff-line", R.kind])
              }, [
                i("span", Ra, g(R.oldNo), 1),
                i("span", $a, g(R.newNo), 1),
                i("span", Ca, g(R.kind === "add" ? "+" : R.kind === "del" ? "-" : ""), 1),
                i("span", La, g(R.text), 1)
              ], 2))), 128))
            ])
          ]))), 128))
        ])) : (b(!0), _(oe, { key: 2 }, ve(D.value, (h, y) => (b(), _(oe, { key: y }, [
          h.label ? (b(), _("small", Ia, g(h.label), 1)) : U("", !0),
          h.mono ? (b(), _("pre", Oa, g(h.text), 1)) : (b(), _("p", Pa, g(h.text), 1))
        ], 64))), 128)),
        !D.value.length && !q.value.length && n.step.state !== "running" && !n.step.error ? (b(), _("p", Na, g(t("执行完成，无输出", "Completed with no output")), 1)) : U("", !0),
        n.step.error ? (b(), _("p", Da, g(n.formatError?.(n.step.error) || n.step.error), 1)) : U("", !0)
      ])) : U("", !0),
      s.value ? (b(), _("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: v[1] || (v[1] = Ie((h) => s.value = !1, ["self"]))
      }, [
        i("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          i("header", null, [
            i("h4", null, g(t("搜索", "Search")) + " · " + g(se.value), 1),
            i("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: v[0] || (v[0] = (h) => s.value = !1)
            }, [...v[3] || (v[3] = [
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
            ])], 8, za)
          ]),
          n.step.state === "running" ? (b(), _("p", Ua, g(t("搜索中…", "Searching…")), 1)) : C.value.length ? (b(), _("ol", Fa, [
            (b(!0), _(oe, null, ve(C.value, (h, y) => (b(), _("li", { key: y }, [
              i("a", {
                href: h.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, g(h.title || h.url), 9, Ba),
              h.snippet ? (b(), _("p", Ha, g(h.snippet), 1)) : U("", !0),
              h.title && h.url ? (b(), _("small", ja, g(h.url), 1)) : U("", !0)
            ]))), 128))
          ])) : (b(), _("p", Wa, g(N.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (b(), _("p", Va, g(n.formatError?.(n.step.error) || n.step.error), 1)) : U("", !0)
        ], 8, Ma)
      ])) : U("", !0)
    ], 2));
  }
}), Hr = /* @__PURE__ */ er(qa, [["__scopeId", "data-v-c097ee74"]]);
function ls(n = "") {
  const e = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
  return n ? `${n}-${e}` : e;
}
const Ga = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Ya = { class: "app-select-value" }, Za = {
  class: "app-select-chevron",
  "aria-hidden": "true"
}, Ka = ["id", "aria-label"], Xa = {
  key: 0,
  class: "app-select-search"
}, Qa = ["placeholder"], Ja = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], eo = {
  key: 0,
  class: "app-select-check",
  "aria-hidden": "true"
}, to = {
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
    const t = n, r = e, s = F(null), a = F(null), u = F(null), o = F(!1), m = F(-1), k = F({}), A = F(!1), T = F(""), P = ls("select"), z = ne(() => t.options.map((h) => typeof h == "string" ? { value: h, label: h } : h)), $ = ne(() => {
      if (!t.searchable || !T.value.trim()) return z.value;
      const h = T.value.trim().toLocaleLowerCase();
      return z.value.filter((y) => y.label.toLocaleLowerCase().includes(h) || y.value.toLocaleLowerCase().includes(h));
    }), q = ne(() => z.value.find((h) => h.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let B = "", Q = 0;
    function se() {
      const h = s.value?.getBoundingClientRect();
      if (!h) return;
      const y = window.visualViewport?.height || innerHeight, R = window.visualViewport?.width || innerWidth, L = y - h.bottom - 10, ae = h.top - 10;
      A.value = L < Math.min(280, $.value.length * 46 + 58) && ae > L;
      const W = Math.max(48, Math.min(340, A.value ? ae : L)), fe = Math.min(Math.max(h.width, 220), R - 16);
      k.value = { position: "fixed", left: `${Math.max(8, Math.min(h.left, R - fe - 8))}px`, width: `${fe}px`, maxHeight: `${W}px`, ...A.value ? { bottom: `${y - h.top + 8}px` } : { top: `${h.bottom + 8}px` } };
    }
    function C(h = !1) {
      o.value = !1, T.value = "", B = "", h && s.value?.focus();
    }
    async function N() {
      t.disabled || o.value || (o.value = !0, T.value = "", m.value = $.value.findIndex((h) => h.value === t.modelValue && !h.disabled), m.value < 0 && (m.value = $.value.findIndex((h) => !h.disabled)), se(), r("open"), await rt(), t.searchable && u.value?.focus(), D());
    }
    function D() {
      a.value?.querySelector(`[data-index="${m.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function G(h) {
      const y = $.value[h];
      !y || y.disabled || (r("update:modelValue", y.value), r("change", y.value), C(!0));
    }
    async function X(h) {
      if (!(t.disabled || h.isComposing)) {
        if (h.key === "Tab") {
          C();
          return;
        }
        if (h.key === "Escape") {
          o.value && (h.preventDefault(), C(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(h.key)) {
          if (t.searchable && h.key === " ") return;
          if (h.preventDefault(), !o.value) {
            await N();
            return;
          }
          if (h.key === "Enter") {
            G(m.value);
            return;
          }
          const y = $.value.map((L, ae) => L.disabled ? -1 : ae).filter((L) => L >= 0);
          if (!y.length) return;
          const R = y.indexOf(m.value);
          m.value = h.key === "Home" ? y[0] : h.key === "End" ? y[y.length - 1] : y[(R + (h.key === "ArrowDown" ? 1 : -1) + y.length) % y.length], await rt(), D();
          return;
        }
        if (!t.searchable && h.key.length === 1 && !h.ctrlKey && !h.metaKey && !h.altKey) {
          await N();
          const y = Date.now();
          B = y - Q > 700 ? h.key : B + h.key, Q = y;
          const R = $.value.findIndex((L) => !L.disabled && L.label.toLocaleLowerCase().startsWith(B.toLocaleLowerCase()));
          R >= 0 && (m.value = R, await rt(), D());
        }
      }
    }
    function x(h) {
      const y = h.target;
      !s.value?.contains(y) && !a.value?.contains(y) && C();
    }
    function v(h) {
      o.value && (!(h.target instanceof Node) || !a.value?.contains(h.target)) && se();
    }
    return Re(() => t.disabled, (h) => {
      h && C();
    }), Re($, () => {
      o.value && (m.value >= $.value.length && (m.value = $.value.findIndex((h) => !h.disabled)), rt(se));
    }), Re(T, () => {
      o.value && (m.value = $.value.findIndex((h) => !h.disabled), rt(D));
    }), yn(() => {
      document.addEventListener("pointerdown", x, !0), window.addEventListener("resize", se), window.addEventListener("scroll", v, !0);
    }), _n(() => {
      document.removeEventListener("pointerdown", x, !0), window.removeEventListener("resize", se), window.removeEventListener("scroll", v, !0);
    }), (h, y) => (b(), _("div", As(h.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled, "is-open": o.value }]
    }), [
      i("button", {
        ref_key: "trigger",
        ref: s,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": o.value,
        "aria-controls": o.value ? re(P) : void 0,
        "aria-activedescendant": o.value && m.value >= 0 ? `${re(P)}-${m.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: y[0] || (y[0] = (R) => o.value ? C() : N()),
        onKeydown: X,
        onFocus: y[1] || (y[1] = (R) => r("focus", R))
      }, [
        i("span", Ya, g(q.value), 1),
        i("span", Za, [
          (b(), _("svg", {
            class: ie({ "is-open": o.value }),
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none"
          }, [...y[4] || (y[4] = [
            i("path", {
              d: "m6 9 6 6 6-6",
              stroke: "currentColor",
              "stroke-width": "1.9",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, null, -1)
          ])], 2))
        ])
      ], 40, Ga),
      (b(), St(Vn, { to: "body" }, [
        Me(jr, { name: "select-menu" }, {
          default: Wr(() => [
            o.value ? (b(), _("div", {
              key: 0,
              id: re(P),
              ref_key: "menu",
              ref: a,
              class: ie(["app-select-menu", { "opens-up": A.value }]),
              style: jt(k.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: y[3] || (y[3] = Ie(() => {
              }, ["prevent"]))
            }, [
              n.searchable ? (b(), _("label", Xa, [
                y[5] || (y[5] = i("svg", {
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
                Ft(i("input", {
                  ref_key: "searchInput",
                  ref: u,
                  "onUpdate:modelValue": y[2] || (y[2] = (R) => T.value = R),
                  type: "text",
                  placeholder: re(Ye) === "en" ? "Search…" : "搜索…",
                  onKeydown: X
                }, null, 40, Qa), [
                  [gn, T.value]
                ])
              ])) : U("", !0),
              (b(!0), _(oe, null, ve($.value, (R, L) => (b(), _("div", {
                id: `${re(P)}-${L}`,
                key: `${R.value}:${L}`,
                role: "option",
                "aria-selected": R.value === n.modelValue,
                "aria-disabled": !!R.disabled,
                "data-index": L,
                class: ie(["app-select-option", { highlighted: m.value === L, selected: R.value === n.modelValue, disabled: R.disabled }]),
                onPointermove: (ae) => !R.disabled && (m.value = L),
                onClick: Ie((ae) => G(L), ["stop"])
              }, [
                i("span", null, g(R.label), 1),
                R.value === n.modelValue ? (b(), _("span", eo, [...y[6] || (y[6] = [
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
                ])])) : U("", !0)
              ], 42, Ja))), 128)),
              $.value.length ? U("", !0) : (b(), _("div", to, g(re(Ye) === "en" ? "No matches" : "没有匹配项"), 1))
            ], 46, Ka)) : U("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), no = { class: "thinking-caption" }, ro = ["disabled", "aria-expanded", "aria-controls"], so = ["id", "onKeydown"], lo = {
  class: "thinking-capsule",
  "aria-hidden": "true"
}, ao = ["value", "aria-valuetext"], oo = {
  key: 0,
  class: "energy-wave",
  "aria-hidden": "true"
}, io = { class: "thinking-stops" }, uo = ["aria-pressed", "onClick"], co = { class: "thinking-provider-note" }, po = /* @__PURE__ */ At({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = ne(() => Ye.value === "en"), r = n, s = e, a = ne(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), u = ne(() => r.modelValue === 0 ? 0 : r.modelValue < 35 ? 1 : r.modelValue < 62.5 ? 2 : r.modelValue < 87.5 ? 3 : 4), o = F(!1), m = F({}), k = F(null), A = F(null), T = F(null), P = F(u.value * 25), z = F(!1), $ = ne(() => u.value === 4), q = ls("thinking");
    let B;
    Re(() => r.modelValue, () => {
      o.value || (P.value = u.value * 25);
    }), Re($, (x, v) => {
      x && !v && (z.value = !0, clearTimeout(B), B = setTimeout(() => z.value = !1, 900));
    }), Re(() => r.disabled, (x) => {
      x && (o.value = !1);
    });
    function Q() {
      const x = k.value?.getBoundingClientRect();
      if (!x) return;
      const v = Math.min(352, innerWidth - 16), h = 236, y = x.top >= h + 8 || innerHeight - x.bottom < h;
      m.value = { left: `${Math.max(8, Math.min(x.left, innerWidth - v - 8))}px`, width: `${v}px`, ...y ? { bottom: `${innerHeight - x.top + 8}px` } : { top: `${x.bottom + 8}px` } };
    }
    async function se() {
      r.disabled || (o.value = !o.value, o.value && (P.value = u.value * 25, Q(), await rt(), T.value?.focus()));
    }
    function C() {
      o.value = !1, k.value?.focus();
    }
    function N(x) {
      P.value = Number(x.target.value), s("update:modelValue", a.value[Math.round(P.value / 25)].value);
    }
    function D(x) {
      P.value = x * 25, s("update:modelValue", a.value[x].value);
    }
    function G(x) {
      const v = x.target;
      !k.value?.contains(v) && !A.value?.contains(v) && (o.value = !1);
    }
    function X(x) {
      o.value && (!(x.target instanceof Node) || !A.value?.contains(x.target)) && Q();
    }
    return yn(() => {
      document.addEventListener("pointerdown", G, !0), window.addEventListener("resize", Q), window.addEventListener("scroll", X, !0);
    }), _n(() => {
      clearTimeout(B), document.removeEventListener("pointerdown", G, !0), window.removeEventListener("resize", Q), window.removeEventListener("scroll", X, !0);
    }), (x, v) => (b(), _("div", {
      class: ie(["thinking-control", { full: $.value, pulse: z.value }])
    }, [
      i("span", no, g(t.value ? "Thinking effort" : "思考强度"), 1),
      i("button", {
        ref_key: "trigger",
        ref: k,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": o.value,
        "aria-controls": o.value ? re(q) : void 0,
        onClick: se,
        onKeydown: yt(C, ["esc"])
      }, [
        i("span", null, g($.value ? "✦ " : "") + g(a.value[u.value].label), 1),
        v[5] || (v[5] = i("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, ro),
      (b(), St(Vn, { to: "body" }, [
        Me(jr, { name: "thinking-menu" }, {
          default: Wr(() => [
            o.value ? (b(), _("section", {
              key: 0,
              id: re(q),
              ref_key: "panel",
              ref: A,
              class: ie(["thinking-popover", { full: $.value, pulse: z.value }]),
              style: jt(m.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: yt(Ie(C, ["prevent", "stop"]), ["esc"])
            }, [
              i("header", null, [
                i("strong", null, g(t.value ? "Thinking effort" : "思考强度"), 1),
                i("output", null, g($.value ? "✦ " : "") + g(a.value[u.value].label), 1)
              ]),
              i("div", {
                class: "thinking-track",
                style: jt({ "--intensity": `${P.value}%` })
              }, [
                i("div", lo, [
                  v[6] || (v[6] = i("div", { class: "thinking-fill" }, null, -1)),
                  (b(!0), _(oe, null, ve(a.value, (h, y) => (b(), _("span", {
                    key: y,
                    class: ie(["thinking-tick", { passed: P.value >= y * 25 }]),
                    style: jt({ left: `${y * 25}%` })
                  }, null, 6))), 128))
                ]),
                i("input", {
                  ref_key: "range",
                  ref: T,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: P.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[u.value].label,
                  onInput: N,
                  onChange: v[0] || (v[0] = (h) => P.value = u.value * 25),
                  onKeydown: [
                    v[1] || (v[1] = yt(Ie((h) => D(0), ["prevent"]), ["home"])),
                    v[2] || (v[2] = yt(Ie((h) => D(4), ["prevent"]), ["end"])),
                    v[3] || (v[3] = yt(Ie((h) => D(Math.min(4, u.value + 1)), ["prevent"]), ["arrow-right"])),
                    v[4] || (v[4] = yt(Ie((h) => D(Math.max(0, u.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, ao),
                $.value ? (b(), _("span", oo)) : U("", !0)
              ], 4),
              i("div", io, [
                (b(!0), _(oe, null, ve(a.value, (h, y) => (b(), _("button", {
                  key: h.value,
                  type: "button",
                  class: ie({ selected: u.value === y }),
                  "aria-pressed": u.value === y,
                  onClick: (R) => D(y)
                }, g(h.label), 11, uo))), 128))
              ]),
              i("p", null, g(t.value ? u.value === 0 ? "Disable model reasoning" : $.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : u.value === 0 ? "不启用模型思考模式" : $.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              i("p", co, g(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, so)) : U("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), wt = F(null);
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
const ho = /* @__PURE__ */ At({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = as(), r = F(null), s = F(null);
    let a = null;
    const u = () => (document.documentElement.lang || "").startsWith("en"), o = () => e.value?.options.title || (u() ? "Confirm" : "请确认"), m = () => e.value?.options.confirmLabel || (u() ? "Confirm" : "确认"), k = () => e.value?.options.cancelLabel || (u() ? "Cancel" : "取消");
    Re(() => !!e.value, async (T) => {
      T ? (a = document.activeElement, await rt(), r.value?.focus(), s.value?.focus()) : (r.value = null, a?.focus?.());
    });
    function A(T) {
      if (!e.value) return;
      if (T.key === "Escape") {
        T.preventDefault(), t(!1);
        return;
      }
      if (T.key !== "Tab" || !r.value) return;
      const P = [...r.value.querySelectorAll("button:not(:disabled)")];
      if (!P.length) return;
      const z = P[0], $ = P[P.length - 1];
      T.shiftKey && document.activeElement === z ? (T.preventDefault(), $.focus()) : !T.shiftKey && document.activeElement === $ && (T.preventDefault(), z.focus());
    }
    return (T, P) => (b(), St(Vn, { to: "body" }, [
      re(e) ? (b(), _("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: P[2] || (P[2] = Ie((z) => re(t)(!1), ["self"])),
        onKeydown: A
      }, [
        i("section", {
          ref_key: "dialog",
          ref: r,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          i("h2", null, g(o()), 1),
          i("p", null, g(re(e).options.message), 1),
          i("footer", null, [
            i("button", {
              ref_key: "cancelBtn",
              ref: s,
              type: "button",
              onClick: P[0] || (P[0] = (z) => re(t)(!1))
            }, g(k()), 513),
            i("button", {
              type: "button",
              class: ie(["confirm-primary", { danger: re(e).options.danger !== !1 }]),
              onClick: P[1] || (P[1] = (z) => re(t)(!0))
            }, g(m()), 3)
          ])
        ], 512)
      ], 32)) : U("", !0)
    ]));
  }
}), fo = { class: "workspace" }, go = { class: "sessions" }, mo = ["disabled", "title"], ko = { class: "connection" }, vo = ["title"], bo = ["placeholder", "aria-label"], yo = { class: "filter-bar" }, _o = ["onClick"], wo = { class: "muted" }, xo = { class: "session-list" }, So = ["disabled", "onClick"], To = { class: "origin" }, Ao = {
  key: 0,
  class: "muted"
}, Eo = {
  key: 0,
  class: "ledger"
}, Ro = { class: "muted" }, $o = ["onClick"], Co = {
  key: 1,
  class: "conversation"
}, Lo = { class: "conversation-header" }, Io = {
  key: 0,
  class: "running"
}, Oo = {
  key: 1,
  class: "session-actions"
}, Po = ["disabled"], No = ["disabled"], Do = {
  key: 0,
  class: "error",
  role: "alert"
}, Mo = {
  key: 1,
  class: "host-panel"
}, zo = { class: "usage-rings" }, Uo = {
  key: 1,
  class: "muted"
}, Fo = {
  key: 0,
  class: "sub-view"
}, Bo = { class: "sub-view-header" }, Ho = { class: "muted" }, jo = { class: "sub-view-body" }, Wo = { class: "bubble user" }, Vo = { class: "message-head" }, qo = { class: "message-text" }, Go = {
  key: 0,
  class: "agent-speech"
}, Yo = {
  key: 0,
  class: "muted model-annotation"
}, Zo = {
  key: 0,
  class: "running"
}, Ko = {
  key: 2,
  class: "muted"
}, Xo = {
  key: 3,
  class: "error"
}, Qo = {
  key: 1,
  class: "subagent-card nested"
}, Jo = ["onClick"], ei = { class: "subagent-prompt" }, ti = { key: 3 }, ni = {
  key: 0,
  class: "agent-speech"
}, ri = {
  key: 1,
  class: "error"
}, si = {
  key: 2,
  class: "muted"
}, li = {
  key: 0,
  class: "welcome"
}, ai = { class: "bubble user" }, oi = { class: "message-head" }, ii = { class: "message-text" }, ui = { class: "bubble agent" }, ci = { class: "message-head" }, di = {
  key: 0,
  class: "steps"
}, pi = {
  key: 0,
  class: "agent-speech"
}, hi = {
  key: 0,
  class: "muted model-annotation"
}, fi = {
  key: 0,
  class: "running"
}, gi = {
  key: 2,
  class: "muted"
}, mi = {
  key: 3,
  class: "error"
}, ki = {
  key: 1,
  class: "subagent-card"
}, vi = ["onClick"], bi = { class: "subagent-prompt" }, yi = {
  key: 0,
  class: "error subagent-card-error"
}, _i = { key: 3 }, wi = {
  key: 2,
  class: "error"
}, xi = {
  key: 3,
  class: "muted"
}, Si = {
  key: 0,
  class: "compact-notice"
}, Ti = { class: "execution-options" }, Ai = ["disabled", "title"], Ei = { class: "composer-input" }, Ri = ["disabled", "placeholder"], $i = ["disabled", "aria-label", "title"], Ci = ["aria-label", "title"], Li = ["disabled"], Ii = { class: "muted" }, Oi = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, Pi = { class: "directory-roots" }, Ni = ["disabled", "onClick"], Di = ["disabled"], Mi = ["disabled"], zi = ["disabled"], Ui = {
  key: 0,
  class: "error"
}, Fi = { key: 1 }, Bi = {
  key: 2,
  class: "directory-list"
}, Hi = ["onClick"], ji = {
  key: 1,
  class: "muted"
}, Wi = ["disabled"], Vi = /* @__PURE__ */ At({
  __name: "AgentsPage",
  setup(n) {
    const e = (d, f) => Ye.value === "en" ? f : d, { confirm: t } = as(), r = Cs(), s = F(localStorage.getItem("0kay.agent.selected") || ""), a = F(""), u = F(""), o = F("all"), m = F("general"), k = F(""), A = F(""), T = F(50);
    function P(d) {
      const f = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof d == "string" && d in f) return f[d];
      const p = Number(d ?? 50);
      return Number.isFinite(p) ? Math.max(0, Math.min(100, p)) : 50;
    }
    const z = F("MOCR"), $ = F("normal"), q = F("");
    async function B() {
      if (!(!q.value.trim() || !I.value || N.value)) {
        N.value = !0, D.value = "";
        try {
          const d = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent(I.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: G.value.path, name: q.value.trim() }) });
          if (!d.ok) throw new Error(await d.text());
          const f = await d.json();
          q.value = "", await Fe(f.path);
        } catch (d) {
          D.value = d.message;
        } finally {
          N.value = !1;
        }
      }
    }
    const Q = F([]), se = F(!1), C = F(!1), N = F(!1), D = F(""), G = F({ path: "", parent: "", roots: [], directories: [] }), X = F(null), x = F("");
    let v = null, h = 0, y = "", R = !1;
    const L = F(!0);
    function ae(d = s.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${d}`, JSON.stringify({ draft: a.value, mode: m.value, ...Jt() }));
      } catch {
      }
    }
    function W() {
      h++, C.value = !1, N.value = !1;
    }
    function fe(d) {
      d.key === "Escape" && C.value && W();
    }
    function wn(d) {
      d.key === "Enter" && !d.shiftKey && !d.isComposing && d.keyCode !== 229 && (d.preventDefault(), ft());
    }
    function ct() {
      const d = Ke.value;
      d && (L.value = d.scrollHeight - d.scrollTop - d.clientHeight < 100);
    }
    async function Fe(d = "") {
      if (!I.value) {
        be.value = "请先选择在线执行器";
        return;
      }
      const f = ++h;
      y = I.value.plugin_id, C.value = !0, N.value = !0, D.value = "";
      try {
        const p = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: I.value.plugin_id, path: d })}`);
        if (!p.ok) throw new Error(await p.text());
        const M = await p.json();
        f === h && (G.value = M);
      } catch (p) {
        f === h && (D.value = p.message);
      } finally {
        f === h && (N.value = !1);
      }
    }
    function Gt() {
      !I.value || I.value.plugin_id !== y || N.value || D.value || (k.value = I.value.plugin_id, A.value = G.value.path, C.value = !1);
    }
    async function Rt() {
      if (!se.value || !I.value || R || document.hidden) return;
      R = !0;
      const d = I.value.plugin_id;
      try {
        const f = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(d)}`);
        if (!f.ok) throw new Error();
        const p = await f.json();
        I.value?.plugin_id === d && (X.value = p);
      } catch {
        I.value?.plugin_id === d && (X.value = null);
      } finally {
        R = !1;
      }
    }
    async function Yt() {
      if (!te.value || de.value || le.value || te.value.state === "archived") return;
      const d = s.value;
      le.value = !0, be.value = "", x.value = "正在压缩上下文…";
      try {
        const f = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: d }) });
        if (!f.ok) throw new Error(await f.text());
        await f.json(), await r.fetchAgents(), x.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (f) {
        be.value = f.message, x.value = "";
      } finally {
        le.value = !1;
      }
    }
    const xn = (d) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, d))}%, var(--md-outline-variant) 0)` }), I = ne(() => k.value ? r.agents.find((d) => d.plugin_id === k.value) : r.agents.find((d) => r.isHealthy(d))), Zt = (d) => d === void 0 ? "—" : `${(d / 1024 ** 3).toFixed(1)} GiB`;
    function Kt() {
      try {
        const d = JSON.parse(localStorage.getItem(`0kay.agent.editor:${s.value}`) || localStorage.getItem(`0kay.agent.options:${s.value}`) || "{}");
        k.value = d.executor_id || "", A.value = d.workdir || "", T.value = P(d.thinking_intensity), z.value = d.model_id || "MOCR", $.value = d.permission_mode === "full_access" ? "full_access" : "normal", a.value = d.draft || "", m.value = d.mode || "general";
      } catch {
        k.value = "", A.value = "", T.value = 50, z.value = "MOCR", a.value = "", m.value = "general";
      }
    }
    const Xt = F({});
    function Sn(d) {
      return `${Xt.value[d.provider] || d.provider}/${d.id}`;
    }
    async function Qt() {
      try {
        const d = await fetch("/api/models");
        if (!d.ok) throw new Error(`模型目录 HTTP ${d.status}`);
        Q.value = (await d.json()).models || [];
      } catch (d) {
        be.value = d.message;
      }
      try {
        const d = await fetch("/api/providers");
        if (d.ok) {
          const f = (await d.json()).providers || [], p = {};
          for (const M of f) M.name && (p[M.provider] = M.name);
          Xt.value = p;
        }
      } catch {
      }
    }
    function Jt() {
      const d = T.value === 0 ? "off" : T.value < 35 ? "low" : T.value < 62.5 ? "medium" : T.value < 87.5 ? "high" : "max";
      return { executor_id: k.value, workdir: A.value.trim(), thinking_intensity: d, model_id: z.value, permission_mode: $.value, language: Ye.value };
    }
    const le = F(!1), be = F(""), Be = F(!1), K = F(!1), $e = F([]), j = ne(() => $e.value[$e.value.length - 1] || null), Ke = F(null), te = ne(() => r.sessions.find((d) => d.session_id === s.value)), Oe = (d) => d.caller_id !== "webui", $t = ne(() => r.sessions.filter((d) => (K.value ? d.state === "archived" : d.state !== "archived") && (o.value === "all" || (o.value === "life" ? Oe(d) : !Oe(d))) && (d.prompt || "").toLowerCase().includes(u.value.toLowerCase()))), Pe = ne(() => r.tasks.filter((d) => d.kind === "agent" && d.session_id === s.value).sort((d, f) => (d.started_at || "").localeCompare(f.started_at || "") || d.task_id.localeCompare(f.task_id))), de = ne(() => r.tasks.find((d) => d.session_id === s.value && ["agent", "compact"].includes(d.kind || "") && ["running", "pending"].includes(d.state))), Ne = (d) => (Ye.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[d] || d, Xe = (d) => d ? new Date(d).toLocaleString() : "";
    function dt(d) {
      return r.tasks.filter((f) => f.task_id !== d.task_id && f.session_id === d.session_id && f.parent_id === d.task_id).sort((f, p) => (f.started_at || "").localeCompare(p.started_at || "") || f.task_id.localeCompare(p.task_id));
    }
    function we(d) {
      return d ? r.tasks.filter((f) => f.task_id !== d.task_id && f.session_id === d.session_id && f.parent_id === d.task_id).sort((f, p) => (f.started_at || "").localeCompare(p.started_at || "") || f.task_id.localeCompare(p.task_id)) : [];
    }
    function He(d) {
      const f = [];
      for (const p of dt(d))
        f.push(p), p.kind === "subagent" && f.push(...He({ ...p, session_id: d.session_id }));
      return f;
    }
    function je(d) {
      $e.value = [...$e.value, d];
    }
    function Ct() {
      $e.value = $e.value.slice(0, -1);
    }
    function pt() {
      $e.value = [];
    }
    function Qe(d) {
      if (!d?.result) return "";
      let f = d.result;
      try {
        const p = JSON.parse(f);
        typeof p == "string" ? f = p : p && typeof p.result == "string" && (f = p.result);
      } catch {
      }
      return !f.trim() || we(d).some((p) => p.kind === "think" && (p.result || "").trim() === f.trim()) ? "" : f;
    }
    function De(d) {
      return d ? /User denied permission for task/i.test(d) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(d) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(d) ? e("权限请求已超时", "Permission request expired") : d : "";
    }
    function Ge(d) {
      return d.kind === "subagent" ? e("子 Agent", "Subagent") : d.kind === "tool" ? e("工具", "Tool") : d.kind === "think" ? e("模型", "Model") : d.kind || e("步骤", "Step");
    }
    function st(d) {
      return we(d).length;
    }
    function ht(d) {
      return He(d).some((f) => f.kind === "think" && f.result?.trim() === d.result?.trim());
    }
    async function Lt(d) {
      if (!te.value || le.value || d === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const f = s.value;
      le.value = !0;
      try {
        ae(f), await r.manageSession(f, d), d === "delete" && (localStorage.removeItem(`0kay.agent.editor:${f}`), localStorage.removeItem(`0kay.agent.options:${f}`)), d !== "restore" ? (s.value = "", localStorage.removeItem("0kay.agent.selected")) : K.value = !1;
      } catch (p) {
        be.value = p.message;
      } finally {
        le.value = !1;
      }
    }
    function It(d) {
      le.value || (ae(), s.value = d, Be.value = !1, localStorage.setItem("0kay.agent.selected", d));
    }
    async function en() {
      le.value = !0, be.value = "";
      try {
        const d = await r.createSession("新对话");
        ae(), s.value = d, localStorage.setItem("0kay.agent.selected", d), Be.value = !1, K.value = !1;
      } catch (d) {
        be.value = d.message;
      } finally {
        le.value = !1;
      }
    }
    async function ft() {
      if (a.value.trim() === "/compact") {
        await Yt();
        return;
      }
      if (!(!a.value.trim() || le.value || de.value || te.value?.state === "archived")) {
        le.value = !0, be.value = "";
        try {
          const d = Jt(), f = a.value.trim(), p = m.value;
          if (!te.value) {
            const M = await r.createSession(f.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${M}`, JSON.stringify({ ...d, draft: f, mode: p })), s.value = M, localStorage.setItem("0kay.agent.selected", M);
          }
          ae(), await r.sendTask(s.value, f, p, d), a.value = "", ae(), L.value = !0, await We();
        } catch (d) {
          be.value = d.message;
        } finally {
          le.value = !1;
        }
      }
    }
    async function Ot() {
      if (!(!de.value || de.value.kind !== "agent"))
        try {
          await r.cancelTask(de.value.task_id);
        } catch (d) {
          be.value = d.message;
        }
    }
    async function We() {
      await rt(), L.value && Ke.value?.scrollTo({ top: Ke.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Re(() => r.tasks.filter((d) => d.session_id === s.value).map((d) => `${d.task_id}:${d.state}:${d.result?.length}`).join("|"), We), Re(s, () => {
      L.value = !0, We(), W(), pt(), be.value = "";
    }), Re(s, Kt), Re(k, () => {
      X.value = null, A.value = "", W(), Rt();
    }, { flush: "sync" }), Re(se, Rt), Re(s, () => {
      x.value = "";
    }), yn(() => {
      ma(), r.connect(), Kt(), Qt(), v = setInterval(Rt, 5e3), window.addEventListener("keydown", fe);
    }), _n(() => {
      ae(), W(), r.disconnect(), v && clearInterval(v), window.removeEventListener("keydown", fe);
    }), (d, f) => (b(), _(oe, null, [
      i("main", fo, [
        i("aside", go, [
          i("header", null, [
            f[19] || (f[19] = i("h1", null, "Agent", -1)),
            i("button", {
              onClick: en,
              disabled: le.value,
              title: e("新建会话", "New session")
            }, [
              f[18] || (f[18] = i("svg", {
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
              Se(" " + g(e("新对话", "New chat")), 1)
            ], 8, mo)
          ]),
          i("div", ko, [
            i("i", {
              class: ie({ online: re(r).onlineCount > 0 })
            }, null, 2),
            Se(g(re(r).onlineCount) + " " + g(e("个执行器在线", "executors online")) + " ", 1),
            i("button", {
              onClick: f[0] || (f[0] = (p) => re(r).fetchAgents()),
              title: e("刷新", "Refresh"),
              "aria-label": "refresh"
            }, [...f[20] || (f[20] = [
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
            ])], 8, vo)
          ]),
          Ft(i("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (p) => u.value = p),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, bo), [
            [gn, u.value]
          ]),
          i("nav", yo, [
            (b(!0), _(oe, null, ve([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (p) => (b(), _("button", {
              key: p.id,
              class: ie({ chosen: o.value === p.id }),
              onClick: (M) => o.value = p.id
            }, g(p.label), 11, _o))), 128))
          ]),
          i("label", wo, [
            Ft(i("input", {
              "onUpdate:modelValue": f[2] || (f[2] = (p) => K.value = p),
              type: "checkbox"
            }, null, 512), [
              [Es, K.value]
            ]),
            Se(" " + g(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          i("div", xo, [
            (b(!0), _(oe, null, ve($t.value, (p) => (b(), _("button", {
              key: p.task_id,
              class: ie(["session-card", { selected: s.value === p.session_id && !Be.value }]),
              disabled: le.value,
              onClick: (M) => It(p.session_id)
            }, [
              i("span", To, g(Oe(p) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              i("strong", null, g(p.prompt || "未命名会话"), 1),
              i("small", null, g(Xe(p.started_at)), 1)
            ], 10, So))), 128)),
            $t.value.length ? U("", !0) : (b(), _("p", Ao, g(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          i("button", {
            class: ie(["ledger-button", { chosen: Be.value }]),
            onClick: f[3] || (f[3] = (p) => Be.value = !0)
          }, g(e("全部任务记录", "All task records")) + " · " + g(re(r).tasks.length), 3)
        ]),
        Be.value ? (b(), _("section", Eo, [
          i("header", null, [
            i("h2", null, g(e("全部任务记录", "All task records")), 1),
            i("button", {
              onClick: f[4] || (f[4] = (p) => Be.value = !1)
            }, g(e("返回会话", "Back to chat")), 1)
          ]),
          i("p", Ro, g(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (b(!0), _(oe, null, ve(re(r).tasks, (p) => (b(), _("article", {
            key: p.task_id,
            class: "ledger-entry"
          }, [
            i("div", null, [
              i("span", null, g(p.kind || "agent"), 1),
              i("span", {
                class: ie(p.state)
              }, g(Ne(p.state)), 3),
              i("small", null, g(Xe(p.started_at)), 1)
            ]),
            i("p", null, g(p.prompt), 1),
            re(r).sessions.some((M) => M.session_id === p.session_id) ? (b(), _("button", {
              key: 0,
              onClick: (M) => It(p.session_id)
            }, "打开所属会话", 8, $o)) : U("", !0),
            i("details", null, [
              f[21] || (f[21] = i("summary", null, "详情", -1)),
              i("code", null, g(p.task_id), 1),
              i("pre", null, g(p.result || p.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (b(), _("section", Co, [
          i("header", Lo, [
            i("div", null, [
              i("h2", null, g(te.value?.prompt || "与 Agent 对话"), 1),
              i("p", null, g(te.value && Oe(te.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            de.value ? (b(), _("span", Io, "正在执行")) : U("", !0),
            te.value ? (b(), _("div", Oo, [
              i("button", {
                disabled: !!de.value,
                onClick: f[5] || (f[5] = (p) => Lt(te.value.state === "archived" ? "restore" : "archive"))
              }, g(te.value.state === "archived" ? "恢复" : "归档"), 9, Po),
              i("button", {
                disabled: !!de.value,
                onClick: f[6] || (f[6] = (p) => Lt("delete"))
              }, "删除", 8, No)
            ])) : U("", !0)
          ]),
          be.value || re(r).error ? (b(), _("div", Do, g(be.value || re(r).error), 1)) : U("", !0),
          se.value ? (b(), _("section", Mo, [
            I.value ? (b(), _(oe, { key: 0 }, [
              i("strong", null, g(I.value.host?.hostname || I.value.name), 1),
              i("span", {
                class: ie(re(r).isHealthy(I.value) ? "done" : "failed")
              }, g(re(r).isHealthy(I.value) ? "在线" : "离线"), 3),
              i("div", zo, [
                (b(!0), _(oe, null, ve([{ label: "CPU 占用", value: X.value?.cpu_percent }, { label: "内存占用", value: X.value?.memory_percent }], (p) => (b(), _("div", {
                  key: p.label,
                  class: "usage-metric"
                }, [
                  i("div", {
                    class: "usage-ring",
                    style: jt(xn(p.value || 0))
                  }, [
                    i("b", null, g(p.value === void 0 ? "—" : `${p.value.toFixed(1)}%`), 1)
                  ], 4),
                  i("span", null, g(p.label), 1)
                ]))), 128)),
                i("small", null, g(X.value ? `采样时间：${Xe(X.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              i("dl", null, [
                i("div", null, [
                  f[22] || (f[22] = i("dt", null, "执行器地址", -1)),
                  i("dd", null, g(I.value.address), 1)
                ]),
                i("div", null, [
                  f[23] || (f[23] = i("dt", null, "系统 / 架构", -1)),
                  i("dd", null, g(I.value.host?.os || "—") + " / " + g(I.value.host?.arch || "—"), 1)
                ]),
                i("div", null, [
                  f[24] || (f[24] = i("dt", null, "CPU", -1)),
                  i("dd", null, g(I.value.host?.cpu_model || "—") + " · " + g(I.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                i("div", null, [
                  f[25] || (f[25] = i("dt", null, "可用 / 总内存", -1)),
                  i("dd", null, g(Zt(I.value.host?.memory_available_bytes)) + " / " + g(Zt(I.value.host?.memory_total_bytes)), 1)
                ]),
                i("div", null, [
                  f[26] || (f[26] = i("dt", null, "活跃任务", -1)),
                  i("dd", null, g(I.value.active_tasks), 1)
                ]),
                i("div", null, [
                  f[27] || (f[27] = i("dt", null, "距上次心跳", -1)),
                  i("dd", null, g(I.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                i("div", null, [
                  f[28] || (f[28] = i("dt", null, "默认工作目录", -1)),
                  i("dd", null, g(I.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (b(), _("p", Uo, "没有可用的执行器宿主机信息。"))
          ])) : U("", !0),
          i("div", {
            ref_key: "transcript",
            ref: Ke,
            class: "transcript",
            onScrollPassive: ct
          }, [
            j.value ? (b(), _("div", Fo, [
              i("header", Bo, [
                i("button", {
                  type: "button",
                  onClick: Ct
                }, "← " + g($e.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                i("div", null, [
                  i("h3", null, g(e("子 Agent", "Subagent")), 1),
                  i("p", Ho, g(j.value.prompt), 1)
                ]),
                i("span", {
                  class: ie(j.value.state)
                }, g(Ne(j.value.state)), 3)
              ]),
              i("div", jo, [
                i("div", Wo, [
                  i("div", Vo, [
                    i("b", null, g(e("父 Agent", "Parent agent")), 1),
                    i("time", null, g(Xe(j.value.started_at)), 1)
                  ]),
                  i("div", qo, g(j.value.prompt), 1)
                ]),
                (b(!0), _(oe, null, ve(we(j.value), (p) => (b(), _(oe, {
                  key: p.task_id
                }, [
                  p.kind === "think" && (p.result || p.state === "running" || p.error) ? (b(), _("div", Go, [
                    p.prompt ? (b(), _("small", Yo, g(p.prompt), 1)) : U("", !0),
                    p.result ? (b(), _(oe, { key: 1 }, [
                      Me(pn, {
                        content: p.result
                      }, null, 8, ["content"]),
                      p.state === "running" ? (b(), _("span", Zo, " ▍")) : U("", !0)
                    ], 64)) : p.state === "running" ? (b(), _("small", Ko, g(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : U("", !0),
                    p.error ? (b(), _("p", Xo, g(De(p.error)), 1)) : U("", !0)
                  ])) : p.kind === "subagent" ? (b(), _("div", Qo, [
                    i("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: (M) => je(p)
                    }, [
                      i("span", {
                        class: ie(p.state)
                      }, "●", 2),
                      i("strong", null, g(e("子 Agent", "Subagent")), 1),
                      i("span", ei, g(p.prompt), 1),
                      i("small", null, g(Ne(p.state)), 1),
                      f[29] || (f[29] = i("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, Jo)
                  ])) : p.kind === "tool" ? (b(), St(Hr, {
                    key: 2,
                    step: p,
                    "format-error": De
                  }, null, 8, ["step"])) : p.kind !== "think" ? (b(), _("details", ti, [
                    i("summary", null, [
                      i("span", {
                        class: ie(p.state)
                      }, "●", 2),
                      Se(" " + g(Ge(p)) + " · " + g(p.prompt) + " ", 1),
                      i("small", null, g(Ne(p.state)), 1)
                    ]),
                    i("pre", null, g(p.result || p.error || (p.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : U("", !0)
                ], 64))), 128)),
                Qe(j.value) ? (b(), _("div", ni, [
                  Me(pn, {
                    content: Qe(j.value)
                  }, null, 8, ["content"])
                ])) : U("", !0),
                j.value.error ? (b(), _("p", ri, g(De(j.value.error)), 1)) : U("", !0),
                !we(j.value).length && !Qe(j.value) && !j.value.error ? (b(), _("p", si, g(j.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : U("", !0)
              ])
            ])) : (b(), _(oe, { key: 1 }, [
              Pe.value.length ? U("", !0) : (b(), _("div", li, [...f[30] || (f[30] = [
                i("h2", null, "想让 Agent 帮你做什么？", -1),
                i("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                i("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])),
              (b(!0), _(oe, null, ve(Pe.value, (p) => (b(), _("article", {
                key: p.task_id,
                class: "turn"
              }, [
                i("div", ai, [
                  i("div", oi, [
                    i("b", null, g(Oe(p) ? "LIFE" : "你"), 1),
                    i("time", null, g(Xe(p.started_at)), 1)
                  ]),
                  i("div", ii, g(p.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                i("div", ui, [
                  i("div", ci, [
                    f[31] || (f[31] = i("b", null, "Agent", -1)),
                    i("span", {
                      class: ie(p.state)
                    }, g(Ne(p.state)), 3)
                  ]),
                  dt(p).length ? (b(), _("div", di, [
                    (b(!0), _(oe, null, ve(dt(p), (M) => (b(), _(oe, {
                      key: M.task_id
                    }, [
                      M.kind === "think" && (M.result || M.state === "running" || M.error) ? (b(), _("div", pi, [
                        M.prompt ? (b(), _("small", hi, g(M.prompt), 1)) : U("", !0),
                        M.result ? (b(), _(oe, { key: 1 }, [
                          Me(pn, {
                            content: M.result
                          }, null, 8, ["content"]),
                          M.state === "running" ? (b(), _("span", fi, " ▍")) : U("", !0)
                        ], 64)) : M.state === "running" ? (b(), _("small", gi, "Agent 正在生成回复…")) : U("", !0),
                        M.error ? (b(), _("p", mi, g(De(M.error)), 1)) : U("", !0)
                      ])) : M.kind === "subagent" ? (b(), _("div", ki, [
                        i("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (Tn) => je(M)
                        }, [
                          i("span", {
                            class: ie(M.state)
                          }, "●", 2),
                          i("strong", null, g(e("子 Agent", "Subagent")), 1),
                          i("span", bi, g(M.prompt), 1),
                          i("small", null, [
                            Se(g(Ne(M.state)), 1),
                            st(M) ? (b(), _(oe, { key: 0 }, [
                              Se(" · " + g(st(M)) + " " + g(e("步", "steps")), 1)
                            ], 64)) : U("", !0)
                          ]),
                          f[32] || (f[32] = i("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, vi),
                        M.error ? (b(), _("p", yi, g(De(M.error)), 1)) : U("", !0)
                      ])) : M.kind === "tool" ? (b(), St(Hr, {
                        key: 2,
                        step: M,
                        "format-error": De
                      }, null, 8, ["step"])) : M.kind !== "think" ? (b(), _("details", _i, [
                        i("summary", null, [
                          i("span", {
                            class: ie(M.state)
                          }, "●", 2),
                          Se(" " + g(Ge(M)) + " · " + g(M.prompt) + " ", 1),
                          i("small", null, g(Ne(M.state)), 1)
                        ]),
                        i("pre", null, g(M.result || M.error || (M.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : U("", !0)
                    ], 64))), 128))
                  ])) : U("", !0),
                  p.result && !ht(p) ? (b(), St(pn, {
                    key: 1,
                    content: p.result
                  }, null, 8, ["content"])) : U("", !0),
                  p.error ? (b(), _("div", wi, g(De(p.error)), 1)) : U("", !0),
                  ["running", "pending"].includes(p.state) ? (b(), _("p", xi, "Agent 正在处理，执行过程会自动更新…")) : U("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          j.value ? U("", !0) : (b(), _("form", {
            key: 2,
            class: "composer",
            onSubmit: Ie(ft, ["prevent"])
          }, [
            x.value ? (b(), _("div", Si, g(x.value), 1)) : U("", !0),
            i("div", Ti, [
              i("label", null, [
                Se(g(e("权限", "Permissions")), 1),
                Me(hn, {
                  modelValue: $.value,
                  "onUpdate:modelValue": f[7] || (f[7] = (p) => $.value = p),
                  "aria-label": e("权限", "Permissions"),
                  disabled: !!de.value || le.value,
                  options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Se(g(e("执行器", "Executor")), 1),
                Me(hn, {
                  modelValue: k.value,
                  "onUpdate:modelValue": f[8] || (f[8] = (p) => k.value = p),
                  "aria-label": e("执行器", "Executor"),
                  disabled: !!de.value || le.value,
                  options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...re(r).agents.map((p) => ({ value: p.plugin_id, label: `${p.host?.hostname || p.name} · ${p.plugin_id}`, disabled: !re(r).isHealthy(p) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              i("label", null, [
                Se(g(e("工作区", "Workspace")), 1),
                i("button", {
                  type: "button",
                  class: "workspace-select",
                  disabled: !!de.value || le.value || !I.value,
                  title: A.value || I.value?.host?.workdir,
                  onClick: f[9] || (f[9] = (p) => Fe(A.value || I.value?.host?.workdir || ""))
                }, [
                  f[33] || (f[33] = i("svg", {
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
                  Se(" " + g(A.value || e("选择目录…", "Select folder…")), 1)
                ], 8, Ai)
              ]),
              Me(po, {
                modelValue: T.value,
                "onUpdate:modelValue": f[10] || (f[10] = (p) => T.value = p),
                disabled: !!de.value || le.value
              }, null, 8, ["modelValue", "disabled"]),
              i("label", null, [
                Se(g(e("模型", "Model")), 1),
                Me(hn, {
                  modelValue: z.value,
                  "onUpdate:modelValue": f[11] || (f[11] = (p) => z.value = p),
                  searchable: "",
                  "aria-label": e("模型", "Model"),
                  disabled: !!de.value || le.value,
                  onOpen: Qt,
                  options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...Q.value.map((p) => ({ value: p.id, label: Sn(p) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ])
            ]),
            i("div", Ei, [
              Ft(i("textarea", {
                "onUpdate:modelValue": f[12] || (f[12] = (p) => a.value = p),
                disabled: le.value || te.value?.state === "archived",
                placeholder: te.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行）",
                "aria-label": "给 Agent 发消息",
                onKeydown: wn
              }, null, 40, Ri), [
                [gn, a.value]
              ]),
              de.value?.kind !== "agent" ? (b(), _("button", {
                key: 0,
                type: "submit",
                class: "send-fly",
                disabled: le.value || !!de.value || !a.value.trim() || te.value?.state === "archived",
                "aria-label": e("发送", "Send"),
                title: e("发送", "Send")
              }, [...f[34] || (f[34] = [
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
              ])], 8, $i)) : (b(), _("button", {
                key: 1,
                type: "button",
                class: "send-fly stop",
                onClick: Ot,
                "aria-label": e("停止", "Stop"),
                title: e("停止", "Stop")
              }, [...f[35] || (f[35] = [
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
              ])], 8, Ci))
            ]),
            i("footer", null, [
              Me(hn, {
                modelValue: m.value,
                "onUpdate:modelValue": f[13] || (f[13] = (p) => m.value = p),
                disabled: le.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              i("button", {
                type: "button",
                onClick: f[14] || (f[14] = (p) => se.value = !se.value)
              }, g(e("宿主机", "Host")), 1),
              i("button", {
                type: "button",
                disabled: !te.value || !!de.value || le.value || te.value.state === "archived",
                onClick: Yt
              }, "/compact", 8, Li),
              i("span", Ii, g(de.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : re(r).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1)
            ])
          ], 32))
        ])),
        C.value ? (b(), _("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Ie(W, ["self"])
        }, [
          i("section", Oi, [
            i("header", null, [
              i("h2", null, "选择 " + g(I.value?.host?.hostname || "执行器") + " 的工作区", 1),
              i("button", { onClick: W }, "关闭")
            ]),
            i("div", Pi, [
              (b(!0), _(oe, null, ve(G.value.roots, (p) => (b(), _("button", {
                key: p,
                disabled: N.value,
                onClick: (M) => Fe(p)
              }, g(p), 9, Ni))), 128)),
              i("button", {
                disabled: N.value,
                onClick: f[15] || (f[15] = (p) => Fe(I.value?.host?.workdir || ""))
              }, "默认目录", 8, Di)
            ]),
            i("code", null, g(G.value.path), 1),
            i("form", {
              class: "new-folder",
              onSubmit: Ie(B, ["prevent"])
            }, [
              Ft(i("input", {
                "onUpdate:modelValue": f[16] || (f[16] = (p) => q.value = p),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: N.value
              }, null, 8, Mi), [
                [gn, q.value]
              ]),
              i("button", {
                disabled: N.value || !q.value.trim() || !G.value.path
              }, "新建文件夹", 8, zi)
            ], 32),
            D.value ? (b(), _("p", Ui, g(D.value), 1)) : U("", !0),
            N.value ? (b(), _("p", Fi, "正在读取目录…")) : (b(), _("div", Bi, [
              G.value.parent !== G.value.path ? (b(), _("button", {
                key: 0,
                onClick: f[17] || (f[17] = (p) => Fe(G.value.parent))
              }, "上一级")) : U("", !0),
              (b(!0), _(oe, null, ve(G.value.directories, (p) => (b(), _("button", {
                key: p.path,
                onClick: (M) => Fe(p.path)
              }, [
                f[36] || (f[36] = i("svg", {
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
                Se(" " + g(p.name), 1)
              ], 8, Hi))), 128)),
              G.value.directories.length ? U("", !0) : (b(), _("p", ji, "没有子目录"))
            ])),
            i("footer", null, [
              i("button", {
                disabled: N.value || !!D.value || !G.value.path,
                onClick: Gt
              }, "选择当前目录", 8, Wi)
            ])
          ])
        ])) : U("", !0)
      ]),
      Me(ho)
    ], 64));
  }
}), Yi = /* @__PURE__ */ er(Vi, [["__scopeId", "data-v-bd31ecb2"]]);
export {
  Yi as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-c097ee74]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-c097ee74]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:13px}.tool-kind[data-v-c097ee74]{flex-shrink:0;font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface)}.tool-summary[data-v-c097ee74]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--code-font);font-size:13px;color:var(--md-on-surface)}.tool-stat[data-v-c097ee74]{flex-shrink:0;font-size:12px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-c097ee74]{flex-shrink:0;font-size:13px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-c097ee74]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:12px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-c097ee74]{transform:rotate(90deg)}.tool-dot[data-v-c097ee74]{font-size:9px}.tool-dot.running[data-v-c097ee74],.tool-dot.pending[data-v-c097ee74]{color:#b88412}.tool-dot.failed[data-v-c097ee74]{color:var(--md-error,#c44)}.tool-dot.done[data-v-c097ee74]{color:#3a6}.tool-dot.cancelled[data-v-c097ee74]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-c097ee74]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-c097ee74]{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-c097ee74]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-family:var(--code-font);font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-section-text[data-v-c097ee74]{margin:0;font-size:13px;overflow-wrap:anywhere}.tool-error[data-v-c097ee74]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-c097ee74]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-c097ee74]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-c097ee74]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-c097ee74]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-c097ee74]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-c097ee74],.tool-dialog-close[data-v-c097ee74]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-c097ee74]:hover,.tool-dialog-close[data-v-c097ee74]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-c097ee74]:active,.tool-dialog-close[data-v-c097ee74]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-c097ee74]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-c097ee74]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-c097ee74]:hover{text-decoration:underline}.tool-search-results p[data-v-c097ee74]{margin:4px 0 0;font-size:13px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-c097ee74]{display:block;margin-top:2px;font-size:12px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.tool-card[data-v-c097ee74]{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent);background:var(--md-surface-container);transition:box-shadow .22s,background-color .2s}.tool-card[data-v-c097ee74]:hover{box-shadow:var(--shadow-1)}button.tool-card-head[data-v-c097ee74]{padding:12px 15px;gap:10px;min-height:46px;border-radius:0}button.tool-card-head[data-v-c097ee74]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-c097ee74]{font-weight:700;letter-spacing:.06em}.tool-stat[data-v-c097ee74]{border-color:color-mix(in srgb,var(--md-primary) 30%,transparent);background:color-mix(in srgb,var(--md-primary) 10%,transparent)}.tool-chevron[data-v-c097ee74]{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:50%;background:var(--md-surface-container-high);transition:transform .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}.tool-card-body[data-v-c097ee74]{padding:8px 15px 15px;gap:8px;border-top-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-card-body pre[data-v-c097ee74]{border-radius:14px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}.tool-section-label[data-v-c097ee74]{font-weight:700}.diff-wrap[data-v-c097ee74]{display:flex;flex-direction:column;gap:10px}.diff-file[data-v-c097ee74]{border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);border-radius:14px;overflow:hidden;background:var(--md-surface-container-lowest)}.diff-file-head[data-v-c097ee74]{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;background:var(--md-surface-container);font-size:11.5px;font-weight:650}.diff-file-path[data-v-c097ee74]{font-family:var(--code-font);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.diff-file-stat[data-v-c097ee74]{flex:none;font-family:var(--code-font);color:var(--md-on-surface-variant)}.diff-body[data-v-c097ee74]{max-height:360px;overflow:auto;font-family:var(--code-font);font-size:12px;line-height:1.55;padding:4px 0}.diff-line[data-v-c097ee74]{display:grid;grid-template-columns:40px 40px 18px 1fr;white-space:pre;min-width:max-content}.diff-no[data-v-c097ee74]{text-align:right;padding:0 6px;color:var(--md-on-surface-variant);opacity:.6;user-select:none;font-variant-numeric:tabular-nums}.diff-sign[data-v-c097ee74]{text-align:center;user-select:none;opacity:.9}.diff-text[data-v-c097ee74]{padding-right:12px}.diff-line.add[data-v-c097ee74]{background:color-mix(in srgb,#2ea043 20%,transparent);color:#116329}.diff-line.del[data-v-c097ee74]{background:color-mix(in srgb,#cf222e 18%,transparent);color:#82071e}.diff-line.add .diff-sign[data-v-c097ee74]{color:#116329;font-weight:700}.diff-line.del .diff-sign[data-v-c097ee74]{color:#cf222e;font-weight:700}.diff-line.hunk[data-v-c097ee74]{background:var(--md-surface-container);color:var(--md-on-surface-variant)}.diff-line.meta[data-v-c097ee74]{color:var(--md-on-surface-variant);opacity:.75}@media (prefers-color-scheme: dark){.diff-line.add[data-v-c097ee74],.diff-line.add .diff-sign[data-v-c097ee74]{color:#7ee787}.diff-line.del[data-v-c097ee74],.diff-line.del .diff-sign[data-v-c097ee74]{color:#ffa198}}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}#app .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background-color:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:15px;text-align:left;cursor:pointer;box-shadow:none;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}#app .app-select-trigger[aria-expanded=true],#app .app-select-trigger:focus-visible{border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .16s}#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-chevron svg{transition:transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.app-select-chevron svg.is-open{transform:rotate(180deg)}.app-select-menu{position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;font-family:var(--font-family);font-size:14px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);transition:background-color .14s,border-radius .3s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color .14s}.app-select-option>span{min-width:0}.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}.app-select-option.selected.highlighted{background:color-mix(in srgb,var(--md-primary-container) 88%,var(--md-primary) 12%)}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-search{position:sticky;top:-8px;z-index:1;display:flex;align-items:center;gap:10px;margin:-8px -8px 8px;padding:13px 16px;background:var(--md-surface-container-low);border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);border-radius:24px 24px 0 0;color:var(--md-on-surface-variant)}.app-select-search input{flex:1;min-width:0;border:0;background:transparent;padding:0;font:inherit;color:var(--md-on-surface);outline:none}.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}.select-menu-enter-active{transition:opacity .18s var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.thinking-popover.full{box-shadow:0 8px 28px #24345d24,0 0 34px #a050db33;border-color:#a050db77}.thinking-popover.full .energy-wave{position:absolute;inset:-3px 4px;border-radius:999px;z-index:-1;background:radial-gradient(70% 120% at 100% 50%,#c56bffbb,transparent 68%),radial-gradient(50% 120% at 0% 50%,#6b8cffaa,transparent 70%);filter:blur(7px);animation:thunder-glow 1.7s ease-in-out infinite}@keyframes thunder-glow{0%,to{opacity:.5;transform:scale(1)}45%{opacity:1;transform:scale(1.03)}}.thinking-popover.full .thinking-capsule{box-shadow:0 0 0 1px #a050db66,0 0 26px #a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#6b8cff,#a050db,#e0a3ff,#a050db);background-size:280% 100%;animation:thunder-flow 2.6s linear infinite}@keyframes thunder-flow{to{background-position:280% 0}}.thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-control.full .thinking-trigger span:first-child{animation:thunder-flicker 2s steps(1,end) infinite}@keyframes thunder-flicker{0%,90%,to{opacity:1}92%{opacity:.35}94%{opacity:1}96%{opacity:.5}}#app .thinking-control .thinking-trigger{min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:13px;font-weight:500;align-items:center;transition:background-color .18s,border-color .18s,box-shadow .2s,border-radius .34s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .thinking-control .thinking-trigger:hover{background:var(--md-surface-container-highest)}#app .thinking-control .thinking-trigger[aria-expanded=true]{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .thinking-control.full .thinking-trigger{color:#7b3fd0;border-color:#a050db66;box-shadow:0 0 0 1px #a050db33,0 0 18px #a050db3d}.thinking-caption{font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-bd31ecb2]{--code-font:ui-monospace,\"Cascadia Code\",\"JetBrains Mono\",Consolas,\"SFMono-Regular\",Menlo,monospace;display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-bd31ecb2],input[data-v-bd31ecb2],textarea[data-v-bd31ecb2],select[data-v-bd31ecb2]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-bd31ecb2]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-bd31ecb2]:disabled{opacity:.45;cursor:default}button[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-bd31ecb2]:focus,textarea[data-v-bd31ecb2]:focus,select[data-v-bd31ecb2]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-bd31ecb2]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-bd31ecb2]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-bd31ecb2]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-bd31ecb2]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-bd31ecb2]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-bd31ecb2]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-bd31ecb2]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-bd31ecb2]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-bd31ecb2]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-bd31ecb2]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-bd31ecb2]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-bd31ecb2]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-bd31ecb2]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-bd31ecb2]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-bd31ecb2]{margin-right:6px}.session-list[data-v-bd31ecb2]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-bd31ecb2]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-bd31ecb2]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-bd31ecb2]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-bd31ecb2]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:14px}.origin[data-v-bd31ecb2],small[data-v-bd31ecb2],.sessions .muted[data-v-bd31ecb2]{font-size:12px;color:var(--md-on-surface-variant)}.origin[data-v-bd31ecb2]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-bd31ecb2]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:13px;font-weight:550}.ledger-button.chosen[data-v-bd31ecb2]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-bd31ecb2]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-bd31ecb2]{margin-bottom:8px}.ledger>header h2[data-v-bd31ecb2]{font-size:18px;font-weight:650}.ledger-entry[data-v-bd31ecb2]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-bd31ecb2]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-bd31ecb2]:first-child{font-family:var(--code-font);background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-bd31ecb2]{margin-left:auto}.ledger-entry>p[data-v-bd31ecb2]{margin:8px 0;font-size:14px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-bd31ecb2]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-bd31ecb2]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-bd31ecb2]{margin:8px 0 0;max-height:300px}.conversation[data-v-bd31ecb2]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-bd31ecb2]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-bd31ecb2]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-bd31ecb2]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-bd31ecb2]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:13px}.session-actions[data-v-bd31ecb2]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-bd31ecb2]{height:32px;padding:0 13px;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-bd31ecb2]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-bd31ecb2]{color:var(--md-error)}.done[data-v-bd31ecb2]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-bd31ecb2],.muted[data-v-bd31ecb2]{color:var(--md-on-surface-variant)}.muted[data-v-bd31ecb2]{font-size:12px;line-height:1.6}.error[data-v-bd31ecb2]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-bd31ecb2]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.welcome[data-v-bd31ecb2]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-bd31ecb2]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-bd31ecb2]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-bd31ecb2]{margin:6px 0;font-size:14px}.turn[data-v-bd31ecb2]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-bd31ecb2]{padding:15px 19px;font-size:14px}.bubble.user[data-v-bd31ecb2]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-bd31ecb2]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-bd31ecb2]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-bd31ecb2]{font-weight:700}.bubble .message-head time[data-v-bd31ecb2]{margin-left:auto;opacity:.75;font-size:12px}.bubble .message-head span[data-v-bd31ecb2]{margin-left:auto}.bubble.user .message-head[data-v-bd31ecb2]{margin-bottom:7px;opacity:.85}.message-text[data-v-bd31ecb2]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-bd31ecb2] p{margin:.4em 0}.bubble.agent[data-v-bd31ecb2] pre{max-height:420px}.agent-speech[data-v-bd31ecb2]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-bd31ecb2]{display:block;font-size:12px;opacity:.7;margin-bottom:4px;font-family:var(--code-font)}.agent-speech[data-v-bd31ecb2] p{margin:.45em 0}.agent-speech[data-v-bd31ecb2] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:13px}.agent-speech[data-v-bd31ecb2] code{font-family:var(--code-font)}.agent-speech[data-v-bd31ecb2] ul{padding-left:20px;margin:.4em 0}.steps[data-v-bd31ecb2]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-bd31ecb2]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-bd31ecb2]{cursor:pointer;font-size:13px;font-weight:550}.steps summary small[data-v-bd31ecb2]{margin-left:10px;font-weight:600}.steps summary[data-v-bd31ecb2]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-bd31ecb2]{margin:10px 0 0;font-family:var(--code-font);font-size:13px;white-space:pre-wrap;max-height:400px}pre[data-v-bd31ecb2]{max-height:450px;overflow:auto;font-family:var(--code-font)}.subagent-card[data-v-bd31ecb2]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-bd31ecb2]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:13px}button.subagent-card-head[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-bd31ecb2]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-bd31ecb2]{font-weight:700}.subagent-prompt[data-v-bd31ecb2]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-bd31ecb2]{font-weight:600}.subagent-chevron[data-v-bd31ecb2]{color:var(--md-on-surface-variant);font-size:12px}.subagent-card-error[data-v-bd31ecb2]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-bd31ecb2]{margin:6px 0;box-shadow:none}.sub-view[data-v-bd31ecb2]{max-width:900px;margin:0 auto}.sub-view-header[data-v-bd31ecb2]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-bd31ecb2]{flex-shrink:0;border-radius:9px;font-size:13px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-bd31ecb2]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-bd31ecb2]{margin:0;max-width:520px}.sub-view-header>span[data-v-bd31ecb2]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-bd31ecb2]{min-height:120px}.composer[data-v-bd31ecb2]{flex-shrink:0;margin:0 20px 18px;border:1px solid var(--md-outline-variant);border-radius:18px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}.composer-input[data-v-bd31ecb2]{position:relative}.composer-input textarea[data-v-bd31ecb2]{font-size:14px;width:100%;display:block;min-height:96px;padding:15px 64px 15px 18px;line-height:1.6;resize:vertical;border:0;border-radius:0;background:transparent}.composer-input textarea[data-v-bd31ecb2]:focus{box-shadow:none;border:0}.send-fly[data-v-bd31ecb2]{position:absolute!important;right:10px!important;bottom:10px!important;z-index:2;width:42px!important;height:42px!important;aspect-ratio:1/1;display:grid!important;place-items:center;border:0!important;border-radius:50%!important;padding:0!important;margin:0!important;background:var(--md-primary);color:var(--md-on-primary,#fff);box-shadow:0 2px 10px color-mix(in srgb,var(--md-primary) 38%,transparent)}.send-fly svg[data-v-bd31ecb2]{width:20px;height:20px}.send-fly[data-v-bd31ecb2]:hover:not(:disabled){filter:brightness(1.08)}.send-fly[data-v-bd31ecb2]:disabled{background:var(--md-surface-container);color:var(--md-on-surface-variant);opacity:.7;box-shadow:none}.send-fly.stop[data-v-bd31ecb2]{background:var(--md-error);color:#fff;box-shadow:0 2px 10px color-mix(in srgb,var(--md-error) 40%,transparent)}.compact-notice[data-v-bd31ecb2]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.execution-options[data-v-bd31ecb2]{display:flex;gap:10px;padding:12px 16px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-bd31ecb2]{display:flex;flex-direction:column;gap:5px;font-size:12px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-bd31ecb2] .app-select-trigger,.execution-options .workspace-select[data-v-bd31ecb2]{width:100%;font-size:13px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-bd31ecb2]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-bd31ecb2]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap;border-top:1px solid var(--md-outline-variant)}.composer footer>select[data-v-bd31ecb2],.composer footer>.app-select[data-v-bd31ecb2]{font-size:13px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-bd31ecb2]{flex:1;min-width:120px}.composer footer>button[data-v-bd31ecb2]{font-size:13px;font-weight:600;border-radius:9px;min-height:34px}.host-panel>strong[data-v-bd31ecb2]{font-size:14px}.host-panel dl[data-v-bd31ecb2]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-bd31ecb2]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-bd31ecb2]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-bd31ecb2]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-bd31ecb2]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-bd31ecb2]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-bd31ecb2]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-bd31ecb2]{display:flex;gap:8px}.new-folder input[data-v-bd31ecb2]{flex:1;min-width:0}.directory-backdrop[data-v-bd31ecb2]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-bd31ecb2]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-bd31ecb2]{gap:12px}.directory-dialog>header h2[data-v-bd31ecb2]{font-size:16px;font-weight:650}.directory-list[data-v-bd31ecb2]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-bd31ecb2]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-bd31ecb2]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-bd31ecb2]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-bd31ecb2]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-bd31ecb2]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-bd31ecb2]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-bd31ecb2]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-bd31ecb2]{display:block;margin:8px 0}.permission-request pre[data-v-bd31ecb2]{max-height:160px;overflow:auto}.permission-request>div[data-v-bd31ecb2]{display:flex;justify-content:flex-end;gap:8px}#app .workspace[data-v-bd31ecb2]{gap:12px;padding-left:6px;background:var(--md-surface-container)}#app .workspace .sessions[data-v-bd31ecb2]{width:296px;gap:14px;padding:18px 14px;border:0;border-radius:28px;background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}#app .workspace .sessions h1[data-v-bd31ecb2]{font-size:24px;font-weight:800;letter-spacing:-.02em}#app .workspace .sessions header>button[data-v-bd31ecb2]{height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:700 13px/1 inherit;display:inline-flex;align-items:center;gap:7px;box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}#app .workspace .sessions header>button[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.06);box-shadow:0 8px 20px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .sessions>input[data-v-bd31ecb2]{min-height:48px;padding:0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font-size:14px}#app .workspace .sessions>input[data-v-bd31ecb2]:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}#app .workspace .filter-bar[data-v-bd31ecb2]{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}#app .workspace .filter-bar button[data-v-bd31ecb2]{border-radius:999px;padding:8px 4px;font-weight:600}#app .workspace .filter-bar button.chosen[data-v-bd31ecb2]{background:var(--md-primary);color:var(--md-on-primary,#fff);font-weight:700;box-shadow:var(--shadow-1)}#app .workspace .filter-bar button.chosen[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff)}#app .workspace .session-list[data-v-bd31ecb2]{margin:0 -2px;padding:0 2px}#app .workspace .session-card[data-v-bd31ecb2]{gap:5px;margin-bottom:8px;padding:13px 15px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:18px;background:var(--md-surface-container-lowest);transition:transform .26s var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color .2s,border-color .2s,box-shadow .22s,border-radius .32s var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}#app .workspace .session-card[data-v-bd31ecb2]:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-1);border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant))}#app .workspace .session-card.selected[data-v-bd31ecb2]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent;border-radius:20px 20px 20px 7px;box-shadow:var(--shadow-1)}#app .workspace .session-card .origin[data-v-bd31ecb2]{font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:12px;color:var(--md-primary)}#app .workspace .session-card.selected .origin[data-v-bd31ecb2]{color:var(--md-on-secondary-container);opacity:.75}#app .workspace .ledger-button[data-v-bd31ecb2]{min-height:44px;border-radius:16px;font-weight:650;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .ledger-button.chosen[data-v-bd31ecb2]{background:var(--md-secondary-container);color:var(--md-on-secondary-container);border-color:transparent}#app .workspace .ledger-entry[data-v-bd31ecb2]{border-radius:20px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-lowest);box-shadow:var(--shadow-1)}#app .workspace .conversation[data-v-bd31ecb2]{background:var(--md-surface);border-radius:30px;overflow:hidden;box-shadow:var(--shadow-1)}#app .workspace .conversation-header[data-v-bd31ecb2]{padding:20px 26px 16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .conversation-header h2[data-v-bd31ecb2]{font-size:20px;font-weight:750;letter-spacing:-.01em}#app .workspace .session-actions button[data-v-bd31ecb2]{height:36px;padding:0 15px;border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .session-actions button[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-surface-container-highest);box-shadow:none}#app .workspace .running[data-v-bd31ecb2]{color:#b88412;background:color-mix(in srgb,#B88412 14%,transparent);padding:4px 11px;border-radius:999px;font-weight:700}#app .workspace .transcript[data-v-bd31ecb2]{padding:28px 30px}#app .workspace .welcome[data-v-bd31ecb2]{margin:64px auto 0}#app .workspace .welcome[data-v-bd31ecb2]:before{width:76px;height:76px;border-radius:26px 26px 26px 10px;background-color:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 24 24' fill='none' stroke='%235944c6' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-size:34px 34px}#app .workspace .welcome h2[data-v-bd31ecb2]{font-size:26px;font-weight:800;letter-spacing:-.02em}#app .workspace .turn[data-v-bd31ecb2]{gap:12px;margin-bottom:32px}#app .workspace .bubble[data-v-bd31ecb2]{padding:16px 20px;font-size:15px;line-height:1.7}#app .workspace .bubble.user[data-v-bd31ecb2]{background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:24px 24px 8px;box-shadow:var(--shadow-1);max-width:82%}#app .workspace .bubble.agent[data-v-bd31ecb2]{background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);border-radius:8px 24px 24px;box-shadow:var(--shadow-1);max-width:100%}#app .workspace .bubble .message-head b[data-v-bd31ecb2]{font-weight:750}#app .workspace .steps[data-v-bd31ecb2]{gap:9px;margin:14px 0}#app .workspace .steps details[data-v-bd31ecb2]{border-radius:16px;background:var(--md-surface-container);border:1px solid color-mix(in srgb,var(--md-outline-variant) 40%,transparent);padding:11px 15px}#app .workspace .subagent-card[data-v-bd31ecb2]{border-radius:18px;background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);box-shadow:var(--shadow-1)}#app .workspace button.subagent-card-head[data-v-bd31ecb2]{padding:12px 15px}#app .workspace button.subagent-card-head[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .sub-view-header[data-v-bd31ecb2]{padding-bottom:16px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent)}#app .workspace .sub-view-header button[data-v-bd31ecb2]{border-radius:999px;background:var(--md-surface-container-high);border-color:transparent;font-weight:650}#app .workspace .agent-speech[data-v-bd31ecb2] pre{border-radius:16px;background:var(--md-surface-container);border-color:color-mix(in srgb,var(--md-outline-variant) 40%,transparent)}#app .workspace .composer[data-v-bd31ecb2]{margin:0 22px 20px;border-radius:28px;overflow:hidden;background:var(--md-surface-container-lowest);border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);box-shadow:var(--shadow-2)}#app .workspace .composer[data-v-bd31ecb2]:focus-within{border-color:color-mix(in srgb,var(--md-primary) 55%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent),var(--shadow-2)}#app .workspace .execution-options[data-v-bd31ecb2]{padding:12px 16px;gap:10px;border-bottom:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent)}#app .workspace .execution-options label[data-v-bd31ecb2]{font-weight:700;letter-spacing:.05em}#app .workspace .execution-options .workspace-select[data-v-bd31ecb2]{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .execution-options[data-v-bd31ecb2] .app-select-trigger,#app .workspace .composer footer[data-v-bd31ecb2] .app-select-trigger{min-height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high);font-size:13px}#app .workspace .composer-input textarea[data-v-bd31ecb2]{border-radius:0;background:transparent}#app .workspace .send-fly[data-v-bd31ecb2]{width:46px!important;height:46px!important;border-radius:50%!important;box-shadow:0 8px 22px color-mix(in srgb,var(--md-primary) 34%,transparent)}#app .workspace .composer footer[data-v-bd31ecb2]{border-top:1px solid color-mix(in srgb,var(--md-outline-variant) 45%,transparent);padding:12px 16px}#app .workspace .composer footer>button[data-v-bd31ecb2]{border-radius:999px;min-height:36px;padding-inline:15px;background:var(--md-surface-container-high);border-color:transparent}#app .workspace .host-panel[data-v-bd31ecb2]{margin:0 22px 10px;border-radius:24px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}#app .workspace .usage-ring b[data-v-bd31ecb2]{background:var(--md-surface-container-lowest)}#app .workspace .directory-dialog[data-v-bd31ecb2]{border-radius:32px;border-color:transparent;box-shadow:var(--shadow-4);background:var(--md-surface-container-low)}#app .workspace .directory-list button[data-v-bd31ecb2]{background:var(--md-surface-container-lowest);border-color:transparent;border-radius:16px;min-height:46px}#app .workspace .directory-list button[data-v-bd31ecb2]:hover:not(:disabled){background:var(--md-secondary-container)}#app .workspace .directory-roots button[data-v-bd31ecb2]{background:var(--md-surface-container-high);border-color:transparent}@media (max-width:800px){.sessions[data-v-bd31ecb2]{width:214px;padding:12px 10px}.transcript[data-v-bd31ecb2]{padding:14px}.composer[data-v-bd31ecb2]{margin:0 12px 12px}.composer footer .muted[data-v-bd31ecb2]{display:none}.conversation-header[data-v-bd31ecb2]{padding:14px 16px}.welcome[data-v-bd31ecb2]{margin:30px auto 0}.turn[data-v-bd31ecb2]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-bd31ecb2]{flex-direction:column}.sessions[data-v-bd31ecb2]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-bd31ecb2],.filter-bar[data-v-bd31ecb2],.connection[data-v-bd31ecb2]{display:none}.session-list[data-v-bd31ecb2]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-bd31ecb2]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-bd31ecb2]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
