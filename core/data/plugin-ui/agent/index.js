var xs = Object.defineProperty;
var Ts = (n, e, t) => e in n ? xs(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var Z = (n, e, t) => Ts(n, typeof e != "symbol" ? e + "" : e, t);
import { reactive as Ss, defineComponent as Et, computed as ee, openBlock as v, createElementBlock as y, ref as U, onMounted as bn, onUnmounted as vn, normalizeClass as se, createElementVNode as c, toDisplayString as h, createCommentVNode as z, Fragment as ne, renderList as me, withModifiers as Re, watch as Ee, nextTick as dt, mergeProps as As, unref as J, createBlock as St, Teleport as jn, createVNode as Le, Transition as jr, withCtx as Wr, normalizeStyle as Ut, withKeys as _t, createTextVNode as ze, withDirectives as on, vModelText as Ln, vModelCheckbox as Es } from "vue";
function Rs() {
  const n = Ss({
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
  function b(L) {
    L.reset && a.clear();
    for (const S of L.removed || []) a.delete(S);
    for (const S of L.tasks || []) a.set(S.task_id, S);
    s = L.cursor || "";
    const P = [...a.values()].sort((S, w) => (w.started_at || "").localeCompare(S.started_at || "") || S.task_id.localeCompare(w.task_id));
    n.tasks = P.filter((S) => S.kind !== "agent_session"), n.sessions = P.filter((S) => S.kind === "agent_session");
  }
  function m() {
    i?.close(), o = !1, i = new EventSource(`/api/tasks/events?cursor=${encodeURIComponent(s)}`), i.onopen = () => {
      o = !0;
    }, i.onerror = () => {
      o = !1;
    }, i.addEventListener("tasks", (L) => {
      try {
        b(JSON.parse(L.data));
      } catch {
        o = !1;
      }
    });
  }
  function A() {
    return t ? (r || (r = t.then(() => (r = null, A()))), r) : (t = x().finally(() => {
      t = null;
    }), t);
  }
  async function x() {
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
        b(P);
      } catch (L) {
        n.error = L.message || "无法刷新任务记录";
      }
    n.loading = !1;
  }
  function N() {
    A().then(() => {
      e && m();
    }), e && clearInterval(e), e = setInterval(() => {
      !document.hidden && !t && A();
    }, 2e3);
  }
  function D() {
    i?.close(), i = null, o = !1, e && (clearInterval(e), e = null);
  }
  function O(L) {
    return !L.missing_dependencies?.length && (L.status === "PLUGIN_STATUS_HEALTHY" || L.status === "HEALTHY");
  }
  async function V(L) {
    const P = await fetch("/api/agent/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: L }) });
    if (!P.ok) throw new Error(await P.text());
    const S = await P.json();
    return await A(), S.session_id;
  }
  async function F(L, P, S) {
    const w = await fetch("/api/agent/sessions", { method: P === "delete" ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: L, action: P, title: S }) });
    if (!w.ok) throw new Error(await w.text());
    await A();
  }
  async function Y(L, P, S, w = {}) {
    const g = await fetch("/api/agent/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: L, prompt: P, agent_type: S, ...w }) }), k = await g.text();
    if (await A(), !g.ok) {
      let R = k;
      try {
        R = JSON.parse(k).message || k;
      } catch {
      }
      throw new Error(R);
    }
  }
  async function X(L) {
    const P = await fetch("/api/tasks/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task_id: L }) });
    if (!P.ok) throw new Error(await P.text());
    const S = await P.json();
    if (!S.success) throw new Error(S.message);
    await A();
  }
  return Object.assign(n, {
    fetchAgents: A,
    connect: N,
    disconnect: D,
    isHealthy: O,
    createSession: V,
    manageSession: F,
    sendTask: Y,
    cancelTask: X
  });
}
const $s = Rs();
function Cs() {
  return $s;
}
function Wn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ft = Wn();
function Vr(n) {
  ft = n;
}
var ct = { exec: () => null };
function wt(n) {
  let e = [];
  return (t) => {
    let r = Math.max(0, Math.min(3, t - 1)), s = e[r];
    return s || (s = n(r), e[r] = s), s;
  };
}
function B(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (s, a) => {
    let i = typeof a == "string" ? a : a.source;
    return i = i.replace(ce.caret, "$1"), t = t.replace(s, i), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Ls = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), ce = { codeRemoveIndent: /^(?: {0,3}\t| {1,4})/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, endingSpaceTabChar: /[ \t]$/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, leadingSpaceTab: /^[ \t]+/, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, numericCharacterReference: /&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: wt((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: wt((n) => new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)), fencesBeginRegex: wt((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: wt((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: wt((n) => new RegExp(`^ {0,${n}}(?:</?(?:${Ht})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`, "i")), blockquoteBeginRegex: wt((n) => new RegExp(`^ {0,${n}}>`)) }, Is = /^(?:[ \t]*(?:\n|$))+/, Os = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ps = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Bt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ds = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Vn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, qr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Gr = B(qr).replace(/bull/g, Vn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ns = B(qr).replace(/bull/g, Vn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), qn = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Ms = /^[^\n]+/, Gn = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zs = B(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Gn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fs = B(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, Vn).getRegex(), Ht = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Yn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Us = B("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Yn).replace("tag", Ht).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Yr = (n) => B(qn).replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ht).getRegex(), Bs = Yr(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hs = Yr(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), js = B(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hs).getRegex(), Zn = { blockquote: js, code: Os, def: zs, fences: Ps, heading: Ds, hr: Bt, html: Us, lheading: Gr, list: Fs, newline: Is, paragraph: Bs, table: ct, text: Ms }, kr = B("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ht).getRegex(), Ws = { ...Zn, lheading: Ns, table: kr, paragraph: B(qn).replace("hr", Bt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ht).getRegex() }, Vs = { ...Zn, html: B(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Yn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ct, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: B(qn).replace("hr", Bt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Gr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, qs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Zr = /^( {2,}|\\)\n(?!\s*$)[ \t]*/, Ys = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, We = /[\p{P}\p{S}]/u, Rt = /[\s\p{P}\p{S}]/u, jt = /[^\s\p{P}\p{S}]/u, Zs = B(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Rt).getRegex(), Ks = /[\p{Pi}\p{Ps}"']/u, Kr = /(?!~)[\p{P}\p{S}]/u, Xs = /(?!~)[\s\p{P}\p{S}]/u, Qs = /(?:[^\s\p{P}\p{S}]|~)/u, Js = B(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ls ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Xr = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, el = B(Xr, "u").replace(/punct/g, We).getRegex(), tl = B(Xr, "u").replace(/punct/g, Kr).getRegex(), nl = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, rl = B(nl, "u").replace(/openQuote/g, Ks).replace(/punct/g, We).getRegex(), Qr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sl = B(Qr, "gu").replace(/notPunctSpace/g, jt).replace(/punctSpace/g, Rt).replace(/punct/g, We).getRegex(), ll = B(Qr, "gu").replace(/notPunctSpace/g, Qs).replace(/punctSpace/g, Xs).replace(/punct/g, Kr).getRegex(), al = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ol = B(al, "gu").replace(/notPunctSpace/g, jt).replace(/punctSpace/g, Rt).replace(/punct/g, We).getRegex(), il = B("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, jt).replace(/punctSpace/g, Rt).replace(/punct/g, We).getRegex(), ul = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", cl = B(ul, "gu").replace(/notPunctSpace/g, jt).replace(/punctSpace/g, Rt).replace(/punct/g, We).getRegex(), dl = B(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, We).getRegex(), pl = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", fl = B(pl, "gu").replace(/notPunctSpace/g, jt).replace(/punctSpace/g, Rt).replace(/punct/g, We).getRegex(), hl = B(/\\(punct)/, "gu").replace(/punct/g, We).getRegex(), gl = B(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ml = B(Yn).replace("(?:-->|$)", "-->").getRegex(), kl = B("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ml).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Jr = /\[(?:\\[\s\S]|[^\[\]\\])*\]/, hn = B(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets", Jr).getRegex(), bl = B(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", hn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), vl = B(/^!?\[(label)\]\[(ref)\]/).replace("label", hn).replace("ref", Gn).getRegex(), yl = B(/^!?\[(ref)\](?:\[\])?/).replace("ref", Gn).getRegex(), br = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/, _l = B(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets", Jr).getRegex(), wl = B("reflink|nolink(?!\\()", "g").replace("reflink", B(/^!?\[(label)\]\[(ref)\]/).replace("label", _l).replace("ref", br).getRegex()).replace("nolink", B(/^!?\[(ref)\](?:\[\])?/).replace("ref", br).getRegex()).getRegex(), vr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xl = /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/, Tl = B(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g, xl).getRegex(), Kn = { _backpedal: ct, anyPunctuation: hl, autolink: gl, blockSkip: Js, br: Zr, code: Gs, del: ct, delLDelim: ct, delRDelim: ct, emStrongLDelim: el, emStrongRDelimAst: sl, emStrongRDelimUnd: il, escape: qs, link: bl, nolink: yl, punctuation: Zs, reflink: vl, reflinkSearch: wl, tag: kl, text: Ys, url: ct }, Sl = { ...Kn, emStrongLDelim: rl, emStrongRDelimAst: ol, emStrongRDelimUnd: cl, link: B(/^!?\[(label)\]\((.*?)\)/).replace("label", hn).getRegex(), reflink: B(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", hn).getRegex() }, zn = { ...Kn, emStrongRDelimAst: ll, emStrongLDelim: tl, delLDelim: dl, delRDelim: fl, url: B(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol", Tl).replace("protocol", vr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: B(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol", vr).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex() }, Al = { ...zn, br: B(Zr).replace("{2,}", "*").getRegex(), text: B(zn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, un = { normal: Zn, gfm: Ws, pedantic: Vs }, Pt = { normal: Kn, gfm: zn, breaks: Al, pedantic: Sl }, El = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, yr = (n) => El[n];
function we(n, e) {
  if (e) {
    if (ce.escapeTest.test(n)) return n.replace(ce.escapeReplace, yr);
  } else if (ce.escapeTestNoEncode.test(n)) return n.replace(ce.escapeReplaceNoEncode, yr);
  return n;
}
function Rl(n) {
  return n.replace(ce.numericCharacterReference, (e, t, r) => {
    let s = t === void 0 ? Number.parseInt(r, 16) : Number.parseInt(t, 10);
    return s === 0 || s > 1114111 || s >= 55296 && s <= 57343 ? "�" : String.fromCodePoint(s);
  });
}
function _r(n) {
  try {
    n = encodeURI(n).replace(ce.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function wr(n, e) {
  let t = n.replace(ce.findPipe, (a, i, o) => {
    let b = !1, m = i;
    for (; --m >= 0 && o[m] === "\\"; ) b = !b;
    return b ? "|" : " |";
  }), r = t.split(ce.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(ce.slashPipe, "|");
  return r;
}
function Ke(n, e, t) {
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
  for (; t >= 0 && ce.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function gn(n) {
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
function Tr(n, e = 0) {
  let t = e, r = "";
  for (let s of n) if (s === "	") {
    let a = 4 - t % 4;
    r += " ".repeat(a), t += a;
  } else r += s, t++;
  return r;
}
function Sr(n, e, t, r, s) {
  let a = e.href, i = e.title || null, o = n[1].replace(s.other.outputLinkReplace, "$1"), b = n[0].charAt(0) === "!";
  r.state.inLink = !0;
  let m = r.state.linkEmitted, A = r.state.inRawBlock;
  r.state.linkEmitted = !1;
  let x = r.inlineTokens(o), N = r.state.linkEmitted;
  if (r.state.linkEmitted = m, r.state.inLink = !1, !b) {
    if (N) {
      r.state.inRawBlock = A;
      return;
    }
    r.state.linkEmitted = !0;
  }
  return { type: b ? "image" : "link", raw: t, href: a, title: i, text: o, tokens: x };
}
function Cl(n, e, t) {
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
var mn = class {
  constructor(n) {
    Z(this, "options");
    Z(this, "rules");
    Z(this, "lexer");
    this.options = n || ft;
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
        let r = Ke(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: Ke(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: Ke(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = Ke(e[0], `
`).split(`
`), r = "", s = "", a = [];
      for (; t.length > 0; ) {
        let i = !1, o = [], b;
        for (b = 0; b < t.length; b++) if (this.rules.other.blockquoteStart.test(t[b])) o.push(t[b]), i = !0;
        else if (!i) o.push(t[b]);
        else break;
        t = t.slice(b);
        let m = o.join(`
`), A = m.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${m}` : m, s = s ? `${s}
${A}` : A;
        let x = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(A, a, !0), this.lexer.state.top = x, t.length === 0) break;
        let N = a.at(-1);
        if (N?.type === "code") break;
        if (N?.type === "blockquote") {
          let D = N, O = t.join(`
`), V = D.raw + `
` + O.replace(this.rules.other.blockquoteSetextReplace2, ""), F = this.blockquote(V);
          a[a.length - 1] = F;
          let Y = V.substring(F.raw.length).replace(/^\n/, ""), X = Y ? Y.split(`
`).length : 0, L = X ? t.slice(0, -X) : t;
          L.length > 0 && (r = `${r}
${L.join(`
`)}`), s = s.substring(0, s.length - D.text.length) + F.text;
          break;
        } else if (N?.type === "list") {
          let D = N, O = D.raw + `
` + t.join(`
`), V = this.list(O);
          a[a.length - 1] = V, r = r.substring(0, r.length - N.raw.length) + V.raw, s = s.substring(0, s.length - D.raw.length) + V.raw, t = O.substring(a.at(-1).raw.length).split(`
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
        let b = !1, m = "", A = "";
        if (!(e = a.exec(n)) || this.rules.block.hr.test(n)) break;
        m = e[0], n = n.substring(m.length);
        let x = e[2].split(`
`, 1)[0], N = e[1].length, D = this.options.pedantic ? Tr(x, N) : x.replace(this.rules.other.leadingSpaceTab, (Y) => Tr(Y, N)), O = n.split(`
`, 1)[0], V = !D.trim(), F = 0;
        if (this.options.pedantic ? (F = 2, A = D.trimStart()) : V ? F = N + 1 : (F = D.search(this.rules.other.nonSpaceChar), F = F > 4 ? 1 : F, A = D.slice(F), F += N), V && this.rules.other.blankLine.test(O) && (m += O + `
`, n = n.substring(O.length + 1), b = !0), !b) {
          let Y = this.rules.other.nextBulletRegex(F), X = this.rules.other.hrRegex(F), L = this.rules.other.fencesBeginRegex(F), P = this.rules.other.headingBeginRegex(F), S = this.rules.other.htmlBeginRegex(F), w = this.rules.other.blockquoteBeginRegex(F);
          for (; n; ) {
            let g = n.split(`
`, 1)[0], k;
            if (O = g, this.options.pedantic ? (O = O.replace(this.rules.other.listReplaceNesting, "  "), k = O) : k = O.replace(this.rules.other.leadingSpaceTab, (R) => R.replace(this.rules.other.tabCharGlobal, "    ")), L.test(O) || P.test(O) || S.test(O) || w.test(O) || Y.test(O) || X.test(O)) break;
            if (k.search(this.rules.other.nonSpaceChar) >= F || !O.trim()) A += `
` + k.slice(F);
            else {
              if (V || D.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || L.test(D) || P.test(D) || X.test(D)) break;
              A += `
` + O;
            }
            V = !O.trim(), m += g + `
`, n = n.substring(g.length + 1), D = k.slice(F);
          }
        }
        s.loose || (i ? s.loose = !0 : this.rules.other.doubleBlankLine.test(m) && (i = !0)), s.items.push({ type: "list_item", raw: m, task: !!this.options.gfm && this.rules.other.listIsTask.test(A), loose: !1, text: A, tokens: [] }), s.raw += m;
      }
      let o = s.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let b of s.items) if (this.lexer.state.top = !1, b.tokens = this.lexer.blockTokens(b.text, []), !s.loose) {
        let m = b.tokens.filter((x) => x.type === "space"), A = m.length > 0 && m.some((x) => this.rules.other.anyLine.test(x.raw));
        s.loose = A;
      }
      for (let b of s.items) {
        let m = b.tokens[0];
        if (b.task && (m?.type === "text" || m?.type === "paragraph")) {
          b.text = b.text.replace(this.rules.other.listReplaceTask, ""), m.raw = m.raw.replace(this.rules.other.listReplaceTask, ""), m.text = m.text.replace(this.rules.other.listReplaceTask, "");
          for (let x = this.lexer.inlineQueue.length - 1; x >= 0; x--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[x].src)) {
            this.lexer.inlineQueue[x].src = this.lexer.inlineQueue[x].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let A = this.rules.other.listTaskCheckbox.exec(b.raw);
          if (A) {
            let x = { type: "checkbox", raw: A[0] + " ", checked: A[0] !== "[ ]" };
            b.checked = x.checked, s.loose ? b.tokens[0] && ["paragraph", "text"].includes(b.tokens[0].type) && "tokens" in b.tokens[0] && b.tokens[0].tokens ? (b.tokens[0].raw = x.raw + b.tokens[0].raw, b.tokens[0].text = x.raw + b.tokens[0].text, b.tokens[0].tokens.unshift(x)) : b.tokens.unshift({ type: "paragraph", raw: x.raw, text: x.raw, tokens: [x] }) : b.tokens.unshift(x);
          }
        } else b.task && (b.task = !1);
      }
      if (s.loose) for (let b of s.items) {
        b.loose = !0;
        for (let m of b.tokens) m.type === "text" && (m.type = "paragraph");
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
      let t = gn(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: Ke(e[0], `
`), href: r, title: s };
    }
  }
  table(n) {
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = wr(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: Ke(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let i of r) this.rules.other.tableAlignRight.test(i) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? a.align.push("left") : a.align.push(null);
      for (let i = 0; i < t.length; i++) a.header.push({ text: t[i], tokens: this.lexer.inline(t[i]), header: !0, align: a.align[i] });
      for (let i of s) a.rows.push(wr(i, a.header.length).map((o, b) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[b] })));
      return a;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: Ke(e[0], `
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
        let i = Ke(r.slice(0, -1), "\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = $l(e[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? s = s.slice(1) : s = s.slice(1, -1)), Sr(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let r = t[0].charAt(0) === "!" ? 2 : 1;
      if (!this.options.pedantic && Ar(n, t[1], r, this.rules)) return;
      let s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[gn(s)];
      if (!a) {
        let i = t[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return Sr(t, a, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, a, i, o = s, b = 0, m = r[0][0], A = t === m, x = m === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (x.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = x.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (i = [...a].length, r[3] || r[4]) {
          o += i;
          continue;
        } else if (r[5] || r[6]) {
          if (s % 3 && !((s + i) % 3)) {
            b += i;
            continue;
          }
          if (A) break;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o + b);
        let N = [...r[0]][0].length, D = n.slice(0, s + r.index + N + i);
        if (Math.min(s, i) % 2) {
          let V = D.slice(1, -1);
          return { type: "em", raw: D, text: V, tokens: this.lexer.inlineTokens(V) };
        }
        let O = D.slice(2, -2);
        return { type: "strong", raw: D, text: O, tokens: this.lexer.inlineTokens(O) };
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
      let s = [...r[0]].length - 1, a, i, o = s, b = this.rules.inline.delRDelim;
      for (b.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = b.exec(e)) !== null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (i = [...a].length, i !== s)) continue;
        if (r[3] || r[4]) {
          o += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o);
        let m = [...r[0]][0].length, A = n.slice(0, s + r.index + m + i), x = A.slice(s, -s);
        return { type: "del", raw: A, text: x, tokens: this.lexer.inlineTokens(x) };
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
}, Ie = class Fn {
  constructor(e) {
    Z(this, "tokens");
    Z(this, "options");
    Z(this, "state");
    Z(this, "inlineQueue");
    Z(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ft, this.options.tokenizer = this.options.tokenizer || new mn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, linkEmitted: !1, top: !0 };
    let t = { other: ce, block: un.normal, inline: Pt.normal };
    this.options.pedantic ? (t.block = un.pedantic, t.inline = Pt.pedantic) : this.options.gfm && (t.block = un.gfm, this.options.breaks ? t.inline = Pt.breaks : t.inline = Pt.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: un, inline: Pt };
  }
  static lex(e, t) {
    return new Fn(t).lex(e);
  }
  static lexInline(e, t) {
    return new Fn(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ce.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(ce.tabCharGlobal, "    ").replace(ce.spaceLine, ""));
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
        let o = 1 / 0, b = e.slice(1), m;
        this.options.extensions.startBlock.forEach((A) => {
          m = A.call({ lexer: this }, b), typeof m == "number" && m >= 0 && (o = Math.min(o, m));
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
      if (!(s.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, gn(s.slice(a + 1, -1)))) && !(a > 1 && this.linkInText(s.slice(1, a - 1)))) return !0;
    }
    return !1;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let r = e;
    if (this.tokens.links && e.includes("[")) {
      let o = this.tokenizer.rules.inline.reflinkSearch, b = (m) => {
        let A = m.lastIndexOf("[");
        if (!Object.hasOwn(this.tokens.links, gn(m.slice(A + 1, -1)))) return m;
        if (A > 1 && m.charAt(0) !== "!") {
          let x = m.slice(1, A - 1);
          if (this.linkInText(x)) return "[" + x.replace(o, b) + "][" + "a".repeat(m.length - A - 2) + "]";
        }
        return "[" + "a".repeat(m.length - 2) + "]";
      };
      r = r.replace(o, b);
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (o, b, m) => {
      let A = m ? m.length : 0;
      return o.slice(0, A) + "[" + "a".repeat(o.length - A - 2) + "]";
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
      let b = e;
      if (this.options.extensions?.startInline) {
        let m = 1 / 0, A = e.slice(1), x;
        this.options.extensions.startInline.forEach((N) => {
          x = N.call({ lexer: this }, A), typeof x == "number" && x >= 0 && (m = Math.min(m, x));
        }), m < 1 / 0 && m >= 0 && (b = e.substring(0, m + 1));
      }
      if (o = this.tokenizer.inlineText(b)) {
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
}, kn = class {
  constructor(n) {
    Z(this, "options");
    Z(this, "parser");
    this.options = n || ft;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let r = (e || "").match(ce.notSpaceStart)?.[0], s = n ? n.replace(ce.endingNewline, "") + `
` : "";
    return r ? '<pre><code class="language-' + we(r) + '">' + (t ? s : we(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : we(s, !0)) + `</code></pre>
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
    return `<code>${we(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, text: t, tokens: r, autolink: s }) {
    let a = s ? we(t, !0) : this.parser.parseInline(r), i = _r(n);
    if (i === null) return a;
    n = we(i, s);
    let o = '<a href="' + n + '"';
    return e && (o += ' title="' + we(e) + '"'), o += ">" + a + "</a>", o;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = _r(n);
    if (s === null) return we(t);
    n = s;
    let a = `<img src="${we(n)}" alt="${we(t)}"`;
    return e && (a += ` title="${we(e)}"`), a += ">", a;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : we(n.text);
  }
}, Xn = class {
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
}, Oe = class Un {
  constructor(e) {
    Z(this, "options");
    Z(this, "renderer");
    Z(this, "textRenderer");
    this.options = e || ft, this.options.renderer = this.options.renderer || new kn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Xn();
  }
  static parse(e, t) {
    return new Un(t).parse(e);
  }
  static parseInline(e, t) {
    return new Un(t).parseInline(e);
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
}, fn, zt = (fn = class {
  constructor(n) {
    Z(this, "options");
    Z(this, "block");
    this.options = n || ft;
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
    return n ? Ie.lex : Ie.lexInline;
  }
  provideParser(n = this.block) {
    return n ? Oe.parse : Oe.parseInline;
  }
}, Z(fn, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), Z(fn, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), fn), Ll = class {
  constructor(...n) {
    Z(this, "defaults", Wn());
    Z(this, "options", this.setOptions);
    Z(this, "parse", this.parseMarkdown(!0));
    Z(this, "parseInline", this.parseMarkdown(!1));
    Z(this, "Parser", Oe);
    Z(this, "Renderer", kn);
    Z(this, "TextRenderer", Xn);
    Z(this, "Lexer", Ie);
    Z(this, "Tokenizer", mn);
    Z(this, "Hooks", zt);
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
        let s = this.defaults.renderer || new kn(this.defaults);
        for (let a in t.renderer) {
          if (!(a in s)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let i = a, o = t.renderer[i], b = s[i];
          s[i] = (...m) => {
            let A = o.apply(s, m);
            return A === !1 && (A = b.apply(s, m)), A || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new mn(this.defaults);
        for (let a in t.tokenizer) {
          if (!(a in s)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let i = a, o = t.tokenizer[i], b = s[i];
          s[i] = (...m) => {
            let A = o.apply(s, m);
            return A === !1 && (A = b.apply(s, m)), A;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new zt();
        for (let a in t.hooks) {
          if (!(a in s)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let i = a, o = t.hooks[i], b = s[i];
          zt.passThroughHooks.has(a) ? s[i] = (m) => {
            if (this.defaults.async && zt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let x = await o.call(s, m);
              return b.call(s, x);
            })();
            let A = o.call(s, m);
            return b.call(s, A);
          } : s[i] = (...m) => {
            if (this.defaults.async) return (async () => {
              let x = await o.apply(s, m);
              return x === !1 && (x = await b.apply(s, m)), x;
            })();
            let A = o.apply(s, m);
            return A === !1 && (A = b.apply(s, m)), A;
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
    return Ie.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return Oe.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let i = s.hooks ? await s.hooks.preprocess(e) : e, o = await (s.hooks ? await s.hooks.provideLexer(n) : n ? Ie.lex : Ie.lexInline)(i, s), b = s.hooks ? await s.hooks.processAllTokens(o) : o;
        s.walkTokens && await Promise.all(this.walkTokens(b, s.walkTokens));
        let m = await (s.hooks ? await s.hooks.provideParser(n) : n ? Oe.parse : Oe.parseInline)(b, s);
        return s.hooks ? await s.hooks.postprocess(m) : m;
      })().catch(a);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let i = (s.hooks ? s.hooks.provideLexer(n) : n ? Ie.lex : Ie.lexInline)(e, s);
        s.hooks && (i = s.hooks.processAllTokens(i)), s.walkTokens && this.walkTokens(i, s.walkTokens);
        let o = (s.hooks ? s.hooks.provideParser(n) : n ? Oe.parse : Oe.parseInline)(i, s);
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
        let r = "<p>An error occurred:</p><pre>" + we(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, pt = new Ll();
function K(n, e) {
  return pt.parse(n, e);
}
K.options = K.setOptions = function(n) {
  return pt.setOptions(n), K.defaults = pt.defaults, Vr(K.defaults), K;
};
K.getDefaults = Wn;
K.defaults = ft;
function Il(...n) {
  return pt.use(...n), K.defaults = pt.defaults, Vr(K.defaults), K;
}
K.use = Il;
K.walkTokens = function(n, e) {
  return pt.walkTokens(n, e);
};
K.parseInline = pt.parseInline;
K.Parser = Oe;
K.parser = Oe.parse;
K.Renderer = kn;
K.TextRenderer = Xn;
K.Lexer = Ie;
K.lexer = Ie.lex;
K.Tokenizer = mn;
K.Hooks = zt;
K.parse = K;
K.options;
K.setOptions;
K.walkTokens;
K.parseInline;
Oe.parse;
Ie.lex;
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
    var r, s, a, i, o = [], b = !0, m = !1;
    try {
      if (a = (t = t.call(n)).next, e !== 0) for (; !(b = (r = a.call(t)).done) && (o.push(r.value), o.length !== e); b = !0) ;
    } catch (A) {
      m = !0, s = A;
    } finally {
      try {
        if (!b && t.return != null && (i = t.return(), Object(i) !== i)) return;
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
function Nl(n, e) {
  return Ol(n) || Pl(n, e) || Ml(n, e) || Dl();
}
function Ml(n, e) {
  if (n) {
    if (typeof n == "string") return Er(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Er(n, e) : void 0;
  }
}
const es = Object.entries, Rr = Object.setPrototypeOf, zl = Object.isFrozen, Fl = Object.getPrototypeOf, Ul = Object.getOwnPropertyDescriptor;
let ie = Object.freeze, ue = Object.seal, Tt = Object.create, ts = typeof Reflect < "u" && Reflect, Bn = ts.apply, Hn = ts.construct;
ie || (ie = function(e) {
  return e;
});
ue || (ue = function(e) {
  return e;
});
Bn || (Bn = function(e, t) {
  for (var r = arguments.length, s = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++) s[a - 2] = arguments[a];
  return e.apply(t, s);
});
Hn || (Hn = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
  return new e(...r);
});
const ut = oe(Array.prototype.forEach), Bl = oe(Array.prototype.lastIndexOf), $r = oe(Array.prototype.pop), Dt = oe(Array.prototype.push), Hl = oe(Array.prototype.splice), At = Array.isArray, Ft = oe(String.prototype.toLowerCase), In = oe(String.prototype.toString), Cr = oe(String.prototype.match), Nt = oe(String.prototype.replace), Lr = oe(String.prototype.indexOf), jl = oe(String.prototype.trim), Wl = oe(Number.prototype.toString), Vl = oe(Boolean.prototype.toString), Ir = typeof BigInt > "u" ? null : oe(BigInt.prototype.toString), Or = typeof Symbol > "u" ? null : oe(Symbol.prototype.toString), ge = oe(Object.prototype.hasOwnProperty), Mt = oe(Object.prototype.toString), pe = oe(RegExp.prototype.test), Xe = ql(TypeError);
function oe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) r[s - 1] = arguments[s];
    return Bn(n, e, r);
  };
}
function ql(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return Hn(n, t);
  };
}
function G(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ft;
  if (Rr && Rr(n, null), !At(e)) return n;
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
  for (let e = 0; e < n.length; e++) ge(n, e) || (n[e] = null);
  return n;
}
function xe(n) {
  const e = Tt(null);
  for (const r of es(n)) {
    var t = Nl(r, 2);
    const s = t[0], a = t[1];
    ge(n, s) && (At(a) ? e[s] = Gl(a) : a && typeof a == "object" && a.constructor === Object ? e[s] = xe(a) : e[s] = a);
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
      return Mt(n);
    case "function":
    case "object": {
      if (n === null) return Mt(n);
      const e = n, t = Ae(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : Mt(r);
      }
      return Mt(n);
    }
    default:
      return Mt(n);
  }
}
function Ae(n, e) {
  for (; n !== null; ) {
    const r = Ul(n, e);
    if (r) {
      if (r.get) return oe(r.get);
      if (typeof r.value == "function") return oe(r.value);
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
    return pe(n, ""), !0;
  } catch {
    return !1;
  }
}
const Pr = ie([
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
]), On = ie([
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
]), Pn = ie([
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
]), Kl = ie([
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
]), Dn = ie([
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
]), Xl = ie([
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
]), Dr = ie(["#text"]), Nr = ie([
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
]), Nn = ie([
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
]), Mr = ie([
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
]), cn = ie([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Ql = ue(/{{[\w\W]*|^[\w\W]*}}/g), Jl = ue(/<%[\w\W]*|^[\w\W]*%>/g), ea = ue(/\${[\w\W]*/g), ta = ue(/^data-[\-\w.\u00B7-\uFFFF]+$/), na = ue(/^aria-[\-\w]+$/), zr = ue(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), ra = ue(/^(?:\w+script|data):/i), sa = ue(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), la = ue(/^html$/i), aa = ue(/^[a-z][.\w]*(-[.\w]+)+$/i), Fr = ue(/<[/\w!]/g), Ur = ue(/<[/\w]/g), oa = ue(/<\/no(script|embed|frames)/i), ia = ue(/\/>/i), _e = {
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
], ua = ie(G({}, ns)), ca = function() {
  const n = {};
  return ut(ns, (e) => {
    n[e] = ue(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ie(n);
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
}, Qe = function(e, t, r, s) {
  return ge(e, t) && At(e[t]) ? G(s.base ? xe(s.base) : {}, e[t], s.transform) : r;
}, Mn = function(e, t, r) {
  const s = ge(e, t) ? e[t] : void 0;
  return s && typeof s == "object" ? xe(s) : r();
};
function rs() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : da();
  const e = (T) => rs(T);
  if (e.version = "3.4.16", e.removed = [], !n || !n.document || n.document.nodeType !== _e.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, s = r.currentScript;
  n.DocumentFragment;
  const a = n.HTMLTemplateElement, i = n.Node, o = n.Element, b = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const m = n.DOMParser, A = n.trustedTypes, x = o.prototype, N = Ae(x, "cloneNode"), D = Ae(x, "remove"), O = Ae(x, "removeAttributeNode"), V = Ae(x, "nextSibling"), F = Ae(x, "childNodes"), Y = Ae(x, "parentNode"), X = Ae(x, "shadowRoot"), L = Ae(x, "attributes"), P = i && i.prototype ? Ae(i.prototype, "nodeType") : null, S = i && i.prototype ? Ae(i.prototype, "nodeName") : null, w = i && i.prototype ? Ae(i.prototype, "ownerDocument") : null, g = function(l) {
    return P ? P(l) : l.nodeType;
  }, k = function(l) {
    return S ? S(l) : l.nodeName;
  };
  if (typeof a == "function") {
    const T = t.createElement("template");
    T.content && T.content.ownerDocument && (t = T.content.ownerDocument);
  }
  let R, C = "", te, Fe = !1, ke = 0;
  const Ue = function() {
    if (ke > 0) throw Xe('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, be = function(l) {
    Ue(), ke++;
    try {
      return R.createHTML(l);
    } finally {
      ke--;
    }
  }, Wt = function(l) {
    Ue(), ke++;
    try {
      return R.createScriptURL(l);
    } finally {
      ke--;
    }
  }, yn = function() {
    return Fe || (te = pa(A, s), Fe = !0), te;
  }, ht = t, Pe = ht.implementation, Vt = ht.createNodeIterator, $t = ht.createDocumentFragment, qt = ht.getElementsByTagName, _n = r.importNode;
  let $ = Br();
  e.isSupported = typeof es == "function" && typeof Y == "function" && Pe && Pe.createHTMLDocument !== void 0;
  const Gt = Ql, Yt = Jl, Zt = ea, Kt = ta, Q = na, fe = ra, De = sa, et = aa;
  let $e = zr, H = null;
  const Ve = G({}, [
    ...Pr,
    ...On,
    ...Pn,
    ...Dn,
    ...Dr
  ]);
  let j = null;
  const Be = G({}, [
    ...Nr,
    ...Nn,
    ...Mr,
    ...cn
  ]);
  let ve = Object.seal(Tt(null, {
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
  })), qe = null, ae = null;
  const de = Object.seal(Tt(null, {
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
  let Ge = !0, tt = !0, nt = !1, Ct = !0, Ce = !1, He = !0, je = !1, rt = !1, Te = null, st = null, gt = !1, Ye = !1, lt = !1, at = !1, Xt = !0, Lt = !1;
  const Qt = "user-content-";
  let ot = !0, p = !1, f = {}, d = null;
  const M = G({}, [
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
  let wn = null;
  const Jn = G({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let er = null;
  const tr = G({}, [
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
  ]), Jt = "http://www.w3.org/1998/Math/MathML", en = "http://www.w3.org/2000/svg", Ne = "http://www.w3.org/1999/xhtml";
  let mt = Ne, xn = !1, Tn = null;
  const os = G({}, [
    Jt,
    en,
    Ne
  ], In), nr = ie([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Sn = G({}, nr);
  const rr = ie(["annotation-xml"]);
  let An = G({}, rr);
  const is = G({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let It = null;
  const us = ["application/xhtml+xml", "text/html"], cs = "text/html";
  let le = null, kt = null;
  const ds = t.createElement("form"), sr = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, En = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (kt && kt === l) return;
    (!l || typeof l != "object") && (l = {}), l = xe(l), It = us.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? cs : l.PARSER_MEDIA_TYPE, le = It === "application/xhtml+xml" ? In : Ft, H = Qe(l, "ALLOWED_TAGS", Ve, { transform: le }), j = Qe(l, "ALLOWED_ATTR", Be, { transform: le }), Tn = Qe(l, "ALLOWED_NAMESPACES", os, { transform: In }), er = Qe(l, "ADD_URI_SAFE_ATTR", tr, {
      transform: le,
      base: tr
    }), wn = Qe(l, "ADD_DATA_URI_TAGS", Jn, {
      transform: le,
      base: Jn
    }), d = Qe(l, "FORBID_CONTENTS", M, { transform: le }), qe = Qe(l, "FORBID_TAGS", xe({}), { transform: le }), ae = Qe(l, "FORBID_ATTR", xe({}), { transform: le }), f = ge(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? xe(l.USE_PROFILES) : l.USE_PROFILES : !1, Ge = l.ALLOW_ARIA_ATTR !== !1, tt = l.ALLOW_DATA_ATTR !== !1, nt = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Ct = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ce = l.SAFE_FOR_TEMPLATES || !1, He = l.SAFE_FOR_XML !== !1, je = l.WHOLE_DOCUMENT || !1, Ye = l.RETURN_DOM || !1, lt = l.RETURN_DOM_FRAGMENT || !1, at = l.RETURN_TRUSTED_TYPE || !1, gt = l.FORCE_BODY || !1, Xt = l.SANITIZE_DOM !== !1, Lt = l.SANITIZE_NAMED_PROPS || !1, ot = l.KEEP_CONTENT !== !1, p = l.IN_PLACE || !1, $e = Zl(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : zr, mt = typeof l.NAMESPACE == "string" ? l.NAMESPACE : Ne, Sn = Mn(l, "MATHML_TEXT_INTEGRATION_POINTS", () => G({}, nr)), An = Mn(l, "HTML_INTEGRATION_POINTS", () => G({}, rr));
    const u = Mn(l, "CUSTOM_ELEMENT_HANDLING", () => Tt(null));
    if (ve = Tt(null), ge(u, "tagNameCheck") && sr(u.tagNameCheck) && (ve.tagNameCheck = u.tagNameCheck), ge(u, "attributeNameCheck") && sr(u.attributeNameCheck) && (ve.attributeNameCheck = u.attributeNameCheck), ge(u, "allowCustomizedBuiltInElements") && typeof u.allowCustomizedBuiltInElements == "boolean" && (ve.allowCustomizedBuiltInElements = u.allowCustomizedBuiltInElements), ue(ve), Ce && (tt = !1), lt && (Ye = !0), f && (H = G({}, Dr), j = Tt(null), f.html === !0 && (G(H, Pr), G(j, Nr)), f.svg === !0 && (G(H, On), G(j, Nn), G(j, cn)), f.svgFilters === !0 && (G(H, Pn), G(j, Nn), G(j, cn)), f.mathMl === !0 && (G(H, Dn), G(j, Mr), G(j, cn))), de.tagCheck = null, de.attributeCheck = null, ge(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? de.tagCheck = l.ADD_TAGS : At(l.ADD_TAGS) && (H === Ve && (H = xe(H)), G(H, l.ADD_TAGS, le))), ge(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? de.attributeCheck = l.ADD_ATTR : At(l.ADD_ATTR) && (j === Be && (j = xe(j)), G(j, l.ADD_ATTR, le))), ge(l, "ADD_FORBID_CONTENTS") && At(l.ADD_FORBID_CONTENTS) && (d === M && (d = xe(d)), G(d, l.ADD_FORBID_CONTENTS, le)), ot && (H["#text"] = !0), je && G(H, [
      "html",
      "head",
      "body"
    ]), H.table && (G(H, ["tbody"]), delete qe.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Xe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const _ = R;
      R = l.TRUSTED_TYPES_POLICY;
      try {
        C = be("");
      } catch (E) {
        throw R = _, E;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (R = void 0, C = "") : (R === void 0 && (R = yn()), R && typeof C == "string" && (C = be("")));
    ie && ie(l), kt = l;
  }, lr = G({}, [
    ...On,
    ...Pn,
    ...Kl
  ]), ar = G({}, [...Dn, ...Xl]), ps = function(l, u, _) {
    return u.namespaceURI === Ne ? l === "svg" : u.namespaceURI === Jt ? l === "svg" && (_ === "annotation-xml" || Sn[_]) : !!lr[l];
  }, fs = function(l, u, _) {
    return u.namespaceURI === Ne ? l === "math" : u.namespaceURI === en ? l === "math" && An[_] : !!ar[l];
  }, hs = function(l, u, _) {
    return u.namespaceURI === en && !An[_] || u.namespaceURI === Jt && !Sn[_] ? !1 : !ar[l] && (is[l] || !lr[l]);
  }, gs = function(l) {
    let u = Y(l);
    (!u || !u.tagName) && (u = {
      namespaceURI: mt,
      tagName: "template"
    });
    const _ = Ft(l.tagName), E = Ft(u.tagName);
    return Tn[l.namespaceURI] ? l.namespaceURI === en ? ps(_, u, E) : l.namespaceURI === Jt ? fs(_, u, E) : l.namespaceURI === Ne ? hs(_, u, E) : !!(It === "application/xhtml+xml" && Tn[l.namespaceURI]) : !1;
  }, Ze = function(l) {
    Dt(e.removed, { element: l });
    try {
      Y(l).removeChild(l);
    } catch {
      if (D(l), !Y(l)) throw Xe("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, or = function(l, u, _) {
    try {
      O(l, u);
    } catch {
      try {
        l.removeAttribute(_);
      } catch {
      }
    }
  }, tn = function(l) {
    nn(l);
    const u = F(l);
    if (u) {
      const E = [];
      ut(u, (I) => {
        Dt(E, I);
      }), ut(E, (I) => {
        try {
          D(I);
        } catch {
        }
      });
    }
    const _ = L(l);
    if (_) for (let E = _.length - 1; E >= 0; --E) {
      const I = _[E], W = I && I.name;
      typeof W == "string" && or(l, I, W);
    }
  }, it = function(l, u, _) {
    if (!_) try {
      _ = u.getAttributeNode(l);
    } catch {
      _ = null;
    }
    Dt(e.removed, {
      attribute: _ || null,
      from: u
    });
    try {
      _ ? O(u, _) : u.removeAttribute(l);
    } catch {
      try {
        u.removeAttribute(l);
      } catch {
      }
    }
    if (l === "is")
      if (Ye || lt) try {
        Ze(u);
      } catch {
      }
      else try {
        u.setAttribute(l, "");
      } catch {
      }
  }, ms = function(l) {
    const u = L(l);
    if (u)
      for (let _ = u.length - 1; _ >= 0; --_) {
        const E = u[_], I = E && E.name;
        typeof I != "string" || j[le(I)] || or(l, E, I);
      }
  }, nn = function(l) {
    const u = [l];
    for (; u.length > 0; ) {
      const _ = u.pop();
      g(_) === _e.element && ms(_);
      const E = F(_);
      if (E) for (let I = E.length - 1; I >= 0; --I) u.push(E[I]);
    }
  }, ir = function(l, u) {
    return He ? l === "patchsrc" ? !0 : l === "for" && u !== "label" && u !== "output" : !1;
  }, ks = function(l) {
    if (!He) return;
    const u = [l];
    for (; u.length > 0; ) {
      const _ = u.pop(), E = g(_);
      if (E === _e.processingInstruction || E === _e.comment && pe(Ur, _.data)) {
        try {
          D(_);
        } catch {
        }
        continue;
      }
      if (E === _e.element) {
        const W = _, q = le(k(_));
        try {
          W.hasAttribute && W.hasAttribute("patchsrc") && W.removeAttribute("patchsrc"), W.hasAttribute && W.hasAttribute("for") && ir("for", q) && W.removeAttribute("for");
        } catch {
        }
      }
      const I = F(_);
      if (I) for (let W = I.length - 1; W >= 0; --W) u.push(I[W]);
    }
  }, ur = function(l) {
    let u = null, _ = null;
    if (gt) l = "<remove></remove>" + l;
    else {
      const W = Cr(l, /^[\r\n\t ]+/);
      _ = W && W[0];
    }
    It === "application/xhtml+xml" && mt === Ne && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const E = R ? be(l) : l;
    if (mt === Ne) try {
      u = new m().parseFromString(E, It);
    } catch {
    }
    if (!u || !u.documentElement) {
      u = Pe.createDocument(mt, "template", null);
      try {
        u.documentElement.innerHTML = xn ? C : E;
      } catch {
      }
    }
    const I = u.body || u.documentElement;
    return l && _ && I.insertBefore(t.createTextNode(_), I.childNodes[0] || null), mt === Ne ? qt.call(u, je ? "html" : "body")[0] : je ? u.documentElement : I;
  }, cr = function(l) {
    const u = w ? w(l) : l.ownerDocument;
    return Vt.call(u || l, l, b.SHOW_ELEMENT | b.SHOW_COMMENT | b.SHOW_TEXT | b.SHOW_PROCESSING_INSTRUCTION | b.SHOW_CDATA_SECTION, null);
  }, rn = function(l) {
    return l = Nt(l, Gt, " "), l = Nt(l, Yt, " "), l = Nt(l, Zt, " "), l;
  }, Rn = function(l) {
    var u;
    l.normalize();
    const _ = w ? w(l) : l.ownerDocument, E = Vt.call(_ || l, l, b.SHOW_TEXT | b.SHOW_COMMENT | b.SHOW_CDATA_SECTION | b.SHOW_PROCESSING_INSTRUCTION, null);
    let I = E.nextNode();
    for (; I; )
      I.data = rn(I.data), I = E.nextNode();
    const W = (u = l.querySelectorAll) === null || u === void 0 ? void 0 : u.call(l, "template");
    W && ut(W, (q) => {
      bt(q.content) && Rn(q.content);
    });
  }, sn = function(l) {
    const u = S ? S(l) : null;
    return typeof u != "string" || le(u) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || l.attributes !== L(l) || typeof l.removeAttribute != "function" || typeof l.removeAttributeNode != "function" || typeof l.getAttributeNode != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || l.nodeType !== P(l) || l.childNodes !== F(l);
  }, bt = function(l) {
    if (!P || typeof l != "object" || l === null) return !1;
    try {
      return P(l) === _e.documentFragment;
    } catch {
      return !1;
    }
  }, Ot = function(l) {
    if (!P || typeof l != "object" || l === null) return !1;
    try {
      return typeof P(l) == "number";
    } catch {
      return !1;
    }
  };
  function Me(T, l, u) {
    T.length !== 0 && ut(T, (_) => {
      _.call(e, l, u, kt);
    });
  }
  const bs = function(l, u) {
    return !!(He && l.hasChildNodes() && !Ot(l.firstElementChild) && pe(Fr, l.textContent) && pe(Fr, l.innerHTML) || He && l.namespaceURI === Ne && ua[u] && (Ot(l.firstElementChild) || typeof l.textContent == "string" && pe(ca[u], l.textContent)) || l.nodeType === _e.processingInstruction || He && l.nodeType === _e.comment && pe(Ur, l.data));
  }, ln = function(l, u) {
    if (l instanceof RegExp) return pe(l, u);
    if (l instanceof Function) {
      for (var _ = arguments.length, E = new Array(_ > 2 ? _ - 2 : 0), I = 2; I < _; I++) E[I - 2] = arguments[I];
      return !!l(u, ...E);
    }
    return !1;
  }, vs = function(l, u, _) {
    if (!qe[u] && hr(u) && ln(ve.tagNameCheck, u)) return !1;
    if (ot && !d[u]) {
      const E = Y(l), I = F(l);
      if (I && E) {
        const W = I.length;
        for (let q = W - 1; q >= 0; --q) {
          const re = l === _ ? N(I[q], !0) : I[q];
          E.insertBefore(re, V(l));
        }
      }
    }
    return Ze(l), !0;
  }, dr = function(l, u, _, E) {
    return l.length === 0 ? u : u === _ || u === E ? xe(u) : u;
  }, vt = function(l, u) {
    return l === u || Y(l) !== null ? !1 : (p && nn(l), !0);
  }, pr = function(l, u) {
    if (Me($.beforeSanitizeElements, l, null), vt(l, u)) return !0;
    if (sn(l))
      return Ze(l), !0;
    const _ = le(k(l));
    if (H = dr($.uponSanitizeElement, H, Ve, Te), Me($.uponSanitizeElement, l, {
      tagName: _,
      allowedTags: H
    }), vt(l, u)) return !0;
    if (bs(l, _))
      return Ze(l), !0;
    if (qe[_] || !(de.tagCheck instanceof Function && de.tagCheck(_)) && !H[_]) {
      const E = vs(l, _, u);
      return E === !1 && (Me($.afterSanitizeElements, l, null), vt(l, u)) ? !0 : E;
    }
    if (g(l) === _e.element && !gs(l) || (_ === "noscript" || _ === "noembed" || _ === "noframes") && pe(oa, l.innerHTML))
      return Ze(l), !0;
    if (Ce && l.nodeType === _e.text) {
      const E = rn(l.textContent);
      l.textContent !== E && (Dt(e.removed, { element: l.cloneNode() }), l.textContent = E);
    }
    return Me($.afterSanitizeElements, l, null), vt(l, u);
  }, fr = function(l, u, _) {
    if (ae[u] || ir(u, l) || Xt && (u === "id" || u === "name") && (_ in t || _ in ds)) return !1;
    const E = j[u] || de.attributeCheck instanceof Function && de.attributeCheck(u, l);
    return tt && pe(Kt, u) || Ge && pe(Q, u) ? !0 : E ? er[u] || pe($e, Nt(_, De, "")) || (u === "src" || u === "xlink:href" || u === "href") && l !== "script" && Lr(_, "data:") === 0 && wn[l] || nt && !pe(fe, Nt(_, De, "")) ? !0 : !_ : hr(l) && ln(ve.tagNameCheck, l) && ln(ve.attributeNameCheck, u, l) || u === "is" && ve.allowCustomizedBuiltInElements && ln(ve.tagNameCheck, _);
  }, ys = G({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), hr = function(l) {
    return !ys[Ft(l)] && pe(et, l);
  }, _s = function(l, u, _, E) {
    if (R && typeof A == "object" && typeof A.getAttributeType == "function" && !_) switch (A.getAttributeType(l, u)) {
      case "TrustedHTML":
        return be(E);
      case "TrustedScriptURL":
        return Wt(E);
    }
    return E;
  }, ws = function(l, u, _, E) {
    try {
      return _ ? l.setAttributeNS(_, u, E) : l.setAttribute(u, E), sn(l) ? (Ze(l), !1) : !0;
    } catch {
      return it(u, l), !1;
    }
  }, gr = function(l, u) {
    if (Me($.beforeSanitizeAttributes, l, null), vt(l, u)) return;
    const _ = l.attributes;
    if (!_ || sn(l)) return;
    j = dr($.uponSanitizeAttribute, j, Be, st);
    const E = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: j,
      forceKeepAttr: void 0
    };
    let I = _.length;
    const W = le(l.nodeName);
    for (; I--; ) {
      const q = _[I], re = q.name, Se = q.namespaceURI, ye = q.value, yt = le(re), Cn = ye;
      let he = re === "value" ? Cn : jl(Cn), mr = !1;
      if (E.attrName = yt, E.attrValue = he, E.keepAttr = !0, E.forceKeepAttr = void 0, Me($.uponSanitizeAttribute, l, E), he = E.attrValue, Lt && (yt === "id" || yt === "name") && Lr(he, Qt) !== 0 && (it(re, l, q), he = Qt + he, mr = !0), He && pe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, he)) {
        it(re, l, q);
        continue;
      }
      if (yt === "attributename" && Cr(he, "href")) {
        it(re, l, q);
        continue;
      }
      if (!E.forceKeepAttr) {
        if (!E.keepAttr) {
          it(re, l, q);
          continue;
        }
        if (!Ct && pe(ia, he)) {
          it(re, l, q);
          continue;
        }
        if (Ce && (he = rn(he)), !fr(W, yt, he)) {
          it(re, l, q);
          continue;
        }
        he = _s(W, yt, Se, he), he !== Cn && ws(l, re, Se, he) && mr && $r(e.removed);
      }
    }
    Me($.afterSanitizeAttributes, l, null), vt(l, u);
  }, an = function(l) {
    let u = null;
    const _ = cr(l);
    for (Me($.beforeSanitizeShadowDOM, l, null); u = _.nextNode(); )
      if (Me($.uponSanitizeShadowNode, u, null), pr(u, l), gr(u, l), bt(u.content) && an(u.content), g(u) === _e.element) {
        const E = X(u);
        bt(E) && ($n(E), an(E));
      }
    Me($.afterSanitizeShadowDOM, l, null);
  }, $n = function(l) {
    const u = [{
      node: l,
      shadow: null
    }];
    for (; u.length > 0; ) {
      const _ = u.pop();
      if (_.shadow) {
        an(_.shadow);
        continue;
      }
      const E = _.node, I = g(E) === _e.element, W = F(E);
      if (W) for (let q = W.length - 1; q >= 0; --q) u.push({
        node: W[q],
        shadow: null
      });
      if (I) {
        const q = S ? S(E) : null;
        if (typeof q == "string" && le(q) === "template") {
          const re = E.content;
          bt(re) && u.push({
            node: re,
            shadow: null
          });
        }
      }
      if (I) {
        const q = X(E);
        bt(q) && u.push({
          node: null,
          shadow: q
        }, {
          node: q,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(T) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, _ = null, E = null, I = null;
    if (xn = !T, xn && (T = "<!-->"), typeof T != "string" && !Ot(T) && (T = Yl(T), typeof T != "string"))
      throw Xe("dirty is not a string, aborting");
    if (!e.isSupported) return T;
    rt ? (H = Te, j = st) : En(l), ($.uponSanitizeElement.length > 0 || $.uponSanitizeAttribute.length > 0) && (H = xe(H)), $.uponSanitizeAttribute.length > 0 && (j = xe(j)), e.removed = [];
    const W = p && typeof T != "string" && Ot(T);
    if (W) {
      ks(T);
      const Se = k(T);
      if (typeof Se == "string") {
        const ye = le(Se);
        if (!H[ye] || qe[ye])
          throw tn(T), Xe("root node is forbidden and cannot be sanitized in-place");
      }
      if (sn(T))
        throw tn(T), Xe("root node is clobbered and cannot be sanitized in-place");
      try {
        $n(T);
      } catch (ye) {
        throw tn(T), ye;
      }
    } else if (Ot(T))
      u = ur("<!---->"), _ = u.ownerDocument.importNode(T, !0), _.nodeType === _e.element && _.nodeName === "BODY" || _.nodeName === "HTML" ? u = _ : u.appendChild(_), $n(u);
    else {
      if (!Ye && !Ce && !je && T.indexOf("<") === -1) return R && at ? be(T) : T;
      if (u = ur(T), !u) return Ye ? null : at ? C : "";
    }
    u && gt && Ze(u.firstChild);
    const q = W ? T : u;
    try {
      const Se = cr(q);
      for (; E = Se.nextNode(); )
        pr(E, q), gr(E, q), bt(E.content) && an(E.content);
    } catch (Se) {
      throw W && (tn(T), ut(e.removed, (ye) => {
        ye.element && nn(ye.element);
      })), Se;
    }
    if (W) {
      let Se = !1;
      if (ut(e.removed, (ye) => {
        ye.element && (ye.element === T && (Se = !0), nn(ye.element));
      }), Se) throw Xe("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ce && Rn(T), T;
    }
    if (Ye) {
      if (Ce && Rn(u), lt)
        for (I = $t.call(u.ownerDocument); u.firstChild; ) I.appendChild(u.firstChild);
      else I = u;
      return (j.shadowroot || j.shadowrootmode) && (I = _n.call(r, I, !0)), I;
    }
    let re = je ? u.outerHTML : u.innerHTML;
    return je && H["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && pe(la, u.ownerDocument.doctype.name) && (re = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + re), Ce && (re = rn(re)), R && at ? be(re) : re;
  }, e.setConfig = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    En(T), rt = !0, Te = H, st = j;
  }, e.clearConfig = function() {
    kt = null, rt = !1, Te = null, st = null, R = te, C = "";
  }, e.isValidAttribute = function(T, l, u) {
    kt || En({});
    const _ = le(T), E = le(l);
    return fr(_, E, u);
  }, e.addHook = function(T, l) {
    typeof l == "function" && ge($, T) && Dt($[T], l);
  }, e.removeHook = function(T, l) {
    if (ge($, T)) {
      if (l !== void 0) {
        const u = Bl($[T], l);
        return u === -1 ? void 0 : Hl($[T], u, 1)[0];
      }
      return $r($[T]);
    }
  }, e.removeHooks = function(T) {
    ge($, T) && ($[T] = []);
  }, e.removeAllHooks = function() {
    $ = Br();
  }, e;
}
var fa = rs();
const ha = ["innerHTML"], ga = /* @__PURE__ */ Et({
  __name: "MarkdownContent",
  props: {
    content: {}
  },
  setup(n) {
    const e = n, t = ee(() => fa.sanitize(K.parse(e.content, { async: !1, breaks: !0 })));
    return (r, s) => (v(), y("div", {
      class: "markdown-content",
      innerHTML: t.value
    }, null, 8, ha));
  }
}), Qn = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, s] of e)
    t[r] = s;
  return t;
}, dn = /* @__PURE__ */ Qn(ga, [["__scopeId", "data-v-ef377647"]]);
function ss() {
  const n = localStorage.getItem("0kay_lang");
  return n === "en" || n === "zh" ? n : navigator.language.startsWith("zh") ? "zh" : "en";
}
const Je = U(ss());
function ma() {
  Je.value = ss();
}
const ka = { class: "tool-kind" }, ba = { class: "tool-summary" }, va = {
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
}, Ta = { key: 1 }, Sa = {
  key: 2,
  class: "tool-section-text"
}, Aa = {
  key: 1,
  class: "muted"
}, Ea = {
  key: 2,
  class: "tool-error"
}, Ra = ["aria-label"], $a = ["aria-label", "title"], Ca = {
  key: 0,
  class: "muted"
}, La = {
  key: 1,
  class: "tool-search-results"
}, Ia = ["href"], Oa = { key: 0 }, Pa = { key: 1 }, Da = {
  key: 2,
  class: "muted"
}, Na = {
  key: 3,
  class: "tool-error"
}, Ma = /* @__PURE__ */ Et({
  __name: "ToolStepCard",
  props: {
    step: {},
    formatError: { type: Function }
  },
  setup(n) {
    const e = n, t = (S, w) => Je.value === "en" ? w : S, r = U(!1), s = U(!1), a = ee(() => (e.step.prompt || "").trim() || "tool"), i = ee(() => ["websearch", "web_search", "search"].includes(a.value)), o = ee(() => {
      if (!e.step.args) return null;
      try {
        const S = JSON.parse(e.step.args);
        return S && typeof S == "object" && !Array.isArray(S) ? S : null;
      } catch {
        return null;
      }
    }), b = ee(() => {
      if (!e.step.result) return null;
      try {
        return JSON.parse(e.step.result);
      } catch {
        return e.step.result;
      }
    }), m = ee(() => {
      const S = b.value;
      return !S || typeof S != "object" || Array.isArray(S) ? null : S.data !== void 0 && S.data !== null && typeof S.data == "object" && !Array.isArray(S.data) ? S.data : "success" in S ? null : S;
    }), A = ee(() => {
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
    }), x = (S) => (Je.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[S] || S;
    function N(S) {
      let w = 0, g = 0;
      for (const k of String(S || "").split(`
`))
        k.startsWith("---") || k.startsWith("+++") || (k.startsWith("+") ? w++ : k.startsWith("-") && g++);
      return { added: w, removed: g };
    }
    const D = ee(() => {
      const S = a.value, w = m.value;
      if (!w) return "";
      if (S === "write") return typeof w.lines == "number" ? `+${w.lines} ${t("行", "lines")}` : "";
      if (S === "edit") {
        const { added: g, removed: k } = N(w.diff);
        return g || k ? `+${g} −${k}` : "";
      }
      if (S === "apply_patch" && Array.isArray(w.files)) {
        let g = 0, k = 0;
        for (const R of w.files) {
          const C = N(R?.diff);
          g += C.added, k += C.removed;
        }
        return g || k ? `+${g} −${k}` : "";
      }
      return "";
    }), O = ee(() => {
      const S = a.value, w = o.value, g = m.value, k = (R, C = 160) => (R || "").length > C ? `${R.slice(0, C)}…` : R || "";
      if (i.value) {
        const R = k(String(g?.query ?? w?.query ?? "")), C = Array.isArray(g?.results) ? g.results.length : 0;
        return R + (C ? ` · ${C} ${t("条结果", "results")}` : "");
      }
      if (S === "bash") {
        const R = k(String(w?.command ?? "")), C = g && g.exitCode !== void 0 && e.step.state !== "running" ? ` · ${t("退出码", "exit")} ${g.exitCode}` : "";
        return R + C;
      }
      if (S === "webfetch")
        return k(String(g?.url ?? w?.url ?? "")) + (g?.status !== void 0 && g?.status !== null ? ` · HTTP ${g.status}` : "");
      if (S === "read" || S === "write") return k(String(g?.path ?? w?.filePath ?? ""));
      if (S === "edit") return k(String(w?.filePath ?? g?.path ?? ""));
      if (S === "apply_patch") {
        const R = Array.isArray(w?.patches) ? w.patches.map((C) => C?.filePath).filter(Boolean) : Array.isArray(g?.files) ? g.files.map((C) => C?.path).filter(Boolean) : [];
        return k(R.join(", "));
      }
      if (w && Object.keys(w).length)
        try {
          return k(JSON.stringify(w));
        } catch {
        }
      return k(String(e.step.args || ""));
    }), V = ee(() => String(m.value?.query ?? o.value?.query ?? e.step.args ?? "")), F = ee(() => Array.isArray(m.value?.results) ? m.value.results : []), Y = ee(() => typeof b.value == "string" ? b.value : b.value === null && e.step.result ? e.step.result : ""), X = ee(() => {
      const S = a.value, w = m.value;
      if (S === "bash" && w) {
        const k = [{ label: t("工作目录", "cwd"), text: String(w.cwd || "") }];
        return w.stdout && k.push({ label: "stdout", text: String(w.stdout), mono: !0 }), w.stderr && k.push({ label: "stderr", text: String(w.stderr), mono: !0 }), !w.stdout && !w.stderr && k.push({ label: "", text: t("（无输出）", "(no output)") }), k;
      }
      if (S === "write" && w) {
        const k = [{ label: t("文件", "File"), text: String(w.path || "") }];
        return k.push({ label: t("内容", "Content"), text: `${typeof w.lines == "number" ? w.lines : "—"} ${t("行", "lines")}${w.created ? ` · ${t("新建文件", "created")}` : ""} · ${w.bytes ?? "—"} B` }), k;
      }
      if (S === "edit" && w)
        return [
          { label: t("文件", "File"), text: String(w.path || "") },
          { label: `diff${typeof w.replacements == "number" && w.replacements > 1 ? ` · ×${w.replacements}` : ""}`, text: String(w.diff || ""), mono: !0 }
        ];
      if (S === "apply_patch" && Array.isArray(w?.files) && w.files.length) {
        const k = [];
        for (const R of w.files)
          k.push({ label: t("文件", "File"), text: String(R?.path || "") }), R?.diff && k.push({ label: "diff", text: String(R.diff), mono: !0 });
        return k;
      }
      if (S === "read" && w) {
        const k = [{ label: t("文件", "File"), text: String(w.path || "") }];
        return k.push({ label: `${t("第", "line")} ${w.offset ?? "—"} ${t("行起", "onward")}`, text: String(w.content || ""), mono: !0 }), k;
      }
      if (S === "webfetch" && w)
        return [
          { label: "URL", text: String(w.url || "") },
          { label: t("内容", "Content"), text: String(w.content || ""), mono: !0 }
        ];
      const g = e.step.result;
      if (!g) return [];
      try {
        return [{ label: "JSON", text: JSON.stringify(b.value, null, 2), mono: !0 }];
      } catch {
        return [{ label: "", text: String(g), mono: !0 }];
      }
    });
    function L() {
      if (i.value) {
        s.value = !s.value;
        return;
      }
      r.value = !r.value;
    }
    function P(S) {
      S.key === "Escape" && s.value && (s.value = !1);
    }
    return bn(() => window.addEventListener("keydown", P)), vn(() => window.removeEventListener("keydown", P)), (S, w) => (v(), y("div", {
      class: se(["tool-card", { expanded: r.value }])
    }, [
      c("button", {
        type: "button",
        class: "tool-card-head",
        onClick: L
      }, [
        c("span", {
          class: se(["tool-dot", n.step.state])
        }, "●", 2),
        c("strong", ka, h(A.value), 1),
        c("span", ba, h(O.value), 1),
        D.value ? (v(), y("small", va, h(D.value), 1)) : z("", !0),
        c("small", ya, h(x(n.step.state)), 1),
        w[2] || (w[2] = c("span", {
          class: "tool-chevron",
          "aria-hidden": "true"
        }, "▸", -1))
      ]),
      r.value && !i.value ? (v(), y("div", _a, [
        n.step.state === "running" && !X.value.length ? (v(), y("p", wa, h(t("执行中…", "Running…")), 1)) : z("", !0),
        (v(!0), y(ne, null, me(X.value, (g, k) => (v(), y(ne, { key: k }, [
          g.label ? (v(), y("small", xa, h(g.label), 1)) : z("", !0),
          g.mono ? (v(), y("pre", Ta, h(g.text), 1)) : (v(), y("p", Sa, h(g.text), 1))
        ], 64))), 128)),
        !X.value.length && n.step.state !== "running" && !n.step.error ? (v(), y("p", Aa, h(t("执行完成，无输出", "Completed with no output")), 1)) : z("", !0),
        n.step.error ? (v(), y("p", Ea, h(n.formatError?.(n.step.error) || n.step.error), 1)) : z("", !0)
      ])) : z("", !0),
      s.value ? (v(), y("div", {
        key: 1,
        class: "tool-dialog-backdrop",
        onClick: w[1] || (w[1] = Re((g) => s.value = !1, ["self"]))
      }, [
        c("section", {
          class: "tool-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t("搜索结果", "Search results")
        }, [
          c("header", null, [
            c("h4", null, h(t("搜索", "Search")) + " · " + h(V.value), 1),
            c("button", {
              type: "button",
              class: "tool-dialog-close",
              "aria-label": t("关闭", "Close"),
              title: t("关闭", "Close"),
              onClick: w[0] || (w[0] = (g) => s.value = !1)
            }, [...w[3] || (w[3] = [
              c("svg", {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true"
              }, [
                c("path", {
                  d: "M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round"
                })
              ], -1)
            ])], 8, $a)
          ]),
          n.step.state === "running" ? (v(), y("p", Ca, h(t("搜索中…", "Searching…")), 1)) : F.value.length ? (v(), y("ol", La, [
            (v(!0), y(ne, null, me(F.value, (g, k) => (v(), y("li", { key: k }, [
              c("a", {
                href: g.url,
                target: "_blank",
                rel: "noopener noreferrer"
              }, h(g.title || g.url), 9, Ia),
              g.snippet ? (v(), y("p", Oa, h(g.snippet), 1)) : z("", !0),
              g.title && g.url ? (v(), y("small", Pa, h(g.url), 1)) : z("", !0)
            ]))), 128))
          ])) : (v(), y("p", Da, h(Y.value || t("没有找到相关结果。", "No relevant results found.")), 1)),
          n.step.error ? (v(), y("p", Na, h(n.formatError?.(n.step.error) || n.step.error), 1)) : z("", !0)
        ], 8, Ra)
      ])) : z("", !0)
    ], 2));
  }
}), Hr = /* @__PURE__ */ Qn(Ma, [["__scopeId", "data-v-ee8cf02b"]]);
function ls(n = "") {
  const e = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
  return n ? `${n}-${e}` : e;
}
const za = ["aria-expanded", "aria-controls", "aria-activedescendant", "aria-label", "disabled"], Fa = { class: "app-select-value" }, Ua = ["id", "aria-label"], Ba = ["id", "aria-selected", "aria-disabled", "data-index", "onPointermove", "onClick"], Ha = {
  key: 0,
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": "true"
}, ja = {
  key: 0,
  class: "app-select-empty"
}, pn = /* @__PURE__ */ Et({
  inheritAttrs: !1,
  __name: "AppSelect",
  props: {
    modelValue: { default: "" },
    options: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "请选择" },
    ariaLabel: {}
  },
  emits: ["update:modelValue", "change", "focus", "open"],
  setup(n, { emit: e }) {
    const t = n, r = e, s = U(null), a = U(null), i = U(!1), o = U(-1), b = U({}), m = U(!1), A = ls("select"), x = ee(() => t.options.map((g) => typeof g == "string" ? { value: g, label: g } : g)), N = ee(() => x.value.find((g) => g.value === t.modelValue)?.label || t.modelValue || t.placeholder);
    let D = "", O = 0;
    function V() {
      const g = s.value?.getBoundingClientRect();
      if (!g) return;
      const k = window.visualViewport?.height || innerHeight, R = window.visualViewport?.width || innerWidth, C = k - g.bottom - 10, te = g.top - 10;
      m.value = C < Math.min(280, x.value.length * 40 + 12) && te > C;
      const Fe = Math.max(48, Math.min(320, m.value ? te : C)), ke = Math.min(Math.max(g.width, 200), R - 16);
      b.value = { position: "fixed", left: `${Math.max(8, Math.min(g.left, R - ke - 8))}px`, width: `${ke}px`, maxHeight: `${Fe}px`, ...m.value ? { bottom: `${k - g.top + 6}px` } : { top: `${g.bottom + 6}px` } };
    }
    function F(g = !1) {
      i.value = !1, D = "", g && s.value?.focus();
    }
    async function Y() {
      t.disabled || i.value || (i.value = !0, o.value = x.value.findIndex((g) => g.value === t.modelValue && !g.disabled), o.value < 0 && (o.value = x.value.findIndex((g) => !g.disabled)), V(), r("open"), await dt(), X());
    }
    function X() {
      a.value?.querySelector(`[data-index="${o.value}"]`)?.scrollIntoView({ block: "nearest" });
    }
    function L(g) {
      const k = x.value[g];
      !k || k.disabled || (r("update:modelValue", k.value), r("change", k.value), F(!0));
    }
    async function P(g) {
      if (!(t.disabled || g.isComposing)) {
        if (g.key === "Tab") {
          F();
          return;
        }
        if (g.key === "Escape") {
          i.value && (g.preventDefault(), F(!0));
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(g.key)) {
          if (g.preventDefault(), !i.value) {
            await Y();
            return;
          }
          if (g.key === "Enter" || g.key === " ") {
            L(o.value);
            return;
          }
          const k = x.value.map((C, te) => C.disabled ? -1 : te).filter((C) => C >= 0);
          if (!k.length) return;
          const R = k.indexOf(o.value);
          o.value = g.key === "Home" ? k[0] : g.key === "End" ? k[k.length - 1] : k[(R + (g.key === "ArrowDown" ? 1 : -1) + k.length) % k.length], await dt(), X();
          return;
        }
        if (g.key.length === 1 && !g.ctrlKey && !g.metaKey && !g.altKey) {
          await Y();
          const k = Date.now();
          D = k - O > 700 ? g.key : D + g.key, O = k;
          const R = x.value.findIndex((C) => !C.disabled && C.label.toLocaleLowerCase().startsWith(D.toLocaleLowerCase()));
          R >= 0 && (o.value = R, await dt(), X());
        }
      }
    }
    function S(g) {
      const k = g.target;
      !s.value?.contains(k) && !a.value?.contains(k) && F();
    }
    function w(g) {
      i.value && (!(g.target instanceof Node) || !a.value?.contains(g.target)) && V();
    }
    return Ee(() => t.disabled, (g) => {
      g && F();
    }), Ee(x, () => {
      i.value && (o.value >= x.value.length && (o.value = x.value.findIndex((g) => !g.disabled)), dt(V));
    }), bn(() => {
      document.addEventListener("pointerdown", S, !0), window.addEventListener("resize", V), window.addEventListener("scroll", w, !0);
    }), vn(() => {
      document.removeEventListener("pointerdown", S, !0), window.removeEventListener("resize", V), window.removeEventListener("scroll", w, !0);
    }), (g, k) => (v(), y("div", As(g.$attrs, {
      class: ["app-select", { "is-disabled": n.disabled }]
    }), [
      c("button", {
        ref_key: "trigger",
        ref: s,
        type: "button",
        class: "app-select-trigger",
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": i.value,
        "aria-controls": i.value ? J(A) : void 0,
        "aria-activedescendant": i.value && o.value >= 0 ? `${J(A)}-${o.value}` : void 0,
        "aria-label": n.ariaLabel,
        disabled: n.disabled,
        onClick: k[0] || (k[0] = (R) => i.value ? F() : Y()),
        onKeydown: P,
        onFocus: k[1] || (k[1] = (R) => r("focus", R))
      }, [
        c("span", Fa, h(N.value), 1),
        (v(), y("svg", {
          class: se({ "is-open": i.value }),
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true"
        }, [...k[3] || (k[3] = [
          c("path", {
            d: "m6 9 6 6 6-6",
            stroke: "currentColor",
            "stroke-width": "1.8",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, -1)
        ])], 2))
      ], 40, za),
      (v(), St(jn, { to: "body" }, [
        Le(jr, { name: "select-menu" }, {
          default: Wr(() => [
            i.value ? (v(), y("div", {
              key: 0,
              id: J(A),
              ref_key: "menu",
              ref: a,
              class: se(["app-select-menu", { "opens-up": m.value }]),
              style: Ut(b.value),
              role: "listbox",
              "aria-label": n.ariaLabel || "选项",
              onPointerdown: k[2] || (k[2] = Re(() => {
              }, ["prevent"]))
            }, [
              (v(!0), y(ne, null, me(x.value, (R, C) => (v(), y("div", {
                id: `${J(A)}-${C}`,
                key: `${R.value}:${C}`,
                role: "option",
                "aria-selected": R.value === n.modelValue,
                "aria-disabled": !!R.disabled,
                "data-index": C,
                class: se(["app-select-option", { highlighted: o.value === C, selected: R.value === n.modelValue, disabled: R.disabled }]),
                onPointermove: (te) => !R.disabled && (o.value = C),
                onClick: Re((te) => L(C), ["stop"])
              }, [
                c("span", null, h(R.label), 1),
                R.value === n.modelValue ? (v(), y("svg", Ha, [...k[4] || (k[4] = [
                  c("path", {
                    d: "m5 12 4 4L19 6",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }, null, -1)
                ])])) : z("", !0)
              ], 42, Ba))), 128)),
              x.value.length ? z("", !0) : (v(), y("div", ja, h(J(Je) === "en" ? "No options available" : "暂无可选项"), 1))
            ], 46, Ua)) : z("", !0)
          ]),
          _: 1
        })
      ]))
    ], 16));
  }
}), Wa = { class: "thinking-caption" }, Va = ["disabled", "aria-expanded", "aria-controls"], qa = ["id", "onKeydown"], Ga = {
  class: "thinking-capsule",
  "aria-hidden": "true"
}, Ya = ["value", "aria-valuetext"], Za = {
  key: 0,
  class: "energy-wave",
  "aria-hidden": "true"
}, Ka = { class: "thinking-stops" }, Xa = ["aria-pressed", "onClick"], Qa = { class: "thinking-provider-note" }, Ja = /* @__PURE__ */ Et({
  __name: "ThinkingSlider",
  props: {
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = ee(() => Je.value === "en"), r = n, s = e, a = ee(() => [{ value: 0, label: t.value ? "Off" : "关闭思考" }, { value: 20, label: t.value ? "Low" : "低" }, { value: 50, label: t.value ? "Medium" : "中" }, { value: 75, label: t.value ? "High" : "高" }, { value: 100, label: t.value ? "Max" : "最高" }]), i = ee(() => r.modelValue === 0 ? 0 : r.modelValue < 35 ? 1 : r.modelValue < 62.5 ? 2 : r.modelValue < 87.5 ? 3 : 4), o = U(!1), b = U({}), m = U(null), A = U(null), x = U(null), N = U(i.value * 25), D = U(!1), O = ee(() => i.value === 4), V = ls("thinking");
    let F;
    Ee(() => r.modelValue, () => {
      o.value || (N.value = i.value * 25);
    }), Ee(O, (k, R) => {
      k && !R && (D.value = !0, clearTimeout(F), F = setTimeout(() => D.value = !1, 900));
    }), Ee(() => r.disabled, (k) => {
      k && (o.value = !1);
    });
    function Y() {
      const k = m.value?.getBoundingClientRect();
      if (!k) return;
      const R = Math.min(352, innerWidth - 16), te = innerHeight - k.bottom < 204;
      b.value = { left: `${Math.max(8, Math.min(k.left, innerWidth - R - 8))}px`, width: `${R}px`, ...te ? { bottom: `${innerHeight - k.top + 8}px` } : { top: `${k.bottom + 8}px` } };
    }
    async function X() {
      r.disabled || (o.value = !o.value, o.value && (N.value = i.value * 25, Y(), await dt(), x.value?.focus()));
    }
    function L() {
      o.value = !1, m.value?.focus();
    }
    function P(k) {
      N.value = Number(k.target.value), s("update:modelValue", a.value[Math.round(N.value / 25)].value);
    }
    function S(k) {
      N.value = k * 25, s("update:modelValue", a.value[k].value);
    }
    function w(k) {
      const R = k.target;
      !m.value?.contains(R) && !A.value?.contains(R) && (o.value = !1);
    }
    function g(k) {
      o.value && (!(k.target instanceof Node) || !A.value?.contains(k.target)) && Y();
    }
    return bn(() => {
      document.addEventListener("pointerdown", w, !0), window.addEventListener("resize", Y), window.addEventListener("scroll", g, !0);
    }), vn(() => {
      clearTimeout(F), document.removeEventListener("pointerdown", w, !0), window.removeEventListener("resize", Y), window.removeEventListener("scroll", g, !0);
    }), (k, R) => (v(), y("div", {
      class: se(["thinking-control", { full: O.value, pulse: D.value }])
    }, [
      c("span", Wa, h(t.value ? "Thinking effort" : "思考强度"), 1),
      c("button", {
        ref_key: "trigger",
        ref: m,
        type: "button",
        class: "thinking-trigger",
        disabled: n.disabled,
        "aria-label": "思考强度",
        "aria-haspopup": "dialog",
        "aria-expanded": o.value,
        "aria-controls": o.value ? J(V) : void 0,
        onClick: X,
        onKeydown: _t(L, ["esc"])
      }, [
        c("span", null, h(O.value ? "✦ " : "") + h(a.value[i.value].label), 1),
        R[5] || (R[5] = c("span", { "aria-hidden": "true" }, "⌄", -1))
      ], 40, Va),
      (v(), St(jn, { to: "body" }, [
        Le(jr, { name: "thinking-menu" }, {
          default: Wr(() => [
            o.value ? (v(), y("section", {
              key: 0,
              id: J(V),
              ref_key: "panel",
              ref: A,
              class: se(["thinking-popover", { full: O.value, pulse: D.value }]),
              style: Ut(b.value),
              role: "dialog",
              "aria-label": "调整思考强度",
              onKeydown: _t(Re(L, ["prevent", "stop"]), ["esc"])
            }, [
              c("header", null, [
                c("strong", null, h(t.value ? "Thinking effort" : "思考强度"), 1),
                c("output", null, h(O.value ? "✦ " : "") + h(a.value[i.value].label), 1)
              ]),
              c("div", {
                class: "thinking-track",
                style: Ut({ "--intensity": `${N.value}%` })
              }, [
                c("div", Ga, [
                  R[6] || (R[6] = c("div", { class: "thinking-fill" }, null, -1)),
                  (v(!0), y(ne, null, me(a.value, (C, te) => (v(), y("span", {
                    key: te,
                    class: se(["thinking-tick", { passed: N.value >= te * 25 }]),
                    style: Ut({ left: `${te * 25}%` })
                  }, null, 6))), 128))
                ]),
                c("input", {
                  ref_key: "range",
                  ref: x,
                  type: "range",
                  min: "0",
                  max: "100",
                  step: "0.1",
                  value: N.value,
                  "aria-label": "思考强度滑块",
                  "aria-valuetext": a.value[i.value].label,
                  onInput: P,
                  onChange: R[0] || (R[0] = (C) => N.value = i.value * 25),
                  onKeydown: [
                    R[1] || (R[1] = _t(Re((C) => S(0), ["prevent"]), ["home"])),
                    R[2] || (R[2] = _t(Re((C) => S(4), ["prevent"]), ["end"])),
                    R[3] || (R[3] = _t(Re((C) => S(Math.min(4, i.value + 1)), ["prevent"]), ["arrow-right"])),
                    R[4] || (R[4] = _t(Re((C) => S(Math.max(0, i.value - 1)), ["prevent"]), ["arrow-left"]))
                  ]
                }, null, 40, Ya),
                O.value ? (v(), y("span", Za)) : z("", !0)
              ], 4),
              c("div", Ka, [
                (v(!0), y(ne, null, me(a.value, (C, te) => (v(), y("button", {
                  key: C.value,
                  type: "button",
                  class: se({ selected: i.value === te }),
                  "aria-pressed": i.value === te,
                  onClick: (Fe) => S(te)
                }, h(C.label), 11, Xa))), 128))
              ]),
              c("p", null, h(t.value ? i.value === 0 ? "Disable model reasoning" : O.value ? "Maximum effort" : "Drag to adjust; release to snap to a level" : i.value === 0 ? "不启用模型思考模式" : O.value ? "全力思考 · 已达到最高档" : "拖动滑块调整，松开后定位到对应档位"), 1),
              c("p", Qa, h(t.value ? "Actual reasoning controls depend on the selected provider. Max may map to High." : "实际推理参数取决于供应商；最高档可能映射为高档。"), 1)
            ], 46, qa)) : z("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), xt = U(null);
function as() {
  function n(t) {
    const r = typeof t == "string" ? { message: t } : t;
    return xt.value && xt.value.resolve(!1), new Promise((s) => {
      xt.value = { options: r, resolve: s };
    });
  }
  function e(t) {
    const r = xt.value;
    xt.value = null, r?.resolve(t);
  }
  return { confirmState: xt, confirm: n, settle: e };
}
const eo = /* @__PURE__ */ Et({
  __name: "ConfirmDialog",
  setup(n) {
    const { confirmState: e, settle: t } = as(), r = U(null), s = U(null);
    let a = null;
    const i = () => (document.documentElement.lang || "").startsWith("en"), o = () => e.value?.options.title || (i() ? "Confirm" : "请确认"), b = () => e.value?.options.confirmLabel || (i() ? "Confirm" : "确认"), m = () => e.value?.options.cancelLabel || (i() ? "Cancel" : "取消");
    Ee(() => !!e.value, async (x) => {
      x ? (a = document.activeElement, await dt(), r.value?.focus(), s.value?.focus()) : (r.value = null, a?.focus?.());
    });
    function A(x) {
      if (!e.value) return;
      if (x.key === "Escape") {
        x.preventDefault(), t(!1);
        return;
      }
      if (x.key !== "Tab" || !r.value) return;
      const N = [...r.value.querySelectorAll("button:not(:disabled)")];
      if (!N.length) return;
      const D = N[0], O = N[N.length - 1];
      x.shiftKey && document.activeElement === D ? (x.preventDefault(), O.focus()) : !x.shiftKey && document.activeElement === O && (x.preventDefault(), D.focus());
    }
    return (x, N) => (v(), St(jn, { to: "body" }, [
      J(e) ? (v(), y("div", {
        key: 0,
        class: "confirm-scrim",
        role: "presentation",
        onClick: N[2] || (N[2] = Re((D) => J(t)(!1), ["self"])),
        onKeydown: A
      }, [
        c("section", {
          ref_key: "dialog",
          ref: r,
          class: "confirm-dialog",
          role: "alertdialog",
          "aria-modal": "true",
          tabindex: "-1"
        }, [
          c("h2", null, h(o()), 1),
          c("p", null, h(J(e).options.message), 1),
          c("footer", null, [
            c("button", {
              ref_key: "cancelBtn",
              ref: s,
              type: "button",
              onClick: N[0] || (N[0] = (D) => J(t)(!1))
            }, h(m()), 513),
            c("button", {
              type: "button",
              class: se(["confirm-primary", { danger: J(e).options.danger !== !1 }]),
              onClick: N[1] || (N[1] = (D) => J(t)(!0))
            }, h(b()), 3)
          ])
        ], 512)
      ], 32)) : z("", !0)
    ]));
  }
}), to = { class: "workspace" }, no = { class: "sessions" }, ro = ["disabled", "title"], so = { class: "connection" }, lo = ["title"], ao = ["placeholder", "aria-label"], oo = { class: "filter-bar" }, io = ["onClick"], uo = { class: "muted" }, co = { class: "session-list" }, po = ["disabled", "onClick"], fo = { class: "origin" }, ho = {
  key: 0,
  class: "muted"
}, go = {
  key: 0,
  class: "ledger"
}, mo = { class: "muted" }, ko = ["onClick"], bo = {
  key: 1,
  class: "conversation"
}, vo = { class: "conversation-header" }, yo = {
  key: 0,
  class: "running"
}, _o = {
  key: 1,
  class: "session-actions"
}, wo = ["disabled"], xo = ["disabled"], To = {
  key: 0,
  class: "error",
  role: "alert"
}, So = {
  key: 1,
  class: "host-panel"
}, Ao = { class: "usage-rings" }, Eo = {
  key: 1,
  class: "muted"
}, Ro = {
  key: 0,
  class: "sub-view"
}, $o = { class: "sub-view-header" }, Co = { class: "muted" }, Lo = { class: "sub-view-body" }, Io = { class: "bubble user" }, Oo = { class: "message-head" }, Po = { class: "message-text" }, Do = {
  key: 0,
  class: "agent-speech"
}, No = {
  key: 0,
  class: "muted model-annotation"
}, Mo = {
  key: 0,
  class: "running"
}, zo = {
  key: 2,
  class: "muted"
}, Fo = {
  key: 3,
  class: "error"
}, Uo = {
  key: 1,
  class: "subagent-card nested"
}, Bo = ["onClick"], Ho = { class: "subagent-prompt" }, jo = { key: 3 }, Wo = {
  key: 0,
  class: "agent-speech"
}, Vo = {
  key: 1,
  class: "error"
}, qo = {
  key: 2,
  class: "muted"
}, Go = {
  key: 0,
  class: "welcome"
}, Yo = { class: "bubble user" }, Zo = { class: "message-head" }, Ko = { class: "message-text" }, Xo = { class: "bubble agent" }, Qo = { class: "message-head" }, Jo = {
  key: 0,
  class: "steps"
}, ei = {
  key: 0,
  class: "agent-speech"
}, ti = {
  key: 0,
  class: "muted model-annotation"
}, ni = {
  key: 0,
  class: "running"
}, ri = {
  key: 2,
  class: "muted"
}, si = {
  key: 3,
  class: "error"
}, li = {
  key: 1,
  class: "subagent-card"
}, ai = ["onClick"], oi = { class: "subagent-prompt" }, ii = {
  key: 0,
  class: "error subagent-card-error"
}, ui = { key: 3 }, ci = {
  key: 2,
  class: "error"
}, di = {
  key: 3,
  class: "muted"
}, pi = {
  key: 0,
  class: "compact-notice"
}, fi = ["disabled", "placeholder"], hi = { class: "execution-options" }, gi = ["disabled", "title"], mi = ["disabled"], ki = { class: "muted" }, bi = ["disabled"], vi = {
  class: "directory-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "选择工作区目录"
}, yi = { class: "directory-roots" }, _i = ["disabled", "onClick"], wi = ["disabled"], xi = ["disabled"], Ti = ["disabled"], Si = {
  key: 0,
  class: "error"
}, Ai = { key: 1 }, Ei = {
  key: 2,
  class: "directory-list"
}, Ri = ["onClick"], $i = {
  key: 1,
  class: "muted"
}, Ci = ["disabled"], Li = /* @__PURE__ */ Et({
  __name: "AgentsPage",
  setup(n) {
    const e = (p, f) => Je.value === "en" ? f : p, { confirm: t } = as(), r = Cs(), s = U(localStorage.getItem("0kay.agent.selected") || ""), a = U(""), i = U(""), o = U("all"), b = U("general"), m = U(""), A = U(""), x = U(50);
    function N(p) {
      const f = { off: 0, low: 20, medium: 50, high: 75, max: 100 };
      if (typeof p == "string" && p in f) return f[p];
      const d = Number(p ?? 50);
      return Number.isFinite(d) ? Math.max(0, Math.min(100, d)) : 50;
    }
    const D = U("MOCR"), O = U("normal"), V = U("");
    async function F() {
      if (!(!V.value.trim() || !$.value || P.value)) {
        P.value = !0, S.value = "";
        try {
          const p = await fetch(`/api/agent/workspace?executor_id=${encodeURIComponent($.value.plugin_id)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: w.value.path, name: V.value.trim() }) });
          if (!p.ok) throw new Error(await p.text());
          const f = await p.json();
          V.value = "", await Pe(f.path);
        } catch (p) {
          S.value = p.message;
        } finally {
          P.value = !1;
        }
      }
    }
    const Y = U([]), X = U(!1), L = U(!1), P = U(!1), S = U(""), w = U({ path: "", parent: "", roots: [], directories: [] }), g = U(null), k = U("");
    let R = null, C = 0, te = "", Fe = !1;
    const ke = U(!0);
    function Ue(p = s.value) {
      try {
        localStorage.setItem(`0kay.agent.editor:${p}`, JSON.stringify({ draft: a.value, mode: b.value, ...Kt() }));
      } catch {
      }
    }
    function be() {
      C++, L.value = !1, P.value = !1;
    }
    function Wt(p) {
      p.key === "Escape" && L.value && be();
    }
    function yn(p) {
      p.key === "Enter" && !p.shiftKey && !p.isComposing && p.keyCode !== 229 && (p.preventDefault(), Lt());
    }
    function ht() {
      const p = Ve.value;
      p && (ke.value = p.scrollHeight - p.scrollTop - p.clientHeight < 100);
    }
    async function Pe(p = "") {
      if (!$.value) {
        fe.value = "请先选择在线执行器";
        return;
      }
      const f = ++C;
      te = $.value.plugin_id, L.value = !0, P.value = !0, S.value = "";
      try {
        const d = await fetch(`/api/agent/workspace?${new URLSearchParams({ executor_id: $.value.plugin_id, path: p })}`);
        if (!d.ok) throw new Error(await d.text());
        const M = await d.json();
        f === C && (w.value = M);
      } catch (d) {
        f === C && (S.value = d.message);
      } finally {
        f === C && (P.value = !1);
      }
    }
    function Vt() {
      !$.value || $.value.plugin_id !== te || P.value || S.value || (m.value = $.value.plugin_id, A.value = w.value.path, L.value = !1);
    }
    async function $t() {
      if (!X.value || !$.value || Fe || document.hidden) return;
      Fe = !0;
      const p = $.value.plugin_id;
      try {
        const f = await fetch(`/api/agent/host?executor_id=${encodeURIComponent(p)}`);
        if (!f.ok) throw new Error();
        const d = await f.json();
        $.value?.plugin_id === p && (g.value = d);
      } catch {
        $.value?.plugin_id === p && (g.value = null);
      } finally {
        Fe = !1;
      }
    }
    async function qt() {
      if (!j.value || ae.value || Q.value || j.value.state === "archived") return;
      const p = s.value;
      Q.value = !0, fe.value = "", k.value = "正在压缩上下文…";
      try {
        const f = await fetch("/api/agent/compact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: p }) });
        if (!f.ok) throw new Error(await f.text());
        await f.json(), await r.fetchAgents(), k.value = "上下文已压缩。后续消息使用摘要；原始对话和工具记录仍然保留。", a.value.trim() === "/compact" && (a.value = "");
      } catch (f) {
        fe.value = f.message, k.value = "";
      } finally {
        Q.value = !1;
      }
    }
    const _n = (p) => ({ background: `conic-gradient(var(--md-primary) ${Math.max(0, Math.min(100, p))}%, var(--md-outline-variant) 0)` }), $ = ee(() => m.value ? r.agents.find((p) => p.plugin_id === m.value) : r.agents.find((p) => r.isHealthy(p))), Gt = (p) => p === void 0 ? "—" : `${(p / 1024 ** 3).toFixed(1)} GiB`;
    function Yt() {
      try {
        const p = JSON.parse(localStorage.getItem(`0kay.agent.editor:${s.value}`) || localStorage.getItem(`0kay.agent.options:${s.value}`) || "{}");
        m.value = p.executor_id || "", A.value = p.workdir || "", x.value = N(p.thinking_intensity), D.value = p.model_id || "MOCR", O.value = p.permission_mode === "full_access" ? "full_access" : "normal", a.value = p.draft || "", b.value = p.mode || "general";
      } catch {
        m.value = "", A.value = "", x.value = 50, D.value = "MOCR", a.value = "", b.value = "general";
      }
    }
    async function Zt() {
      try {
        const p = await fetch("/api/models");
        if (!p.ok) throw new Error(`模型目录 HTTP ${p.status}`);
        Y.value = (await p.json()).models || [];
      } catch (p) {
        fe.value = p.message;
      }
    }
    function Kt() {
      const p = x.value === 0 ? "off" : x.value < 35 ? "low" : x.value < 62.5 ? "medium" : x.value < 87.5 ? "high" : "max";
      return { executor_id: m.value, workdir: A.value.trim(), thinking_intensity: p, model_id: D.value, permission_mode: O.value, language: Je.value };
    }
    const Q = U(!1), fe = U(""), De = U(!1), et = U(!1), $e = U([]), H = ee(() => $e.value[$e.value.length - 1] || null), Ve = U(null), j = ee(() => r.sessions.find((p) => p.session_id === s.value)), Be = (p) => p.caller_id !== "webui", ve = ee(() => r.sessions.filter((p) => (et.value ? p.state === "archived" : p.state !== "archived") && (o.value === "all" || (o.value === "life" ? Be(p) : !Be(p))) && (p.prompt || "").toLowerCase().includes(i.value.toLowerCase()))), qe = ee(() => r.tasks.filter((p) => p.kind === "agent" && p.session_id === s.value).sort((p, f) => (p.started_at || "").localeCompare(f.started_at || "") || p.task_id.localeCompare(f.task_id))), ae = ee(() => r.tasks.find((p) => p.session_id === s.value && ["agent", "compact"].includes(p.kind || "") && ["running", "pending"].includes(p.state))), de = (p) => (Je.value === "en" ? { pending: "Queued", running: "Running", done: "Completed", failed: "Failed", cancelled: "Stopped" } : { pending: "等待执行", running: "执行中", done: "完成", failed: "失败", cancelled: "已停止" })[p] || p, Ge = (p) => p ? new Date(p).toLocaleString() : "";
    function tt(p) {
      return r.tasks.filter((f) => f.task_id !== p.task_id && f.session_id === p.session_id && f.parent_id === p.task_id).sort((f, d) => (f.started_at || "").localeCompare(d.started_at || "") || f.task_id.localeCompare(d.task_id));
    }
    function nt(p) {
      return p ? r.tasks.filter((f) => f.task_id !== p.task_id && f.session_id === p.session_id && f.parent_id === p.task_id).sort((f, d) => (f.started_at || "").localeCompare(d.started_at || "") || f.task_id.localeCompare(d.task_id)) : [];
    }
    function Ct(p) {
      const f = [];
      for (const d of tt(p))
        f.push(d), d.kind === "subagent" && f.push(...Ct({ ...d, session_id: p.session_id }));
      return f;
    }
    function Ce(p) {
      $e.value = [...$e.value, p];
    }
    function He() {
      $e.value = $e.value.slice(0, -1);
    }
    function je() {
      $e.value = [];
    }
    function rt(p) {
      if (!p?.result) return "";
      let f = p.result;
      try {
        const d = JSON.parse(f);
        typeof d == "string" ? f = d : d && typeof d.result == "string" && (f = d.result);
      } catch {
      }
      return !f.trim() || nt(p).some((d) => d.kind === "think" && (d.result || "").trim() === f.trim()) ? "" : f;
    }
    function Te(p) {
      return p ? /User denied permission for task/i.test(p) ? e("你拒绝了这次子 Agent 调用", "You denied this sub-agent call") : /User denied permission for (\S+)/i.test(p) ? e(`你拒绝了 ${RegExp.$1} 权限`, `You denied permission for ${RegExp.$1}`) : /Permission request expired/i.test(p) ? e("权限请求已超时", "Permission request expired") : p : "";
    }
    function st(p) {
      return p.kind === "subagent" ? e("子 Agent", "Subagent") : p.kind === "tool" ? e("工具", "Tool") : p.kind === "think" ? e("模型", "Model") : p.kind || e("步骤", "Step");
    }
    function gt(p) {
      return nt(p).length;
    }
    function Ye(p) {
      return Ct(p).some((f) => f.kind === "think" && f.result?.trim() === p.result?.trim());
    }
    async function lt(p) {
      if (!j.value || Q.value || p === "delete" && !await t({
        title: e("删除会话", "Delete session"),
        message: e("永久删除此会话及其中的消息和工具记录？", "Permanently delete this session and its messages and tool records?"),
        confirmLabel: e("永久删除", "Delete"),
        danger: !0
      }))
        return;
      const f = s.value;
      Q.value = !0;
      try {
        Ue(f), await r.manageSession(f, p), p === "delete" && (localStorage.removeItem(`0kay.agent.editor:${f}`), localStorage.removeItem(`0kay.agent.options:${f}`)), p !== "restore" ? (s.value = "", localStorage.removeItem("0kay.agent.selected")) : et.value = !1;
      } catch (d) {
        fe.value = d.message;
      } finally {
        Q.value = !1;
      }
    }
    function at(p) {
      Q.value || (Ue(), s.value = p, De.value = !1, localStorage.setItem("0kay.agent.selected", p));
    }
    async function Xt() {
      Q.value = !0, fe.value = "";
      try {
        const p = await r.createSession("新对话");
        Ue(), s.value = p, localStorage.setItem("0kay.agent.selected", p), De.value = !1, et.value = !1;
      } catch (p) {
        fe.value = p.message;
      } finally {
        Q.value = !1;
      }
    }
    async function Lt() {
      if (a.value.trim() === "/compact") {
        await qt();
        return;
      }
      if (!(!a.value.trim() || Q.value || ae.value || j.value?.state === "archived")) {
        Q.value = !0, fe.value = "";
        try {
          const p = Kt(), f = a.value.trim(), d = b.value;
          if (!j.value) {
            const M = await r.createSession(f.slice(0, 60));
            localStorage.setItem(`0kay.agent.editor:${M}`, JSON.stringify({ ...p, draft: f, mode: d })), s.value = M, localStorage.setItem("0kay.agent.selected", M);
          }
          Ue(), await r.sendTask(s.value, f, d, p), a.value = "", Ue(), ke.value = !0, await ot();
        } catch (p) {
          fe.value = p.message;
        } finally {
          Q.value = !1;
        }
      }
    }
    async function Qt() {
      if (!(!ae.value || ae.value.kind !== "agent"))
        try {
          await r.cancelTask(ae.value.task_id);
        } catch (p) {
          fe.value = p.message;
        }
    }
    async function ot() {
      await dt(), ke.value && Ve.value?.scrollTo({ top: Ve.value.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return Ee(() => r.tasks.filter((p) => p.session_id === s.value).map((p) => `${p.task_id}:${p.state}:${p.result?.length}`).join("|"), ot), Ee(s, () => {
      ke.value = !0, ot(), be(), je(), fe.value = "";
    }), Ee(s, Yt), Ee(m, () => {
      g.value = null, A.value = "", be(), $t();
    }, { flush: "sync" }), Ee(X, $t), Ee(s, () => {
      k.value = "";
    }), bn(() => {
      ma(), r.connect(), Yt(), Zt(), R = setInterval($t, 5e3), window.addEventListener("keydown", Wt);
    }), vn(() => {
      Ue(), be(), r.disconnect(), R && clearInterval(R), window.removeEventListener("keydown", Wt);
    }), (p, f) => (v(), y(ne, null, [
      c("main", to, [
        c("aside", no, [
          c("header", null, [
            f[18] || (f[18] = c("h1", null, "Agent", -1)),
            c("button", {
              onClick: Xt,
              disabled: Q.value,
              title: e("新建会话", "New session")
            }, "＋ " + h(e("新对话", "New chat")), 9, ro)
          ]),
          c("div", so, [
            c("i", {
              class: se({ online: J(r).onlineCount > 0 })
            }, null, 2),
            ze(h(J(r).onlineCount) + " " + h(e("个执行器在线", "executors online")) + " ", 1),
            c("button", {
              onClick: f[0] || (f[0] = (d) => J(r).fetchAgents()),
              title: e("刷新", "Refresh")
            }, "↻", 8, lo)
          ]),
          on(c("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (d) => i.value = d),
            placeholder: e("搜索会话…", "Search sessions…"),
            "aria-label": e("搜索会话", "Search sessions")
          }, null, 8, ao), [
            [Ln, i.value]
          ]),
          c("nav", oo, [
            (v(!0), y(ne, null, me([{ id: "all", label: e("全部", "All") }, { id: "life", label: e("LIFE 发起", "From LIFE") }, { id: "user", label: e("我的对话", "My chats") }], (d) => (v(), y("button", {
              key: d.id,
              class: se({ chosen: o.value === d.id }),
              onClick: (M) => o.value = d.id
            }, h(d.label), 11, io))), 128))
          ]),
          c("label", uo, [
            on(c("input", {
              "onUpdate:modelValue": f[2] || (f[2] = (d) => et.value = d),
              type: "checkbox"
            }, null, 512), [
              [Es, et.value]
            ]),
            ze(" " + h(e("显示已归档会话", "Show archived sessions")), 1)
          ]),
          c("div", co, [
            (v(!0), y(ne, null, me(ve.value, (d) => (v(), y("button", {
              key: d.task_id,
              class: se(["session-card", { selected: s.value === d.session_id && !De.value }]),
              disabled: Q.value,
              onClick: (M) => at(d.session_id)
            }, [
              c("span", fo, h(Be(d) ? "LIFE → Agent" : e("你 ↔ Agent", "You ↔ Agent")), 1),
              c("strong", null, h(d.prompt || "未命名会话"), 1),
              c("small", null, h(Ge(d.started_at)), 1)
            ], 10, po))), 128)),
            ve.value.length ? z("", !0) : (v(), y("p", ho, h(e("暂无会话。直接发送消息，或等待 LIFE 委派工作。", "No sessions yet. Send a message or wait for LIFE to delegate work.")), 1))
          ]),
          c("button", {
            class: se(["ledger-button", { chosen: De.value }]),
            onClick: f[3] || (f[3] = (d) => De.value = !0)
          }, h(e("全部任务记录", "All task records")) + " · " + h(J(r).tasks.length), 3)
        ]),
        De.value ? (v(), y("section", go, [
          c("header", null, [
            c("h2", null, h(e("全部任务记录", "All task records")), 1),
            c("button", {
              onClick: f[4] || (f[4] = (d) => De.value = !1)
            }, h(e("返回会话", "Back to chat")), 1)
          ]),
          c("p", mo, h(e("包括 LIFE 对话、模型调用、Agent 执行及工具活动。", "LIFE conversations, model calls, Agent execution and tool activity.")), 1),
          (v(!0), y(ne, null, me(J(r).tasks, (d) => (v(), y("article", {
            key: d.task_id,
            class: "ledger-entry"
          }, [
            c("div", null, [
              c("span", null, h(d.kind || "agent"), 1),
              c("span", {
                class: se(d.state)
              }, h(de(d.state)), 3),
              c("small", null, h(Ge(d.started_at)), 1)
            ]),
            c("p", null, h(d.prompt), 1),
            J(r).sessions.some((M) => M.session_id === d.session_id) ? (v(), y("button", {
              key: 0,
              onClick: (M) => at(d.session_id)
            }, "打开所属会话", 8, ko)) : z("", !0),
            c("details", null, [
              f[19] || (f[19] = c("summary", null, "详情", -1)),
              c("code", null, h(d.task_id), 1),
              c("pre", null, h(d.result || d.error || "等待结果"), 1)
            ])
          ]))), 128))
        ])) : (v(), y("section", bo, [
          c("header", vo, [
            c("div", null, [
              c("h2", null, h(j.value?.prompt || "与 Agent 对话"), 1),
              c("p", null, h(j.value && Be(j.value) ? "LIFE 发起的工作会话 · 你可以查看过程，也可以直接继续对话" : "持续对话 · 编程、调研与工具执行"), 1)
            ]),
            ae.value ? (v(), y("span", yo, "正在执行")) : z("", !0),
            j.value ? (v(), y("div", _o, [
              c("button", {
                disabled: !!ae.value,
                onClick: f[5] || (f[5] = (d) => lt(j.value.state === "archived" ? "restore" : "archive"))
              }, h(j.value.state === "archived" ? "恢复" : "归档"), 9, wo),
              c("button", {
                disabled: !!ae.value,
                onClick: f[6] || (f[6] = (d) => lt("delete"))
              }, "删除", 8, xo)
            ])) : z("", !0)
          ]),
          fe.value || J(r).error ? (v(), y("div", To, h(fe.value || J(r).error), 1)) : z("", !0),
          X.value ? (v(), y("section", So, [
            $.value ? (v(), y(ne, { key: 0 }, [
              c("strong", null, h($.value.host?.hostname || $.value.name), 1),
              c("span", {
                class: se(J(r).isHealthy($.value) ? "done" : "failed")
              }, h(J(r).isHealthy($.value) ? "在线" : "离线"), 3),
              c("div", Ao, [
                (v(!0), y(ne, null, me([{ label: "CPU 占用", value: g.value?.cpu_percent }, { label: "内存占用", value: g.value?.memory_percent }], (d) => (v(), y("div", {
                  key: d.label,
                  class: "usage-metric"
                }, [
                  c("div", {
                    class: "usage-ring",
                    style: Ut(_n(d.value || 0))
                  }, [
                    c("b", null, h(d.value === void 0 ? "—" : `${d.value.toFixed(1)}%`), 1)
                  ], 4),
                  c("span", null, h(d.label), 1)
                ]))), 128)),
                c("small", null, h(g.value ? `采样时间：${Ge(g.value.sampled_at)}` : "等待宿主机实时采样"), 1)
              ]),
              c("dl", null, [
                c("div", null, [
                  f[20] || (f[20] = c("dt", null, "执行器地址", -1)),
                  c("dd", null, h($.value.address), 1)
                ]),
                c("div", null, [
                  f[21] || (f[21] = c("dt", null, "系统 / 架构", -1)),
                  c("dd", null, h($.value.host?.os || "—") + " / " + h($.value.host?.arch || "—"), 1)
                ]),
                c("div", null, [
                  f[22] || (f[22] = c("dt", null, "CPU", -1)),
                  c("dd", null, h($.value.host?.cpu_model || "—") + " · " + h($.value.host?.cpu_cores || "—") + " 核", 1)
                ]),
                c("div", null, [
                  f[23] || (f[23] = c("dt", null, "可用 / 总内存", -1)),
                  c("dd", null, h(Gt($.value.host?.memory_available_bytes)) + " / " + h(Gt($.value.host?.memory_total_bytes)), 1)
                ]),
                c("div", null, [
                  f[24] || (f[24] = c("dt", null, "活跃任务", -1)),
                  c("dd", null, h($.value.active_tasks), 1)
                ]),
                c("div", null, [
                  f[25] || (f[25] = c("dt", null, "距上次心跳", -1)),
                  c("dd", null, h($.value.last_heartbeat_age_seconds) + " 秒", 1)
                ]),
                c("div", null, [
                  f[26] || (f[26] = c("dt", null, "默认工作目录", -1)),
                  c("dd", null, h($.value.host?.workdir || "—"), 1)
                ])
              ])
            ], 64)) : (v(), y("p", Eo, "没有可用的执行器宿主机信息。"))
          ])) : z("", !0),
          c("div", {
            ref_key: "transcript",
            ref: Ve,
            class: "transcript",
            onScrollPassive: ht
          }, [
            H.value ? (v(), y("div", Ro, [
              c("header", $o, [
                c("button", {
                  type: "button",
                  onClick: He
                }, "← " + h($e.value.length > 1 ? e("返回上一层", "Back one level") : e("返回会话", "Back to chat")), 1),
                c("div", null, [
                  c("h3", null, h(e("子 Agent", "Subagent")), 1),
                  c("p", Co, h(H.value.prompt), 1)
                ]),
                c("span", {
                  class: se(H.value.state)
                }, h(de(H.value.state)), 3)
              ]),
              c("div", Lo, [
                c("div", Io, [
                  c("div", Oo, [
                    c("b", null, h(e("父 Agent", "Parent agent")), 1),
                    c("time", null, h(Ge(H.value.started_at)), 1)
                  ]),
                  c("div", Po, h(H.value.prompt), 1)
                ]),
                (v(!0), y(ne, null, me(nt(H.value), (d) => (v(), y(ne, {
                  key: d.task_id
                }, [
                  d.kind === "think" && (d.result || d.state === "running" || d.error) ? (v(), y("div", Do, [
                    d.prompt ? (v(), y("small", No, h(d.prompt), 1)) : z("", !0),
                    d.result ? (v(), y(ne, { key: 1 }, [
                      Le(dn, {
                        content: d.result
                      }, null, 8, ["content"]),
                      d.state === "running" ? (v(), y("span", Mo, " ▍")) : z("", !0)
                    ], 64)) : d.state === "running" ? (v(), y("small", zo, h(e("子 Agent 正在生成回复…", "Subagent is drafting a reply…")), 1)) : z("", !0),
                    d.error ? (v(), y("p", Fo, h(Te(d.error)), 1)) : z("", !0)
                  ])) : d.kind === "subagent" ? (v(), y("div", Uo, [
                    c("button", {
                      type: "button",
                      class: "subagent-card-head",
                      onClick: (M) => Ce(d)
                    }, [
                      c("span", {
                        class: se(d.state)
                      }, "●", 2),
                      c("strong", null, h(e("子 Agent", "Subagent")), 1),
                      c("span", Ho, h(d.prompt), 1),
                      c("small", null, h(de(d.state)), 1),
                      f[27] || (f[27] = c("span", {
                        class: "subagent-chevron",
                        "aria-hidden": "true"
                      }, "▸", -1))
                    ], 8, Bo)
                  ])) : d.kind === "tool" ? (v(), St(Hr, {
                    key: 2,
                    step: d,
                    "format-error": Te
                  }, null, 8, ["step"])) : d.kind !== "think" ? (v(), y("details", jo, [
                    c("summary", null, [
                      c("span", {
                        class: se(d.state)
                      }, "●", 2),
                      ze(" " + h(st(d)) + " · " + h(d.prompt) + " ", 1),
                      c("small", null, h(de(d.state)), 1)
                    ]),
                    c("pre", null, h(d.result || d.error || (d.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                  ])) : z("", !0)
                ], 64))), 128)),
                rt(H.value) ? (v(), y("div", Wo, [
                  Le(dn, {
                    content: rt(H.value)
                  }, null, 8, ["content"])
                ])) : z("", !0),
                H.value.error ? (v(), y("p", Vo, h(Te(H.value.error)), 1)) : z("", !0),
                !nt(H.value).length && !rt(H.value) && !H.value.error ? (v(), y("p", qo, h(H.value.state === "running" ? e("子 Agent 正在执行…", "Subagent is running…") : e("没有子步骤记录", "No child steps recorded")), 1)) : z("", !0)
              ])
            ])) : (v(), y(ne, { key: 1 }, [
              qe.value.length ? z("", !0) : (v(), y("div", Go, [...f[28] || (f[28] = [
                c("h2", null, "想让 Agent 帮你做什么？", -1),
                c("p", null, "直接描述目标，Agent 会在这个会话里回复并使用工具完成工作。", -1),
                c("p", null, "左侧的「LIFE 发起」会话可以查看 LIFE 与 Agent 的交流，也支持你继续提问。", -1)
              ])])),
              (v(!0), y(ne, null, me(qe.value, (d) => (v(), y("article", {
                key: d.task_id,
                class: "turn"
              }, [
                c("div", Yo, [
                  c("div", Zo, [
                    c("b", null, h(Be(d) ? "LIFE" : "你"), 1),
                    c("time", null, h(Ge(d.started_at)), 1)
                  ]),
                  c("div", Ko, h(d.prompt?.replace(/^\[thinking_intensity=\w+\]\s*/, "")), 1)
                ]),
                c("div", Xo, [
                  c("div", Qo, [
                    f[29] || (f[29] = c("b", null, "Agent", -1)),
                    c("span", {
                      class: se(d.state)
                    }, h(de(d.state)), 3)
                  ]),
                  tt(d).length ? (v(), y("div", Jo, [
                    (v(!0), y(ne, null, me(tt(d), (M) => (v(), y(ne, {
                      key: M.task_id
                    }, [
                      M.kind === "think" && (M.result || M.state === "running" || M.error) ? (v(), y("div", ei, [
                        M.prompt ? (v(), y("small", ti, h(M.prompt), 1)) : z("", !0),
                        M.result ? (v(), y(ne, { key: 1 }, [
                          Le(dn, {
                            content: M.result
                          }, null, 8, ["content"]),
                          M.state === "running" ? (v(), y("span", ni, " ▍")) : z("", !0)
                        ], 64)) : M.state === "running" ? (v(), y("small", ri, "Agent 正在生成回复…")) : z("", !0),
                        M.error ? (v(), y("p", si, h(Te(M.error)), 1)) : z("", !0)
                      ])) : M.kind === "subagent" ? (v(), y("div", li, [
                        c("button", {
                          type: "button",
                          class: "subagent-card-head",
                          onClick: (wn) => Ce(M)
                        }, [
                          c("span", {
                            class: se(M.state)
                          }, "●", 2),
                          c("strong", null, h(e("子 Agent", "Subagent")), 1),
                          c("span", oi, h(M.prompt), 1),
                          c("small", null, [
                            ze(h(de(M.state)), 1),
                            gt(M) ? (v(), y(ne, { key: 0 }, [
                              ze(" · " + h(gt(M)) + " " + h(e("步", "steps")), 1)
                            ], 64)) : z("", !0)
                          ]),
                          f[30] || (f[30] = c("span", {
                            class: "subagent-chevron",
                            "aria-hidden": "true"
                          }, "▸", -1))
                        ], 8, ai),
                        M.error ? (v(), y("p", ii, h(Te(M.error)), 1)) : z("", !0)
                      ])) : M.kind === "tool" ? (v(), St(Hr, {
                        key: 2,
                        step: M,
                        "format-error": Te
                      }, null, 8, ["step"])) : M.kind !== "think" ? (v(), y("details", ui, [
                        c("summary", null, [
                          c("span", {
                            class: se(M.state)
                          }, "●", 2),
                          ze(" " + h(st(M)) + " · " + h(M.prompt) + " ", 1),
                          c("small", null, h(de(M.state)), 1)
                        ]),
                        c("pre", null, h(M.result || M.error || (M.state === "running" ? "执行中…" : "执行完成，无输出")), 1)
                      ])) : z("", !0)
                    ], 64))), 128))
                  ])) : z("", !0),
                  d.result && !Ye(d) ? (v(), St(dn, {
                    key: 1,
                    content: d.result
                  }, null, 8, ["content"])) : z("", !0),
                  d.error ? (v(), y("div", ci, h(Te(d.error)), 1)) : z("", !0),
                  ["running", "pending"].includes(d.state) ? (v(), y("p", di, "Agent 正在处理，执行过程会自动更新…")) : z("", !0)
                ])
              ]))), 128))
            ], 64))
          ], 544),
          H.value ? z("", !0) : (v(), y("form", {
            key: 2,
            class: "composer",
            onSubmit: Re(Lt, ["prevent"])
          }, [
            k.value ? (v(), y("div", pi, h(k.value), 1)) : z("", !0),
            on(c("textarea", {
              "onUpdate:modelValue": f[7] || (f[7] = (d) => a.value = d),
              disabled: Q.value || j.value?.state === "archived",
              placeholder: j.value?.state === "archived" ? "恢复会话后可以继续对话" : "给 Agent 发消息…（Enter 发送，Shift+Enter 换行）",
              "aria-label": "给 Agent 发消息",
              onKeydown: yn
            }, null, 40, fi), [
              [Ln, a.value]
            ]),
            c("div", hi, [
              c("label", null, [
                ze(h(e("权限", "Permissions")), 1),
                Le(pn, {
                  modelValue: O.value,
                  "onUpdate:modelValue": f[8] || (f[8] = (d) => O.value = d),
                  "aria-label": e("权限", "Permissions"),
                  disabled: !!ae.value || Q.value,
                  options: [{ value: "normal", label: e("Normal · 全部审批", "Normal · Ask every time") }, { value: "full_access", label: e("Full access · 自动执行", "Full access · Auto execute") }]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              c("label", null, [
                ze(h(e("执行器", "Executor")), 1),
                Le(pn, {
                  modelValue: m.value,
                  "onUpdate:modelValue": f[9] || (f[9] = (d) => m.value = d),
                  "aria-label": e("执行器", "Executor"),
                  disabled: !!ae.value || Q.value,
                  options: [{ value: "", label: e("自动选择在线执行器", "Automatic executor") }, ...J(r).agents.map((d) => ({ value: d.plugin_id, label: `${d.host?.hostname || d.name} · ${d.plugin_id}`, disabled: !J(r).isHealthy(d) }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ]),
              c("label", null, [
                ze(h(e("工作区", "Workspace")), 1),
                c("button", {
                  type: "button",
                  class: "workspace-select",
                  disabled: !!ae.value || Q.value || !$.value,
                  title: A.value || $.value?.host?.workdir,
                  onClick: f[10] || (f[10] = (d) => Pe(A.value || $.value?.host?.workdir || ""))
                }, "📁 " + h(A.value || e("选择目录…", "Select folder…")), 9, gi)
              ]),
              Le(Ja, {
                modelValue: x.value,
                "onUpdate:modelValue": f[11] || (f[11] = (d) => x.value = d),
                disabled: !!ae.value || Q.value
              }, null, 8, ["modelValue", "disabled"]),
              c("label", null, [
                ze(h(e("模型", "Model")), 1),
                Le(pn, {
                  modelValue: D.value,
                  "onUpdate:modelValue": f[12] || (f[12] = (d) => D.value = d),
                  "aria-label": e("模型", "Model"),
                  disabled: !!ae.value || Q.value,
                  onOpen: Zt,
                  options: [{ value: "MOCR", label: e("MOCR · 自动选型", "MOCR · Automatic") }, ...Y.value.map((d) => ({ value: d.id, label: `${d.id} · ${d.provider}` }))]
                }, null, 8, ["modelValue", "aria-label", "disabled", "options"])
              ])
            ]),
            c("footer", null, [
              Le(pn, {
                modelValue: b.value,
                "onUpdate:modelValue": f[13] || (f[13] = (d) => b.value = d),
                disabled: Q.value,
                "aria-label": e("Agent 模式", "Agent mode"),
                options: [{ value: "general", label: e("通用 Agent", "General Agent") }, { value: "code", label: e("编程 Agent", "Coding Agent") }, { value: "research", label: e("调研 Agent", "Research Agent") }]
              }, null, 8, ["modelValue", "disabled", "aria-label", "options"]),
              c("button", {
                type: "button",
                onClick: f[14] || (f[14] = (d) => X.value = !X.value)
              }, h(e("宿主机", "Host")), 1),
              c("button", {
                type: "button",
                disabled: !j.value || !!ae.value || Q.value || j.value.state === "archived",
                onClick: qt
              }, "/compact", 8, mi),
              c("span", ki, h(ae.value?.kind === "compact" ? e("上下文压缩中…", "Compacting…") : J(r).onlineCount ? e("在当前会话中继续", "Continue this session") : e("执行器离线", "Executor offline")), 1),
              ae.value?.kind === "agent" ? (v(), y("button", {
                key: 0,
                type: "button",
                onClick: Qt
              }, h(e("停止", "Stop")), 1)) : (v(), y("button", {
                key: 1,
                type: "submit",
                disabled: Q.value || !!ae.value || !a.value.trim() || j.value?.state === "archived"
              }, h(Q.value ? e("处理中…", "Processing…") : e("发送 ↑", "Send ↑")), 9, bi))
            ])
          ], 32))
        ])),
        L.value ? (v(), y("div", {
          key: 2,
          class: "directory-backdrop",
          onClick: Re(be, ["self"])
        }, [
          c("section", vi, [
            c("header", null, [
              c("h2", null, "选择 " + h($.value?.host?.hostname || "执行器") + " 的工作区", 1),
              c("button", { onClick: be }, "关闭")
            ]),
            c("div", yi, [
              (v(!0), y(ne, null, me(w.value.roots, (d) => (v(), y("button", {
                key: d,
                disabled: P.value,
                onClick: (M) => Pe(d)
              }, h(d), 9, _i))), 128)),
              c("button", {
                disabled: P.value,
                onClick: f[15] || (f[15] = (d) => Pe($.value?.host?.workdir || ""))
              }, "默认目录", 8, wi)
            ]),
            c("code", null, h(w.value.path), 1),
            c("form", {
              class: "new-folder",
              onSubmit: Re(F, ["prevent"])
            }, [
              on(c("input", {
                "onUpdate:modelValue": f[16] || (f[16] = (d) => V.value = d),
                placeholder: "新文件夹名称",
                "aria-label": "新文件夹名称",
                disabled: P.value
              }, null, 8, xi), [
                [Ln, V.value]
              ]),
              c("button", {
                disabled: P.value || !V.value.trim() || !w.value.path
              }, "新建文件夹", 8, Ti)
            ], 32),
            S.value ? (v(), y("p", Si, h(S.value), 1)) : z("", !0),
            P.value ? (v(), y("p", Ai, "正在读取目录…")) : (v(), y("div", Ei, [
              w.value.parent !== w.value.path ? (v(), y("button", {
                key: 0,
                onClick: f[17] || (f[17] = (d) => Pe(w.value.parent))
              }, "↰ 上一级")) : z("", !0),
              (v(!0), y(ne, null, me(w.value.directories, (d) => (v(), y("button", {
                key: d.path,
                onClick: (M) => Pe(d.path)
              }, "📁 " + h(d.name), 9, Ri))), 128)),
              w.value.directories.length ? z("", !0) : (v(), y("p", $i, "没有子目录"))
            ])),
            c("footer", null, [
              c("button", {
                disabled: P.value || !!S.value || !w.value.path,
                onClick: Vt
              }, "选择当前目录", 8, Ci)
            ])
          ])
        ])) : z("", !0)
      ]),
      Le(eo)
    ], 64));
  }
}), Pi = /* @__PURE__ */ Qn(Li, [["__scopeId", "data-v-763e8863"]]);
export {
  Pi as default
};

;(()=>{if(typeof document!=='undefined'&&!document.getElementById('agent-plugin-style')){const s=document.createElement('style');s.id='agent-plugin-style';s.textContent=".markdown-content[data-v-ef377647]{line-height:1.75;overflow-wrap:anywhere;font-size:14px}.markdown-content[data-v-ef377647] pre{padding:16px;background:var(--md-surface-container);border-radius:8px;overflow:auto;white-space:pre;line-height:1.5}.markdown-content[data-v-ef377647] code{font-family:monospace;background:var(--md-surface-container);padding:2px 4px;border-radius:4px}.markdown-content[data-v-ef377647] pre code{padding:0;background:none}.markdown-content[data-v-ef377647] table{display:block;overflow:auto;border-collapse:collapse;margin:12px 0}.markdown-content[data-v-ef377647] th,.markdown-content[data-v-ef377647] td{border:1px solid var(--md-outline-variant);padding:8px 12px}.markdown-content[data-v-ef377647] blockquote{border-left:3px solid var(--md-outline);margin:12px 0;padding-left:14px;color:var(--md-on-surface-variant)}.markdown-content[data-v-ef377647] ul,.markdown-content[data-v-ef377647] ol{padding-left:24px}.markdown-content[data-v-ef377647] a{color:var(--md-primary);text-decoration:underline}.markdown-content[data-v-ef377647] img{max-width:100%}.markdown-content[data-v-ef377647] h1,.markdown-content[data-v-ef377647] h2,.markdown-content[data-v-ef377647] h3{margin:16px 0 8px}.tool-card[data-v-ee8cf02b]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container);margin:8px 0;overflow:hidden}button.tool-card-head[data-v-ee8cf02b]{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:none;border-radius:0;background:transparent;padding:10px 12px;cursor:pointer;font-size:12px}button.tool-card-head[data-v-ee8cf02b]:hover{background:var(--md-secondary-container)}.tool-kind[data-v-ee8cf02b]{flex-shrink:0;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--md-on-surface-variant)}.tool-summary[data-v-ee8cf02b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace;font-size:11.5px}.tool-stat[data-v-ee8cf02b]{flex-shrink:0;font-size:11px;font-weight:600;color:var(--md-primary);border:1px solid var(--md-outline-variant);border-radius:999px;padding:1px 8px}.tool-state[data-v-ee8cf02b]{flex-shrink:0;font-size:11px;color:var(--md-on-surface-variant)}.tool-chevron[data-v-ee8cf02b]{flex-shrink:0;color:var(--md-on-surface-variant);font-size:11px;transition:transform .15s}.tool-card.expanded .tool-chevron[data-v-ee8cf02b]{transform:rotate(90deg)}.tool-dot[data-v-ee8cf02b]{font-size:9px}.tool-dot.running[data-v-ee8cf02b],.tool-dot.pending[data-v-ee8cf02b]{color:#b88412}.tool-dot.failed[data-v-ee8cf02b]{color:var(--md-error,#c44)}.tool-dot.done[data-v-ee8cf02b]{color:#3a6}.tool-dot.cancelled[data-v-ee8cf02b]{color:var(--md-on-surface-variant)}.tool-card-body[data-v-ee8cf02b]{padding:4px 12px 12px;border-top:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}.tool-section-label[data-v-ee8cf02b]{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--md-on-surface-variant);margin-top:4px}.tool-card-body pre[data-v-ee8cf02b]{margin:0;max-height:340px;overflow:auto;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.tool-section-text[data-v-ee8cf02b]{margin:0;font-size:12.5px;overflow-wrap:anywhere}.tool-error[data-v-ee8cf02b]{background:var(--md-error-container);padding:8px 12px;border-radius:8px;margin:0;font-size:12px;overflow-wrap:anywhere}.muted[data-v-ee8cf02b]{font-size:12px;color:var(--md-on-surface-variant);margin:0}.tool-dialog-backdrop[data-v-ee8cf02b]{position:fixed;inset:0;background:#0008;z-index:1050;display:grid;place-items:center;padding:20px}.tool-dialog[data-v-ee8cf02b]{background:var(--md-surface);color:var(--md-on-surface);border:1px solid var(--md-outline-variant);border-radius:16px;padding:18px 20px;width:min(680px,100%);max-height:82vh;overflow:auto;display:flex;flex-direction:column;gap:12px}.tool-dialog header[data-v-ee8cf02b]{display:flex;align-items:center;justify-content:space-between;gap:12px}.tool-dialog h4[data-v-ee8cf02b]{margin:0;font-size:15px;overflow-wrap:anywhere;flex:1;min-width:0}#app .tool-dialog-close[data-v-ee8cf02b],.tool-dialog-close[data-v-ee8cf02b]{flex-shrink:0;width:40px;height:40px;min-height:0;padding:0;border:none;border-radius:50%;background:transparent;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background var(--transition-fast),color var(--transition-fast)}#app .tool-dialog-close[data-v-ee8cf02b]:hover,.tool-dialog-close[data-v-ee8cf02b]:hover{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent);box-shadow:none;filter:none;color:var(--md-on-surface)}#app .tool-dialog-close[data-v-ee8cf02b]:active,.tool-dialog-close[data-v-ee8cf02b]:active{background:color-mix(in srgb,var(--md-on-surface) 12%,transparent);border-radius:50%}.tool-search-results[data-v-ee8cf02b]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}.tool-search-results a[data-v-ee8cf02b]{color:var(--md-primary);font-size:14px;font-weight:500;text-decoration:none}.tool-search-results a[data-v-ee8cf02b]:hover{text-decoration:underline}.tool-search-results p[data-v-ee8cf02b]{margin:4px 0 0;font-size:12.5px;line-height:1.65;color:var(--md-on-surface)}.tool-search-results small[data-v-ee8cf02b]{display:block;margin-top:2px;font-size:11px;color:var(--md-on-surface-variant);overflow-wrap:anywhere}#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:44px;background:transparent}#app .app-select .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:38px;padding:9px 12px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-low);color:var(--md-on-surface);font:inherit;text-align:left;cursor:pointer;box-shadow:none}#app .app-select.input .app-select-trigger{min-height:46px;font-size:14px}#app .app-select .app-select-trigger:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-trigger>svg{flex-shrink:0;transition:transform .16s}.app-select-trigger>svg.is-open{transform:rotate(180deg)}.app-select-menu{z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:5px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);box-shadow:0 8px 30px #16244026;font-family:var(--font-family);font-size:13px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;min-height:38px;border-radius:7px;cursor:pointer;overflow-wrap:anywhere;line-height:1.45}.app-select-option>span{min-width:0}.app-select-option>svg{flex-shrink:0;color:var(--md-primary)}.app-select-option.highlighted{background:var(--md-surface-container)}.app-select-option.selected{color:var(--md-primary);font-weight:600}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:14px;color:var(--md-on-surface-variant)}.select-menu-enter-active,.select-menu-leave-active{transition:opacity .13s,transform .13s}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:scaleY(.97) translateY(-3px)}.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:11px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:11px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:11px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost .85s ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave .85s ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}to{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{0%{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity .13s,transform .13s}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media (prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}.thinking-popover{padding:20px;border-radius:28px;background:var(--md-surface-container-low);border-color:transparent;box-shadow:0 8px 28px #24345d24}.thinking-popover header{align-items:center;font-size:14px;min-height:30px}.thinking-popover output{padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}.thinking-track{height:68px;padding:0;margin:12px 0 0;isolation:isolate}.thinking-capsule{position:absolute;left:5px;right:5px;height:28px;border-radius:999px;background:var(--md-primary-container);overflow:hidden;pointer-events:none}.thinking-fill{height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}.thinking-tick{position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}.thinking-tick:first-of-type{left:8px!important}.thinking-tick:last-of-type{left:calc(100% - 8px)!important}.thinking-tick.passed{background:var(--md-on-primary)}.thinking-track input{position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y}.thinking-track input::-webkit-slider-runnable-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-webkit-slider-thumb{width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);transition:width .14s,height .14s,margin-top .14s}.thinking-track input:active::-webkit-slider-thumb{width:6px;height:48px;margin-top:-10px}.thinking-track input::-moz-range-track{height:28px;background:transparent;border-radius:999px}.thinking-track input::-moz-range-thumb{width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}.thinking-track input:active::-moz-range-thumb{width:6px;height:48px}.thinking-track input:focus-visible{outline-offset:3px}.thinking-stops{align-items:center;gap:2px;margin-top:2px}.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color .16s,color .16s}.thinking-popover.full{background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}.thinking-popover.full .thinking-fill{background:linear-gradient(90deg,#7255c8,#ad50d6)}.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}.thinking-popover p{margin-top:12px}.confirm-scrim{position:fixed;inset:0;z-index:13000;background:#21173566;backdrop-filter:blur(6px);display:grid;place-items:center;padding:20px}.confirm-dialog{width:min(440px,100%);background:var(--md-surface-container-high, var(--md-surface, #fff));color:var(--md-on-surface);border:1px solid var(--md-outline-variant, transparent);border-radius:28px;padding:28px;box-shadow:0 24px 70px #18132d33;outline:none}.confirm-dialog h2{margin:0 0 10px;font-size:22px;font-weight:650}.confirm-dialog p{margin:0;font-size:14px;line-height:1.65;color:var(--md-on-surface-variant);overflow-wrap:anywhere}.confirm-dialog footer{display:flex;justify-content:flex-end;gap:12px;margin-top:24px}.confirm-dialog footer button{border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;cursor:pointer;background:var(--md-secondary-container, #e7e0ec);color:var(--md-on-secondary-container, #1d1b20)}.confirm-dialog footer .confirm-primary{background:var(--md-primary, #6750a4);color:var(--md-on-primary, #fff)}.confirm-dialog footer .confirm-primary.danger{background:var(--md-error, #b3261e);color:var(--md-on-error, #fff)}.confirm-dialog footer button:focus-visible{outline:3px solid var(--md-primary);outline-offset:3px}.workspace[data-v-763e8863]{display:flex;height:100%;min-height:0;background:var(--md-surface);color:var(--md-on-surface)}button[data-v-763e8863],input[data-v-763e8863],textarea[data-v-763e8863],select[data-v-763e8863]{font:inherit;color:inherit;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);padding:9px 12px}button[data-v-763e8863]{cursor:pointer;transition:background .15s,box-shadow .15s,filter .15s}button[data-v-763e8863]:disabled{opacity:.45;cursor:default}button[data-v-763e8863]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}input[data-v-763e8863]:focus,textarea[data-v-763e8863]:focus,select[data-v-763e8863]:focus{outline:none;border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}input[type=checkbox][data-v-763e8863]{width:auto;accent-color:var(--md-primary)}.sessions[data-v-763e8863]{width:284px;flex-shrink:0;border-right:1px solid var(--md-outline-variant);padding:20px 16px;display:flex;flex-direction:column;gap:14px;background:var(--md-surface-container-low)}.sessions header[data-v-763e8863]{display:flex;align-items:center;justify-content:space-between;gap:12px}.sessions h1[data-v-763e8863]{font-size:22px;font-weight:650;letter-spacing:-.01em;margin:0}.sessions header>button[data-v-763e8863]{height:34px;padding:0 13px;border:0;border-radius:9px;background:var(--md-primary);color:var(--md-on-primary,#fff);font:600 13px/1 inherit}.sessions header>button[data-v-763e8863]:hover:not(:disabled){background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.sessions>input[data-v-763e8863]{border-radius:10px;background:var(--md-surface-container-lowest)}.connection[data-v-763e8863]{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant)}.connection button[data-v-763e8863]{margin-left:auto;padding:3px 9px;border-radius:8px;font-size:13px}.connection i[data-v-763e8863]{width:8px;height:8px;border-radius:50%;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}.connection i.online[data-v-763e8863]{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}.filter-bar[data-v-763e8863]{display:flex;gap:3px;padding:4px;border-radius:999px;background:var(--md-surface-container-high)}.filter-bar button[data-v-763e8863]{flex:1;font-size:12px;font-weight:500;padding:7px 4px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);box-shadow:none}.filter-bar button[data-v-763e8863]:hover:not(:disabled){background:transparent;color:var(--md-on-surface)}.filter-bar button.chosen[data-v-763e8863]{background:var(--md-surface-container-lowest);color:var(--md-primary);font-weight:650;box-shadow:var(--shadow-1)}.sessions label input[data-v-763e8863]{margin-right:6px}.session-list[data-v-763e8863]{overflow-y:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px}.session-card[data-v-763e8863]{display:flex;flex-direction:column;width:100%;text-align:left;gap:6px;margin-bottom:8px;padding:12px 13px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest)}.session-card[data-v-763e8863]:hover:not(:disabled){background:var(--md-surface-container-lowest);border-color:color-mix(in srgb,var(--md-primary) 40%,var(--md-outline-variant));box-shadow:var(--shadow-1)}.session-card.selected[data-v-763e8863]{background:var(--md-secondary-container);border-color:transparent;border-radius:12px 12px 12px 4px}.session-card.selected[data-v-763e8863]:hover{background:var(--md-secondary-container)}.session-card strong[data-v-763e8863]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-weight:600;font-size:13.5px}.origin[data-v-763e8863],small[data-v-763e8863],.sessions .muted[data-v-763e8863]{font-size:11px;color:var(--md-on-surface-variant)}.origin[data-v-763e8863]{font-weight:600;letter-spacing:.02em}.ledger-button[data-v-763e8863]{text-align:left;border-radius:10px;background:var(--md-surface-container-lowest);font-size:12.5px;font-weight:550}.ledger-button.chosen[data-v-763e8863]{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.ledger[data-v-763e8863]{flex:1;overflow-y:auto;padding:var(--space-xl)}.ledger>header[data-v-763e8863]{margin-bottom:8px}.ledger>header h2[data-v-763e8863]{font-size:18px;font-weight:650}.ledger-entry[data-v-763e8863]{border:1px solid var(--md-outline-variant);border-radius:14px;background:var(--md-surface-container-lowest);padding:14px 16px;margin:10px 0;box-shadow:var(--shadow-1)}.ledger-entry>div[data-v-763e8863]{display:flex;align-items:center;gap:10px;font-size:12px}.ledger-entry>div>span[data-v-763e8863]:first-child{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 8px;border-radius:6px;font-weight:600}.ledger-entry>div small[data-v-763e8863]{margin-left:auto}.ledger-entry>p[data-v-763e8863]{margin:8px 0;font-size:13.5px;line-height:1.6;overflow-wrap:anywhere}.ledger-entry details[data-v-763e8863]{margin-top:8px;border-radius:10px;background:var(--md-surface-container);padding:8px 12px;font-size:12px}.ledger-entry summary[data-v-763e8863]{cursor:pointer;color:var(--md-on-surface-variant)}.ledger-entry pre[data-v-763e8863]{margin:8px 0 0;max-height:300px}.conversation[data-v-763e8863]{display:flex;flex:1;min-width:0;flex-direction:column;min-height:0}.conversation-header[data-v-763e8863]{display:flex;align-items:flex-start;gap:14px}.conversation-header>div[data-v-763e8863]:first-child{flex:1;min-width:0}.conversation-header h2[data-v-763e8863]{font-size:17px;font-weight:650;margin:0}.conversation-header p[data-v-763e8863]{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:12.5px}.session-actions[data-v-763e8863]{display:flex;gap:8px;flex-shrink:0}.session-actions button[data-v-763e8863]{height:32px;padding:0 13px;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}.running[data-v-763e8863]{color:#b88412;font-weight:650;font-size:12px}.failed[data-v-763e8863]{color:var(--md-error)}.done[data-v-763e8863]{color:var(--md-success);font-weight:600;font-size:12px}.cancelled[data-v-763e8863],.muted[data-v-763e8863]{color:var(--md-on-surface-variant)}.muted[data-v-763e8863]{font-size:12px;line-height:1.6}.error[data-v-763e8863]{background:var(--md-error-container);color:#410e0b;padding:11px 16px;border-radius:12px;margin:8px 0;font-size:13px;overflow-wrap:anywhere}.transcript[data-v-763e8863]{flex:1;overflow-y:auto;padding:26px 28px;min-height:0}.welcome[data-v-763e8863]{max-width:660px;margin:70px auto 0;text-align:center;color:var(--md-on-surface-variant);line-height:1.8}.welcome[data-v-763e8863]:before{content:\"\";display:block;width:64px;height:64px;margin:0 auto 20px;border-radius:20px;background:var(--md-primary-container);background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='%234d5d91' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z'/%3E%3Cpath d='M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:center}.welcome h2[data-v-763e8863]{color:var(--md-on-surface);font-size:24px;font-weight:650;margin:0 0 8px;letter-spacing:-.01em}.welcome p[data-v-763e8863]{margin:6px 0;font-size:13.5px}.turn[data-v-763e8863]{max-width:920px;margin:0 auto 30px;display:flex;flex-direction:column;gap:10px}.bubble[data-v-763e8863]{padding:15px 19px;font-size:14px}.bubble.user[data-v-763e8863]{align-self:flex-end;max-width:82%;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:16px 16px 4px}.bubble.agent[data-v-763e8863]{align-self:flex-start;max-width:100%;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:16px 16px 16px 4px;box-shadow:var(--shadow-1)}.bubble .message-head[data-v-763e8863]{display:flex;align-items:center;gap:14px;margin-bottom:10px;font-size:12px}.bubble .message-head b[data-v-763e8863]{font-weight:700}.bubble .message-head time[data-v-763e8863]{margin-left:auto;opacity:.75;font-size:11px}.bubble .message-head span[data-v-763e8863]{margin-left:auto}.bubble.user .message-head[data-v-763e8863]{margin-bottom:7px;opacity:.85}.message-text[data-v-763e8863]{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7;font-size:14px}.bubble.agent[data-v-763e8863] p{margin:.4em 0}.bubble.agent[data-v-763e8863] pre{max-height:420px}.agent-speech[data-v-763e8863]{margin:6px 0;padding:2px 0;line-height:1.7}.model-annotation[data-v-763e8863]{display:block;font-size:11px;opacity:.7;margin-bottom:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.agent-speech[data-v-763e8863] p{margin:.45em 0}.agent-speech[data-v-763e8863] pre{background:var(--md-surface-container);border:1px solid var(--md-outline-variant);border-radius:10px;padding:12px 14px;max-height:460px;overflow:auto;font-size:12.5px}.agent-speech[data-v-763e8863] code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.agent-speech[data-v-763e8863] ul{padding-left:20px;margin:.4em 0}.steps[data-v-763e8863]{display:flex;flex-direction:column;gap:8px;margin:12px 0 14px}.steps details[data-v-763e8863]{border-radius:12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);padding:10px 14px}.steps summary[data-v-763e8863]{cursor:pointer;font-size:12.5px;font-weight:550}.steps summary small[data-v-763e8863]{margin-left:10px;font-weight:600}.steps summary[data-v-763e8863]::marker{color:var(--md-on-surface-variant)}.steps details pre[data-v-763e8863]{margin:10px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;white-space:pre-wrap;max-height:400px}pre[data-v-763e8863]{max-height:450px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.subagent-card[data-v-763e8863]{border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);overflow:hidden;box-shadow:var(--shadow-1)}button.subagent-card-head[data-v-763e8863]{display:flex;align-items:center;gap:9px;width:100%;text-align:left;border:0;border-radius:0;background:transparent;padding:11px 14px;font-size:12.5px}button.subagent-card-head[data-v-763e8863]:hover:not(:disabled){background:var(--md-secondary-container);box-shadow:none}button.subagent-card-head>span[data-v-763e8863]:first-child{color:var(--md-primary)}button.subagent-card-head>strong[data-v-763e8863]{font-weight:700}.subagent-prompt[data-v-763e8863]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--md-on-surface)}.subagent-card small[data-v-763e8863]{font-weight:600}.subagent-chevron[data-v-763e8863]{color:var(--md-on-surface-variant);font-size:11px}.subagent-card-error[data-v-763e8863]{margin:0 10px 10px;padding:8px 12px;font-size:12px}.subagent-card.nested[data-v-763e8863]{margin:6px 0;box-shadow:none}.sub-view[data-v-763e8863]{max-width:900px;margin:0 auto}.sub-view-header[data-v-763e8863]{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant)}.sub-view-header button[data-v-763e8863]{flex-shrink:0;border-radius:9px;font-size:12.5px;font-weight:550;background:var(--md-surface-container-lowest)}.sub-view-header h3[data-v-763e8863]{margin:0 0 4px;font-size:16px;font-weight:650}.sub-view-header p[data-v-763e8863]{margin:0;max-width:520px}.sub-view-header>span[data-v-763e8863]{margin-left:auto;font-weight:650;font-size:12px}.sub-view-body[data-v-763e8863]{min-height:120px}.composer[data-v-763e8863]{flex-shrink:0;margin:0 20px 18px}.composer textarea[data-v-763e8863]{font-size:14px;width:100%;display:block;min-height:104px;padding:15px 18px;line-height:1.6;resize:vertical}.compact-notice[data-v-763e8863]{font-size:12px;padding:10px 16px;color:var(--md-primary);background:var(--md-primary-container);border-radius:10px;margin:10px 16px 0}.execution-options[data-v-763e8863]{display:flex;gap:10px;padding:12px 20px;flex-wrap:wrap;border-bottom:1px solid var(--md-outline-variant);align-items:end}.execution-options label[data-v-763e8863]{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--md-on-surface-variant);flex:1;min-width:130px}.execution-options[data-v-763e8863] .app-select-trigger,.execution-options .workspace-select[data-v-763e8863]{width:100%;font-size:12.5px;text-transform:none;letter-spacing:0;font-weight:500;color:var(--md-on-surface);min-height:36px;border-radius:10px;background:var(--md-surface-container);border-color:transparent;text-align:left}.workspace-select[data-v-763e8863]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;display:block}.composer footer[data-v-763e8863]{display:flex;align-items:center;gap:10px;padding:10px 16px;flex-wrap:wrap}.composer footer>select[data-v-763e8863],.composer footer>.app-select[data-v-763e8863]{font-size:12.5px;border-radius:10px;min-height:34px}.composer footer .muted[data-v-763e8863]{flex:1;min-width:120px}.composer footer>button[data-v-763e8863]{font-size:12.5px;font-weight:600;border-radius:9px;min-height:34px}.composer footer>button[type=submit][data-v-763e8863]:not(:disabled){background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;padding:0 18px}.composer footer>button[type=submit][data-v-763e8863]:not(:disabled):hover{background:var(--md-primary);filter:brightness(1.08);box-shadow:var(--shadow-1)}.composer footer>button[data-v-763e8863]:last-child:not([type=submit]){background:var(--md-error);color:#fff;border-color:transparent}.host-panel>strong[data-v-763e8863]{font-size:14px}.host-panel dl[data-v-763e8863]{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px}.host-panel dt[data-v-763e8863]{color:var(--md-on-surface-variant);font-weight:600}.host-panel dd[data-v-763e8863]{margin:4px 0 0;overflow-wrap:anywhere}.usage-rings[data-v-763e8863]{display:flex;align-items:center;gap:24px;padding:14px 0;flex-wrap:wrap}.usage-metric[data-v-763e8863]{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px}.usage-ring[data-v-763e8863]{width:88px;height:88px;border-radius:50%;display:grid;place-items:center}.usage-ring b[data-v-763e8863]{width:68px;height:68px;border-radius:50%;background:var(--md-surface-container-lowest);display:grid;place-items:center;font-size:15px;font-weight:650;box-shadow:var(--shadow-1)}.new-folder[data-v-763e8863]{display:flex;gap:8px}.new-folder input[data-v-763e8863]{flex:1;min-width:0}.directory-backdrop[data-v-763e8863]{position:fixed;inset:0;background:#14111acc;z-index:1000;display:grid;place-items:center;padding:20px}.directory-dialog[data-v-763e8863]{background:var(--md-surface);border:1px solid var(--md-outline-variant);border-radius:20px;padding:22px;width:min(680px,100%);display:flex;flex-direction:column;gap:14px;max-height:85vh;box-shadow:var(--shadow-4)}.directory-dialog>header[data-v-763e8863]{gap:12px}.directory-dialog>header h2[data-v-763e8863]{font-size:16px;font-weight:650}.directory-list[data-v-763e8863]{overflow:auto;min-height:180px;display:flex;flex-direction:column;gap:6px}.directory-list button[data-v-763e8863]{text-align:left;border-radius:10px;background:var(--md-surface-container-low);font-size:13px}.directory-roots[data-v-763e8863]{display:flex;gap:8px;flex-wrap:wrap}.directory-roots button[data-v-763e8863]{border-radius:999px;font-size:12px;padding:6px 12px}.directory-dialog code[data-v-763e8863]{overflow-wrap:anywhere;font-size:12px;background:var(--md-surface-container);padding:8px 10px;border-radius:8px}.directory-dialog>footer[data-v-763e8863]{display:flex;justify-content:flex-end}.directory-dialog>footer button[data-v-763e8863]{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;font-weight:600}.permission-request[data-v-763e8863]{margin:12px;padding:16px;border-radius:16px;background:var(--md-tertiary-container)}.permission-request small[data-v-763e8863]{display:block;margin:8px 0}.permission-request pre[data-v-763e8863]{max-height:160px;overflow:auto}.permission-request>div[data-v-763e8863]{display:flex;justify-content:flex-end;gap:8px}@media (max-width:800px){.sessions[data-v-763e8863]{width:214px;padding:12px 10px}.transcript[data-v-763e8863]{padding:14px}.composer[data-v-763e8863]{margin:0 12px 12px}.composer footer .muted[data-v-763e8863]{display:none}.conversation-header[data-v-763e8863]{padding:14px 16px}.welcome[data-v-763e8863]{margin:30px auto 0}.turn[data-v-763e8863]{margin-bottom:22px}}@media (max-width:560px){.workspace[data-v-763e8863]{flex-direction:column}.sessions[data-v-763e8863]{width:100%;max-height:230px;border-right:0;border-bottom:1px solid var(--md-outline-variant)}.sessions>input[data-v-763e8863],.filter-bar[data-v-763e8863],.connection[data-v-763e8863]{display:none}.session-list[data-v-763e8863]{display:flex;gap:6px;overflow-x:auto}.session-card[data-v-763e8863]{min-width:160px;width:160px;margin-bottom:0}.ledger-button[data-v-763e8863]{padding:5px;font-size:12px}}\n";document.head.appendChild(s)}})();
