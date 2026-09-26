<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { confirm } = useConfirm()

type Memory = {
  id: string
  content: string
  importance: number
  strength: number
  created_at: string
  last_recalled?: string
  recall_count?: number
  tags: string[]
  tier: string
  scope?: string
  memory_type?: string
  source_kind?: string
}
type Note = { note_id: string; preview: string; bytes: number }
type Reflection = {
  id: string
  session_id: string
  status: string
  statement: string
  risk: string
  created_at: string
  user_text: string
  assistant_text: string
}

const tab = ref<'memories' | 'notes' | 'reflections'>('memories')
const query = ref('')
const tier = ref('')
const sort = ref('recent')
const offset = ref(0)
const limit = 30
const memories = ref<Memory[]>([])
const total = ref(0)
const stats = ref<any>({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 })
const loading = ref(false)
const error = ref('')
const notice = ref('')
const expanded = ref<string>('')

const notes = ref<Note[]>([])
const noteQuery = ref('')
const noteForm = ref({ title: '', content: '', tags: '' })
const reading = ref<{ note_id: string; content: string; total_lines: number; has_more: boolean; offset: number } | null>(null)

const reflections = ref<Reflection[]>([])
const reflectionStatus = ref('proposed')

const pages = computed(() => Math.max(1, Math.ceil(total.value / limit)))
const page = computed(() => Math.floor(offset.value / limit) + 1)

function pct(value: number) { return `${Math.round(Math.max(0, Math.min(1, value || 0)) * 100)}%` }
function label(t: string) { return t === 'long_term' ? '长期记忆' : t === 'short_term' ? '短期记忆' : '工作记忆' }
function fmtTime(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
}
function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, 2000) }

async function call(action: string, payload: any) {
  const response = await fetch('/api/life/companion', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  if (!response.ok) throw new Error((await response.text()) || `HTTP ${response.status}`)
  return response.json().catch(() => ({}))
}

async function loadStats() {
  try {
    const response = await fetch('/api/life/memories?limit=1')
    if (response.ok) {
      const body = await response.json()
      if (body.stats) stats.value = body.stats
    }
  } catch { /* optional */ }
}

async function loadMemories() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_page', { tier: tier.value, query: query.value.trim(), limit, offset: offset.value, sort: sort.value })
    memories.value = body.items || []
    total.value = body.total || 0
  } catch (cause: any) { error.value = cause?.message || '无法读取记忆' }
  finally { loading.value = false }
}

async function loadNotes() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_note_list', { query: noteQuery.value.trim(), limit: 60 })
    notes.value = body.notes || []
  } catch (cause: any) { error.value = cause?.message || '无法读取笔记' }
  finally { loading.value = false }
}

async function loadReflections() {
  loading.value = true
  error.value = ''
  try {
    const body = await call('memory_reflection_list', { status: reflectionStatus.value, limit: 80 })
    reflections.value = body.reflections || []
  } catch (cause: any) { error.value = cause?.message || '无法读取反思提案' }
  finally { loading.value = false }
}

function refresh() {
  if (tab.value === 'notes') return loadNotes()
  if (tab.value === 'reflections') return loadReflections()
  return loadMemories()
}

async function reinforce(memory: Memory) {
  try { await call('memory_reinforce', { ids: [memory.id] }); flash('已再巩固'); await loadMemories() }
  catch (cause: any) { error.value = cause?.message || '强化失败' }
}
async function bumpImportance(memory: Memory, delta: number) {
  try { await call('memory_importance', { id: memory.id, delta }); await loadMemories() }
  catch (cause: any) { error.value = cause?.message || '调整失败' }
}
async function exportMemories() {
  try {
    const body = await call('memory_export', {})
    const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `0kay-memory-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    flash('已导出记忆快照')
  } catch (cause: any) { error.value = cause?.message || '导出失败' }
}
const importInput = ref<HTMLInputElement | null>(null)
async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const snapshot = JSON.parse(await file.text())
    const result = await call('memory_import', { snapshot })
    flash(`导入完成：新增 ${result.imported || 0} · 跳过 ${result.skipped || 0}`)
    await loadMemories(); await loadStats()
  } catch (cause: any) { error.value = cause?.message || '导入失败' }
  finally { input.value = '' }
}

async function removeMemory(memory: Memory) {
  const ok = await confirm({ title: '删除记忆', message: '删除会撤销该记忆并重建检索投影，继续吗？', confirmLabel: '删除', danger: true })
  if (!ok) return
  try { await call('delete_memory', { id: memory.id }); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || '删除失败' }
}

async function clearAll() {
  const ok = await confirm({ title: '清除全部记忆', message: '这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？', confirmLabel: '全部清除', danger: true })
  if (!ok) return
  try { await call('clear_all_memory', {}); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || '清除失败' }
}

async function createNote() {
  if (!noteForm.value.content.trim() && !noteForm.value.title.trim()) return
  try {
    await call('memory_note_create', {
      title: noteForm.value.title,
      content: noteForm.value.content,
      tags: noteForm.value.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    noteForm.value = { title: '', content: '', tags: '' }
    flash('笔记已保存'); await loadNotes()
  } catch (cause: any) { error.value = cause?.message || '保存笔记失败' }
}

async function readNote(note: Note, offset = 1) {
  try {
    const body = await call('memory_note_read', { note_id: note.note_id, offset, limit: 400 })
    reading.value = { ...body, offset: body.offset || offset }
  } catch (cause: any) { error.value = cause?.message || '读取笔记失败' }
}

async function deleteNote(note: Note) {
  const ok = await confirm({ title: '删除笔记', message: `删除笔记「${note.note_id}」及其分块？`, confirmLabel: '删除', danger: true })
  if (!ok) return
  try { await call('memory_note_delete', { note_id: note.note_id }); if (reading.value?.note_id === note.note_id) reading.value = null; await loadNotes() }
  catch (cause: any) { error.value = cause?.message || '删除笔记失败' }
}

async function reviewReflection(item: Reflection, accept: boolean) {
  try { await call('memory_reflection_review', { id: item.id, accept }); await loadReflections(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || '审核失败' }
}

async function runMaintenance() {
  try { const body = await call('memory_maintenance', {}); flash(`维护完成：巩固 ${body.consolidated ?? 0} 条`); await loadMemories(); await loadStats() }
  catch (cause: any) { error.value = cause?.message || '维护失败' }
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(query, () => { offset.value = 0; if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(loadMemories, 250) })
watch([tier, sort], () => { offset.value = 0; loadMemories() })
watch(noteQuery, () => { if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(loadNotes, 250) })
watch(reflectionStatus, loadReflections)
watch(tab, refresh)
onMounted(async () => { await loadMemories(); await loadStats() })
</script>

<template>
  <main class="page memory-page">
    <div class="page-inner">
      <header class="page-header">
        <div>
          <p class="eyebrow">L.I.F.E / MEMORY</p>
          <h1>记忆管理台</h1>
          <p class="subtitle">浏览 LIFE 的记忆分层、强度与召回；管理笔记、审核反思提案。记忆由 LIFE 插件维护，禁用后此入口消失。</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-tonal" :disabled="loading" @click="runMaintenance">巩固维护</button>
          <button class="btn btn-danger" :disabled="loading" @click="clearAll">一键清除</button>
          <button class="btn btn-tonal" :disabled="loading" @click="refresh">{{ loading ? '加载中…' : '刷新' }}</button>
        </div>
      </header>

      <section class="stat-grid">
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-1" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="stat-label">工作记忆</span></div>
          <strong class="stat-value">{{ stats.working }}</strong><span class="stat-hint">当前上下文</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">短期记忆</span></div>
          <strong class="stat-value">{{ stats.shortTerm?.total || 0 }}</strong><span class="stat-hint">待巩固记录</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-3" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="stat-label">长期记忆</span></div>
          <strong class="stat-value">{{ stats.longTerm || 0 }}</strong><span class="stat-hint">稳定沉淀</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-4" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">平均强度</span></div>
          <strong class="stat-value">{{ pct(stats.avgStrength) }}</strong><span class="stat-hint">遗忘曲线后的值</span>
        </article>
      </section>

      <nav class="tabs">
        <button :class="{ active: tab === 'memories' }" @click="tab = 'memories'">记忆</button>
        <button :class="{ active: tab === 'notes' }" @click="tab = 'notes'">笔记</button>
        <button :class="{ active: tab === 'reflections' }" @click="tab = 'reflections'">反思提案</button>
      </nav>

      <!-- Memories -->
      <template v-if="tab === 'memories'">
        <section class="card toolbar">
          <div class="search-field">
            <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <input v-model="query" placeholder="搜索记忆内容或标签" aria-label="搜索记忆" />
          </div>
          <label class="select"><span>层级</span>
            <select v-model="tier"><option value="">全部</option><option value="short_term">短期</option><option value="long_term">长期</option></select>
          </label>
          <label class="select"><span>排序</span>
            <select v-model="sort"><option value="recent">最近</option><option value="strength">强度</option><option value="importance">重要性</option><option value="recall">召回次数</option></select>
          </label>
          <span class="chip muted">{{ total }} 条 · 第 {{ page }}/{{ pages }} 页</span>
          <button class="btn btn-tonal btn-sm" @click="exportMemories">导出</button>
          <button class="btn btn-tonal btn-sm" @click="importInput?.click()">导入</button>
          <input ref="importInput" type="file" accept="application/json,.json" class="hidden-input" @change="onImportFile" />
        </section>

        <section class="memory-list">
          <article v-for="memory in memories" :key="memory.id" class="memory-card" :class="{ open: expanded === memory.id }">
            <div class="card-top">
              <span class="chip" :class="'tier-' + (memory.tier === 'long_term' ? 'long' : 'short')">{{ label(memory.tier) }}</span>
              <span v-if="memory.scope && memory.scope !== 'public'" class="chip muted">{{ memory.scope }}</span>
              <span class="chip muted">{{ memory.memory_type || 'knowledge' }}</span>
              <button class="btn-icon danger" title="删除记忆" @click="removeMemory(memory)"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
            <p class="memory-content">{{ memory.content }}</p>
            <div v-if="memory.tags?.length" class="tags"><span v-for="tag in memory.tags" :key="tag">#{{ tag }}</span></div>
            <footer class="memory-foot">
              <div class="meter" title="重要性"><span>重要性</span><div class="meter-bar"><i :style="{ width: pct(memory.importance) }" class="fill-primary"></i></div><b>{{ pct(memory.importance) }}</b></div>
              <div class="meter" title="强度"><span>强度</span><div class="meter-bar"><i :style="{ width: pct(memory.strength) }" class="fill-secondary"></i></div><b>{{ pct(memory.strength) }}</b></div>
              <span class="meter-text">召回 {{ memory.recall_count || 0 }} 次</span>
            </footer>
            <div v-if="expanded === memory.id" class="detail">
              <dl>
                <div><dt>ID</dt><dd><code>{{ memory.id }}</code></dd></div>
                <div><dt>来源</dt><dd>{{ memory.source_kind || 'conversation' }}</dd></div>
                <div><dt>创建</dt><dd>{{ fmtTime(memory.created_at) }}</dd></div>
                <div><dt>最近召回</dt><dd>{{ fmtTime(memory.last_recalled) }}</dd></div>
              </dl>
            </div>
            <div class="card-actions">
              <button class="btn btn-sm btn-tonal" @click="expanded = expanded === memory.id ? '' : memory.id">{{ expanded === memory.id ? '收起' : '详情' }}</button>
              <button class="btn btn-sm btn-tonal" @click="bumpImportance(memory, 0.1)">重要 +</button>
              <button class="btn btn-sm btn-tonal" @click="bumpImportance(memory, -0.1)">重要 −</button>
              <button class="btn btn-sm btn-tonal" @click="reinforce(memory)">再巩固</button>
            </div>
          </article>
          <div v-if="!loading && !memories.length" class="empty-state"><p>暂无匹配记忆</p><p class="hint">LIFE 会在对话与工具调用中逐步沉淀记忆。</p></div>
        </section>

        <div class="pager" v-if="pages > 1">
          <button class="btn btn-tonal btn-sm" :disabled="offset === 0" @click="offset = Math.max(0, offset - limit); loadMemories()">上一页</button>
          <span class="chip muted">{{ page }} / {{ pages }}</span>
          <button class="btn btn-tonal btn-sm" :disabled="page >= pages" @click="offset += limit; loadMemories()">下一页</button>
        </div>
      </template>

      <!-- Notes -->
      <template v-else-if="tab === 'notes'">
        <section class="grid-notes">
          <article class="card">
            <div class="card-head"><h2 class="card-title">新建笔记</h2></div>
            <form class="stack-form" @submit.prevent="createNote">
              <input v-model="noteForm.title" class="input" placeholder="标题" aria-label="笔记标题" />
              <input v-model="noteForm.tags" class="input" placeholder="标签（逗号分隔，可选）" aria-label="笔记标签" />
              <textarea v-model="noteForm.content" class="input area" placeholder="笔记正文…" aria-label="笔记正文"></textarea>
              <button class="btn btn-primary" type="submit" :disabled="!noteForm.content.trim() && !noteForm.title.trim()">保存笔记</button>
            </form>
          </article>
          <article class="card">
            <div class="card-head"><h2 class="card-title">笔记库</h2><span class="chip muted">{{ notes.length }}</span></div>
            <div class="search-field mini"><input v-model="noteQuery" placeholder="搜索笔记…" aria-label="搜索笔记" /></div>
            <ul class="note-list">
              <li v-for="note in notes" :key="note.note_id" class="note-item">
                <div class="note-main">
                  <strong>{{ note.note_id }}</strong>
                  <span class="item-meta">{{ note.preview?.slice(0, 90) || '（空）' }}</span>
                  <span class="item-meta">{{ (note.bytes / 1024).toFixed(1) }} KB</span>
                </div>
                <div class="note-actions">
                  <button class="btn btn-sm btn-tonal" @click="readNote(note)">阅读</button>
                  <button class="btn btn-sm btn-danger" @click="deleteNote(note)">删除</button>
                </div>
              </li>
              <li v-if="!notes.length" class="list-empty">还没有笔记。LIFE 或你可以把长内容写入笔记并参与检索。</li>
            </ul>
          </article>
        </section>
        <section v-if="reading" class="card reader">
          <div class="card-head"><h2 class="card-title">{{ reading.note_id }}</h2><button class="btn btn-sm btn-tonal" @click="reading = null">关闭</button></div>
          <pre>{{ reading.content }}</pre>
          <div class="pager">
            <button class="btn btn-tonal btn-sm" :disabled="reading.offset <= 1" @click="readNote({ note_id: reading.note_id } as any, Math.max(1, reading.offset - 400))">上一段</button>
            <span class="chip muted">{{ reading.total_lines }} 行</span>
            <button class="btn btn-tonal btn-sm" :disabled="!reading.has_more" @click="readNote({ note_id: reading.note_id } as any, reading.offset + 400)">下一段</button>
          </div>
        </section>
      </template>

      <!-- Reflections -->
      <template v-else>
        <section class="card toolbar">
          <label class="select"><span>状态</span>
            <select v-model="reflectionStatus"><option value="proposed">待审核</option><option value="pending">待处理</option><option value="applied">已采纳</option><option value="rejected">已拒绝</option><option value="">全部</option></select>
          </label>
          <span class="chip muted">{{ reflections.length }} 条</span>
        </section>
        <section class="reflection-list">
          <article v-for="item in reflections" :key="item.id" class="card reflection">
            <div class="card-head">
              <h3 class="card-title">{{ item.statement || '（无摘要）' }}</h3>
              <span class="chip" :class="item.status === 'applied' ? 'chip-ok' : item.status === 'rejected' ? 'chip-warn' : 'muted'">{{ item.status }}</span>
            </div>
            <p class="item-meta">来源会话 {{ item.session_id }} · {{ fmtTime(item.created_at) }}</p>
            <details>
              <summary>查看原始对话</summary>
              <p class="quote">用户：{{ item.user_text }}</p>
              <p class="quote">LIFE：{{ item.assistant_text }}</p>
            </details>
            <div class="card-actions" v-if="item.status === 'proposed'">
              <button class="btn btn-sm btn-primary" @click="reviewReflection(item, true)">采纳为记忆</button>
              <button class="btn btn-sm btn-danger" @click="reviewReflection(item, false)">拒绝</button>
            </div>
          </article>
          <div v-if="!reflections.length" class="empty-state"><p>没有该状态的反思提案</p><p class="hint">LIFE 从对话中提炼低风险记忆提案，等你确认。</p></div>
        </section>
      </template>

      <p v-if="error" class="error-banner">{{ error }}</p>
      <p v-if="notice" class="notice">{{ notice }}</p>
    </div>
    <ConfirmDialog />
  </main>
</template>

<style scoped>
.page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}
.page-inner{max-width:1180px;margin:0 auto}
.page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.eyebrow{margin:0 0 6px;color:var(--md-primary);font:700 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.page-header h1{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em}
.subtitle{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}
.header-actions{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0;flex-wrap:wrap}

.btn{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}
.btn:disabled{opacity:.55;cursor:not-allowed}
.btn:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}
.btn-sm{height:30px;padding:0 12px;font-size:12px}
.btn-primary{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn-danger{background:var(--md-error-container);color:#410E0B}

.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}
.stat-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}
.stat-head{display:flex;align-items:center;gap:10px}
.stat-label{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}
.stat-value{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1}
.stat-hint{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}
.icon-badge{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}
.tone-1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.tone-2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tone-3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.tone-4{background:var(--md-success-container);color:#0D3B1E}

.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1);padding:var(--space-lg)}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.card-title{margin:0;font-size:16px;font-weight:650}

.tabs{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:var(--md-surface-container-high);margin-bottom:var(--space-lg)}
.tabs button{border:0;background:transparent;border-radius:999px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--md-on-surface-variant);cursor:pointer}
.tabs button.active{background:var(--md-surface-container-lowest);color:var(--md-primary);box-shadow:var(--shadow-1)}

.toolbar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:var(--space-lg);padding:var(--space-md)}
.search-field{display:flex;align-items:center;gap:10px;flex:1;min-width:220px}
.search-icon{color:var(--md-on-surface-variant);flex-shrink:0}
.search-field input{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}
.search-field.mini{padding:8px 12px;border:1px solid var(--md-outline-variant);border-radius:10px;margin-bottom:12px}
.select{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}
.select select{height:34px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:0 10px;font:inherit;font-size:13px}

.chip{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.tier-short{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tier-long{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.chip-ok{background:var(--md-success-container);color:#0D3B1E}
.chip-warn{background:#FFF1DC;color:#7A4400}

.error-banner{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410E0B;font-size:13px;margin:var(--space-lg) 0}
.notice{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin-top:var(--space-md)}

.memory-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-lg)}
.memory-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}
.memory-card:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}
.card-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.btn-icon{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;margin-left:auto}
.btn-icon.danger:hover{background:var(--md-error-container);color:var(--md-error)}
.memory-content{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tags span{font-size:12px;font-weight:500;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:3px 8px;border-radius:999px}
.memory-foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--md-outline-variant)}
.meter{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--md-on-surface-variant)}
.meter-bar{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.meter-bar i{display:block;height:100%;border-radius:999px;transition:width .3s}
.fill-primary{background:var(--md-primary)}
.fill-secondary{background:var(--md-secondary,#536255)}
.meter-text{margin-left:auto;font-size:12px;color:var(--md-on-surface-variant)}
.detail{border-top:1px solid var(--md-outline-variant);padding-top:10px}
.detail dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;font-size:12px}
.detail dt{color:var(--md-on-surface-variant);font-weight:600}
.detail dd{margin:3px 0 0;overflow-wrap:anywhere}
.detail code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
.card-actions{display:flex;gap:8px;justify-content:flex-end}
.hidden-input{display:none}

.empty-state{padding:56px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}
.empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
.empty-state .hint{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}

.pager{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:var(--space-lg)}

.grid-notes{display:grid;grid-template-columns:minmax(0,340px) 1fr;gap:var(--space-lg)}
.stack-form{display:flex;flex-direction:column;gap:10px}
.input{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}
.input:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}
.input.area{height:auto;padding:10px 14px;min-height:120px;resize:vertical;line-height:1.6}
.note-list,.reflection-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.note-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}
.note-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.note-main strong{font-size:14px;font-weight:600;overflow-wrap:anywhere}
.item-meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
.note-actions{display:flex;gap:6px;flex-shrink:0}
.list-empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}
.reader{margin-top:var(--space-lg)}
.reader pre{margin:0;max-height:460px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7;white-space:pre-wrap;background:var(--md-surface-container);padding:14px 16px;border-radius:12px}
.reflection .card-title{font-size:14px;font-weight:600}
.reflection details{margin-top:6px}
.reflection summary{cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}
.quote{margin:8px 0 0;font-size:13px;line-height:1.6;background:var(--md-surface-container);padding:8px 12px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}

/* ---------- Material 3 Expressive align ---------- */
#app .memory-page .page-header h1{font-size:clamp(24px,2.8vw,34px);font-weight:800;letter-spacing:-.02em}
#app .memory-page .stat-grid{gap:var(--space-lg)}
#app .memory-page .stat-card,
#app .memory-page .card,
#app .memory-page .memory-card{
  border-color:color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
  background:var(--md-surface-container-low);
  box-shadow:var(--shadow-1);
}
#app .memory-page .stat-card{border-radius:24px;transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms}
#app .memory-page .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .memory-page .stat-value{font-size:34px;font-weight:800;letter-spacing:-.02em}
#app .memory-page .icon-badge{width:44px;height:44px;border-radius:16px 16px 16px 6px}
#app .memory-page .card,
#app .memory-page .memory-card{border-radius:24px}
#app .memory-page .memory-card{transition:transform 260ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 220ms,border-color 200ms}
#app .memory-page .memory-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}
#app .memory-page .btn{height:44px;padding:0 20px;border-radius:999px;font-weight:700}
#app .memory-page .btn-sm{height:34px;padding:0 14px;font-size:13px}
#app .memory-page .btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .memory-page .btn-primary{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 28%,transparent)}
#app .memory-page .input{
  height:48px;border:1px solid transparent;border-radius:14px;background:var(--md-surface-container-high);
  transition:background-color 180ms,border-color 180ms,box-shadow 200ms;
}
#app .memory-page .input:focus{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent)}
#app .memory-page .input.area{height:auto;padding:14px 16px}
#app .memory-page .search-field input{height:44px}
#app .memory-page .search-field.mini{border-color:transparent;background:var(--md-surface-container-high);border-radius:14px}
#app .memory-page .select select{height:44px;border-color:transparent;border-radius:14px;background:var(--md-surface-container-high);padding:0 14px}
#app .memory-page .tabs{padding:5px;border-radius:999px;background:var(--md-surface-container-high)}
#app .memory-page .tabs button{border-radius:999px;padding:9px 20px;font-weight:650}
#app .memory-page .tabs button.active{background:var(--md-primary);color:var(--md-on-primary);box-shadow:var(--shadow-1)}
#app .memory-page .note-item{border-radius:16px;border-color:color-mix(in srgb,var(--md-outline-variant) 45%,transparent);background:var(--md-surface-container-low)}

@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.grid-notes{grid-template-columns:1fr}}
@media(max-width:640px){.page{padding:var(--space-lg)}.header-actions{padding-top:0}.memory-list{grid-template-columns:1fr}}
</style>
