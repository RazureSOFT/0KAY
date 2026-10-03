<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiGet, apiPost } from '../api'

type McpTransport = 'stdio' | 'http' | 'builtin'

interface McpServerDraft {
  id: string
  transport: McpTransport
  command: string
  argsText: string
  url: string
  headersText: string
  enabled: boolean
  // builtin mail server options
  imapHost: string
  imapPort: number
  imapSsl: boolean
  imapUser: string
  imapPassword: string
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPassword: string
  from: string
  fromName: string
}

const servers = ref<McpServerDraft[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const saved = ref(false)

function blank(): McpServerDraft {
  return {
    id: '', transport: 'stdio', command: '', argsText: '', url: '', headersText: '', enabled: true,
    imapHost: '', imapPort: 993, imapSsl: true, imapUser: '', imapPassword: '',
    smtpHost: '', smtpPort: 465, smtpSecure: true, smtpUser: '', smtpPassword: '',
    from: '', fromName: '0KAY',
  }
}

function toDraft(raw: any): McpServerDraft {
  const transport: McpTransport =
    raw?.transport === 'http' ? 'http' : raw?.transport === 'builtin' || raw?.builtin ? 'builtin' : 'stdio'
  const imap = raw?.options?.imap || {}
  const smtp = raw?.options?.smtp || {}
  return {
    id: String(raw?.id || ''),
    transport,
    command: String(raw?.command || ''),
    argsText: Array.isArray(raw?.args) ? raw.args.join('\n') : '',
    url: String(raw?.url || ''),
    headersText: raw?.headers && typeof raw.headers === 'object' ? JSON.stringify(raw.headers, null, 2) : '',
    enabled: raw?.enabled !== false,
    imapHost: String(imap.host || ''), imapPort: Number(imap.port) || 993, imapSsl: imap.ssl !== false,
    imapUser: String(imap.user || ''), imapPassword: String(imap.password || ''),
    smtpHost: String(smtp.host || ''), smtpPort: Number(smtp.port) || 465, smtpSecure: smtp.secure !== false,
    smtpUser: String(smtp.user || ''), smtpPassword: String(smtp.password || ''),
    from: String(smtp.from || ''), fromName: String(smtp.fromName || '0KAY'),
  }
}

function toWire(draft: McpServerDraft): Record<string, unknown> {
  if (draft.transport === 'builtin') {
    const options: Record<string, unknown> = {}
    if (draft.imapHost.trim() || draft.imapUser.trim()) {
      options.imap = {
        host: draft.imapHost.trim(), port: Number(draft.imapPort) || 993, ssl: draft.imapSsl,
        user: draft.imapUser.trim(), password: draft.imapPassword,
      }
    }
    if (draft.smtpHost.trim() || draft.smtpUser.trim() || draft.from.trim()) {
      options.smtp = {
        host: draft.smtpHost.trim(), port: Number(draft.smtpPort) || 465, secure: draft.smtpSecure,
        user: draft.smtpUser.trim(), password: draft.smtpPassword,
        from: draft.from.trim(), fromName: draft.fromName.trim() || '0KAY',
      }
    }
    return { id: draft.id.trim() || 'mail', transport: 'builtin', builtin: 'mail', enabled: draft.enabled, options }
  }
  const out: Record<string, unknown> = { id: draft.id.trim(), transport: draft.transport, enabled: draft.enabled }
  if (draft.transport === 'http') {
    if (draft.url.trim()) out.url = draft.url.trim()
    if (draft.headersText.trim()) {
      try {
        out.headers = JSON.parse(draft.headersText)
      } catch {
        throw new Error(`服务「${draft.id || '(未命名)'}」的 Headers 不是合法 JSON`)
      }
    }
  } else {
    if (draft.command.trim()) out.command = draft.command.trim()
    const args = draft.argsText.split('\n').map((line) => line.trim()).filter(Boolean)
    if (args.length) out.args = args
  }
  return out
}

/** The built-in mail server must keep id "mail": L.I.F.E calls server "mail". */
function onTransportChange(draft: McpServerDraft) {
  if (draft.transport === 'builtin') draft.id = 'mail'
}

function addServer() {
  const draft = blank()
  // Only one built-in mail server makes sense; prefill id when it is absent.
  if (servers.value.some((s) => s.transport === 'builtin')) draft.transport = 'stdio'
  servers.value.push(draft)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await apiGet('/api/settings/mcp')
    const raw = data?.values?.servers
    let list: any[] = []
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) list = parsed
      } catch {
        error.value = '已保存的 MCP 配置不是合法 JSON，已忽略。'
      }
    }
    servers.value = list.map(toDraft)
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

async function save() {
  if (saving.value) return
  saving.value = true
  error.value = ''
  saved.value = false
  try {
    const seen = new Set<string>()
    const wire = servers.value
      .map(toWire)
      .filter((s) => {
        const id = String(s.id || '').trim()
        if (!id || seen.has(id)) return false
        seen.add(id)
        return true
      })
    await apiPost('/api/settings/mcp', { values: { servers: JSON.stringify(wire) } })
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } catch (e: any) {
    error.value = e?.message || String(e)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="mcp-panel">
    <header class="mcp-head">
      <div>
        <h2>MCP 服务</h2>
        <p class="subtitle">配置外部 MCP（模型上下文协议）服务。保存后 Agent 与 L.I.F.E 共用同一份配置。</p>
      </div>
      <div class="mcp-actions">
        <button class="btn btn-tonal" type="button" @click="addServer">添加服务</button>
        <button class="btn primary" type="button" :disabled="saving" @click="save">
          {{ saving ? '保存中…' : '保存' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="saved" class="notice-banner">已保存</div>
    <p v-if="loading" class="hint">加载中…</p>

    <div v-else class="mcp-list">
      <article v-for="(s, i) in servers" :key="i" class="mcp-card" :class="{ 'is-builtin': s.transport === 'builtin' }">
        <div class="mcp-row">
          <label class="mcp-field grow">
            <span>ID</span>
            <input v-model="s.id" :readonly="s.transport === 'builtin'" placeholder="filesystem" />
          </label>
          <label class="mcp-field">
            <span>传输</span>
            <select v-model="s.transport" @change="onTransportChange(s)">
              <option value="stdio">stdio</option>
              <option value="http">http</option>
              <option value="builtin">内置邮件 (mail)</option>
            </select>
          </label>
          <label class="mcp-toggle">
            <input type="checkbox" v-model="s.enabled" />
            <span>启用</span>
          </label>
          <button class="mcp-remove" type="button" @click="servers.splice(i, 1)">删除</button>
        </div>

        <template v-if="s.transport === 'stdio'">
          <label class="mcp-field">
            <span>命令</span>
            <input v-model="s.command" placeholder="npx" />
          </label>
          <label class="mcp-field">
            <span>参数（每行一个）</span>
            <textarea v-model="s.argsText" rows="2" placeholder="-y&#10;@modelcontextprotocol/server-filesystem&#10;C:\work" />
          </label>
        </template>

        <template v-else-if="s.transport === 'http'">
          <label class="mcp-field">
            <span>URL</span>
            <input v-model="s.url" placeholder="https://example.com/mcp" />
          </label>
          <label class="mcp-field">
            <span>Headers（JSON）</span>
            <textarea v-model="s.headersText" rows="2" placeholder='{ "Authorization": "Bearer ..." }' />
          </label>
        </template>

        <template v-else>
          <p class="builtin-note">内置 0kay-mcp 邮件服务器：L.I.F.E 的 <code>getmail</code> / <code>sendmail</code> 工具经此收发邮件。留空表示不启用对应方向。</p>
          <div class="mail-grid">
            <div class="mail-col">
              <p class="mail-label">收信 · IMAP</p>
              <label class="mcp-field"><span>主机</span><input v-model="s.imapHost" placeholder="imap.example.com" autocomplete="off" /></label>
              <div class="mail-row">
                <label class="mcp-field"><span>端口</span><input v-model.number="s.imapPort" type="number" placeholder="993" /></label>
                <label class="mcp-toggle"><input type="checkbox" v-model="s.imapSsl" /><span>SSL</span></label>
              </div>
              <label class="mcp-field"><span>用户名</span><input v-model="s.imapUser" placeholder="user@example.com" autocomplete="off" /></label>
              <label class="mcp-field"><span>密码 / 应用专用密码</span><input v-model="s.imapPassword" type="password" placeholder="••••••••" autocomplete="new-password" /></label>
            </div>

            <div class="mail-col">
              <p class="mail-label">发信 · SMTP</p>
              <label class="mcp-field"><span>主机</span><input v-model="s.smtpHost" placeholder="smtp.example.com" autocomplete="off" /></label>
              <div class="mail-row">
                <label class="mcp-field"><span>端口</span><input v-model.number="s.smtpPort" type="number" placeholder="465" /></label>
                <label class="mcp-toggle"><input type="checkbox" v-model="s.smtpSecure" /><span>SSL（465）</span></label>
              </div>
              <label class="mcp-field"><span>用户名</span><input v-model="s.smtpUser" placeholder="user@example.com" autocomplete="off" /></label>
              <label class="mcp-field"><span>密码 / 应用专用密码</span><input v-model="s.smtpPassword" type="password" placeholder="••••••••" autocomplete="new-password" /></label>
              <div class="mail-row">
                <label class="mcp-field grow"><span>发件人地址（可选）</span><input v-model="s.from" placeholder="留空用 SMTP 用户名" autocomplete="off" /></label>
                <label class="mcp-field"><span>发件人昵称</span><input v-model="s.fromName" placeholder="0KAY" autocomplete="off" /></label>
              </div>
            </div>
          </div>
        </template>
      </article>

      <p v-if="!servers.length" class="hint">还没有 MCP 服务，点击「添加服务」。传输选择「内置邮件」可配置邮箱收发。</p>
    </div>
  </div>
</template>

<style scoped>
.mcp-panel { max-width: 900px; }
.mcp-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}
.mcp-head h2 { margin: 0; font-size: clamp(22px, 2.4vw, 30px); font-weight: 800; letter-spacing: -.02em; }
.subtitle { margin: 8px 0 0; color: var(--md-on-surface-variant); font-size: 14px; line-height: 1.6; max-width: 60ch; }
.mcp-actions { display: flex; gap: 10px; }

.error-banner { padding: 14px 18px; border-radius: 16px; background: var(--md-error-container); color: var(--md-on-error-container); margin-bottom: var(--space-lg); }
.notice-banner { padding: 14px 18px; border-radius: 16px; background: var(--md-secondary-container); color: var(--md-on-secondary-container); margin-bottom: var(--space-lg); }
.hint { color: var(--md-on-surface-variant); font-size: 14px; }

.mcp-list { display: flex; flex-direction: column; gap: var(--space-md, 16px); }
.mcp-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  background: var(--md-surface-container-low);
}
.mcp-card.is-builtin {
  border-color: color-mix(in srgb, var(--md-primary) 34%, var(--md-outline-variant));
  background: var(--md-surface-container);
}
.mcp-row { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.mcp-field { display: flex; flex-direction: column; gap: 6px; min-width: 160px; }
.mcp-field.grow { flex: 1; }
.mcp-field > span { font-size: 12px; font-weight: 700; letter-spacing: .04em; color: var(--md-on-surface-variant); }
.mcp-field input, .mcp-field select, .mcp-field textarea {
  font: inherit;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  outline: none;
}
.mcp-field input[readonly] { opacity: .7; }
.mcp-field textarea { resize: vertical; font-family: ui-monospace, monospace; font-size: 13px; }
.mcp-field input:focus, .mcp-field select:focus, .mcp-field textarea:focus {
  border-color: var(--md-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 14%, transparent);
}
.mcp-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 650; color: var(--md-on-surface-variant); user-select: none; }
.mcp-remove {
  margin-left: auto;
  border: 0;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 650;
  cursor: pointer;
  background: var(--md-error-container);
  color: var(--md-on-error-container);
}

/* Built-in mail fields */
.builtin-note { margin: 0; font-size: 12.5px; line-height: 1.6; color: var(--md-on-surface-variant); }
.builtin-note code { font-family: ui-monospace, monospace; }
.mail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.mail-col { display: flex; flex-direction: column; gap: 10px; }
.mail-row { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.mail-label {
  margin: 0; font-size: 12px; font-weight: 800; letter-spacing: .09em;
  text-transform: uppercase; color: var(--md-on-surface-variant);
}

.btn {
  height: 44px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.btn-tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.btn.primary { background: var(--md-primary); color: var(--md-on-primary); }
.btn:disabled { opacity: .6; cursor: not-allowed; }

@media (max-width: 720px) {
  .mail-grid { grid-template-columns: 1fr; }
}
</style>
