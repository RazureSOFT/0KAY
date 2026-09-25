<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { confirm } = useConfirm()
const data = ref<any>({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] })
const loading = ref(false); const error = ref(''); const notice = ref('')
const agendaTitle = ref(''); const agendaWhen = ref(''); const agendaDetail = ref('')
const journal = ref(''); const dream = ref('')
const openLedger = ref(false); const openGroup = ref<string>('')
const proactiveForm = ref({ target: '', motive: '', content: '', preferred_at: '' })
const policy = ref({ daily_limit: 6, per_target_limit: 2 })
const groups = computed(() => Object.entries(data.value.groups || {}))
const activeCandidates = computed(() => (data.value.proactive?.candidates || []).filter((x: any) => !['delivered', 'cancelled'].includes(x.status)))
const receipts = computed(() => data.value.proactive?.receipts || [])

function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, 2000) }
const usage = ref<any>(null)
async function loadUsage() {
  try {
    const r = await fetch('/api/usage')
    if (r.ok) usage.value = await r.json()
  } catch { /* usage is optional */ }
}
async function load() {
  loading.value = true; error.value = ''
  try {
    const r = await fetch('/api/life/companion')
    if (!r.ok) throw Error(String(r.status))
    data.value = await r.json()
  } catch (e: any) { error.value = e?.message || '无法读取 LIFE 陪伴状态' }
  finally { loading.value = false }
  void loadUsage()
}
async function act(action: string, payload: any) {
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
    if (!r.ok) throw Error(await r.text())
    await load(); return await r.json().catch(() => ({}))
  } catch (e: any) { error.value = e?.message || '操作失败'; return null }
}
async function addAgenda() { if (!agendaTitle.value.trim()) return; await act('add_agenda', { title: agendaTitle.value, when: agendaWhen.value, detail: agendaDetail.value }); agendaTitle.value = ''; agendaWhen.value = ''; agendaDetail.value = '' }
async function addEntry(kind: 'journal' | 'dream', content: string) { if (!content.trim()) return; await act(kind, { content }); if (kind === 'journal') journal.value = ''; else dream.value = '' }
function relPct(v: number) { return `${Math.round(Math.max(0, Math.min(1, v || 0)) * 100)}%` }
async function adjustRelationship(userId: string, delta: number) {
  const result = await act('relationship_adjust', { user_id: userId, event_key: `manual:${Date.now()}`, reason: 'dashboard_adjust', channel: 'webui', delta })
  if (result) flash(`已调整 ${userId}`)
}
async function createProactive() {
  if (!proactiveForm.value.target.trim() || !proactiveForm.value.content.trim()) return
  const result = await act('proactive_create', { ...proactiveForm.value })
  if (result) { proactiveForm.value = { target: '', motive: '', content: '', preferred_at: '' }; flash('已创建主动候选') }
}
async function cancelProactive(id: string) { await act('proactive_cancel', { id, reason: 'dashboard_cancel' }); flash('已取消候选') }
async function savePolicy() { await act('proactive_policy', { daily_limit: Number(policy.value.daily_limit), per_target_limit: Number(policy.value.per_target_limit) }); flash('策略已保存') }
const generating = ref('')
async function generate(kind: 'journal' | 'dream') {
  generating.value = kind
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: kind === 'journal' ? 'journal_generate' : 'dream_generate', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    await load(); flash('已由 LIFE 生成')
  } catch (e: any) { error.value = e?.message || '生成失败' }
  finally { generating.value = '' }
}
async function suggestProactive() {
  const target = proactiveForm.value.target.trim() || 'user:owner'
  const result = await act('proactive_suggest', { target, hint: proactiveForm.value.motive })
  if (result) { proactiveForm.value = { target: '', motive: '', content: '', preferred_at: '' }; flash('已生成建议候选') }
}
const ticking = ref(false)
async function tickNow() {  ticking.value = true
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'proactive_tick', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    const body = await r.json()
    await load()
    flash(body?.skipped ? `本次跳过：${body.skipped}` : `已投递 ${body.delivered || 0} 条 · 拦截 ${body.blocked || 0} 条`)
  } catch (e: any) { error.value = e?.message || '投递失败' }
  finally { ticking.value = false }
}
const planning = ref(false)
async function planNow() {  planning.value = true
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'autonomy_plan', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    const body = await r.json()
    await load()
    const applied = body?.applied
    flash(applied ? `已自主规划：日程 ${applied.agenda} · 主动 ${applied.proactive} · 日记 ${applied.journal}` : '本次没有新的规划')
  } catch (e: any) { error.value = e?.message || '规划失败' }
  finally { planning.value = false }
}
function daysUntil(text: string): number | null {
  const value = (text || '').trim()
  const today = new Date(); today.setHours(0, 0, 0, 0)
  let target: Date | null = null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    target = new Date(value); target.setHours(0, 0, 0, 0)
    if (target < today) target.setFullYear(today.getFullYear() + 1)
  } else if (/^\d{2}-\d{2}$/.test(value)) {
    target = new Date(today.getFullYear(), Number(value.slice(0, 2)) - 1, Number(value.slice(3, 5)))
    if (target < today) target.setFullYear(today.getFullYear() + 1)
  }
  if (!target || Number.isNaN(target.getTime())) return null
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}
const dateForm = ref({ title: '', date: '', repeat_yearly: true, note: '' })
async function addDate() {
  if (!dateForm.value.title.trim() || !dateForm.value.date.trim()) return
  await act('date_add', { ...dateForm.value })
  dateForm.value = { title: '', date: '', repeat_yearly: true, note: '' }
  flash('已添加重要日期')
}
async function removeDate(id: string) { await act('date_delete', { id }); flash('已删除') }
async function eat() { await act('circadian_eat', { amount: 45 }); flash('已用餐') }
async function arrangeAgenda() {
  const result = await act('daily_agenda', {})
  flash(result?.created ? `LIFE 已安排 ${result.created} 项活动` : '今天已有安排')
}
async function clearJournal(kind: 'journal' | 'dream') {  const ok = await confirm({ title: kind === 'dream' ? '清除梦境' : '清除日记', message: '将删除全部该类型记录，无法恢复。', confirmLabel: '清除', danger: true })
  if (!ok) return
  await act('journal_clear', { kind })
  flash('已清除')
}
function fmtTime(value?: string) { if (!value) return ''; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString() }
onMounted(load)
</script>

<template>
  <main class="page"><div class="page-inner">
    <header class="page-header"><div>
      <p class="eyebrow">L.I.F.E / COMPANION</p><h1>陪伴面板</h1>
      <p class="subtitle">日程、关系账本、主动行为、群聊观察、性格演化与审计均由 LIFE 插件维护。这里可以审阅并手动干预。</p>
    </div><div class="header-actions"><button class="btn btn-primary" :disabled="planning" @click="planNow">{{ planning ? '规划中…' : '让 LIFE 规划' }}</button><button class="btn btn-tonal" :disabled="loading" @click="load">{{ loading ? '刷新中…' : '刷新' }}</button></div></header>
    <p v-if="error" class="error-banner">{{ error }}</p>
    <p v-if="notice" class="notice">{{ notice }}</p>

    <section class="stat-grid">
      <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-1" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">关系对象</span></div><strong class="stat-value">{{ data.relationships?.length || 0 }}</strong><span class="stat-hint">被 LIFE 记住的人</span></article>
      <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">活动日程</span></div><strong class="stat-value">{{ data.agenda?.filter((x: any) => x.status === 'active').length || 0 }}</strong><span class="stat-hint">待确认 + 已确认</span></article>
      <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-3" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span><span class="stat-label">待投递主动行为</span></div><strong class="stat-value">{{ activeCandidates.length }}</strong><span class="stat-hint">已投递 {{ receipts.length }} 次</span></article>
      <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-4" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="stat-label">已观察群聊</span></div><strong class="stat-value">{{ groups.length }}</strong><span class="stat-hint">群消息学习</span></article>
  </section>

    <section class="life-state">
      <span class="state-pill">精力 {{ Math.round(data.circadian?.mental_energy ?? 0) }}</span>
      <span class="state-pill" :class="{ warn: (data.circadian?.hunger ?? 0) >= 75 }">饥饿 {{ Math.round(data.circadian?.hunger ?? 0) }}</span>
      <span class="state-pill" :class="{ warn: (data.circadian?.health ?? 100) < 60 }">健康 {{ Math.round(data.circadian?.health ?? 100) }}</span>
      <span class="state-pill" v-if="data.circadian?.is_sleeping">睡眠中</span>
      <button class="btn btn-tonal btn-sm" @click="eat">吃饭</button>
    </section>

  <section class="group">
    <h2 class="group-title">生活</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">日程</h2><button class="btn btn-tonal btn-sm" @click="arrangeAgenda">由 LIFE 安排今天</button></div>
        <form class="agenda-form" @submit.prevent="addAgenda">
          <input v-model="agendaTitle" class="input" placeholder="日程标题" aria-label="日程标题" />
          <input v-model="agendaWhen" class="input" placeholder="时间，例如 2026-09-25 20:00" aria-label="时间" />
          <button class="btn btn-primary" type="submit">创建候选</button>
          <textarea v-model="agendaDetail" class="input area" placeholder="说明（可选）"></textarea>
        </form>
        <h3 class="section-label">待确认候选</h3>
        <ul class="item-list">
          <li v-for="item in data.calendar_candidates?.filter((x: any) => x.status === 'pending_confirmation')" :key="item.id" class="item">
            <div class="item-main"><strong>{{ item.title }}</strong><span class="item-meta">{{ item.when_text }} · {{ item.detail || '等待你确认' }}</span></div>
            <div class="item-actions"><button class="btn btn-primary btn-sm" @click="act('confirm_agenda', { id: item.id })">确认</button><button class="btn btn-danger btn-sm" @click="act('reject_agenda', { id: item.id })">拒绝</button></div>
          </li>
          <li v-if="!data.calendar_candidates?.filter((x: any) => x.status === 'pending_confirmation').length" class="list-empty">没有待确认的日程候选</li>
        </ul>
        <h3 class="section-label">已确认日程</h3>
        <ul class="item-list">
          <li v-for="item in data.agenda" :key="item.id" class="item">
            <label class="check-label"><input :checked="item.status === 'completed'" type="checkbox" @change="act('complete_agenda', { id: item.id })" /></label>
            <div class="item-main"><strong :class="{ done: item.status === 'completed' }">{{ item.title }}</strong><span class="item-meta">{{ item.start_at }}<template v-if="item.detail"> · {{ item.detail }}</template></span></div>
          </li>
          <li v-if="!data.agenda?.length" class="list-empty">暂无已确认日程</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">重要日期</h2><span class="chip muted">{{ (data.important_dates || []).length }}</span></div>
        <form class="stack-form" @submit.prevent="addDate">
          <input v-model="dateForm.title" class="input" placeholder="名称，如 生日 / 纪念日" aria-label="重要日期名称" />
          <input v-model="dateForm.date" class="input" placeholder="日期：YYYY-MM-DD 或 MM-DD" aria-label="重要日期" />
          <input v-model="dateForm.note" class="input" placeholder="备注（可选）" aria-label="备注" />
          <label class="check-line"><input type="checkbox" v-model="dateForm.repeat_yearly" /> 每年重复</label>
          <button class="btn btn-primary" type="submit" :disabled="!dateForm.title.trim() || !dateForm.date.trim()">添加</button>
        </form>
        <ul class="item-list">
          <li v-for="item in data.important_dates" :key="item.id" class="item">
            <div class="item-main">
              <strong>{{ item.title }}</strong>
              <span class="item-meta">{{ item.date_text }}<template v-if="daysUntil(item.date_text) !== null"> · {{ daysUntil(item.date_text) === 0 ? '就是今天' : daysUntil(item.date_text) + ' 天后' }}</template><template v-if="item.note"> · {{ item.note }}</template></span>
            </div>
            <div class="item-actions"><button class="btn btn-danger btn-sm" @click="removeDate(item.id)">删除</button></div>
          </li>
          <li v-if="!data.important_dates?.length" class="list-empty">还没有重要日期，LIFE 会据此规划提醒。</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">日记</h2><div class="head-actions"><button class="btn btn-danger btn-sm" @click="clearJournal('journal')">清除</button><button class="btn btn-tonal btn-sm" :disabled="generating === 'journal'" @click="generate('journal')">{{ generating === 'journal' ? '生成中…' : '由 LIFE 生成' }}</button></div></div>
        <form class="stack-form" @submit.prevent="addEntry('journal', journal)"><textarea v-model="journal" class="input area" placeholder="记录 LIFE 的日记…"></textarea><button class="btn btn-tonal" type="submit">写入日记</button></form>
        <ol class="feed">
          <li v-for="item in data.journal" :key="item.id"><time>{{ item.at }}</time><p>{{ item.content }}</p></li>
          <li v-if="!data.journal?.length" class="list-empty plain">还没有日记</li>
        </ol>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">梦境</h2><div class="head-actions"><button class="btn btn-danger btn-sm" @click="clearJournal('dream')">清除</button><button class="btn btn-tonal btn-sm" :disabled="generating === 'dream'" @click="generate('dream')">{{ generating === 'dream' ? '生成中…' : '由 LIFE 生成' }}</button></div></div>
        <form class="stack-form" @submit.prevent="addEntry('dream', dream)"><textarea v-model="dream" class="input area" placeholder="记录一个梦境或睡眠反思…"></textarea><button class="btn btn-tonal" type="submit">记录梦境</button></form>
        <ol class="feed">
          <li v-for="item in data.dreams" :key="item.id"><time>{{ item.at }}</time><p>{{ item.content }}</p></li>
          <li v-if="!data.dreams?.length" class="list-empty plain">还没有梦境记录</li>
        </ol>
      </article>
    </div>
  </section>

  <section class="group">
    <h2 class="group-title">关系</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">关系账本</h2><button class="btn btn-tonal btn-sm" @click="openLedger = !openLedger">{{ openLedger ? '隐藏事件' : '查看事件账本' }}</button></div>
        <ul class="rel-list">
          <li v-for="rel in data.relationships" :key="rel.user_id" class="rel">
            <span class="avatar">{{ (rel.user_id || '?').slice(0, 1).toUpperCase() }}</span>
            <div class="rel-main">
              <div class="rel-top"><strong>{{ rel.user_id }}</strong><span class="chip">{{ rel.stage }}</span></div>
              <div class="rel-meter"><div class="meter-bar"><i :style="{ width: relPct(rel.affinity) }"></i></div><b>{{ Math.round((rel.affinity || 0) * 100) }}%</b></div>
              <span class="item-meta">最近互动：{{ rel.last_seen || '暂无' }}</span>
            </div>
            <div class="rel-actions"><button class="btn btn-sm btn-tonal" title="更亲近" @click="adjustRelationship(rel.user_id, 0.05)">+</button><button class="btn btn-sm btn-tonal" title="更疏远" @click="adjustRelationship(rel.user_id, -0.05)">−</button></div>
          </li>
          <li v-if="!data.relationships?.length" class="list-empty">暂无关系记录</li>
        </ul>
        <div v-if="openLedger" class="ledger">
          <h3 class="section-label">事件账本（最近 {{ data.relationship_ledger?.length || 0 }} 条）</h3>
          <ol class="feed">
            <li v-for="event in data.relationship_ledger" :key="event.id"><time>{{ fmtTime(event.created_at) }}</time><p><strong>{{ event.user_id }}</strong> · {{ event.event_key }} <span :class="event.delta >= 0 ? 'pos' : 'neg'">{{ event.delta >= 0 ? '+' : '' }}{{ event.delta }}</span> · {{ event.reason }} ({{ event.channel }})</p></li>
            <li v-if="!data.relationship_ledger?.length" class="list-empty plain">暂无关系事件</li>
          </ol>
        </div>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">成长中的性格</h2></div>
        <ul class="item-list">
          <li v-for="trait in data.persona_evolution" :key="trait.id" class="item trait-item">
            <div class="item-main"><strong>{{ trait.trait }}</strong><span class="item-meta">支持 {{ trait.support_count }} 次 · 置信度 {{ Math.round((trait.confidence || 0) * 100) }}%</span></div>
            <span class="chip">{{ trait.value }}</span>
          </li>
          <li v-if="!data.persona_evolution?.length" class="list-empty">LIFE 还在观察，重复出现的稳定倾向才会被确认。</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="group">
    <h2 class="group-title">主动行为</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">主动行为</h2><span class="chip muted">待投递 {{ activeCandidates.length }}</span></div>
        <div class="toolbar-inline"><button class="btn btn-tonal btn-sm" @click="suggestProactive">让 LIFE 建议一条</button><button class="btn btn-tonal btn-sm" :disabled="ticking" @click="tickNow">{{ ticking ? '检查中…' : '立即检查投递' }}</button></div>
        <form class="stack-form" @submit.prevent="createProactive">
          <input v-model="proactiveForm.target" class="input" placeholder="对象（user_id / 会话）" aria-label="主动对象" />
          <input v-model="proactiveForm.motive" class="input" placeholder="动机，如 care / reminder" aria-label="动机" />
          <input v-model="proactiveForm.preferred_at" class="input" placeholder="期望时间（可选，ISO）" aria-label="期望时间" />
          <textarea v-model="proactiveForm.content" class="input area" placeholder="想说的内容…"></textarea>
          <button class="btn btn-primary" type="submit" :disabled="!proactiveForm.target.trim() || !proactiveForm.content.trim()">创建候选</button>
        </form>
        <h3 class="section-label">候选队列</h3>
        <ul class="item-list">
          <li v-for="c in activeCandidates" :key="c.id" class="item">
            <div class="item-main"><strong>{{ c.target }} · {{ c.motive }}</strong><span class="item-meta">{{ c.content }}</span><span class="item-meta">状态 {{ c.status }} · {{ fmtTime(c.created_at) }}</span></div>
            <div class="item-actions"><button class="btn btn-danger btn-sm" @click="cancelProactive(c.id)">取消</button></div>
          </li>
          <li v-if="!activeCandidates.length" class="list-empty">没有待投递候选</li>
        </ul>
        <h3 class="section-label">配额策略</h3>
        <div class="policy">
          <label class="select"><span>每日上限</span><input v-model.number="policy.daily_limit" type="number" min="0" class="input tiny" /></label>
          <label class="select"><span>单人上限</span><input v-model.number="policy.per_target_limit" type="number" min="0" class="input tiny" /></label>
          <button class="btn btn-tonal btn-sm" @click="savePolicy">保存策略</button>
        </div>
        <h3 class="section-label">投递记录</h3>
        <ol class="feed">
          <li v-for="r in receipts" :key="r.id"><time>{{ fmtTime(r.created_at) }}</time><p>{{ r.phase }} · {{ r.content }}</p></li>
          <li v-if="!receipts.length" class="list-empty plain">还没有主动投递记录</li>
        </ol>
      </article>
    </div>
  </section>

  <section class="group">
    <h2 class="group-title">群聊观察</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">群聊观察</h2><span class="chip muted">{{ groups.length }}</span></div>
        <ul class="item-list">
          <li v-for="[id, group] in groups" :key="id" class="item group-item">
            <div class="item-main">
              <strong>{{ id }}</strong>
              <span class="item-meta">情绪 {{ (group as any).mood || '—' }} · {{ (group as any).messages?.length || 0 }} 条观察 · {{ (group as any).topics?.length || 0 }} 个话题</span>
              <div v-if="openGroup === id" class="group-detail">
                <div v-if="(group as any).topics?.length" class="topics"><span v-for="topic in (group as any).topics" :key="topic.topic" class="chip muted">{{ topic.topic }} · {{ Math.round(topic.score) }}</span></div>
                <ol class="feed compact">
                  <li v-for="(m, i) in (group as any).messages" :key="i"><time>{{ fmtTime(m.created_at) }}</time><p><strong>{{ m.user_id }}</strong>：{{ m.content }}</p></li>
                </ol>
              </div>
            </div>
            <div class="item-actions"><button class="btn btn-tonal btn-sm" @click="openGroup = openGroup === id ? '' : id">{{ openGroup === id ? '收起' : '展开' }}</button></div>
          </li>
          <li v-if="!groups.length" class="list-empty">群聊观察尚未启用或没有消息。</li>
        </ul>
      </article>
    </div>
  </section>

    <section class="group">
      <h2 class="group-title">诊断</h2>
      <div class="grid">
    <article class="card audit-card">
      <div class="card-head"><h2 class="card-title">模型用量</h2><span class="chip muted">{{ usage?.request_count || 0 }} 次请求</span></div>
      <div class="usage-grid">
        <div class="usage-item"><strong>{{ (usage?.total_tokens || 0).toLocaleString() }}</strong><span>总 Token</span></div>
        <div class="usage-item"><strong>{{ (usage?.total_prompt_tokens || 0).toLocaleString() }}</strong><span>输入</span></div>
        <div class="usage-item"><strong>{{ (usage?.total_completion_tokens || 0).toLocaleString() }}</strong><span>输出</span></div>
      </div>
      <ul class="item-list">
        <li v-for="(value, name) in (usage?.by_model || {})" :key="name" class="item">
          <div class="item-main"><strong>{{ name }}</strong><span class="item-meta">{{ (value.total || 0).toLocaleString() }} tokens · {{ value.count }} 次</span></div>
        </li>
        <li v-if="!usage || !Object.keys(usage.by_model || {}).length" class="list-empty">暂无用量记录</li>
      </ul>
    </article>

    <article class="card audit-card">
      <div class="card-head"><h2 class="card-title">主动行为审计</h2><button class="btn btn-tonal btn-sm" @click="act('memory_maintenance', {})">执行记忆维护与备份</button></div>
      <ol class="timeline">
        <li v-for="item in data.audit" :key="item.at + item.kind">
          <span class="dot" :class="item.outcome === 'ok' ? 'ok' : 'warn'" aria-hidden="true"></span>
          <div class="tl-body"><div class="tl-head"><strong>{{ item.kind }}</strong><span class="chip" :class="item.outcome === 'ok' ? 'chip-ok' : 'chip-warn'">{{ item.outcome }}</span><time>{{ item.at }}</time></div><p class="item-meta">{{ item.target }}</p><p class="tl-detail">{{ item.detail }}</p></div>
        </li>
        <li v-if="!data.audit?.length" class="list-empty plain">暂无审计记录</li>
      </ol>
    </article>
      </div>
    </section>
  </div>
  </main>
</template>

<style scoped>
.page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}
.page-inner{max-width:1180px;margin:0 auto}
.page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.eyebrow{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.page-header h1{margin:0;font-size:var(--font-size-lg);font-weight:650}
.subtitle{margin:6px 0 0;max-width:640px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}
.header-actions{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}

.btn{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s}
.btn:disabled{opacity:.55;cursor:not-allowed}
.btn:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}
.btn-sm{height:30px;padding:0 12px;font-size:12px}
.btn-primary{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn-danger{background:var(--md-error-container);color:#410E0B}
.error-banner{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410E0B;font-size:13px;margin:0 0 var(--space-lg)}
.notice{padding:10px 16px;border-radius:12px;background:var(--md-primary-container);color:var(--md-on-primary-container);font-size:13px;margin:0 0 var(--space-lg)}

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

.grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}
.group{margin-bottom:var(--space-lg)}
.group-title{margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
.group .grid{margin-bottom:0}
.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}
.card-title{margin:0;font-size:16px;font-weight:650}
.section-label{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}

.chip{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500;text-transform:none}
.chip-ok{background:var(--md-success-container);color:#0D3B1E}
.chip-warn{background:#FFF1DC;color:#7A4400}

.input{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none}
.input:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}
.input.area{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}
.input.tiny{width:80px;height:34px;padding:0 10px;font-size:13px}
.agenda-form{display:grid;grid-template-columns:1fr 220px auto;gap:10px}
.agenda-form .area{grid-column:1/-1}
.stack-form{display:flex;flex-direction:column;gap:10px;align-items:stretch}
.toolbar-inline{display:flex;gap:8px;margin-bottom:12px}
.stack-form .btn{align-self:flex-start}

.item-list,.rel-list,.feed,.timeline{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}
.item.group-item{align-items:flex-start}
.item:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}
.item-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.item-main strong{font-size:14px;font-weight:600}
.item-main strong.done{text-decoration:line-through;color:var(--md-on-surface-variant)}
.item-meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
.item-actions{display:flex;gap:6px;flex-shrink:0}
.list-empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}
.list-empty.plain{background:transparent;border:0}
.check-label{display:flex;align-items:center}
.check-line{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant)}
.life-state{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 var(--space-lg)}
.state-pill{padding:6px 14px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-size:12.5px;font-weight:600}
.state-pill.warn{background:#FFF1DC;color:#7A4400}
.head-actions{display:flex;gap:8px}
.check-label input{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}
.trait-item .chip{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.rel{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);align-items:center}
.avatar{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}
.rel-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.rel-top{display:flex;align-items:center;gap:8px}
.rel-meter{display:flex;align-items:center;gap:8px}
.meter-bar{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.meter-bar i{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}
.rel-meter b{font-size:12px}
.rel-actions{display:flex;gap:4px}
.ledger{margin-top:16px;border-top:1px solid var(--md-outline-variant);padding-top:12px}
.feed li{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}
.feed.compact li{padding:8px 12px}
.feed time,.timeline time{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.feed p{margin:5px 0 0;font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}
.pos{color:var(--md-success);font-weight:700}
.neg{color:var(--md-error);font-weight:700}
.policy{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.select{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--md-on-surface-variant);font-weight:600}
.topics{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.group-detail{margin-top:6px}
.audit-card{margin-bottom:var(--space-lg)}
.usage-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.usage-item{background:var(--md-surface-container-low);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;align-items:center}
.usage-item strong{font-size:20px;font-weight:700}
.usage-item span{font-size:12px;color:var(--md-on-surface-variant)}
.timeline{position:relative}
.timeline li{display:flex;gap:14px;position:relative;padding-bottom:4px}
.timeline li:not(:last-child)::before{content:'';position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}
.dot{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline)}
.dot.ok{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}
.dot.warn{background:#E08700;box-shadow:0 0 0 3px #FFF1DC}
.tl-body{flex:1;min-width:0;padding-bottom:14px}
.tl-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.tl-head strong{font-size:13.5px;font-weight:650}
.tl-detail{margin:4px 0 0;font-size:12.5px;background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}

@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.agenda-form{grid-template-columns:1fr}}
@media(max-width:640px){.page{padding:var(--space-lg)}.header-actions{padding-top:0}}
</style>
