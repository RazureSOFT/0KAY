<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

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
  if (!window.confirm('删除会撤销该记忆并重建检索投影，继续吗？')) return
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
  if (!window.confirm('这会清除工作、短期、长期记忆、笔记块和反思提案，无法恢复。确定继续吗？')) return
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
  <main class="memory-page">
    <header class="header">
      <div>
        <p class="eyebrow">L.I.F.E / MEMORY</p>
        <h1>记忆管理台</h1>
        <p>浏览 LIFE 主动记忆、遗忘强度和检索结果。记忆由 LIFE 插件注册；禁用 LIFE 后此入口会消失。</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="refresh" style="background:var(--md-error)" :disabled="loading" @click="clearAll">一键清除记忆</button>
        <button class="refresh" :disabled="loading" @click="load">{{ loading ? '刷新中…' : '刷新' }}</button>
      </div>
    </header>

    <section class="stat-grid">
      <article><span>工作记忆</span><strong>{{ stats.working }}</strong><small>当前上下文</small></article>
      <article><span>短期记忆</span><strong>{{ stats.shortTerm?.total || tiers.short }}</strong><small>待巩固记录</small></article>
      <article><span>长期记忆</span><strong>{{ stats.longTerm || tiers.long }}</strong><small>稳定沉淀</small></article>
      <article><span>平均强度</span><strong>{{ pct(stats.avgStrength) }}</strong><small>遗忘曲线后的值</small></article>
    </section>

    <section class="toolbar">
      <input v-model="query" placeholder="搜索记忆内容、标签或笔记引用" />
      <span>{{ visible.length }} 条结果</span>
    </section>
    <p v-if="error" class="error">{{ error }}</p>

    <section class="memory-list">
      <article v-for="memory in visible" :key="memory.id" class="memory-card">
        <div class="card-top"><span class="tier">{{ label(memory.tier) }}</span><code>{{ memory.id }}</code></div>
        <p>{{ memory.content }}</p>
        <div v-if="memory.tags?.length" class="tags"><span v-for="tag in memory.tags" :key="tag">#{{ tag }}</span></div>
        <footer><span>重要性 {{ pct(memory.importance) }}</span><span>强度 {{ pct(memory.strength) }}</span><time>{{ memory.created_at }}</time><button class="delete" @click="removeMemory(memory.id)">删除</button></footer>
      </article>
      <div v-if="!loading && !visible.length" class="empty">暂无匹配记忆。LIFE 会在对话和主动工具调用中逐步沉淀记忆。</div>
    </section>
  </main>
</template>

<style scoped>
.memory-page{height:100%;overflow:auto;padding:32px;background:linear-gradient(145deg,var(--md-surface),var(--md-surface-container-low))}.header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;max-width:1180px;margin:auto}.eyebrow{margin:0;color:var(--md-primary);font:700 12px/1.2 monospace;letter-spacing:.12em}.header h1{margin:8px 0;font-size:28px}.header p{max-width:680px;color:var(--md-on-surface-variant)}.refresh{border:0;border-radius:999px;padding:11px 18px;background:var(--md-primary);color:var(--md-on-primary);cursor:pointer}.stat-grid{max-width:1180px;margin:28px auto;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stat-grid article,.memory-card,.toolbar{border:1px solid var(--md-outline-variant);background:var(--md-surface-container-lowest);border-radius:16px}.stat-grid article{padding:18px}.stat-grid span,.stat-grid small{display:block;color:var(--md-on-surface-variant);font-size:13px}.stat-grid strong{display:block;margin:8px 0;font-size:30px}.toolbar{max-width:1180px;margin:0 auto 16px;padding:10px;display:flex;gap:12px;align-items:center}.toolbar input{flex:1;border:0;background:transparent;padding:10px;color:var(--md-on-surface);outline:none}.toolbar span{font-size:13px;color:var(--md-on-surface-variant);padding:0 8px}.memory-list{max-width:1180px;margin:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}.memory-card{padding:18px}.card-top,.memory-card footer{display:flex;gap:10px;justify-content:space-between;align-items:center;font-size:12px;color:var(--md-on-surface-variant)}.tier{padding:4px 8px;border-radius:999px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}.memory-card p{line-height:1.55;white-space:pre-wrap}.tags{display:flex;gap:6px;flex-wrap:wrap}.tags span{font-size:12px;color:var(--md-primary)}.memory-card footer{margin-top:18px;flex-wrap:wrap}.empty,.error{max-width:1180px;margin:24px auto;padding:24px;border-radius:16px;color:var(--md-on-surface-variant);background:var(--md-surface-container)}.error{color:var(--md-error)}@media(max-width:800px){.memory-page{padding:20px}.header{display:block}.refresh{margin-top:12px}.stat-grid{grid-template-columns:repeat(2,1fr)}}
.delete{border:0;border-radius:999px;padding:4px 9px;color:var(--md-on-error);background:var(--md-error);cursor:pointer}
</style>
