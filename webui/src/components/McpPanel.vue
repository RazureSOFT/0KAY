<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiGet, apiPost } from '../api'

interface McpServerDraft {
  id: string
  transport: 'stdio' | 'http'
  command: string
  argsText: string
  url: string
  headersText: string
  enabled: boolean
}

const servers = ref<McpServerDraft[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const saved = ref(false)

function blank(): McpServerDraft {
  return { id: '', transport: 'stdio', command: '', argsText: '', url: '', headersText: '', enabled: true }
}

function toDraft(raw: any): McpServerDraft {
  return {
    id: String(raw?.id || ''),
    transport: raw?.transport === 'http' ? 'http' : 'stdio',
    command: String(raw?.command || ''),
    argsText: Array.isArray(raw?.args) ? raw.args.join('\n') : '',
    url: String(raw?.url || ''),
    headersText: raw?.headers && typeof raw.headers === 'object' ? JSON.stringify(raw.headers, null, 2) : '',
    enabled: raw?.enabled !== false,
  }
}

function toWire(draft: McpServerDraft): Record<string, unknown> {
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
    const wire = servers.value.map(toWire).filter((s) => String(s.id || '').trim())
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
        <button class="btn btn-tonal" type="button" @click="servers.push(blank())">添加服务</button>
        <button class="btn primary" type="button" :disabled="saving" @click="save">
          {{ saving ? '保存中…' : '保存' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>
    <div v-if="saved" class="notice-banner">已保存</div>
    <p v-if="loading" class="hint">加载中…</p>

    <div v-else class="mcp-list">
      <article v-for="(s, i) in servers" :key="i" class="mcp-card">
        <div class="mcp-row">
          <label class="mcp-field grow">
            <span>ID</span>
            <input v-model="s.id" placeholder="filesystem" />
          </label>
          <label class="mcp-field">
            <span>传输</span>
            <select v-model="s.transport">
              <option value="stdio">stdio</option>
              <option value="http">http</option>
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
        <template v-else>
          <label class="mcp-field">
            <span>URL</span>
            <input v-model="s.url" placeholder="https://example.com/mcp" />
          </label>
          <label class="mcp-field">
            <span>Headers（JSON）</span>
            <textarea v-model="s.headersText" rows="2" placeholder='{ "Authorization": "Bearer ..." }' />
          </label>
        </template>
      </article>

      <p v-if="!servers.length" class="hint">还没有 MCP 服务，点击「添加服务」。</p>
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

.error-banner { padding: 14px 18px; border-radius: 16px; background: var(--md-error-container); color: #410e0b; margin-bottom: var(--space-lg); }
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
  color: #410e0b;
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
</style>
