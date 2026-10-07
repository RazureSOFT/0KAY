// Adds the settings-tab keys whose labels are currently hardcoded Chinese in
// patch files / plugin manifests / Core's RegisterSection.
//
// Run: node scripts/add-settings-tab-keys.mjs
//
// Edits strings.xml (the source of truth) and leaves the JSON to `i18n.mjs
// generate`. Re-rendering through the shared helpers keeps the files sorted and
// consistently escaped.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { parseStringsXml, renderStringsXml } from './i18n.mjs'

const ADD = {
  en: {
    'settings.tabs.appearance': 'Appearance',
    'settings.tabs.life': 'L.I.F.E settings',
    'settings.tabs.adapters': 'Messaging',
    'settings.tabs.deepseekWeb': 'DeepSeek Web',
    'settings.lifeDesc': 'Models, mail, MCP and Agent host permissions. Messaging platforms are configured in their own Messaging tab.',
  },
  zh: {
    'settings.tabs.appearance': '外观',
    'settings.tabs.life': 'L.I.F.E 设置',
    'settings.tabs.adapters': '消息平台',
    'settings.tabs.deepseekWeb': 'DeepSeek 网页版',
    'settings.lifeDesc': '模型、邮件、MCP 与 Agent 主机权限；消息平台在独立的「消息平台」标签页中配置',
  },
  ja: {
    'settings.tabs.appearance': '外観',
    'settings.tabs.life': 'L.I.F.E 設定',
    'settings.tabs.adapters': 'メッセージプラットフォーム',
    'settings.tabs.deepseekWeb': 'DeepSeek Web 版',
    'settings.lifeDesc': 'モデル・メール・MCP・Agent ホスト権限。メッセージプラットフォームは専用の「メッセージプラットフォーム」タブで設定します。',
  },
  'zh-Hant': {
    'settings.tabs.appearance': '外觀',
    'settings.tabs.life': 'L.I.F.E 設定',
    'settings.tabs.adapters': '訊息平台',
    'settings.tabs.deepseekWeb': 'DeepSeek 網頁版',
    'settings.lifeDesc': '模型、郵件、MCP 與 Agent 主機權限；訊息平台在獨立的「訊息平台」標籤頁中設定',
  },
}

const DIRS = {
  en: 'values',
  zh: 'values-zh',
  ja: 'values-ja',
  'zh-Hant': 'values-b+zh+Hant',
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'strings')

for (const [locale, additions] of Object.entries(ADD)) {
  const file = path.join(root, DIRS[locale], 'strings.xml')
  const flat = parseStringsXml(await readFile(file, 'utf8'))
  let added = 0
  for (const [key, value] of Object.entries(additions)) {
    if (key in flat) continue
    flat[key] = value
    added++
  }
  await writeFile(file, renderStringsXml(flat), 'utf8')
  console.log(`${locale}: +${added} keys (${Object.keys(flat).length} total)`)
}
