/**
 * Shared transport + design kit for every L.I.F.E plugin page.
 *
 * The companion page and the 消息平台 settings page are different Vue roots but
 * they are visually the same product: same cards, same pill buttons, same
 * field sizing. Extracting the transport helpers and the design-token block
 * keeps them in lockstep instead of drifting into two dialects.
 */

/** Turn raw gateway/gRPC dial errors into a calm, actionable message. */
export function friendlyError(e: any): string {
  const text = String(e?.message || e || '')
  if (/connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(text)) {
    return 'LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。'
  }
  return text || '操作失败'
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * POST one ManageCompanion action to L.I.F.E through the Core gateway.
 *
 * The reverse-WebSocket listener lives inside the plugin process, so a sibling
 * page racing a LIFE restart sees a dial error rather than a clean 4xx. Three
 * attempts with a short backoff covers the usual restart window without
 * making a genuine failure feel slow.
 */
export async function lifeAct(action: string, payload: any = {}): Promise<any> {
  let last: any = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch('/api/life/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      })
      if (!r.ok) throw Error((await r.text()) || String(r.status))
      return await r.json().catch(() => ({}))
    } catch (e: any) {
      last = e
      const transient = /connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|502|503|life unavailable/i.test(String(e?.message || e))
      if (attempt < 2 && transient) { await sleep(1200); continue }
      throw e
    }
  }
  throw last
}

/** GET the aggregated companion snapshot (settings + cognitive state). */
export async function lifeGet(path = '/api/life/companion'): Promise<any> {
  const r = await fetch(path)
  if (!r.ok) throw Error((await r.text()) || String(r.status))
  return r.json()
}

/** Read one Core settings section's saved values. */
export async function readSection(id: string): Promise<Record<string, any>> {
  const r = await fetch(`/api/settings/${encodeURIComponent(id)}`)
  if (!r.ok) throw Error(String(r.status))
  const body = await r.json().catch(() => ({}))
  return body.values || {}
}

/** Write one Core settings section's values. */
export async function writeSection(id: string, values: Record<string, any>): Promise<void> {
  const r = await fetch(`/api/settings/${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  })
  if (!r.ok) throw Error((await r.text()) || String(r.status))
}

/** Escape a string for safe use inside a CSS selector. */
export function cssEscape(value: string): string {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, '_')
}

/**
 * Design tokens + the component vocabulary shared by the L.I.F.E plugin pages.
 *
 * Sizes follow the Material 3 Expressive scale used by the WebUI shell: 52px
 * fields, 44px buttons, 28px card radius. `rootClass` scopes every rule to the
 * page root so the two pages cannot leak styles into each other.
 */
export function lifeKitCss(rootClass: string): string {
  const r = `.${rootClass}`
  return `
${r}{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
${r} h1,${r} h2,${r} h3,${r} h4{margin:0;letter-spacing:-.01em}
${r} .eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
${r} .eyebrow b{font-size:9px}

/* Hero */
${r} .hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
${r} .hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
${r} .hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
${r} .hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
${r} .sub{margin:8px 0 0;max-width:620px;font-size:14px;line-height:1.6;color:var(--md-on-surface-variant)}
${r} .hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
${r} .fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
@media (hover: hover) and (pointer: fine){${r} .fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}}
${r} .fab:disabled{opacity:.6;cursor:not-allowed}
${r} .fab-ic{font-size:17px}
${r} .state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
${r} .pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:13px;font-weight:700}
${r} .pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
${r} .pill.bad{background:#ffdcc6;color:#7a3a00}

${r} .banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
${r} .banner.err{background:var(--md-error-container);color:var(--md-on-error-container)}
${r} .banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
${r} .tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
${r} .tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
${r} .tab i{font-style:normal;font:700 12px/1 ui-monospace,monospace;opacity:.6}
${r} .tab-ic{font-size:14px}
${r} .tab:hover{background:var(--md-surface-container-high)}
${r} .tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
${r} .tab.active i{opacity:.85}

${r} .panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
${r} .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
${r} .section-head h2{font-size:22px;font-weight:800}
${r} .desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
${r} .head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
${r} .btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
${r} .btn.sm{height:34px;padding:0 14px;font-size:13px}
${r} .btn:disabled{opacity:.5;cursor:not-allowed}
@media (hover: hover) and (pointer: fine){${r} .btn:hover:not(:disabled){transform:translateY(-1px)}}
${r} .btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
${r} .btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
${r} .btn.text{background:transparent;color:var(--md-primary)}
${r} .btn.danger{background:var(--md-error-container);color:var(--md-on-error-container)}
${r} .link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
${r} .card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
${r} .card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}
${r} .card.sub{padding:16px;margin-bottom:0}
${r} .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
${r} .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
${r} .sub-label{margin:16px 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
${r} .hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
${r} .meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}
${r} .empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
${r} .field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
${r} .field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
${r} .field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
${r} .switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
${r} .sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
${r} .sw input{width:18px;height:18px;accent-color:var(--md-primary)}
${r} .settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
${r} .settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
${r} .settings-grid .field{height:40px}
${r} .fld{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant);min-width:180px}

/* Chips / status */
${r} .count-pill{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
${r} .count-pill.ok{background:var(--md-success-container);color:#0d3b1e}
${r} .actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}

/* Feed list (adapters, routes, commitments …) */
${r} .feed{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
${r} .feed > li{padding:14px 16px;border-radius:var(--r-md);background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
${r} .feed > li.empty{background:none;border:0}

/* Material 3 Expressive align */
#app ${r} .card{border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);background:var(--md-surface-container-low);box-shadow:var(--shadow-1)}
#app ${r} .field{height:52px;border-radius:16px;border-color:transparent;background:var(--md-surface-container-high)}
#app ${r} .field:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app ${r} .field.tiny{height:40px}
#app ${r} .settings-grid .field{height:44px}
#app ${r} .btn{height:44px;padding:0 20px}
#app ${r} .btn.sm{height:36px;padding:0 15px}

@media (prefers-reduced-motion: reduce){
  ${r} .panel{animation:none}
  ${r} .fab,${r} .btn,${r} .tab{transition:none}
  ${r} .fab:hover:not(:disabled),${r} .btn:hover:not(:disabled),${r} .tab.active{transform:none}
}
@media (prefers-color-scheme: dark){${r} .pill.bad{background:#5a2d00;color:#ffd7b0}}
@media(max-width:820px){${r} .grid2,${r} .grid3{grid-template-columns:1fr}}
@media(max-width:560px){${r}{padding:var(--space-lg) var(--space-lg) 80px}${r} .hero{padding:20px}${r} .hero-actions{width:100%}}
`
}

/**
 * Install a stylesheet into <head> exactly once.
 *
 * Plugin entries are ESM modules with no HTML host, so the build step appends
 * the CSS to the entry chunk and this helper runs at import time.
 */
export function injectStyle(id: string, css: string): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = css
  document.head.appendChild(el)
}
