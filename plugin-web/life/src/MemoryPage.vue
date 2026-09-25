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
  tags: string[]
  tier: string
}

const query = ref('')
const memories = ref<Memory[]>([])
const stats = ref({ working: 0, shortTerm: { total: 0 }, longTerm: 0, avgStrength: 0 })
const loading = ref(false)
const error = ref('')

const visible = computed(() => memories.value)
const tiers = computed(() => ({
  working: visible.value.filter((item) => item.tier === 'working').length,
  short: visible.value.filter((item) => item.tier === 'short_term').length,
  long: visible.value.filter((item) => item.tier === 'long_term').length,
}))

function pct(value: number) { return `${Math.round(Math.max(0, Math.min(1, value || 0)) * 100)}%` }
function label(tier: string) {
  return tier === 'long_term' ? '长期记忆' : tier === 'short_term' ? '短期记忆' : '工作记忆'
}
function fmtTime(value: string) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
}
async function load() {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({ limit: '200' })
    if (query.value.trim()) params.set('query', query.value.trim())
    const response = await fetch(`/api/life/memories?${params}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const body = await response.json()
    memories.value = Array.isArray(body.memories) ? body.memories : []
    stats.value = body.stats || stats.value
    if (body.error) error.value = body.error
  } catch (cause: any) { error.value = cause?.message || '无法读取 LIFE 记忆' }
  finally { loading.value = false }
}
async function removeMemory(id: string) {
  const ok = await confirm({
    title: '删除记忆',
    message: '删除会撤销该记忆并重建检索投影，继续吗？',
    confirmLabel: '删除',
    danger: true,
  })
  if (!ok) return
  try {
    const response = await fetch('/api/life/companion', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_memory', payload: { id } }),
    })
    if (!response.ok) throw new Error(await response.text())
    await load()
  } catch (cause: any) { error.value = cause?.message || '删除失败' }
}
async function clearAll() {
  const ok = await confirm({
    title: '清除全部记忆',
    message: '这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？',
    confirmLabel: '全部清除',
    danger: true,
  })
  if (!ok) return
  try {
    const response = await fetch('/api/life/companion', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear_all_memory', payload: {} }),
    })
    if (!response.ok) throw new Error(await response.text())
    await load()
  } catch (cause: any) { error.value = cause?.message || '清除失败' }
}
let timer: ReturnType<typeof setTimeout> | null = null
watch(query, () => { if (timer) clearTimeout(timer); timer = setTimeout(load, 250) })
onMounted(load)
</script>

<template>
  <main class="page">
    <div class="page-inner">
      <header class="page-header">
        <div>
          <p class="eyebrow">L.I.F.E / MEMORY</p>
          <h1>记忆管理台</h1>
          <p class="subtitle">浏览 LIFE 主动记忆、遗忘强度和检索结果。记忆由 LIFE 插件注册；禁用 LIFE 后此入口会消失。</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-danger" :disabled="loading" @click="clearAll">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            一键清除
          </button>
          <button class="btn btn-tonal" :disabled="loading" @click="load">{{ loading ? '刷新中…' : '刷新' }}</button>
        </div>
      </header>

      <section class="stat-grid">
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-1" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18m0-13a3 3 0 013 3v.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-1.5 4.5c.4 1.2.1 2.6-1 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="stat-label">工作记忆</span></div>
          <strong class="stat-value">{{ stats.working }}</strong>
          <span class="stat-hint">当前上下文</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">短期记忆</span></div>
          <strong class="stat-value">{{ stats.shortTerm?.total || tiers.short }}</strong>
          <span class="stat-hint">待巩固记录</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-3" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 5.5A2.5 2.5 0 017.5 3H19v16H7.5A2.5 2.5 0 005 21.5v-16z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 7.5h6M9 11h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">长期记忆</span></div>
          <strong class="stat-value">{{ stats.longTerm || tiers.long }}</strong>
          <span class="stat-hint">稳定沉淀</span>
        </article>
        <article class="stat-card">
          <div class="stat-head"><span class="icon-badge tone-4" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 14l4-4 3 3 5-6 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">平均强度</span></div>
          <strong class="stat-value">{{ pct(stats.avgStrength) }}</strong>
          <span class="stat-hint">遗忘曲线后的值</span>
        </article>
      </section>

      <section class="card search-card">
        <div class="search-field">
          <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input v-model="query" placeholder="搜索记忆内容、标签或笔记引用" aria-label="搜索记忆" />
          <span class="chip muted">{{ visible.length }} 条结果</span>
        </div>
      </section>
      <p v-if="error" class="error-banner">{{ error }}</p>

      <section class="memory-list">
        <article v-for="memory in visible" :key="memory.id" class="memory-card">
          <div class="card-top">
            <span class="chip" :class="'tier-' + (memory.tier === 'long_term' ? 'long' : memory.tier === 'short_term' ? 'short' : 'work')">{{ label(memory.tier) }}</span>
            <code class="memory-id">{{ memory.id.slice(0, 8) }}</code>
            <button class="btn-icon danger" title="删除记忆" @click="removeMemory(memory.id)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <p class="memory-content">{{ memory.content }}</p>
          <div v-if="memory.tags?.length" class="tags"><span v-for="tag in memory.tags" :key="tag">#{{ tag }}</span></div>
          <footer class="memory-foot">
            <div class="meter" title="重要性">
              <span>重要性</span>
              <div class="meter-bar"><i :style="{ width: pct(memory.importance) }" class="fill-primary"></i></div>
              <b>{{ pct(memory.importance) }}</b>
            </div>
            <div class="meter" title="强度">
              <span>强度</span>
              <div class="meter-bar"><i :style="{ width: pct(memory.strength) }" class="fill-secondary"></i></div>
              <b>{{ pct(memory.strength) }}</b>
            </div>
            <time>{{ fmtTime(memory.created_at) }}</time>
          </footer>
        </article>
        <div v-if="!loading && !visible.length" class="empty-state">
          <div class="empty-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 5a3 3 0 00-3 3v.5A2.5 2.5 0 006.5 11 2.5 2.5 0 008 15.5c.4 1.2 1.5 2 2.9 2H12m0-12.5V18m0-13a3 3 0 013 3v.5a2.5 2.5 0 012.5 2.5 2.5 2.5 0 01-1.5 4.5c.4 1.2.1 2.6-1 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p>暂无匹配记忆</p>
          <p class="hint">LIFE 会在对话和主动工具调用中逐步沉淀记忆。</p>
        </div>
      </section>
    </div>
    <ConfirmDialog />
  </main>
</template>

<style scoped>
.page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}
.page-inner{max-width:1180px;margin:0 auto}

.page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.eyebrow{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.page-header h1{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}
.subtitle{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}
.header-actions{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}

.btn{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;transition:filter .15s,box-shadow .15s,background .15s}
.btn:disabled{opacity:.55;cursor:not-allowed}
.btn:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}
.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn-danger{background:var(--md-error-container);color:#410E0B}

.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}
.stat-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}
.stat-head{display:flex;align-items:center;gap:10px}
.stat-label{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}
.stat-value{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}
.stat-hint{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}
.icon-badge{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}
.tone-1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.tone-2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tone-3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.tone-4{background:var(--md-success-container);color:#0D3B1E}

.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);box-shadow:var(--shadow-1)}
.search-card{padding:var(--space-md);margin-bottom:var(--space-lg)}
.search-field{display:flex;align-items:center;gap:12px}
.search-icon{color:var(--md-on-surface-variant);flex-shrink:0}
.search-field input{flex:1;min-width:0;height:38px;border:0;background:transparent;outline:none;color:var(--md-on-surface);font-size:14px}
.search-field input::placeholder{color:var(--md-on-surface-variant);opacity:.8}

.chip{height:26px;padding:0 11px;border-radius:999px;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.tier-work{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.tier-short{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tier-long{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}

.error-banner{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410E0B;font-size:13px;margin:0 0 var(--space-lg)}

.memory-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-lg)}
.memory-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:12px;transition:border-color .15s,box-shadow .15s}
.memory-card:hover{border-color:color-mix(in srgb,var(--md-primary) 45%,var(--md-outline-variant));box-shadow:var(--shadow-2)}
.card-top{display:flex;align-items:center;gap:10px}
.memory-id{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:3px 7px;border-radius:6px}
.btn-icon{width:30px;height:30px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--md-on-surface-variant);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s}
.btn-icon.danger:hover{background:var(--md-error-container);color:var(--md-error)}
.memory-content{margin:0;line-height:1.65;font-size:14px;white-space:pre-wrap;color:var(--md-on-surface)}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tags span{font-size:12px;font-weight:500;color:var(--md-primary);background:var(--md-primary-container);color:var(--md-on-primary-container);padding:3px 8px;border-radius:999px}
.memory-foot{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:auto;padding-top:12px;border-top:1px solid var(--md-outline-variant)}
.meter{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--md-on-surface-variant)}
.meter-bar{width:56px;height:5px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.meter-bar i{display:block;height:100%;border-radius:999px;transition:width .3s}
.fill-primary{background:var(--md-primary)}
.fill-secondary{background:var(--md-secondary,#536255)}
.meter b{font-weight:600;color:var(--md-on-surface)}
.memory-foot time{margin-left:auto;font-size:11px;color:var(--md-on-surface-variant)}

.empty-state{grid-column:1/-1;padding:64px 24px;text-align:center;background:var(--md-surface-container);border:1px dashed var(--md-outline-variant);border-radius:var(--radius-lg);color:var(--md-on-surface-variant)}
.empty-icon{width:60px;height:60px;margin:0 auto 16px;border-radius:18px;background:var(--md-surface-container-high);display:grid;place-items:center;color:var(--md-on-surface-variant)}
.empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
.empty-state .hint{margin-top:8px;font-size:13px;font-weight:400;opacity:.85}

@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.page{padding:var(--space-lg)}.header-actions{padding-top:0}.memory-list{grid-template-columns:1fr}}
</style>
