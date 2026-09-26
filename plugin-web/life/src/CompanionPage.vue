<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { confirm } = useConfirm()
const data = ref<any>({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [] })
const loading = ref(false); const error = ref(''); const notice = ref('')
const agendaTitle = ref(''); const agendaWhen = ref(''); const agendaDetail = ref('')
const journal = ref(''); const dream = ref('')
const localToday = () => { const d = new Date(); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }
const diaryDate = ref(localToday())
const diary = ref<{ date: string; content: string; previous: string | null; next: string | null }>({ date: '', content: '', previous: null, next: null })
const diaryLoading = ref(false)
const diaryParagraphs = computed(() => (diary.value.content || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean))
async function loadDiary(day = diaryDate.value) {
  diaryLoading.value = true
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'journal_page', payload: { date: day } }) })
    if (!r.ok) throw Error(await r.text())
    const body = await r.json()
    diary.value = { date: body?.date || day, content: body?.content || '', previous: body?.previous || null, next: body?.next || null }
    diaryDate.value = diary.value.date
  } catch (e: any) { error.value = e?.message || '无法读取日记' }
  finally { diaryLoading.value = false }
}
function shiftDiary(dir: 'previous' | 'next') { const target = dir === 'previous' ? diary.value.previous : diary.value.next; if (target) void loadDiary(target) }
const openGroup = ref<string>('')
const proactiveForm = ref({ target: '', motive: '', content: '', preferred_at: '' })
const policy = ref({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 })
const groups = computed(() => Object.entries(data.value.groups || {}))
const activeCandidates = computed(() => (data.value.proactive?.candidates || []).filter((x: any) => !['delivered', 'cancelled'].includes(x.status)))
const receipts = computed(() => data.value.proactive?.receipts || [])
const todayKey = localToday()
const todayAgenda = computed(() => (data.value.agenda || []).filter((x: any) => { const s = String(x.start_at || '').replace('T', ' '); return !s || s.slice(0, 10) >= todayKey }))

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
    if (data.value?.policy) policy.value = { ...policy.value, ...data.value.policy }
    syncSettings()
  } catch (e: any) { error.value = e?.message || '无法读取 LIFE 陪伴状态' }
  finally { loading.value = false }
  void loadUsage()
  void loadDiary()
  void loadCalendar()
  void loadGroups()
}
async function act(action: string, payload: any) {
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
    if (!r.ok) throw Error(await r.text())
    await load(); return await r.json().catch(() => ({}))
  } catch (e: any) { error.value = e?.message || '操作失败'; return null }
}
async function query(action: string, payload: any) {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
  if (!r.ok) throw Error(await r.text())
  return await r.json().catch(() => ({}))
}
async function addAgenda() { if (!agendaTitle.value.trim()) return; await act('add_agenda', { title: agendaTitle.value, when: agendaWhen.value, detail: agendaDetail.value }); agendaTitle.value = ''; agendaWhen.value = ''; agendaDetail.value = '' }
async function addEntry(kind: 'journal' | 'dream', content: string) { if (!content.trim()) return; await act(kind, { content }); if (kind === 'journal') journal.value = ''; else dream.value = '' }
function relPct(v: number) { return `${Math.round(Math.max(0, Math.min(1, v || 0)) * 100)}%` }
function agendaState(item: any): { label: string; cls: string } {
  if (item.status === 'completed') return { label: '已完成', cls: 'chip-ok' }
  const start = new Date(String(item.start_at || '').replace(' ', 'T'))
  if (!Number.isNaN(start.getTime()) && start.getTime() <= Date.now()) return { label: '进行中', cls: 'chip-warn' }
  return { label: '待开始', cls: 'muted' }
}
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
async function savePolicy() { await act('proactive_policy', { daily_limit: Number(policy.value.daily_limit), per_target_limit: Number(policy.value.per_target_limit), quiet_start: Number(policy.value.quiet_start), quiet_end: Number(policy.value.quiet_end) }); flash('策略已保存') }
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

const selectedUser = ref('')
const userSearch = ref('')
const userStage = ref('')
const detail = ref<any>(null)
const detailLoading = ref(false)
const detailTab = ref<'overview' | 'relationship' | 'proactive' | 'memory' | 'diagnostics'>('overview')
const detailTabs = [{ key: 'overview', label: '概览' }, { key: 'relationship', label: '关系' }, { key: 'proactive', label: '主动' }, { key: 'memory', label: '记忆' }, { key: 'diagnostics', label: '诊断' }] as const
const userStages = computed(() => Array.from(new Set((data.value.relationships || []).map((r: any) => r.stage).filter(Boolean))))
const filteredUsers = computed(() => (data.value.relationships || []).filter((r: any) => (!userSearch.value || String(r.user_id).toLowerCase().includes(userSearch.value.toLowerCase())) && (!userStage.value || r.stage === userStage.value)))
async function openUser(userId: string) {
  selectedUser.value = userId; detailTab.value = 'overview'; detailLoading.value = true
  const result = await act('user_detail', { user_id: userId, limit: 100, memory_limit: 100 })
  detail.value = result || null
  detailLoading.value = false
}
function closeUser() { selectedUser.value = ''; detail.value = null }
async function deleteMemory(id: string) { await act('delete_memory', { id }); if (selectedUser.value) void openUser(selectedUser.value) }

const month = ref(localToday().slice(0, 7))
const calendar = ref<any>({ events: [], candidates: [], conflicts: [] })
const goalForm = ref({ title: '', detail: '', kind: 'growth' })
const foodForm = ref({ name: '', tags: '', note: '' })
const words = computed(() => data.value.word_cloud || [])
const calendarCells = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  if (!y || !m) return [] as any[]
  const days = new Date(y, m, 0).getDate()
  const startPad = new Date(y, m - 1, 1).getDay()
  const byDay: Record<string, any[]> = {}
  for (const e of calendar.value.events || []) {
    const day = String(e.start_at || '').replace('T', ' ').slice(0, 10)
    ;(byDay[day] ||= []).push(e)
  }
  const cells: any[] = []
  for (let i = 0; i < startPad; i++) cells.push({ key: `pad-${i}`, empty: true })
  for (let d = 1; d <= days; d++) {
    const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ key: iso, day: d, iso, events: byDay[iso] || [], today: iso === todayKey })
  }
  return cells
})
async function loadCalendar() { try { const result = await query('calendar_month', { month: month.value }); if (result) calendar.value = result } catch { /* calendar is optional */ } }
function shiftMonth(delta: number) {
  const [y, m] = month.value.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  month.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  void loadCalendar()
}
async function addGoal() { if (!goalForm.value.title.trim()) return; await act('goal_add', { ...goalForm.value }); goalForm.value = { title: '', detail: '', kind: 'growth' } }
async function completeGoal(id: string) { await act('goal_update', { id, status: 'done', progress: 1 }) }
async function removeGoal(id: string) { await act('goal_delete', { id }) }
async function addFood() { if (!foodForm.value.name.trim()) return; await act('food_add', { ...foodForm.value }); foodForm.value = { name: '', tags: '', note: '' } }
async function removeFood(id: string) { await act('food_delete', { id }) }

const registry = ref<any[]>([])
const groupForm = ref({ group_id: '', policy: 'observe', alias: '' })
const groupSlang = ref<Record<string, any[]>>({})
const groupMembers = ref<Record<string, any[]>>({})
const slangForm = ref<Record<string, string>>({})
async function loadGroups() { try { const r = await query('group_list', {}); registry.value = r.groups || [] } catch { /* groups are optional */ } }
async function addGroup() { if (!groupForm.value.group_id.trim()) return; await act('group_upsert', { ...groupForm.value }); groupForm.value = { group_id: '', policy: 'observe', alias: '' } }
async function removeGroup(id: string) { await act('group_delete', { group_id: id }); if (openGroup.value === id) openGroup.value = '' }
async function setPolicy(g: any, e: Event) { const policy = (e.target as HTMLSelectElement).value; await act('group_upsert', { group_id: g.group_id, policy, alias: g.alias || '', note: g.note || '' }) }
async function setMemberFlag(id: string, userId: string, e: Event) { const flag = (e.target as HTMLSelectElement).value; await act('group_member_flag', { group_id: id, user_id: userId, flag }); void loadGroupDetail(id) }
async function loadGroupDetail(id: string) {
  const [s, m] = await Promise.all([act('group_slang_list', { group_id: id }), act('group_members', { group_id: id })])
  groupSlang.value[id] = s?.slang || []
  groupMembers.value[id] = m?.members || []
}
function toggleGroup(id: string) { openGroup.value = openGroup.value === id ? '' : id; if (openGroup.value) void loadGroupDetail(id) }
async function addSlang(id: string) { const topic = (slangForm.value[id] || '').trim(); if (!topic) return; await act('group_slang_update', { group_id: id, topic, score: 1 }); slangForm.value[id] = ''; void loadGroupDetail(id) }
async function removeSlang(id: string, topic: string) { await act('group_slang_delete', { group_id: id, topic }); void loadGroupDetail(id) }

const skillForm = ref({ name: '', category: 'general', level: 1, keywords: '' })
const exprForm = ref({ text: '', scene: '' })
const exprStatus = ref<'pending' | 'approved' | 'rejected'>('pending')
const nodeForm = ref({ user_id: '', name: '', tags: '' })
const edgeForm = ref({ source_id: '', target_id: '', relation: '' })
const expressions = computed(() => (data.value.expressions || []).filter((e: any) => e.status === exprStatus.value))
const exprCounts = computed(() => {
  const all = data.value.expressions || []
  return { pending: all.filter((e: any) => e.status === 'pending').length, approved: all.filter((e: any) => e.status === 'approved').length, rejected: all.filter((e: any) => e.status === 'rejected').length }
})
async function addSkill() { if (!skillForm.value.name.trim()) return; await act('skill_add', { ...skillForm.value, level: Number(skillForm.value.level) }); skillForm.value = { name: '', category: 'general', level: 1, keywords: '' } }
async function removeSkill(id: string) { await act('skill_delete', { id }) }
async function addExpression() { if (!exprForm.value.text.trim()) return; await act('expression_add', { ...exprForm.value }); exprForm.value = { text: '', scene: '' } }
async function reviewExpression(id: string, accept: boolean) { await act('expression_review', { id, accept }) }
async function removeExpression(id: string) { await act('expression_delete', { id }) }
async function addNode() { if (!nodeForm.value.user_id.trim()) return; await act('social_node_upsert', { ...nodeForm.value }); nodeForm.value = { user_id: '', name: '', tags: '' } }
async function addEdge() { if (!edgeForm.value.source_id.trim() || !edgeForm.value.target_id.trim()) return; await act('social_edge_add', { ...edgeForm.value }); edgeForm.value = { source_id: '', target_id: '', relation: '' } }
async function removeEdge(id: string) { await act('social_edge_delete', { id }) }

const settingsForm = ref<Record<string, any>>({})
const diagnostics = ref<any>(null)
const importText = ref('')
function syncSettings() {
  const s = data.value.settings || {}
  const pick = (k: string, d: string) => String(s[k] ?? d)
  settingsForm.value = {
    proactive_daily_limit: Number(pick('proactive_daily_limit', '3')), proactive_target_limit: Number(pick('proactive_target_limit', '1')),
    quiet_start: Number(pick('quiet_start', '23')), quiet_end: Number(pick('quiet_end', '8')),
    idle_minutes: Number(pick('idle_minutes', '30')), min_interval_minutes: Number(pick('min_interval_minutes', '5')),
    check_interval_seconds: Number(pick('check_interval_seconds', '600')), burst_max: Number(pick('burst_max', '2')),
    daily_token_limit: Number(pick('daily_token_limit', '0')),
    enable_proactive: pick('enable_proactive', '1') === '1', enable_group_observe: pick('enable_group_observe', '1') === '1', enable_dream: pick('enable_dream', '1') === '1',
  }
}
async function saveSettings() {
  const s = settingsForm.value
  const payload: Record<string, string> = {
    proactive_daily_limit: String(s.proactive_daily_limit), proactive_target_limit: String(s.proactive_target_limit),
    quiet_start: String(s.quiet_start), quiet_end: String(s.quiet_end), idle_minutes: String(s.idle_minutes),
    min_interval_minutes: String(s.min_interval_minutes), check_interval_seconds: String(s.check_interval_seconds),
    burst_max: String(s.burst_max), daily_token_limit: String(s.daily_token_limit),
    enable_proactive: s.enable_proactive ? '1' : '0', enable_group_observe: s.enable_group_observe ? '1' : '0', enable_dream: s.enable_dream ? '1' : '0',
  }
  await act('settings_set', { settings: payload }); flash('设置已保存')
}
async function exportConfig() {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'config_export', payload: {} }) })
  if (!r.ok) { error.value = await r.text(); return }
  const blob = new Blob([JSON.stringify(await r.json(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `life-companion-${localToday()}.json`; a.click(); URL.revokeObjectURL(url)
}
async function importConfig() {
  if (!importText.value.trim()) return
  let snapshot: any
  try { snapshot = JSON.parse(importText.value) } catch { error.value = '导入内容不是合法 JSON'; return }
  const result = await act('config_import', { snapshot })
  if (result) { importText.value = ''; flash(`已导入：${Object.entries(result.applied || {}).map(([k, v]) => `${k} ${v}`).join(' · ')}`) }
}
async function runDiagnostics() { const result = await act('diagnostics', {}); if (result) diagnostics.value = result }

const worldKinds = ['persona', 'worldview', 'style', 'background', 'wardrobe', 'reference']
const worldKind = ref('')
const worldForm = ref({ id: '', kind: 'worldview', title: '', content: '', tags: '' })
const worldList = computed(() => (data.value.world || []).filter((w: any) => !worldKind.value || w.kind === worldKind.value))
function editWorld(w: any) { worldForm.value = { id: w.id, kind: w.kind, title: w.title, content: w.content, tags: w.tags || '' } }
async function saveWorld() { if (!worldForm.value.title.trim() || !worldForm.value.content.trim()) return; await act('world_upsert', { ...worldForm.value }); worldForm.value = { id: '', kind: 'worldview', title: '', content: '', tags: '' } }
async function removeWorld(id: string) { await act('world_delete', { id }) }
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
      <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">活动日程</span></div><strong class="stat-value">{{ todayAgenda.filter((x: any) => x.status === 'active').length }}</strong><span class="stat-hint">今天起待进行</span></article>
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
        <h3 class="section-label">今天的日程 <small class="hint-inline">LIFE 按时间自动推进</small></h3>
        <ul class="item-list">
          <li v-for="item in todayAgenda" :key="item.id" class="item">
            <div class="item-main">
              <div class="item-row"><strong :class="{ done: item.status === 'completed' }">{{ item.title }}</strong><span class="chip" :class="agendaState(item).cls">{{ agendaState(item).label }}</span></div>
              <span class="item-meta">{{ item.start_at }}<template v-if="item.detail"> · {{ item.detail }}</template></span>
            </div>
          </li>
          <li v-if="!todayAgenda.length" class="list-empty">今天还没有安排，点右上角让 LIFE 安排。</li>
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
        <div class="book">
          <div class="book-nav">
            <button class="btn btn-tonal btn-sm" :disabled="!diary.previous || diaryLoading" @click="shiftDiary('previous')">← 前一页</button>
            <input v-model="diaryDate" class="input book-date" type="date" aria-label="日记日期" @change="loadDiary(diaryDate)" />
            <button class="btn btn-tonal btn-sm" :disabled="!diary.next || diaryLoading" @click="shiftDiary('next')">后一页 →</button>
          </div>
          <div class="book-page">
            <p class="book-heading">{{ diary.date }}</p>
            <div v-if="diaryParagraphs.length" class="book-body"><p v-for="(para, i) in diaryParagraphs" :key="i">{{ para }}</p></div>
            <p v-else class="book-empty">{{ diaryLoading ? '翻页中…' : '这一天还没有写下什么。' }}</p>
          </div>
        </div>
        <form class="stack-form diary-manual" @submit.prevent="addEntry('journal', journal)"><textarea v-model="journal" class="input area" placeholder="为今天写下一点…"></textarea><button class="btn btn-tonal" type="submit">写入今天</button></form>
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
    <h2 class="group-title">生活日历</h2>
    <div class="grid">
      <article class="card cal-card">
        <div class="card-head">
          <h2 class="card-title">生活日历</h2>
          <div class="head-actions"><button class="btn btn-tonal btn-sm" @click="shiftMonth(-1)">←</button><strong class="cal-month">{{ month }}</strong><button class="btn btn-tonal btn-sm" @click="shiftMonth(1)">→</button></div>
        </div>
        <div class="cal-week"><span v-for="w in ['日', '一', '二', '三', '四', '五', '六']" :key="w">{{ w }}</span></div>
        <div class="cal-grid">
          <div v-for="cell in calendarCells" :key="cell.key" class="cal-cell" :class="{ empty: cell.empty, today: cell.today, has: cell.events?.length }">
            <span v-if="!cell.empty" class="cal-day">{{ cell.day }}</span>
            <span v-for="e in (cell.events || []).slice(0, 2)" :key="e.id" class="cal-chip" :title="e.title">{{ e.title }}</span>
            <span v-if="(cell.events || []).length > 2" class="cal-more">+{{ cell.events.length - 2 }}</span>
          </div>
        </div>
        <p v-if="calendar.conflicts?.length" class="cal-warn">⚠ {{ calendar.conflicts.length }} 处时间冲突：{{ calendar.conflicts.map((c: any) => c.titles.join(' / ')).join('；') }}</p>
        <h3 class="section-label">本月待确认候选 ({{ calendar.candidates?.length || 0 }})</h3>
        <ul class="item-list">
          <li v-for="c in (calendar.candidates || []).slice(0, 6)" :key="c.id" class="item">
            <div class="item-main"><strong>{{ c.title }}</strong><span class="item-meta">{{ c.when_text }}</span></div>
            <div class="item-actions"><button class="btn btn-primary btn-sm" @click="act('confirm_agenda', { id: c.id }).then(loadCalendar)">确认</button><button class="btn btn-danger btn-sm" @click="act('reject_agenda', { id: c.id }).then(loadCalendar)">拒绝</button></div>
          </li>
          <li v-if="!(calendar.candidates || []).length" class="list-empty">没有待确认候选</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">个人目标</h2><span class="chip muted">{{ (data.goals || []).length }}</span></div>
        <form class="stack-form" @submit.prevent="addGoal">
          <input v-model="goalForm.title" class="input" placeholder="目标，如 学会一首钢琴曲" aria-label="目标标题" />
          <input v-model="goalForm.detail" class="input" placeholder="说明（可选）" aria-label="目标说明" />
          <button class="btn btn-primary" type="submit" :disabled="!goalForm.title.trim()">添加目标</button>
        </form>
        <ul class="item-list">
          <li v-for="g in data.goals" :key="g.id" class="item">
            <div class="item-main">
              <div class="item-row"><strong :class="{ done: g.status === 'done' }">{{ g.title }}</strong><span class="chip" :class="g.status === 'done' ? 'chip-ok' : 'muted'">{{ g.status === 'done' ? '已完成' : '进行中' }}</span></div>
              <div class="meter-bar"><i :style="{ width: relPct(g.progress) }"></i></div>
              <span v-if="g.detail" class="item-meta">{{ g.detail }}</span>
            </div>
            <div class="item-actions"><button v-if="g.status !== 'done'" class="btn btn-tonal btn-sm" @click="completeGoal(g.id)">完成</button><button class="btn btn-danger btn-sm" @click="removeGoal(g.id)">删除</button></div>
          </li>
          <li v-if="!(data.goals || []).length" class="list-empty">还没有个人目标</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">食物菜单</h2><span class="chip muted">{{ (data.food || []).length }}</span></div>
        <form class="stack-form" @submit.prevent="addFood">
          <input v-model="foodForm.name" class="input" placeholder="食物，如 番茄牛腩" aria-label="食物名称" />
          <input v-model="foodForm.tags" class="input" placeholder="标签，如 家常 / 甜（可选）" aria-label="食物标签" />
          <button class="btn btn-primary" type="submit" :disabled="!foodForm.name.trim()">加入菜单</button>
        </form>
        <ul class="item-list">
          <li v-for="f in data.food" :key="f.id" class="item"><div class="item-main"><strong>{{ f.name }}</strong><span class="item-meta">{{ f.tags || '—' }}</span></div><div class="item-actions"><button class="btn btn-danger btn-sm" @click="removeFood(f.id)">删除</button></div></li>
          <li v-if="!(data.food || []).length" class="list-empty">菜单还是空的</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">群聊黑话词云</h2><span class="chip muted">{{ words.length }}</span></div>
        <div class="cloud">
          <span v-for="w in words" :key="w.topic" class="cloud-word" :style="{ fontSize: (12 + Math.min(18, Math.log(w.score + 1) * 6)) + 'px', opacity: 0.55 + Math.min(0.45, w.score / 20) }">{{ w.topic }}</span>
          <span v-if="!words.length" class="list-empty plain">还没有群聊词云数据</span>
        </div>
      </article>
    </div>
  </section>

  <section class="group">
    <h2 class="group-title">关系</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head">
          <h2 class="card-title">{{ selectedUser ? '用户详情' : '用户' }}</h2>
          <button v-if="selectedUser" class="btn btn-tonal btn-sm" @click="closeUser">← 返回用户列表</button>
          <span v-else class="chip muted">{{ filteredUsers.length }} / {{ data.relationships?.length || 0 }}</span>
        </div>

        <template v-if="!selectedUser">
          <div class="user-tools">
            <input v-model="userSearch" class="input" placeholder="搜索用户 ID" aria-label="搜索用户" />
            <select v-model="userStage" class="input user-stage" aria-label="按阶段筛选">
              <option value="">全部阶段</option>
              <option v-for="s in userStages" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <ul class="rel-list">
            <li v-for="rel in filteredUsers" :key="rel.user_id" class="rel" @click="openUser(rel.user_id)">
              <span class="avatar">{{ (rel.user_id || '?').slice(0, 1).toUpperCase() }}</span>
              <div class="rel-main">
                <div class="rel-top"><strong>{{ rel.user_id }}</strong><span class="chip">{{ rel.stage }}</span></div>
                <div class="rel-meter"><div class="meter-bar"><i :style="{ width: relPct(rel.affinity) }"></i></div><b>{{ Math.round((rel.affinity || 0) * 100) }}%</b></div>
                <span class="item-meta">最近互动：{{ rel.last_seen || '暂无' }}</span>
              </div>
              <span class="rel-chevron" aria-hidden="true">›</span>
            </li>
            <li v-if="!filteredUsers.length" class="list-empty">没有匹配的用户</li>
          </ul>
        </template>

        <div v-else-if="detailLoading" class="list-empty">加载中…</div>

        <template v-else-if="detail">
          <div class="detail-head">
            <span class="avatar">{{ (detail.user_id || '?').slice(0, 1).toUpperCase() }}</span>
            <div class="rel-main"><strong>{{ detail.user_id }}</strong><span class="item-meta">阶段 {{ detail.relationship?.stage || '未知' }} · 好感 {{ Math.round((detail.relationship?.affinity || 0) * 100) }}% · 最近 {{ detail.relationship?.last_seen || '—' }}</span></div>
          </div>
          <nav class="tabs">
            <button v-for="tab in detailTabs" :key="tab.key" class="tab" :class="{ active: detailTab === tab.key }" @click="detailTab = tab.key">{{ tab.label }}</button>
          </nav>

          <div v-if="detailTab === 'overview'" class="detail-body">
            <div class="kv-grid">
              <div class="kv"><span>关系事件</span><strong>{{ detail.counts?.ledger || 0 }}</strong></div>
              <div class="kv"><span>主动候选</span><strong>{{ detail.counts?.candidates || 0 }}</strong></div>
              <div class="kv"><span>已投递</span><strong>{{ detail.counts?.delivered || 0 }}</strong></div>
              <div class="kv"><span>记忆条数</span><strong>{{ detail.memories?.total || 0 }}</strong></div>
              <div class="kv"><span>阶段主动上限</span><strong>{{ detail.stage_limit ?? '不限' }}</strong></div>
            </div>
            <h3 class="section-label">最近关系事件</h3>
            <ol class="feed compact">
              <li v-for="e in (detail.ledger || []).slice(0, 5)" :key="e.id"><time>{{ fmtTime(e.created_at) }}</time><p>{{ e.event_key }} <span :class="e.delta >= 0 ? 'pos' : 'neg'">{{ e.delta >= 0 ? '+' : '' }}{{ e.delta }}</span> · {{ e.reason }}</p></li>
              <li v-if="!(detail.ledger || []).length" class="list-empty plain">暂无关系事件</li>
            </ol>
          </div>

          <div v-else-if="detailTab === 'relationship'" class="detail-body">
            <div class="rel-meter big"><div class="meter-bar"><i :style="{ width: relPct(detail.relationship?.affinity) }"></i></div><b>{{ Math.round((detail.relationship?.affinity || 0) * 100) }}%</b></div>
            <div class="rel-actions">
              <button class="btn btn-tonal btn-sm" @click="adjustRelationship(detail.user_id, 0.05)">更亲近 +</button>
              <button class="btn btn-tonal btn-sm" @click="adjustRelationship(detail.user_id, -0.05)">更疏远 −</button>
            </div>
            <h3 class="section-label">事件账本</h3>
            <ol class="feed compact">
              <li v-for="e in detail.ledger" :key="e.id"><time>{{ fmtTime(e.created_at) }}</time><p><strong>{{ e.event_key }}</strong> <span :class="e.delta >= 0 ? 'pos' : 'neg'">{{ e.delta >= 0 ? '+' : '' }}{{ e.delta }}</span> · {{ e.reason }} ({{ e.channel }})</p></li>
              <li v-if="!(detail.ledger || []).length" class="list-empty plain">暂无关系事件</li>
            </ol>
          </div>

          <div v-else-if="detailTab === 'proactive'" class="detail-body">
            <h3 class="section-label">候选队列</h3>
            <ul class="item-list">
              <li v-for="c in (detail.proactive?.candidates || [])" :key="c.id" class="item">
                <div class="item-main"><strong>{{ c.motive }}</strong><span class="item-meta">{{ c.content }}</span><span class="item-meta">{{ c.status }} · {{ fmtTime(c.updated_at) }}</span></div>
                <div class="item-actions"><button v-if="!['delivered', 'cancelled'].includes(c.status)" class="btn btn-danger btn-sm" @click="cancelProactive(c.id)">取消</button></div>
              </li>
              <li v-if="!(detail.proactive?.candidates || []).length" class="list-empty">暂无主动记录</li>
            </ul>
            <h3 class="section-label">投递记录</h3>
            <ol class="feed compact">
              <li v-for="r in (detail.proactive?.receipts || [])" :key="r.id"><time>{{ fmtTime(r.created_at) }}</time><p>{{ r.phase }} · {{ r.content }}</p></li>
              <li v-if="!(detail.proactive?.receipts || []).length" class="list-empty plain">暂无投递</li>
            </ol>
          </div>

          <div v-else-if="detailTab === 'memory'" class="detail-body">
            <ul class="item-list">
              <li v-for="m in (detail.memories?.items || [])" :key="m.id" class="item">
                <div class="item-main"><strong class="mem-text">{{ m.content }}</strong><span class="item-meta">scope {{ m.scope }} · 重要度 {{ Math.round((m.importance || 0) * 100) }}% · 召回 {{ m.recall_count }} 次</span></div>
                <div class="item-actions"><button class="btn btn-danger btn-sm" @click="deleteMemory(m.id)">删除</button></div>
              </li>
              <li v-if="!(detail.memories?.items || []).length" class="list-empty">没有与该用户相关的记忆</li>
            </ul>
          </div>

          <div v-else class="detail-body">
            <ol class="timeline">
              <li v-for="item in (detail.audit || [])" :key="item.id">
                <span class="dot" :class="item.outcome === 'ok' ? 'ok' : 'warn'" aria-hidden="true"></span>
                <div class="tl-body"><div class="tl-head"><strong>{{ item.kind }}</strong><span class="chip" :class="item.outcome === 'ok' ? 'chip-ok' : 'chip-warn'">{{ item.outcome }}</span><time>{{ fmtTime(item.created_at) }}</time></div><p class="item-meta">{{ item.target }}</p><p class="tl-detail">{{ item.detail }}</p></div>
              </li>
              <li v-if="!(detail.audit || []).length" class="list-empty plain">暂无诊断记录</li>
            </ol>
          </div>
        </template>
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
    <h2 class="group-title">学习</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">技能学习</h2><span class="chip muted">{{ (data.skills || []).length }}</span></div>
        <form class="stack-form" @submit.prevent="addSkill">
          <input v-model="skillForm.name" class="input" placeholder="技能，如 弹钢琴" aria-label="技能名称" />
          <div class="form-row"><input v-model="skillForm.category" class="input" placeholder="分类" aria-label="分类" /><input v-model.number="skillForm.level" class="input tiny" type="number" min="1" max="10" aria-label="等级" /></div>
          <input v-model="skillForm.keywords" class="input" placeholder="关键词（逗号分隔，可选）" aria-label="关键词" />
          <button class="btn btn-primary" type="submit" :disabled="!skillForm.name.trim()">添加技能</button>
        </form>
        <ul class="item-list">
          <li v-for="s in data.skills" :key="s.id" class="item">
            <div class="item-main"><div class="item-row"><strong>{{ s.name }}</strong><span class="chip muted">Lv.{{ s.level }}</span><span class="chip">{{ s.category }}</span></div><span v-if="s.keywords" class="item-meta">{{ s.keywords }}</span></div>
            <div class="item-actions"><button class="btn btn-danger btn-sm" @click="removeSkill(s.id)">删除</button></div>
          </li>
          <li v-if="!(data.skills || []).length" class="list-empty">还没有技能</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">表达学习</h2><span class="chip muted">待审 {{ exprCounts.pending }}</span></div>
        <div class="toolbar-inline">
          <button class="btn btn-sm" :class="exprStatus === 'pending' ? 'btn-primary' : 'btn-tonal'" @click="exprStatus = 'pending'">待审 {{ exprCounts.pending }}</button>
          <button class="btn btn-sm" :class="exprStatus === 'approved' ? 'btn-primary' : 'btn-tonal'" @click="exprStatus = 'approved'">已用 {{ exprCounts.approved }}</button>
          <button class="btn btn-sm" :class="exprStatus === 'rejected' ? 'btn-primary' : 'btn-tonal'" @click="exprStatus = 'rejected'">已拒 {{ exprCounts.rejected }}</button>
        </div>
        <form class="slang-form" @submit.prevent="addExpression"><input v-model="exprForm.text" class="input" placeholder="表达，如 晚安呀" aria-label="表达内容" /><input v-model="exprForm.scene" class="input scene-input" placeholder="场景" aria-label="场景" /><button class="btn btn-primary btn-sm" type="submit" :disabled="!exprForm.text.trim()">入库</button></form>
        <ul class="item-list">
          <li v-for="e in expressions" :key="e.id" class="item">
            <div class="item-main"><strong>{{ e.text }}</strong><span class="item-meta">{{ e.scene || '通用' }} · {{ e.source }}</span></div>
            <div class="item-actions"><button v-if="e.status === 'pending'" class="btn btn-primary btn-sm" @click="reviewExpression(e.id, true)">采用</button><button v-if="e.status === 'pending'" class="btn btn-tonal btn-sm" @click="reviewExpression(e.id, false)">拒绝</button><button class="btn btn-danger btn-sm" @click="removeExpression(e.id)">删除</button></div>
          </li>
          <li v-if="!expressions.length" class="list-empty">该分类下没有表达</li>
        </ul>
      </article>

      <article class="card">
        <div class="card-head"><h2 class="card-title">社交关系网</h2><span class="chip muted">{{ (data.social_nodes || []).length }} 人 · {{ (data.social_edges || []).length }} 关系</span></div>
        <form class="stack-form" @submit.prevent="addNode">
          <input v-model="nodeForm.user_id" class="input" placeholder="用户 ID" aria-label="用户 ID" />
          <div class="form-row"><input v-model="nodeForm.name" class="input" placeholder="称呼（可选）" aria-label="称呼" /><input v-model="nodeForm.tags" class="input" placeholder="标签（可选）" aria-label="标签" /></div>
          <button class="btn btn-primary" type="submit" :disabled="!nodeForm.user_id.trim()">加入关系网</button>
        </form>
        <ul class="item-list">
          <li v-for="n in data.social_nodes" :key="n.user_id" class="item"><div class="item-main"><strong>{{ n.name || n.user_id }}</strong><span class="item-meta">{{ n.user_id }}<template v-if="n.tags"> · {{ n.tags }}</template></span></div></li>
          <li v-if="!(data.social_nodes || []).length" class="list-empty">关系网还是空的</li>
        </ul>
        <h3 class="section-label">关系连线</h3>
        <form class="form-row" @submit.prevent="addEdge">
          <input v-model="edgeForm.source_id" class="input" placeholder="A" aria-label="关系起点" />
          <input v-model="edgeForm.target_id" class="input" placeholder="B" aria-label="关系终点" />
          <input v-model="edgeForm.relation" class="input" placeholder="关系，如 同学" aria-label="关系" />
          <button class="btn btn-tonal btn-sm" type="submit" :disabled="!edgeForm.source_id.trim() || !edgeForm.target_id.trim()">连线</button>
        </form>
        <ul class="item-list">
          <li v-for="e in data.social_edges" :key="e.id" class="item"><div class="item-main"><strong>{{ e.source_id }} → {{ e.target_id }}</strong><span class="item-meta">{{ e.relation }}</span></div><div class="item-actions"><button class="btn btn-danger btn-sm" @click="removeEdge(e.id)">删除</button></div></li>
          <li v-if="!(data.social_edges || []).length" class="list-empty">还没有关系连线</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="group">
    <h2 class="group-title">世界知识</h2>
    <div class="grid">
      <article class="card">
        <div class="card-head"><h2 class="card-title">{{ worldForm.id ? '编辑条目' : '新增条目' }}</h2><span class="chip muted">{{ (data.world || []).length }}</span></div>
        <form class="stack-form" @submit.prevent="saveWorld">
          <div class="form-row">
            <select v-model="worldForm.kind" class="input world-kind" aria-label="类型"><option v-for="k in worldKinds" :key="k" :value="k">{{ k }}</option></select>
            <input v-model="worldForm.title" class="input" placeholder="标题，如 世界观 / 今日穿搭" aria-label="标题" />
          </div>
          <textarea v-model="worldForm.content" class="input area" placeholder="内容…"></textarea>
          <input v-model="worldForm.tags" class="input" placeholder="标签（可选）" aria-label="标签" />
          <div class="toolbar-inline"><button class="btn btn-primary" type="submit" :disabled="!worldForm.title.trim() || !worldForm.content.trim()">{{ worldForm.id ? '保存' : '添加' }}</button><button v-if="worldForm.id" type="button" class="btn btn-tonal" @click="worldForm = { id: '', kind: 'worldview', title: '', content: '', tags: '' }">取消编辑</button></div>
        </form>
        <div class="world-filter">
          <button class="btn btn-sm" :class="worldKind === '' ? 'btn-primary' : 'btn-tonal'" @click="worldKind = ''">全部</button>
          <button v-for="k in worldKinds" :key="k" class="btn btn-sm" :class="worldKind === k ? 'btn-primary' : 'btn-tonal'" @click="worldKind = k">{{ k }}</button>
        </div>
      </article>
      <article class="card">
        <div class="card-head"><h2 class="card-title">条目</h2></div>
        <ul class="item-list">
          <li v-for="w in worldList" :key="w.id" class="item">
            <div class="item-main"><div class="item-row"><strong>{{ w.title }}</strong><span class="chip muted">{{ w.kind }}</span></div><span class="item-meta world-content">{{ w.content }}</span><span v-if="w.tags" class="item-meta">{{ w.tags }}</span></div>
            <div class="item-actions"><button class="btn btn-tonal btn-sm" @click="editWorld(w)">编辑</button><button class="btn btn-danger btn-sm" @click="removeWorld(w.id)">删除</button></div>
          </li>
          <li v-if="!worldList.length" class="list-empty">还没有条目</li>
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
          <input v-model="proactiveForm.target" class="input" placeholder="目标：session:<会话ID> / user:<QQ> / group:<群号>" aria-label="主动对象" />
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
          <label class="select"><span>免打扰起</span><input v-model.number="policy.quiet_start" type="number" min="0" max="23" class="input tiny" /></label>
          <label class="select"><span>免打扰止</span><input v-model.number="policy.quiet_end" type="number" min="0" max="23" class="input tiny" /></label>
          <button class="btn btn-tonal btn-sm" @click="savePolicy">保存策略</button>
        </div>
        <p class="helper-inline">免打扰起止相同即关闭；target 用 <code>session:&lt;会话ID&gt;</code> 可直接发到对话。</p>
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
        <div class="card-head"><h2 class="card-title">群聊管理</h2><span class="chip muted">{{ registry.length }}</span></div>
        <form class="group-form" @submit.prevent="addGroup">
          <input v-model="groupForm.group_id" class="input" placeholder="群号" aria-label="群号" />
          <select v-model="groupForm.policy" class="input policy-select" aria-label="策略"><option value="observe">观察</option><option value="whitelist">白名单</option><option value="blacklist">黑名单</option></select>
          <input v-model="groupForm.alias" class="input" placeholder="备注名（可选）" aria-label="备注名" />
          <button class="btn btn-primary" type="submit" :disabled="!groupForm.group_id.trim()">添加群</button>
        </form>
        <ul class="item-list">
          <li v-for="g in registry" :key="g.group_id" class="item group-item">
            <div class="item-main">
              <div class="item-row"><strong>{{ g.group_id }}</strong><span v-if="g.alias" class="chip muted">{{ g.alias }}</span><span class="chip" :class="g.policy === 'blacklist' ? 'chip-warn' : g.policy === 'whitelist' ? 'chip-ok' : 'muted'">{{ g.policy }}</span></div>
              <span class="item-meta">{{ g.observations }} 条观察 · {{ g.topics }} 个话题</span>
              <div v-if="openGroup === g.group_id" class="group-detail">
                <h4 class="section-label">黑话 / 话题</h4>
                <div class="topics">
                  <span v-for="s in (groupSlang[g.group_id] || [])" :key="s.topic" class="chip muted">{{ s.topic }} · {{ Math.round(s.score) }}<button class="chip-x" @click="removeSlang(g.group_id, s.topic)">×</button></span>
                  <span v-if="!(groupSlang[g.group_id] || []).length" class="item-meta">暂无</span>
                </div>
                <form class="slang-form" @submit.prevent="addSlang(g.group_id)"><input v-model="slangForm[g.group_id]" class="input" placeholder="新增黑话 / 话题" aria-label="新增黑话" /><button class="btn btn-tonal btn-sm" type="submit">添加</button></form>
                <h4 class="section-label">成员安全</h4>
                <ul class="member-list">
                  <li v-for="m in (groupMembers[g.group_id] || [])" :key="m.user_id" class="member-row">
                    <span class="member-id">{{ m.user_id }}</span><span class="item-meta">{{ m.messages }} 条 · {{ fmtTime(m.last_at) }}</span>
                    <select class="input flag-select" :value="m.flag" @change="setMemberFlag(g.group_id, m.user_id, $event)"><option value="watch">关注</option><option value="allow">放行</option><option value="mute">禁言</option></select>
                  </li>
                  <li v-if="!(groupMembers[g.group_id] || []).length" class="item-meta">暂无成员观察</li>
                </ul>
              </div>
            </div>
            <div class="item-actions">
              <select class="input policy-select" :value="g.policy" @change="setPolicy(g, $event)"><option value="observe">观察</option><option value="whitelist">白名单</option><option value="blacklist">黑名单</option></select>
              <button class="btn btn-tonal btn-sm" @click="toggleGroup(g.group_id)">{{ openGroup === g.group_id ? '收起' : '管理' }}</button>
              <button class="btn btn-danger btn-sm" @click="removeGroup(g.group_id)">删除</button>
            </div>
          </li>
          <li v-if="!registry.length" class="list-empty">还没有群记录。收到群消息或在上面添加。</li>
        </ul>
      </article>
    </div>
  </section>

    <section class="group">
      <h2 class="group-title">配置</h2>
      <div class="grid">
        <article class="card">
          <div class="card-head"><h2 class="card-title">运行设置</h2><button class="btn btn-primary btn-sm" @click="saveSettings">保存</button></div>
          <div class="settings-grid">
            <label class="select"><span>每日主动上限</span><input v-model.number="settingsForm.proactive_daily_limit" type="number" min="0" class="input tiny" /></label>
            <label class="select"><span>单人上限</span><input v-model.number="settingsForm.proactive_target_limit" type="number" min="0" class="input tiny" /></label>
            <label class="select"><span>免打扰起</span><input v-model.number="settingsForm.quiet_start" type="number" min="0" max="23" class="input tiny" /></label>
            <label class="select"><span>免打扰止</span><input v-model.number="settingsForm.quiet_end" type="number" min="0" max="23" class="input tiny" /></label>
            <label class="select"><span>空闲分钟</span><input v-model.number="settingsForm.idle_minutes" type="number" min="0" class="input tiny" /></label>
            <label class="select"><span>最小间隔(分)</span><input v-model.number="settingsForm.min_interval_minutes" type="number" min="0" class="input tiny" /></label>
            <label class="select"><span>检查间隔(秒)</span><input v-model.number="settingsForm.check_interval_seconds" type="number" min="60" class="input tiny" /></label>
            <label class="select"><span>连发上限</span><input v-model.number="settingsForm.burst_max" type="number" min="1" class="input tiny" /></label>
            <label class="select"><span>每日 Token</span><input v-model.number="settingsForm.daily_token_limit" type="number" min="0" class="input tiny" /></label>
          </div>
          <div class="toggle-row">
            <label class="check-line"><input type="checkbox" v-model="settingsForm.enable_proactive" /> 启用主动消息</label>
            <label class="check-line"><input type="checkbox" v-model="settingsForm.enable_group_observe" /> 群聊观察</label>
            <label class="check-line"><input type="checkbox" v-model="settingsForm.enable_dream" /> 梦境生成</label>
          </div>
        </article>

        <article class="card">
          <div class="card-head"><h2 class="card-title">数据导入导出</h2><button class="btn btn-tonal btn-sm" @click="exportConfig">导出 JSON</button></div>
          <textarea v-model="importText" class="input area" placeholder="粘贴导出的配置 JSON 后点导入…"></textarea>
          <button class="btn btn-primary btn-sm" @click="importConfig" :disabled="!importText.trim()">导入</button>
          <p class="helper-inline">合并设置、目标、菜单、技能、表达、重要日期等，不会删除已有数据。</p>
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
      <div class="card-head"><h2 class="card-title">排障检查</h2><button class="btn btn-tonal btn-sm" @click="runDiagnostics">运行诊断</button></div>
      <ul class="item-list">
        <li v-for="c in (diagnostics?.checks || [])" :key="c.name" class="item">
          <div class="item-main"><strong>{{ c.name }}</strong><span class="item-meta">{{ c.detail }}</span></div>
          <span class="chip" :class="c.status === 'ok' ? 'chip-ok' : c.status === 'warn' ? 'chip-warn' : 'muted'">{{ c.status }}</span>
        </li>
        <li v-if="!diagnostics" class="list-empty">点击“运行诊断”查看检查项</li>
      </ul>
      <div v-if="diagnostics" class="kv-grid">
        <div v-for="(v, k) in diagnostics.counts" :key="k" class="kv"><span>{{ k }}</span><strong>{{ v }}</strong></div>
      </div>
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
.item-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.hint-inline{font-weight:400;text-transform:none;letter-spacing:0;font-size:11px;opacity:.8}
.helper-inline{margin:8px 0 0;font-size:12px;color:var(--md-on-surface-variant)}
.helper-inline code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--md-surface-container);padding:2px 6px;border-radius:6px}
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
.user-tools{display:flex;gap:10px;margin-bottom:12px}
.user-stage{width:130px;flex:0 0 auto}
.rel{cursor:pointer}
.rel-chevron{font-size:20px;color:var(--md-on-surface-variant);flex-shrink:0}
.detail-head{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.tab{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 12.5px/1 inherit;cursor:pointer}
.tab:hover{border-color:var(--md-primary)}
.tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}
.detail-body{display:flex;flex-direction:column;gap:6px}
.kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.kv{background:var(--md-surface-container-low);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.kv span{font-size:12px;color:var(--md-on-surface-variant)}
.kv strong{font-size:20px;font-weight:700}
.rel-meter.big{margin:6px 0}
.rel-meter.big b{font-size:15px}
.mem-text{font-weight:500 !important;line-height:1.6}
.cal-card{grid-column:1/-1}
.cal-month{font-size:14px;font-weight:700;min-width:76px;text-align:center}
.cal-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}
.cal-week span{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:600}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cal-cell{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}
.cal-cell.empty{border-color:transparent;background:transparent}
.cal-cell.today{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 18%,transparent)}
.cal-cell.has{background:var(--md-surface-container-low)}
.cal-day{font-size:12px;font-weight:700;color:var(--md-on-surface-variant)}
.cal-chip{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal-more{font-size:10px;color:var(--md-on-surface-variant)}
.cal-warn{margin:12px 0 0;padding:8px 12px;border-radius:10px;background:#FFF1DC;color:#7A4400;font-size:12.5px}
.cloud{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}
.cloud-word{font-weight:700;color:var(--md-primary);line-height:1.2}
.group-form{display:grid;grid-template-columns:1fr 120px 1fr auto;gap:10px;margin-bottom:12px}
.policy-select{width:auto;height:34px;flex:0 0 auto}
.flag-select{width:auto;height:30px;flex:0 0 auto;font-size:12px}
.slang-form{display:flex;gap:8px;margin:8px 0}
.slang-form .input{height:34px}
.chip-x{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:700;margin-left:4px}
.member-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.member-row{display:flex;align-items:center;gap:10px;font-size:12.5px}
.member-id{font-weight:600;min-width:80px}
.member-row .item-meta{flex:1}
.form-row{display:flex;gap:10px}
.form-row .input{flex:1}
.scene-input{width:120px;flex:0 0 auto}
.settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}
.toggle-row{display:flex;gap:16px;flex-wrap:wrap}
.select span{white-space:nowrap}
.world-kind{width:130px;flex:0 0 auto}
.world-filter{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.world-content{white-space:pre-wrap}
.book{border:1px solid var(--md-outline-variant);border-radius:14px;background:linear-gradient(180deg,var(--md-surface-container-lowest),var(--md-surface-container-low));padding:16px 18px}
.book-nav{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.book-date{width:auto;height:34px;flex:0 0 auto}
.book-page{min-height:120px;border-top:1px solid var(--md-outline-variant);padding-top:14px}
.book-heading{margin:0 0 10px;font:600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--md-on-surface-variant);letter-spacing:.02em}
.book-body{display:flex;flex-direction:column;gap:10px}
.book-body p{margin:0;font-size:14px;line-height:1.95;text-indent:2em;color:var(--md-on-surface);white-space:pre-wrap;overflow-wrap:anywhere}
.book-empty{margin:0;font-size:13px;color:var(--md-on-surface-variant);font-style:italic}
.diary-manual{margin-top:14px;border-top:1px dashed var(--md-outline-variant);padding-top:12px}
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
