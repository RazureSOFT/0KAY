import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import coreRaw from '../../core/data/ui/fluentui.patch?raw'
import pkgRaw from '../../plugin-web/fluentui/patches/fluentui.patch?raw'
import manifestRaw from '../../plugin-web/fluentui/manifest.json?raw'
import { createPinia, setActivePinia } from 'pinia'
import {
  applyThemePatches,
  buildThemeCSS,
  resetThemePatches,
  resolveTokenSets,
  sortThemePatches,
  THEME_LINK_PREFIX,
  THEME_STYLE_PREFIX,
  type ThemePatchItem,
} from './theme'
import { useUIPatchesStore } from './stores/uiPatches'

function fakeDoc() {
  const head = {
    children: [] as any[],
    appendChild(node: any) {
      const i = head.children.indexOf(node)
      if (i >= 0) head.children.splice(i, 1)
      head.children.push(node)
      return node
    },
    querySelectorAll() {
      return []
    },
    get lastElementChild() {
      return head.children[head.children.length - 1] ?? null
    },
  }
  const doc = {
    head,
    createElement(tag: string) {
      return {
        id: '',
        tag,
        textContent: '',
        rel: '',
        href: '',
        remove(this: any) {
          const i = head.children.indexOf(this)
          if (i >= 0) head.children.splice(i, 1)
        },
      }
    },
  }
  return { doc, head }
}

const idsOf = (head: any) => head.children.map((n: any) => n.id)

describe('resolveTokenSets', () => {
  it('treats a flat map as applying to both schemes', () => {
    const { light, dark } = resolveTokenSets({ '--md-primary': '#111111' })
    expect(light).toEqual({ '--md-primary': '#111111' })
    expect(dark).toEqual({ '--md-primary': '#111111' })
  })

  it('keeps explicit light/dark maps apart', () => {
    const { light, dark } = resolveTokenSets({
      light: { '--md-primary': '#111' },
      dark: { '--md-primary': '#222' },
    })
    expect(light).toEqual({ '--md-primary': '#111' })
    expect(dark).toEqual({ '--md-primary': '#222' })
  })

  it('drops non custom-property keys and unsafe values', () => {
    const { light } = resolveTokenSets({
      '--md-primary': '#123456',
      color: 'red',
      '--md-evil': 'red; } body { background',
      '--md-gradient': 'linear-gradient(1deg, #fff, #000)',
    })
    expect(light).toEqual({
      '--md-primary': '#123456',
      '--md-gradient': 'linear-gradient(1deg, #fff, #000)',
    })
  })

  it('returns empty maps for missing tokens', () => {
    expect(resolveTokenSets(undefined)).toEqual({ light: {}, dark: {} })
    expect(resolveTokenSets(null as any)).toEqual({ light: {}, dark: {} })
  })
})

describe('buildThemeCSS', () => {
  it('emits light then dark blocks with equal-specificity selectors', () => {
    const css = buildThemeCSS({
      id: 'demo',
      tokens: { light: { '--md-primary': '#a1' }, dark: { '--md-primary': '#a2' } },
    })
    expect(css).toBe(
      'html:root {\n  --md-primary: #a1;\n}\nhtml:root:where([data-theme="dark"]) {\n  --md-primary: #a2;\n}',
    )
    expect(css.indexOf('data-theme="dark"]')).toBeGreaterThan(css.indexOf('html:root {'))
  })

  it('omits a scheme the plugin did not define', () => {
    const css = buildThemeCSS({ id: 'demo', tokens: { dark: { '--md-primary': '#a2' } } })
    expect(css).toContain('html:root:where([data-theme="dark"])')
    expect(css).not.toContain('html:root {')
  })

  it('appends raw css after the token declarations', () => {
    const css = buildThemeCSS({
      id: 'demo',
      tokens: { light: { '--md-primary': '#a1' } },
      css: '#app .hero { color: hotpink }',
    })
    expect(css.endsWith('#app .hero { color: hotpink }')).toBe(true)
  })

  it('compiles an empty item to an empty string', () => {
    expect(buildThemeCSS({ id: 'demo' })).toBe('')
    expect(buildThemeCSS(null)).toBe('')
  })
})

describe('sortThemePatches', () => {
  it('orders ascending and keeps items without an order last', () => {
    const items: ThemePatchItem[] = [
      { id: 'c', order: 30 },
      { id: 'b' },
      { id: 'a', order: 10 },
    ]
    expect(sortThemePatches(items).map((i) => i.id)).toEqual(['a', 'c', 'b'])
  })

  it('drops items without an id', () => {
    expect(sortThemePatches([{ id: '' } as any, {} as any])).toEqual([])
  })
})

describe('applyThemePatches', () => {
  beforeEach(() => resetThemePatches())

  it('mounts one style per item in patch order', () => {
    const { doc, head } = fakeDoc()
    applyThemePatches(
      [
        { id: 'second', order: 20, tokens: { light: { '--md-primary': '#222' } } },
        { id: 'first', order: 10, tokens: { light: { '--md-primary': '#111' } } },
      ],
      doc,
    )
    expect(idsOf(head)).toEqual([THEME_STYLE_PREFIX + 'first', THEME_STYLE_PREFIX + 'second'])
  })

  it('updates css in place without duplicating nodes', () => {
    const { doc, head } = fakeDoc()
    applyThemePatches([{ id: 'a', tokens: { light: { '--md-primary': '#111' } } }], doc)
    applyThemePatches([{ id: 'a', tokens: { light: { '--md-primary': '#222' } } }], doc)
    expect(idsOf(head)).toEqual([THEME_STYLE_PREFIX + 'a'])
    expect(head.children[0].textContent).toContain('--md-primary: #222;')
  })

  it('reorders when the patch order changes', () => {
    const { doc, head } = fakeDoc()
    applyThemePatches(
      [
        { id: 'a', order: 10, tokens: { light: { '--md-primary': '#111' } } },
        { id: 'b', order: 20, tokens: { light: { '--md-primary': '#222' } } },
      ],
      doc,
    )
    applyThemePatches(
      [
        { id: 'a', order: 30, tokens: { light: { '--md-primary': '#111' } } },
        { id: 'b', order: 20, tokens: { light: { '--md-primary': '#222' } } },
      ],
      doc,
    )
    expect(idsOf(head)).toEqual([THEME_STYLE_PREFIX + 'b', THEME_STYLE_PREFIX + 'a'])
  })

  it('adds a link for cssUrl and swaps the href when it changes', () => {
    const { doc, head } = fakeDoc()
    applyThemePatches([{ id: 'a', cssUrl: '/api/plugins/x/ui/theme.css' }], doc)
    expect(idsOf(head)).toEqual([THEME_LINK_PREFIX + 'a'])
    expect(head.children[0]).toMatchObject({
      rel: 'stylesheet',
      href: '/api/plugins/x/ui/theme.css',
    })
    applyThemePatches([{ id: 'a', cssUrl: '/api/plugins/x/ui/v2.css' }], doc)
    expect(idsOf(head)).toEqual([THEME_LINK_PREFIX + 'a'])
    expect(head.children[0].href).toBe('/api/plugins/x/ui/v2.css')
  })

  it('prunes nodes whose item was removed', () => {
    const { doc, head } = fakeDoc()
    applyThemePatches(
      [
        { id: 'a', tokens: { light: { '--md-primary': '#111' } }, cssUrl: '/a.css' },
        { id: 'b', tokens: { light: { '--md-primary': '#222' } } },
      ],
      doc,
    )
    applyThemePatches([{ id: 'b', tokens: { light: { '--md-primary': '#222' } } }], doc)
    expect(idsOf(head)).toEqual([THEME_STYLE_PREFIX + 'b'])
  })

  it('leaves unrelated stylesheets (darkmode wipe) alone', () => {
    const { doc, head } = fakeDoc()
    head.children.push({ id: '0kay-theme-wipe' }, { id: '0kay-darkmode-style' })
    applyThemePatches([{ id: 'a', tokens: { light: { '--md-primary': '#111' } } }], doc)
    expect(idsOf(head)).toEqual([
      '0kay-theme-wipe',
      '0kay-darkmode-style',
      THEME_STYLE_PREFIX + 'a',
    ])
  })

  it('is a no-op without a document', () => {
    expect(() =>
      applyThemePatches([{ id: 'a', tokens: { light: { '--md-primary': '#111' } } }]),
    ).not.toThrow()
  })

  it('moves ahead of sheets another script injected later', () => {
    const { doc, head } = fakeDoc()
    const item: ThemePatchItem = { id: 'a', tokens: { light: { '--md-primary': '#111' } } }
    applyThemePatches([item], doc)
    head.appendChild({ id: '0kay-darkmode-style' })
    expect(idsOf(head)).toEqual([THEME_STYLE_PREFIX + 'a', '0kay-darkmode-style'])
    applyThemePatches([item], doc)
    expect(idsOf(head)).toEqual(['0kay-darkmode-style', THEME_STYLE_PREFIX + 'a'])
  })
})

describe('uiPatches store themePatches', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => vi.unstubAllGlobals())

  it('applies insert/remove/replace ops in order', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              ops: [
                {
                  target: 'theme',
                  op: 'insert',
                  id: 'b',
                  item: { id: 'b', order: 20, tokens: { light: { '--md-primary': '#b' } } },
                },
                {
                  target: 'theme',
                  op: 'insert',
                  id: 'a',
                  item: { id: 'a', order: 10, tokens: { light: { '--md-primary': '#a' } } },
                },
                { target: 'theme', op: 'remove', id: 'b' },
                {
                  target: 'theme',
                  op: 'replace',
                  id: 'a',
                  item: { id: 'a', order: 5, tokens: { light: { '--md-primary': '#z' } } },
                },
                { target: 'nav', op: 'insert', id: 'x', item: { id: 'x', to: '/x' } },
              ],
            }),
            { status: 200 },
          ),
      ),
    )
    const store = useUIPatchesStore()
    await store.fetchPatches()
    expect(store.themePatches.map((t) => t.id)).toEqual(['a'])
    expect(store.themePatches[0]).toMatchObject({
      order: 5,
      tokens: { light: { '--md-primary': '#z' } },
    })
  })
})

describe('shipped Fluent theme patch', () => {
  const read = (text: string) => JSON.parse(text)
  const core = read(coreRaw)
  const item = core.patches.find((p: any) => p.target === 'theme').item

  it('compiles every declared token without the sanitizer dropping any', () => {
    const css = buildThemeCSS(item)
    for (const scheme of ['light', 'dark']) {
      expect(item.tokens[scheme]).toBeDefined()
      for (const key of Object.keys(item.tokens[scheme])) expect(css).toContain(`${key}:`)
    }
    expect(css).toContain('html:root {')
    expect(css).toContain('html:root:where([data-theme="dark"]) {')
    expect(css).toContain('#app .btn {')
    expect(css).toContain(':focus-visible { outline: 2px solid var(--md-primary);')
  })

  it('keeps the pm package copy in sync', () => {
    const pkg = read(pkgRaw)
    expect(pkg.enabled).toBe(true)
    expect(pkg.plugin).toBe('fluentui')
    expect(pkg).toEqual(core)

    const manifest = read(manifestRaw)
    expect(manifest.patches).toEqual(['patches/fluentui.patch'])
    expect(manifest.version).toBe(pkg.version)
    expect(pkg.id).toBe('fluentui-theme')
  })
})
