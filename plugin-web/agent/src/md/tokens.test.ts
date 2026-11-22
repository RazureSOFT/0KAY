import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The design tokens must be declarable and self-consistent.
 *
 * A token that references a name declared *later* in the same `:root` block
 * silently resolves to the empty string — no error, no warning, and the CSS
 * shorthand that consumes it is then invalid, so the declaration is dropped. That
 * happened once: `--md-type-title-large-font: … var(--font-typeface)` shipped with
 * `--font-typeface` itself undefined, and every typography role rendered at the
 * browser's default 14px/400. Type checks passed, the build passed, the page
 * looked merely "off".
 *
 * This test reads the stylesheet as text and checks the properties that are easy
 * to get wrong: no token may reference a name that the file never declares, and no
 * `font:` shorthand may depend on an empty value.
 */
const themePath = resolve(__dirname, '../../../../webui/src/styles/theme.css')
const springPath = resolve(__dirname, '../../../../webui/src/styles/spring-tokens.css')

const theme = readFileSync(themePath, 'utf8')
const spring = readFileSync(springPath, 'utf8')
const all = `${spring}\n${theme}`

/** Every custom property this file declares. */
const declared = new Set([...all.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))

/** Every custom property referenced through var(). */
const referenced = [...all.matchAll(/var\((--[a-z0-9-]+)(?:\s*,)?\)?/g)].map((m) => m[1])

/**
 * References that resolve to empty are fine only when the var() states a
 * fallback (`var(--x, #fff)`). Those are deliberate, so they are not collected.
 */
const referencesWithFallback = new Set(
  [...all.matchAll(/var\((--[a-z0-9-]+)\s*,/g)].map((m) => m[1]),
)

describe('design tokens', () => {
  it('declares every token it references without a fallback', () => {
    const missing = [...new Set(referenced)].filter(
      (name) => !declared.has(name) && !referencesWithFallback.has(name),
    )
    expect(missing).toEqual([])
  })

  it('does not chain a font shorthand onto an undeclared family token', () => {
    // The specific regression: a `-font` token that builds on a family variable.
    const fontTokens = [...theme.matchAll(/(--md-type-[a-z-]+-font)\s*:\s*([^;]+);/g)]
    expect(fontTokens.length).toBeGreaterThan(0)
    for (const [, name, value] of fontTokens) {
      const family = /var\((--[a-z0-9-]+)\)\s*$/.exec(value.trim())
      if (!family) continue
      expect(declared.has(family[1]), `${name} uses undeclared ${family[1]}`).toBe(true)
    }
  })

  it('declares the shape scale at the exact ShapeTokens values', () => {
    const shape = (name) => new RegExp(`${name}\s*:\s*([^;]+);`).exec(theme)?.[1].trim()
    /* androidx ShapeTokens (v14_1_0). Both the baseline corners AND the Expressive
       "Increased" additions must exist: an extended FAB uses CornerLarge (16dp) while a
       large icon button uses CornerExtraLarge (28dp). Declaring only the Increased
       values — which this file did at first — silently rounds every component that asks
       for the baseline. */
    expect(shape('--md-shape-xs'), 'CornerExtraSmall').toBe('4px')
    expect(shape('--md-shape-small'), 'CornerSmall').toBe('8px')
    expect(shape('--md-shape-medium'), 'CornerMedium').toBe('12px')
    expect(shape('--md-shape-large'), 'CornerLarge').toBe('16px')
    expect(shape('--md-shape-large-increased'), 'CornerLargeIncreased').toBe('20px')
    expect(shape('--md-shape-xl'), 'CornerExtraLarge').toBe('28px')
    expect(shape('--md-shape-xl-increased'), 'CornerExtraLargeIncreased').toBe('32px')
    expect(shape('--md-shape-xxl'), 'CornerExtraExtraLarge').toBe('48px')
    expect(shape('--md-shape-full'), 'CornerFull').toBe('999px')
  })

  it('declares the exact TypeScaleTokens weights and tracking', () => {
    /* This is the class of mistake that a geometric audit cannot catch: the rendered
       font looks plausible, and `getComputedStyle` only echoes back what was declared.
       Both facts below run against web typography habit, and both were wrong once:
       titles are Regular (400), and tracking is 0 at the top of the scale. Source:
       `TypeScaleTokens` + `TypefaceTokens.WeightRegular/WeightMedium`. */
    const font = (role) => new RegExp(`--md-type-${role}-font\s*:\s*([^;]+);`).exec(theme)?.[1].trim()
    const track = (role) => new RegExp(`--md-type-${role}-tracking\s*:\s*([^;]+);`).exec(theme)?.[1].trim()

    // size / line-height / weight
    expect(font('title-large'), 'TitleLarge is 400, not bold').toContain('400 22px/28px')
    expect(font('title-medium')).toContain('500 16px/24px')
    expect(font('title-small')).toContain('500 14px/20px')
    expect(font('body-large')).toContain('400 16px/24px')
    expect(font('body-medium')).toContain('400 14px/20px')
    expect(font('body-small')).toContain('400 12px/16px')
    expect(font('label-large')).toContain('500 14px/20px')
    expect(font('label-medium')).toContain('500 12px/16px')
    expect(font('label-small')).toContain('500 11px/16px')

    // tracking: 0 at the largest size, growing as size shrinks
    expect(track('title-large'), 'no negative tracking').toBe('0px')
    expect(track('title-medium')).toBe('0.2px')
    expect(track('title-small')).toBe('0.1px')
    expect(track('body-large')).toBe('0.5px')
    expect(track('body-medium')).toBe('0.2px')
    expect(track('body-small')).toBe('0.4px')
    expect(track('label-large')).toBe('0.1px')
    expect(track('label-medium')).toBe('0.5px')
    expect(track('label-small')).toBe('0.5px')
  })

  it('declares every elevation level as a distinct shadow', () => {
    /* `ElevationTokens` levels are dp of cast height: 0/1/3/6/8/12. Components name the
       level, so the level must exist and must be ordered — a Level3 that is heavier
       than Level4 would make hover feel like a press. */
    const level = (n) => new RegExp(`--md-elevation-${n}\s*:\s*([^;]+);`).exec(theme)?.[1].trim()
    expect(level(0)).toBe('none')
    const taken = [1, 2, 3, 4, 5].map(level)
    expect(new Set(taken).size, 'levels must not collapse to the same shadow').toBe(5)
    for (const value of taken) expect(value).toMatch(/0 \d+px \d+px rgba/)
  })

  it('declares the three state layer opacities', () => {
    for (const [name, value] of [
      ['--md-state-hover', '0.08'],
      ['--md-state-focus', '0.10'],
      ['--md-state-pressed', '0.10'],
    ]) {
      expect(new RegExp(`${name}\\s*:\\s*${value.replace('.', '\\.')};`).test(theme), `${name} should be ${value}`).toBe(true)
    }
  })

  it('keeps the legacy radius scale separate from the MD3 shape scale', () => {
    // Both exist during the migration; the legacy values are used by existing
    // components and must not silently become the Expressive ones.
    const legacy = (name) => new RegExp(`${name}\\s*:\\s*([^;]+);`).exec(theme)?.[1].trim()
    expect(legacy('--radius-lg')).toBe('28px')
    expect(legacy('--radius-xl')).toBe('36px')
  })
})