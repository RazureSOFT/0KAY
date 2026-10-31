// Window chrome for the companion window.
//
// The pet window is frameless and transparent, so there is nothing to grab and no
// close button anywhere — dragging and closing were only reachable from the tray,
// which is not where a person looks. This injects a slim bar that appears on
// hover: a drag grip, a click-through toggle and a close button. It hides itself
// again so the window stays "just her" when nobody is pointing at it.
(function () {
  'use strict';

  const ID = 'okay-companion-chrome';
  const STYLE_ID = 'okay-companion-chrome-style';
  const host = window.okayDesktop;
  if (!host || !host.companion) return;

  function build() {
    document.getElementById(ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ID} {
        position: fixed; top: 0; left: 0; right: 0; height: 30px;
        display: flex; align-items: center; gap: 4px;
        padding: 0 4px 0 10px;
        border-radius: 10px 10px 0 0;
        background: linear-gradient(180deg, rgba(12,16,22,.82), rgba(12,16,22,0));
        color: #dfe6f2;
        font: 600 11px/1 system-ui, -apple-system, 'Segoe UI', sans-serif;
        letter-spacing: .04em;
        -webkit-app-region: drag;
        user-select: none;
        opacity: 0; transition: opacity .16s ease; pointer-events: none;
        z-index: 2147483000;
      }
      /* Only appears when you reach for it: the window is meant to look like her,
         not like an app with a title bar. */
      body:hover #${ID}, #${ID}:focus-within { opacity: 1; pointer-events: auto; }
      #${ID} .grip {
        flex: 1 1 auto; height: 100%; display: flex; align-items: center;
        gap: 6px; overflow: hidden;
      }
      #${ID} .dots { letter-spacing: 1px; opacity: .55; }
      #${ID} .name { opacity: .75; font-weight: 600; }
      #${ID} .btns { display: flex; gap: 2px; -webkit-app-region: no-drag; }
      #${ID} button {
        width: 24px; height: 22px; display: grid; place-items: center;
        border: 0; border-radius: 6px; background: transparent; color: inherit;
        cursor: default; padding: 0;
        transition: background .12s ease, color .12s ease;
      }
      #${ID} button:hover { background: #ffffff1f; }
      #${ID} button:active { background: #ffffff33; }
      #${ID} button:focus-visible { outline: 2px solid #86afb5; outline-offset: -2px; }
      #${ID} button.close:hover { background: #e5484d; color: #fff; }
      #${ID} svg { width: 11px; height: 11px; display: block; }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = ID;
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Companion window');
    bar.innerHTML = `
      <div class="grip"><span class="dots">⠿</span><span class="name">0KAY · companion</span></div>
      <div class="btns">
        <button type="button" data-through title="Click-through（穿透点击）" aria-label="Toggle click-through">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8M6 2v8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button type="button" class="close" data-close title="Close" aria-label="Close companion window">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
      </div>`;
    document.body.appendChild(bar);

    // Dragging the model is the natural way to move a desk pet; -webkit-app-region
    // cannot be applied to a canvas at runtime without losing its pointer events,
    // so the page moves the window itself while the pointer is down.
    let dragging = false;
    let origin = { x: 0, y: 0, sx: 0, sy: 0 };
    window.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (target instanceof Element && target.closest(`#${ID}, button, a, input, select, textarea`)) return;
      dragging = true;
      origin = { x: event.screenX, y: event.screenY, sx: window.screenX, sy: window.screenY };
      host.companionDragStart?.();
    });
    window.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      host.companionDragMove?.(origin.sx + (event.screenX - origin.x), origin.sy + (event.screenY - origin.y));
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      host.companionDragEnd?.();
    });

    // Right click anywhere on her opens the pet menu (hide / click-through / close).
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      host.companionMenu?.();
    });

    bar.querySelector('[data-close]').addEventListener('click', () => host.companion('close'));
    bar.querySelector('[data-through]').addEventListener('click', () => host.companion('click-through'));
    return bar;
  }

  build();
})();
