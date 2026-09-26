// 0KAY dark mode — theme engine.
//
// Dependency-free (never touches `vue`, so it may run before the host bridge
// `window.__0KAY_VUE__` exists). It is loaded three ways and all of them work:
//   1. the WebUI host as a bootstrap module — darkmode.patch declares a
//      `target: "bootstrap"` op, so the host imports this file at startup and
//      calls the exported `install()`. The theme then applies on every page
//      without editing index.html;
//   2. the appearance page (`index.js`), which imports this file for its side
//      effect;
//   3. an optional inline `<script type="module">` boot hook in index.html to
//      avoid a first-paint flash (module only: this file uses `export`).
// Importing runs the engine immediately and re-running is harmless — the
// install path is idempotent.

;(function () {
  var STORE_KEY = '0kay_theme_mode'
  var SCHEDULE_KEY = '0kay_theme_schedule'
  var STYLE_ID = '0kay-darkmode-style'
  var WIPE_ID = '0kay-theme-wipe'
  var MODES = ['auto', 'light', 'dark', 'schedule']
  var DEFAULT_SCHEDULE = { darkFrom: '19:00', darkUntil: '07:00' }
  var FADE_MS = 560
  var SURFACE = { light: '#fbf8ff', dark: '#14161d' }

  var DARK_CSS = `
/* ============ 0KAY dark theme (plugin: darkmode) ============ */

html[data-theme="dark"]{color-scheme:dark}
html[data-theme="light"]{color-scheme:light}

/* --- MD3 dark tokens (derived from the refined #4d5d91 primary) --- */
html[data-theme="dark"]{
  --md-primary:#b3c0ea;
  --md-on-primary:#1a2138;
  --md-primary-container:#2c3760;
  --md-on-primary-container:#dde3fa;
  --md-primary-fixed:#dde3fa;
  --md-secondary:#bcc7dc;
  --md-on-secondary:#18202f;
  --md-secondary-container:#333c52;
  --md-on-secondary-container:#d9e2f5;
  --md-tertiary:#d3a8cc;
  --md-on-tertiary:#331a2c;
  --md-tertiary-container:#4a2f45;
  --md-on-tertiary-container:#f5dcef;
  --md-error:#ffb4ab;
  --md-on-error:#680004;
  --md-error-container:#93010a;
  --md-on-error-container:#ffdad6;
  --md-surface:#14161d;
  --md-surface-dim:#14161d;
  --md-surface-bright:#363b47;
  --md-surface-container-lowest:#0e1015;
  --md-surface-container-low:#1a1d25;
  --md-surface-container:#1e212a;
  --md-surface-container-high:#282c36;
  --md-surface-container-highest:#333843;
  --md-on-surface:#e3e6ee;
  --md-on-surface-variant:#c0c6d4;
  --md-outline:#8b91a1;
  --md-outline-variant:#43485a;
  --md-inverse-surface:#e3e6ee;
  --md-inverse-on-surface:#1e212a;
  --md-inverse-primary:#4d5d91;
  --md-success:#7fd7a0;
  --md-success-container:#1e4d34;
  --md-on-success-container:#c8f5d9;
  --md-warning:#ffb960;
  --md-warning-container:#5c3c00;
  --md-on-warning-container:#ffe0b3;
  --md-scrim:rgba(0,0,0,.62);

  /* legacy aliases still referenced by host components */
  --brand-hover:#c3cdec;
  --brand-active:#d5dcf6;
  --neutral-gray-50:#c2c7d4;
  --neutral-gray-60:#a5abb9;
  --neutral-gray-70:#e3e6ee;
  --neutral-gray-80:#eef1f7;
  --neutral-gray-90:#f5f7fb;
  --neutral-gray-100:#ffffff;

  /* elevation: purple-tinted light shadows read as nothing on dark */
  --shadow-1:0 2px 8px rgba(0,0,0,.45);
  --shadow-2:0 6px 22px rgba(0,0,0,.50);
  --shadow-3:0 14px 44px rgba(0,0,0,.55);
  --shadow-4:0 22px 60px rgba(0,0,0,.60);
  --shadow-8:0 8px 12px 6px rgba(0,0,0,.50),0 4px 4px rgba(0,0,0,.60);
  --shadow-16:0 12px 17px 8px rgba(0,0,0,.50),0 6px 6px rgba(0,0,0,.60);
}

/* --- Hard-coded light greys in theme.css (refined + expressive layers) --- */
html[data-theme="dark"] #app .nav-rail{background:var(--md-surface-container)}
html[data-theme="dark"] #app .sessions{background:var(--md-surface-container)}
html[data-theme="dark"] #app .host-panel,
html[data-theme="dark"] #app .character-profile{background:var(--md-surface-container)}
html[data-theme="dark"] #app .usage-ring b{background:var(--md-surface-container)}
html[data-theme="dark"] #app :is(.modal-backdrop,.directory-backdrop){background:rgba(0,0,0,.62)}
html[data-theme="dark"] #app .composer{box-shadow:0 4px 20px rgba(0,0,0,.45)}
html[data-theme="dark"] #app select:not([multiple]){
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='m6 9 6 6 6-6' stroke='%23c0c6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

/* --- settings.css: OS media query must not fight an explicit choice --- */
html[data-theme="dark"] .provider-logo{background:var(--md-surface-container-high)}
html[data-theme="light"] .provider-logo{background:#ffffff}
html[data-theme="light"] .error-message,
html[data-theme="light"] .danger-box{color:#410e0b}

/* --- Fixed text colors baked into AboutPanel / UsagePage / SetupWizard --- */
html[data-theme="dark"] .status-hero.ok,
html[data-theme="dark"] .apply-banner.done,
html[data-theme="dark"] .tile.good,
html[data-theme="dark"] .status-chip.ok,
html[data-theme="dark"] .step.done .step-ind,
html[data-theme="dark"] .banner.ok{color:var(--md-on-success-container,#c8f5d9)}
html[data-theme="dark"] .apply-banner.failed,
html[data-theme="dark"] .banner.err,
html[data-theme="dark"] .stage-status.warn{color:var(--md-on-error-container,#ffdad6)}
html[data-theme="dark"] .status-hero.warn,
html[data-theme="dark"] .status-chip.warn{
  background:var(--md-warning-container,#5c3c00);
  color:var(--md-on-warning-container,#ffe0b3);
}

/* --- Live2D stage backdrop --- */
html[data-theme="dark"] .stage-viewport{
  background:
    radial-gradient(circle at 30% 20%,color-mix(in srgb,var(--mood,#6750A4) 26%,transparent),transparent 55%),
    radial-gradient(circle at 70% 80%,color-mix(in srgb,var(--mood,#6750A4) 14%,transparent),transparent 50%),
    linear-gradient(180deg,#1c1f2b 0%,#14161d 55%,#2c376033 100%);
}

/* --- Mood / energy colors are inline styles from stores/life.ts; lift them --- */
html[data-theme="dark"] .mood-icon,
html[data-theme="dark"] .mood-label,
html[data-theme="dark"] .emotion{filter:brightness(1.5) saturate(.85)}
html[data-theme="dark"] .energy-fill,
html[data-theme="dark"] .emotion-fill{filter:brightness(1.25) saturate(.9)}
`

  // Transition layer: while `html.0kay-theme-fade` is present (roughly one
  // FADE_MS window around a switch) every surface interpolates its colours so
  // the theme change reads as a gradient rather than a hard flip. A fixed
  // radial wash of the incoming surface colour pulses on top to soften the
  // gradients the host paints as background-image (which cannot interpolate).
  var FADE_CSS = `
/* ============ 0KAY theme transition (plugin: darkmode) ============ */
html.0kay-theme-fade,
html.0kay-theme-fade *,
html.0kay-theme-fade *::before,
html.0kay-theme-fade *::after{
  transition:
    background-color 560ms cubic-bezier(.4,0,.2,1),
    color 560ms cubic-bezier(.4,0,.2,1),
    border-color 560ms cubic-bezier(.4,0,.2,1),
    outline-color 560ms cubic-bezier(.4,0,.2,1),
    box-shadow 560ms cubic-bezier(.4,0,.2,1),
    fill 560ms cubic-bezier(.4,0,.2,1),
    stroke 560ms cubic-bezier(.4,0,.2,1) !important;
  transition-delay:0ms !important;
}
#${WIPE_ID}{
  position:fixed;inset:0;z-index:2147482000;pointer-events:none;
  opacity:0;will-change:opacity;
}
@media (prefers-reduced-motion: reduce){
  html.0kay-theme-fade,
  html.0kay-theme-fade *,
  html.0kay-theme-fade *::before,
  html.0kay-theme-fade *::after{transition:none !important}
  #${WIPE_ID}{display:none}
}
`

  var SHEET_CSS = DARK_CSS + FADE_CSS

  function media() {
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null
  }

  function systemDark() {
    var m = media()
    return !!(m && m.matches)
  }

  function readMode() {
    try {
      var v = localStorage.getItem(STORE_KEY)
      if (v && MODES.indexOf(v) >= 0) return v
    } catch (e) { /* private mode / storage disabled */ }
    return 'auto'
  }

  function writeMode(mode) {
    try { localStorage.setItem(STORE_KEY, mode) } catch (e) { /* ignore */ }
  }

  function readSchedule() {
    try {
      var raw = localStorage.getItem(SCHEDULE_KEY)
      if (raw) {
        var s = JSON.parse(raw)
        if (s && typeof s.darkFrom === 'string' && typeof s.darkUntil === 'string') {
          return { darkFrom: s.darkFrom, darkUntil: s.darkUntil }
        }
      }
    } catch (e) { /* ignore */ }
    return { darkFrom: DEFAULT_SCHEDULE.darkFrom, darkUntil: DEFAULT_SCHEDULE.darkUntil }
  }

  function writeSchedule(schedule) {
    try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule)) } catch (e) { /* ignore */ }
  }

  /** "HH:MM" -> minutes since midnight. */
  function toMinutes(hhmm) {
    var p = String(hhmm || '').split(':')
    var h = parseInt(p[0], 10)
    var m = parseInt(p[1], 10)
    if (isNaN(h) || isNaN(m)) return NaN
    return h * 60 + m
  }

  /** Whether the current local time falls inside the scheduled dark window. */
  function scheduleDark(schedule) {
    var from = toMinutes(schedule.darkFrom)
    var until = toMinutes(schedule.darkUntil)
    if (isNaN(from) || isNaN(until)) return false
    var now = new Date()
    var minutes = now.getHours() * 60 + now.getMinutes()
    if (from === until) return false
    if (from < until) return minutes >= from && minutes < until
    return minutes >= from || minutes < until // wraps past midnight
  }

  /** Resolve a mode to the concrete "light" | "dark" value. */
  function resolve(mode) {
    if (mode === 'auto') return systemDark() ? 'dark' : 'light'
    if (mode === 'schedule') return scheduleDark(readSchedule()) ? 'dark' : 'light'
    return mode
  }

  /** Install the sheet once; it only activates under [data-theme="dark"]. */
  function ensureSheet() {
    if (typeof document === 'undefined') return
    var el = document.getElementById(STYLE_ID)
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }
    if (el.textContent !== SHEET_CSS) el.textContent = SHEET_CSS
  }

  function prefersReduced() {
    var m = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null
    return !!(m && m.matches)
  }

  var fadeTimer = null

  /** Fade the whole UI and pulse an incoming-surface wash across the viewport. */
  function runTransition(next) {
    var root = document.documentElement
    root.classList.add('0kay-theme-fade')
    // Flush style so the "from" colours are committed with the transition
    // active; otherwise the class flip and the theme flip batch into one style
    // recalculation and nothing interpolates.
    void root.offsetHeight

    try {
      var wipe = document.getElementById(WIPE_ID)
      if (!wipe && document.body) {
        wipe = document.createElement('div')
        wipe.id = WIPE_ID
        document.body.appendChild(wipe)
      }
      if (wipe) {
        var incoming = next === 'dark' ? SURFACE.dark : SURFACE.light
        wipe.style.background =
          'radial-gradient(130% 120% at 50% -10%,' + incoming + ' 0%,transparent 68%)'
        if (typeof wipe.animate === 'function') {
          wipe.animate(
            [{ opacity: 0 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }],
            { duration: FADE_MS, easing: 'cubic-bezier(.4,0,.2,1)' }
          )
        }
      }
    } catch (e) { /* decorative only */ }

    if (fadeTimer) clearTimeout(fadeTimer)
    fadeTimer = setTimeout(function () {
      root.classList.remove('0kay-theme-fade')
      fadeTimer = null
    }, FADE_MS + 40)
  }

  /**
   * Resolve, apply and (unless `animate === false`) gradient-fade into the
   * next theme. The first install passes `false` so startup never animates.
   */
  function apply(mode, animate) {
    if (typeof document === 'undefined') return resolve(mode)
    ensureSheet()
    var next = resolve(mode)
    var root = document.documentElement
    var changed = root.dataset.theme && root.dataset.theme !== next
    if (changed && animate !== false && !prefersReduced()) runTransition(next)
    if (root.dataset.theme !== next) root.dataset.theme = next
    return next
  }

  var listening = false
  function listen() {
    if (listening) return
    var m = media()
    if (!m) return
    listening = true
    var onChange = function () { if (readMode() === 'auto') apply('auto', true) }
    if (typeof m.addEventListener === 'function') m.addEventListener('change', onChange)
    else if (typeof m.addListener === 'function') m.addListener(onChange)
  }

  var scheduleTimer = null
  function tick() {
    // Re-evaluate so a "schedule" mode flips at the boundary without a reload.
    if (readMode() === 'schedule') apply('schedule', true)
  }

  /** Idempotent: apply the saved mode and follow OS / schedule automatically. */
  function install() {
    apply(readMode(), false)
    listen()
    if (!scheduleTimer) scheduleTimer = setInterval(tick, 30000)
  }

  var api = {
    getMode: readMode,
    resolved: function () { return resolve(readMode()) },
    setMode: function (mode) {
      var m = MODES.indexOf(mode) >= 0 ? mode : 'auto'
      writeMode(m)
      return apply(m, true)
    },
    toggle: function () {
      return api.setMode(resolve(readMode()) === 'dark' ? 'light' : 'dark')
    },
    getSchedule: readSchedule,
    setSchedule: function (schedule) {
      var from = schedule && schedule.darkFrom ? schedule.darkFrom : DEFAULT_SCHEDULE.darkFrom
      var until = schedule && schedule.darkUntil ? schedule.darkUntil : DEFAULT_SCHEDULE.darkUntil
      writeSchedule({ darkFrom: from, darkUntil: until })
      if (readMode() === 'schedule') apply('schedule', true)
    },
    apply: apply,
    install: install,
  }

  if (typeof window !== 'undefined') {
    window.__0KAY_THEME__ = api
    install()
  }
})()

// Host bootstrap contract (WebUI uiPatches `bootstrap` target): the host imports
// this module once at startup and calls `install()`. Delegates to the live
// engine so callers get the same idempotent install path.
export function install() {
  if (typeof window !== 'undefined' && window.__0KAY_THEME__) {
    return window.__0KAY_THEME__.install()
  }
}

export default install
