// Shared highlight.js setup for read-only code views and the live code editor.
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import go from 'highlight.js/lib/languages/go'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import bash from 'highlight.js/lib/languages/bash'
import shell from 'highlight.js/lib/languages/shell'
import yaml from 'highlight.js/lib/languages/yaml'
import rust from 'highlight.js/lib/languages/rust'
import java from 'highlight.js/lib/languages/java'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import ruby from 'highlight.js/lib/languages/ruby'
import php from 'highlight.js/lib/languages/php'
import sql from 'highlight.js/lib/languages/sql'
import ini from 'highlight.js/lib/languages/ini'
import kotlin from 'highlight.js/lib/languages/kotlin'
import swift from 'highlight.js/lib/languages/swift'
import lua from 'highlight.js/lib/languages/lua'
import r from 'highlight.js/lib/languages/r'
import powershell from 'highlight.js/lib/languages/powershell'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import plaintext from 'highlight.js/lib/languages/plaintext'

const languages: Record<string, any> = {
  javascript, typescript, python, go, json, markdown, xml, css, scss, less,
  bash, shell, yaml, rust, java, c, cpp, csharp, ruby, php, sql, ini,
  kotlin, swift, lua, r, powershell, dockerfile, plaintext,
}
for (const [name, definition] of Object.entries(languages)) hljs.registerLanguage(name, definition)

// Extension → registered language. Kept small on purpose; anything unknown
// falls back to highlight.js auto-detection.
const EXT: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript',
  py: 'python', pyw: 'python', go: 'go', json: 'json', jsonc: 'json',
  md: 'markdown', markdown: 'markdown', html: 'xml', htm: 'xml', xml: 'xml', vue: 'xml', svg: 'xml',
  css: 'css', scss: 'scss', sass: 'scss', less: 'less',
  sh: 'bash', bash: 'bash', zsh: 'bash', fish: 'shell',
  yml: 'yaml', yaml: 'yaml', rs: 'rust', java: 'java',
  c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', hh: 'cpp',
  cs: 'csharp', rb: 'ruby', php: 'php', sql: 'sql',
  toml: 'ini', ini: 'ini', cfg: 'ini', conf: 'ini',
  kt: 'kotlin', kts: 'kotlin', swift: 'swift', lua: 'lua', r: 'r',
  ps1: 'powershell', psd1: 'powershell', psm1: 'powershell',
}
const SPECIAL: Record<string, string> = { dockerfile: 'dockerfile', makefile: 'makefile' }

export function langForFile(path?: string): string {
  if (!path) return ''
  const base = (path.split(/[\\/]/).pop() || '').toLowerCase()
  if (SPECIAL[base]) return SPECIAL[base]
  const ext = base.includes('.') ? base.slice(base.lastIndexOf('.') + 1) : ''
  return EXT[ext] || ''
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char] as string)
}

// Long files are shown without highlighting to keep the editor responsive.
const MAX_HIGHLIGHT = 300_000
export function highlightCode(code: string, path?: string): string {
  const value = code ?? ''
  if (value.length > MAX_HIGHLIGHT) return escapeHtml(value)
  const lang = langForFile(path)
  try {
    if (lang && lang !== 'makefile' && hljs.getLanguage(lang)) return hljs.highlight(value, { language: lang, ignoreIllegals: true }).value
    if (lang === 'makefile') return escapeHtml(value)
    return hljs.highlightAuto(value).value
  } catch { return escapeHtml(value) }
}
