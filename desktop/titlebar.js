// The title bar, injected into the page the shell loads.
//
// The window is frameless, so this file provides what a frame normally would:
// something to drag, the window buttons, and the app's identity. It runs in the
// page, not in the main process, so it cannot require anything — the buttons talk
// to the shell through `window.okayDesktop`, which preload.js exposes.
//
// Design notes:
// - Every colour comes from the host's `--md-*` tokens, so the bar follows the
//   light/dark theme instead of being a dark strip glued onto the app.
// - Buttons have hover, :active and :focus-visible states. A window control that
//   only reacts on mouse-up feels broken — that is what "no feedback" meant.
// - It is idempotent: the page can be reloaded and this leaves one bar behind.
(function () {
  'use strict';

  const BAR_ID = 'okay-titlebar';
  const STYLE_ID = 'okay-titlebar-style';
  const HEIGHT = 38;

  const host = window.okayDesktop;
  if (!host || !host.windowControl) return;

  const MIN = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6h7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
  const MAX = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.9" y="2.9" width="6.2" height="6.2" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  const RESTORE = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="3.6" y="1.7" width="5.2" height="5.2" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="3.3" width="5.2" height="5.2" rx="1.2" fill="var(--okay-bar)" stroke="currentColor" stroke-width="1.2"/></svg>';
  const CLOSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

  function build() {
    document.getElementById(BAR_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html.okay-frameless, html.okay-frameless body { height: 100%; }
      /* The app gets the strip back at the top instead of being covered. */
      html.okay-frameless #app { padding-top: ${HEIGHT}px; box-sizing: border-box; }

      #${BAR_ID} {
        --okay-bar: var(--md-surface-container, #171b22);
        --okay-line: var(--md-outline-variant, #2a3140);
        --okay-ink: var(--md-on-surface, #e7ecf4);
        --okay-dim: var(--md-on-surface-variant, #9aa6b8);
        --okay-accent: var(--md-primary, #86afb5);
        position: fixed; inset: 0 0 auto 0; height: ${HEIGHT}px;
        display: flex; align-items: center;
        padding: 0 0 0 11px;
        background: var(--okay-bar);
        color: var(--okay-ink);
        border-bottom: 1px solid var(--okay-line);
        box-shadow: inset 0 1px 0 #ffffff0d;
        font: 500 12px/1 system-ui, -apple-system, 'Segoe UI', 'PingFang SC', sans-serif;
        -webkit-app-region: drag;
        user-select: none;
        z-index: 2147483000;
      }

      #${BAR_ID} .okay-brand { display: flex; align-items: center; gap: 9px; min-width: 0; }
      #${BAR_ID} .okay-mark {
        width: 20px; height: 20px; flex: none; border-radius: 6px;
        object-fit: cover;
        box-shadow: 0 0 0 1px #ffffff1a, 0 1px 2px #00000040;
      }
      #${BAR_ID} b {
        font-size: 11.5px; font-weight: 700; letter-spacing: .13em;
        text-transform: uppercase; color: var(--okay-ink);
      }
      #${BAR_ID} .okay-sep {
        width: 1px; height: 14px; margin: 0 10px;
        background: var(--okay-line); flex: none;
      }
      #${BAR_ID} .okay-page {
        font-size: 11.5px; font-weight: 500; color: var(--okay-dim);
        max-width: 38vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      #${BAR_ID} .okay-spacer { flex: 1 1 auto; height: 100%; min-width: 12px; }

      #${BAR_ID} .okay-status {
        display: flex; align-items: center; gap: 6px;
        height: 24px; padding: 0 9px; margin-right: 6px;
        border: 1px solid transparent; border-radius: 999px; flex: none;
        color: var(--okay-dim); font-size: 11px; font-weight: 500;
        letter-spacing: .01em;
        -webkit-app-region: no-drag;
        transition: color .15s ease, background .15s ease, border-color .15s ease;
      }
      #${BAR_ID} .okay-status:hover {
        background: color-mix(in srgb, var(--okay-ink) 7%, transparent);
        border-color: var(--okay-line);
      }
      #${BAR_ID} .okay-status:focus-visible {
        outline: 2px solid var(--okay-accent); outline-offset: 1px;
      }
      #${BAR_ID} .okay-status .dot {
        width: 7px; height: 7px; border-radius: 50%; flex: none;
        background: #45c8a4; box-shadow: 0 0 0 3px #45c8a426;
        transition: background .2s ease, box-shadow .2s ease;
      }
      #${BAR_ID} .okay-status[data-state="down"] { color: #e0a44a; }
      #${BAR_ID} .okay-status[data-state="down"]:hover {
        background: color-mix(in srgb, #e0a44a 12%, transparent);
        border-color: color-mix(in srgb, #e0a44a 40%, transparent);
      }
      #${BAR_ID} .okay-status[data-state="down"] .dot {
        background: #e0a44a; box-shadow: 0 0 0 3px #e0a44a26;
        animation: okay-pulse 1.8s ease-in-out infinite;
      }
      #${BAR_ID} .okay-status[data-state="unknown"] .dot { background: var(--okay-dim); box-shadow: none; }
      @keyframes okay-pulse { 0%, 100% { opacity: 1 } 50% { opacity: .3 } }
      @media (prefers-reduced-motion: reduce) {
        #${BAR_ID} .okay-status[data-state="down"] .dot { animation: none; }
      }

      #${BAR_ID} .okay-buttons { display: flex; height: 100%; -webkit-app-region: no-drag; }
      #${BAR_ID} button {
        width: 46px; height: 100%; margin: 0; padding: 0;
        display: grid; place-items: center;
        border: 0; border-radius: 0; background: transparent;
        color: var(--okay-dim); cursor: default;
        transition: background .12s ease, color .12s ease, transform .08s ease;
      }
      #${BAR_ID} button svg { width: 12px; height: 12px; display: block; }
      #${BAR_ID} button:hover {
        background: color-mix(in srgb, var(--okay-ink) 9%, transparent);
        color: var(--okay-ink);
      }
      #${BAR_ID} button:active {
        background: color-mix(in srgb, var(--okay-ink) 16%, transparent);
        transform: scale(.94);
      }
      #${BAR_ID} button:focus-visible {
        outline: 2px solid var(--okay-accent); outline-offset: -3px;
        color: var(--okay-ink);
      }
      #${BAR_ID} button.close:hover { background: #e5484d; color: #fff; }
      #${BAR_ID} button.close:active { background: #c93b40; }
      #${BAR_ID} button.close:focus-visible { outline-color: #e5484d; }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Window');
    bar.innerHTML = `
      <div class="okay-brand">
        <img class="okay-mark" src="__OKAY_ICON__" alt="" draggable="false" />
        <b>0KAY</b>
      </div>
      <span class="okay-sep" aria-hidden="true"></span>
      <span class="okay-page" data-page hidden></span>
      <div class="okay-spacer"></div>
      <div class="okay-status" data-status data-state="unknown" role="status" tabindex="0"
           aria-label="Core connection" title="Checking the stack…">
        <span class="dot" aria-hidden="true"></span><span data-status-text>…</span>
      </div>
      <div class="okay-buttons">
        <button type="button" data-min aria-label="Minimize" title="Minimize">${MIN}</button>
        <button type="button" data-max aria-label="Maximize" title="Maximize">${MAX}</button>
        <button type="button" class="close" data-close aria-label="Close" title="Close to tray">${CLOSE}</button>
      </div>`;
    document.body.appendChild(bar);
    document.documentElement.classList.add('okay-frameless');

    const button = (name) => bar.querySelector(`[data-${name}]`);
    button('min').addEventListener('click', () => host.windowControl.minimize());
    button('max').addEventListener('click', () => host.windowControl.toggleMaximize());
    button('close').addEventListener('click', () => host.windowControl.close());
    bar.addEventListener('dblclick', (event) => {
      if (event.target.closest('button, .okay-status')) return;
      host.windowControl.toggleMaximize();
    });
    return bar;
  }

  const bar = build();

  // The page title follows the route in this SPA, so the bar mirrors it instead
  // of showing whatever the document title was at load.
  const pageLabel = bar.querySelector('[data-page]');
  function syncTitle() {
    const title = document.title === '0kay' ? '' : document.title;
    pageLabel.textContent = title;
    pageLabel.hidden = !title;
  }
  syncTitle();
  const titleNode = document.querySelector('title');
  if (titleNode) new MutationObserver(syncTitle).observe(titleNode, { childList: true });

  host.windowControl.onMaximized?.((maximized) => {
    const max = bar.querySelector('[data-max]');
    max.title = maximized ? 'Restore' : 'Maximize';
    max.setAttribute('aria-label', max.title);
    max.innerHTML = maximized ? RESTORE : MAX;
  });

  // A quiet, always-there answer to "is the stack alive" — with words as well as
  // colour, so it does not depend on telling two dots apart.
  async function pollStack() {
    const status = bar.querySelector('[data-status]');
    const text = bar.querySelector('[data-status-text]');
    try {
      const result = await host.status();
      const up = !!result?.up;
      status.dataset.state = up ? 'up' : 'down';
      text.textContent = up ? 'online' : 'offline';
      status.title = up
        ? `Core online at ${result.core || ''}`.trim()
        : 'Core offline — start the stack from the tray menu';
      status.setAttribute('aria-label', up ? 'Core online' : 'Core offline');
    } catch (error) {
      status.dataset.state = 'unknown';
      text.textContent = 'unknown';
      status.title = 'Core status unavailable';
    }
  }
  void pollStack();
  setInterval(pollStack, 15000);
})();
