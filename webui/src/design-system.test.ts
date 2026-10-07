import { describe, expect, it } from 'vitest'
import themeCss from './styles/theme.css?raw'
import settingsCss from './styles/settings.css?raw'
import pairingPanel from './components/PairingPanel.vue?raw'
import chatPanel from './components/ChatPanel.vue?raw'
import confirmDialog from './components/ConfirmDialog.vue?raw'
import dangerPanel from './components/DangerPanel.vue?raw'
import pluginsPage from './pages/PluginsPage.vue?raw'
import settingsPage from './pages/SettingsPage.vue?raw'
import usagePage from './pages/UsagePage.vue?raw'

/**
 * Guards against a button that silently loses its theme.
 *
 * `.btn` sets `border: none`, so a danger treatment that only sets
 * `border-color` paints nothing — the button keeps its neutral background and
 * gains red text, which reads as "the theme stopped applying". That is exactly
 * what PairingPanel did with `class="danger"`: no stylesheet defines `.danger`,
 * so the disconnect button was the only one in the app without a variant.
 *
 * Two checks:
 *   1. every `btn-*` variant used anywhere is actually defined in the design
 *      system, so a typo or a removed rule fails here instead of in the browser
 *   2. the panel that regressed carries a real variant
 *
 * These read the sources as text. The project has no DOM renderer by design
 * (no jsdom / @vue/test-utils), and for a stylesheet-coverage question the text
 * *is* the subject — there is nothing runtime-dependent to observe.
 */

const DESIGN_SYSTEM = `${themeCss}\n${settingsCss}`

/** `btn-*` tokens appearing in literal class="..." attributes. */
function usedVariants(source: string): Set<string> {
  const found = new Set<string>()
  for (const match of source.matchAll(/class="([^"]*)"/g)) {
    for (const token of match[1].split(/\s+/)) {
      if (token.startsWith('btn-')) found.add(token)
    }
  }
  return found
}

/** `btn-*` tokens with a rule in the design system. */
function definedVariants(): Set<string> {
  return new Set([...DESIGN_SYSTEM.matchAll(/\.(btn-[a-z0-9-]+)/g)].map((m) => m[1]))
}

const BUTTON_BEARING_SOURCES: Record<string, string> = {
  'PairingPanel.vue': pairingPanel,
  'ChatPanel.vue': chatPanel,
  'ConfirmDialog.vue': confirmDialog,
  'DangerPanel.vue': dangerPanel,
  'PluginsPage.vue': pluginsPage,
  'SettingsPage.vue': settingsPage,
  'UsagePage.vue': usagePage,
}

describe('design system button variants', () => {
  it('defines every btn-* variant the app uses', () => {
    const defined = definedVariants()
    const missing: string[] = []
    for (const [name, source] of Object.entries(BUTTON_BEARING_SOURCES)) {
      for (const variant of usedVariants(source)) {
        if (!defined.has(variant)) missing.push(`${name} uses undefined .${variant}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('ships the tonal danger variant that several lists need', () => {
    // Destructive actions inside a list (clear usage, uninstall plugin,
    // disconnect device) want a tonal treatment; a filled alarm-red pill is too
    // loud there. It exists as one shared variant rather than per-page overrides.
    expect(themeCss).toContain('.btn-danger-tonal')
    expect(themeCss).toContain('.btn-danger ')
    expect(definedVariants().has('btn-danger')).toBe(true)
    expect(definedVariants().has('btn-danger-tonal')).toBe(true)
  })

  it('does not express danger by border-color alone', () => {
    // `.btn` has border: none, so this pattern silently does nothing.
    const dialogDanger = /\.confirm-primary\.danger\s*\{([^}]*)\}/.exec(confirmDialog)
    expect(dialogDanger, 'expected ConfirmDialog to define a .danger treatment').not.toBeNull()
    expect(dialogDanger![1], 'a danger treatment must set background, not just border-color').toMatch(/background/)
  })

  it('gives the pairing panel buttons real variants', () => {
    // The regression: the disconnect button used class="danger", which nothing
    // defines, and the panel overrode `button { padding }` to compensate.
    const template = pairingPanel.slice(0, pairingPanel.indexOf('<style'))
    const buttonClasses = [...template.matchAll(/<button[^>]*class="([^"]*)"/g)].map((m) => m[1])
    expect(buttonClasses.length, 'expected the pairing panel to render buttons').toBeGreaterThan(0)
    for (const classes of buttonClasses) {
      expect(
        classes.split(/\s+/).some((c) => c.startsWith('btn-')),
        `pairing button class="${classes}" carries no design-system variant`,
      ).toBe(true)
    }
    expect(template, 'the undefined "danger" class must not come back').not.toMatch(/class="danger"/)
  })

  it('keeps button styling out of the pairing panel', () => {
    const style = pairingPanel.slice(pairingPanel.indexOf('<style'))
    // A local `button { ... }` rule fought `.btn`'s own padding/min-height.
    expect(style, 'do not restyle bare <button> in the panel; use a variant').not.toMatch(/(^|[\s{};])button\s*\{/)
  })
})
