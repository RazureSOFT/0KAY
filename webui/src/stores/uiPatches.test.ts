import { describe, expect, it, vi } from 'vitest'
import { isPluginAssetURL, isSafePageURL, sanitizePatchOps } from './uiPatches'

describe('isPluginAssetURL', () => {
  it('accepts same-origin plugin asset paths with query strings', () => {
    expect(isPluginAssetURL('/api/plugins/agent/ui/index.js')).toBe(true)
    expect(isPluginAssetURL('/api/plugins/darkmode/ui/theme.js?v=3')).toBe(true)
  })

  it('rejects remote, protocol-relative and script-capable values', () => {
    expect(isPluginAssetURL('https://evil.example/x.js')).toBe(false)
    expect(isPluginAssetURL('//evil.example/x.js')).toBe(false)
    expect(isPluginAssetURL('data:text/javascript,alert(1)')).toBe(false)
    expect(isPluginAssetURL('javascript:alert(1)')).toBe(false)
    expect(isPluginAssetURL('/api/other/thing.js')).toBe(false)
    expect(isPluginAssetURL('/api/plugins/x.js\r\nX: y')).toBe(false)
    expect(isPluginAssetURL('')).toBe(false)
    expect(isPluginAssetURL(null)).toBe(false)
    expect(isPluginAssetURL(42)).toBe(false)
  })
})

describe('isSafePageURL', () => {
  it('allows http(s), relative paths and anchors', () => {
    expect(isSafePageURL('https://example.com/page')).toBe(true)
    expect(isSafePageURL('/api/plugins/life/ui/panel.html')).toBe(true)
  })

  it('rejects script-capable schemes and control characters', () => {
    expect(isSafePageURL('javascript:fetch("/api/agent/exec")')).toBe(false)
    expect(isSafePageURL('data:text/html,<script>')).toBe(false)
    expect(isSafePageURL('vbscript:msgbox')).toBe(false)
    expect(isSafePageURL('https://x\r\nSet-X: 1')).toBe(false)
  })
})

describe('sanitizePatchOps', () => {
  it('keeps ops whose asset URLs are plugin-served', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ops = sanitizePatchOps([
      { target: 'bootstrap', op: 'insert', item: { id: 'b1', module: '/api/plugins/agent/ui/index.js?v=2' } },
      { target: 'theme', op: 'insert', item: { id: 't1', cssUrl: '/api/plugins/darkmode/ui/theme.css' } },
    ])
    expect(ops).toHaveLength(2)
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('drops ops that try to load remote modules or styles', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ops = sanitizePatchOps([
      { target: 'bootstrap', op: 'insert', item: { id: 'b1', module: 'https://evil.example/x.js' } },
      { target: 'theme', op: 'insert', item: { id: 't1', cssUrl: '//evil.example/x.css' } },
      { target: 'router', op: 'insert', item: { id: 'r1', path: '/x', module: 'data:text/javascript,x' } },
      { target: 'bootstrap', op: 'insert', item: { id: 'b2', module: '/api/plugins/agent/ui/index.js' } },
    ])
    expect(ops).toHaveLength(1)
    expect(ops[0].item?.id).toBe('b2')
    expect(warn).toHaveBeenCalledTimes(3)
    warn.mockRestore()
  })

  it('drops iframe/nav URLs with script-capable schemes but keeps ordinary ones', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ops = sanitizePatchOps([
      { target: 'chat', op: 'insert', item: { id: 'c1', region: 'chat', src: 'javascript:alert(1)' } },
      { target: 'chat', op: 'insert', item: { id: 'c2', region: 'chat', src: 'https://example.com/widget' } },
      { target: 'nav', op: 'insert', item: { id: 'n1', href: '/plugins' } },
    ])
    expect(ops).toHaveLength(2)
    expect(ops.map((o) => o.item?.id)).toEqual(['c2', 'n1'])
    warn.mockRestore()
  })

  it('ignores null items and non-array payloads', () => {
    expect(sanitizePatchOps(null)).toEqual([])
    expect(sanitizePatchOps([{ target: 'nav', op: 'remove', id: 'x' }])).toHaveLength(1)
    expect(sanitizePatchOps([{ target: 'nav', op: 'insert', item: null }])).toHaveLength(1)
  })
})
