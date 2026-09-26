<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConfirm } from './confirm'
import ConfirmDialog from './ConfirmDialog.vue'

const { confirm } = useConfirm()
const data = ref<any>({ relationships: [], relationship_ledger: [], agenda: [], calendar_candidates: [], journal: [], dreams: [], audit: [], groups: {}, proactive: { candidates: [], receipts: [] }, persona_evolution: [], open_topics: [], portraits: [], timeline: [] })
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
  } catch (e: any) { error.value = friendlyError(e) }
  finally { diaryLoading.value = false }
}
function shiftDiary(dir: 'previous' | 'next') { const target = dir === 'previous' ? diary.value.previous : diary.value.next; if (target) void loadDiary(target) }
const openGroup = ref<string>('')
const proactiveForm = ref({ target: '', motive: '', content: '', preferred_at: '' })
const targetChoice = ref('')
const targetManual = ref('')
function resolvedTarget() { return targetChoice.value === '__manual__' ? targetManual.value.trim() : targetChoice.value }
const policy = ref({ daily_limit: 6, per_target_limit: 2, quiet_start: 23, quiet_end: 8 })
const groups = computed(() => Object.entries(data.value.groups || {}))
const activeCandidates = computed(() => (data.value.proactive?.candidates || []).filter((x: any) => !['delivered', 'cancelled'].includes(x.status)))
const receipts = computed(() => data.value.proactive?.receipts || [])
const todayKey = localToday()
const todayAgenda = computed(() => (data.value.agenda || []).filter((x: any) => { const s = String(x.start_at || '').replace('T', ' '); return !s || s.slice(0, 10) >= todayKey }))

const tab = ref('overview')
const pageEl = ref<HTMLElement | null>(null)
const topicForm = ref('')
const navItems = [
  { key: 'overview', i: '01', label: '总览', icon: '◉' },
  { key: 'world', i: '02', label: '世界知识', icon: '✎' },
  { key: 'users', i: '03', label: '用户', icon: '☺' },
  { key: 'groups', i: '04', label: '群聊', icon: '☷' },
  { key: 'learning', i: '05', label: '学习', icon: '✚' },
  { key: 'observe', i: '06', label: '观察', icon: '◎' },
  { key: 'proactive', i: '07', label: '主动', icon: '✦' },
  { key: 'tokens', i: '08', label: 'Token', icon: '∑' },
  { key: 'troubleshooting', i: '09', label: '排障', icon: '⚠' },
  { key: 'config', i: '10', label: '配置', icon: '⚙' },
  { key: 'models', i: '11', label: '模型', icon: '⌁' },
  { key: 'experimental', i: '12', label: '实验', icon: '⚗' },
]

function flash(message: string) { notice.value = message; setTimeout(() => { if (notice.value === message) notice.value = '' }, 2500) }
/** Turn raw gateway/gRPC dial errors into a calm, actionable message. */
function friendlyError(e: any): string {
  const text = String(e?.message || e || '')
  if (/connection refused|Unavailable|actively refused|dial tcp|ECONNREFUSED|LIFE is unavailable|life unavailable|502|503/i.test(text)) {
    return 'LIFE 服务暂时未就绪（可能正在启动或重启），已自动重试。稍候刷新即可。'
  }
  return text || '操作失败'
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const usage = ref<any>(null)
async function loadUsage() { try { const r = await fetch('/api/usage'); if (r.ok) usage.value = await r.json() } catch { /* optional */ } }
async function load(attempt = 0): Promise<void> {
  loading.value = true; error.value = ''
  try {
    const r = await fetch('/api/life/companion')
    if (!r.ok) throw Error(await r.text() || String(r.status))
    data.value = await r.json()
    if (data.value?.policy) policy.value = { ...policy.value, ...data.value.policy }
    syncSettings()
    loading.value = false
    void loadUsage(); void loadDiary(); void loadCalendar(); void loadGroups(); void loadContent(); void loadExtensions(); void loadAudit()
  } catch (e: any) {
    if (attempt < 4) { await sleep(1500); return load(attempt + 1) }
    error.value = friendlyError(e)
    loading.value = false
  }
}
async function act(action: string, payload: any) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
      if (!r.ok) throw Error(await r.text())
      const body = await r.json().catch(() => ({}))
      await load(); return body
    } catch (e: any) {
      if (attempt < 2 && /connection refused|Unavailable|actively refused|dial tcp|502|503|life unavailable/i.test(String(e?.message || e))) { await sleep(1200); continue }
      error.value = friendlyError(e); return null
    }
  }
  return null
}
async function query(action: string, payload: any) {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload }) })
  if (!r.ok) throw Error(await r.text())
  return await r.json().catch(() => ({}))
}
async function addAgenda() { if (!agendaTitle.value.trim()) return; await act('add_agenda', { title: agendaTitle.value, when: agendaWhen.value, detail: agendaDetail.value }); agendaTitle.value = ''; agendaWhen.value = ''; agendaDetail.value = ''; flash('已加入日程') }
async function addEntry(kind: 'journal' | 'dream', content: string) { if (!content.trim()) return; await act(kind, { content }); if (kind === 'journal') journal.value = ''; else dream.value = '' }
function relPct(v: number) { return `${Math.round(Math.max(0, Math.min(1, v || 0)) * 100)}%` }
function agendaState(item: any): { label: string; cls: string } {
  if (item.status === 'completed') return { label: '已完成', cls: 'ok' }
  const start = new Date(String(item.start_at || '').replace(' ', 'T'))
  if (!Number.isNaN(start.getTime()) && start.getTime() <= Date.now()) return { label: '进行中', cls: 'warn' }
  return { label: '待开始', cls: 'muted' }
}
async function adjustRelationship(userId: string, delta: number) { const result = await act('relationship_adjust', { user_id: userId, event_key: `manual:${Date.now()}`, reason: 'dashboard_adjust', channel: 'webui', delta }); if (result) flash(`已调整 ${userId}`) }
async function decayRelationships() { const r = await act('relationship_decay', {}); flash(r?.decayed != null ? `已自然回落 ${r.decayed} 个关系` : '已处理') }
async function createProactive() { const target = resolvedTarget(); if (!target || !proactiveForm.value.content.trim()) return; const result = await act('proactive_create', { ...proactiveForm.value, target }); if (result) { proactiveForm.value = { target: '', motive: '', content: '', preferred_at: '' }; targetChoice.value = ''; targetManual.value = ''; flash('已创建主动候选') } }
async function cancelProactive(id: string) { await act('proactive_cancel', { id, reason: 'dashboard_cancel' }); flash('已取消候选') }
async function savePolicy() { await act('proactive_policy', { daily_limit: Number(policy.value.daily_limit), per_target_limit: Number(policy.value.per_target_limit), quiet_start: Number(policy.value.quiet_start), quiet_end: Number(policy.value.quiet_end) }); flash('策略已保存') }
const generating = ref('')
async function generate(kind: 'journal' | 'dream') {
  generating.value = kind
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: kind === 'journal' ? 'journal_generate' : 'dream_generate', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    await load(); flash('已由 LIFE 生成')
  } catch (e: any) { error.value = friendlyError(e) } finally { generating.value = '' }
}
async function suggestProactive() { const target = resolvedTarget(); if (!target) { flash('先选择发送目标'); return } const result = await act('proactive_suggest', { target, hint: proactiveForm.value.motive }); if (result) { proactiveForm.value = { target: '', motive: '', content: '', preferred_at: '' }; targetChoice.value = ''; targetManual.value = ''; flash('已生成建议候选') } }
const ticking = ref(false)
async function tickNow() { ticking.value = true
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'proactive_tick', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    const body = await r.json(); await load()
    flash(body?.skipped ? `本次跳过：${body.skipped}` : `已投递 ${body.delivered || 0} 条 · 拦截 ${body.blocked || 0} 条`)
  } catch (e: any) { error.value = friendlyError(e) } finally { ticking.value = false }
}
const planning = ref(false)
async function planNow() { planning.value = true
  try {
    const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'autonomy_plan', payload: {} }) })
    if (!r.ok) throw Error(await r.text())
    const body = await r.json(); await load()
    const applied = body?.applied
    flash(applied ? `已自主规划：日程 ${applied.agenda} · 主动 ${applied.proactive}` : '本次没有新的规划')
  } catch (e: any) { error.value = friendlyError(e) } finally { planning.value = false }
}
function daysUntil(text: string): number | null {
  const value = (text || '').trim(); const today = new Date(); today.setHours(0, 0, 0, 0)
  let target: Date | null = null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) { target = new Date(value); target.setHours(0, 0, 0, 0); if (target < today) target.setFullYear(today.getFullYear() + 1) }
  else if (/^\d{2}-\d{2}$/.test(value)) { target = new Date(today.getFullYear(), Number(value.slice(0, 2)) - 1, Number(value.slice(3, 5))); if (target < today) target.setFullYear(today.getFullYear() + 1) }
  if (!target || Number.isNaN(target.getTime())) return null
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}
const dateForm = ref({ title: '', date: '', repeat_yearly: true, note: '' })
async function addDate() { if (!dateForm.value.title.trim() || !dateForm.value.date.trim()) return; await act('date_add', { ...dateForm.value }); dateForm.value = { title: '', date: '', repeat_yearly: true, note: '' }; flash('已添加重要日期') }
async function removeDate(id: string) { await act('date_delete', { id }); flash('已删除') }
async function eat() { await act('circadian_eat', { amount: 45 }); flash('已用餐') }
async function arrangeAgenda() { const result = await act('daily_agenda', {}); flash(result?.created ? `LIFE 已安排 ${result.created} 项活动` : '今天已有安排') }
async function clearJournal(kind: 'journal' | 'dream') { const ok = await confirm({ title: kind === 'dream' ? '清除梦境' : '清除日记', message: '将删除全部该类型记录，无法恢复。', confirmLabel: '清除', danger: true }); if (!ok) return; await act('journal_clear', { kind }); flash('已清除') }
function fmtTime(value?: string) { if (!value) return ''; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString() }

const selectedUser = ref('')
const userSearch = ref('')
const userStage = ref('')
const detail = ref<any>(null)
const detailLoading = ref(false)
const detailTopics = ref<string[]>([])
const detailPortrait = ref<any>(null)
const detailTab = ref<'overview' | 'relationship' | 'proactive' | 'memory' | 'diagnostics'>('overview')
const detailTabs = [{ key: 'overview', label: '概览' }, { key: 'relationship', label: '关系' }, { key: 'proactive', label: '主动' }, { key: 'memory', label: '记忆' }, { key: 'diagnostics', label: '诊断' }] as const
const userStages = computed(() => Array.from(new Set((data.value.relationships || []).map((r: any) => r.stage).filter(Boolean))))
const ownerIds = computed(() => String(data.value.settings?.owner_user_ids || '').split(',').map((x: string) => x.trim()).filter(Boolean))
const filteredUsers = computed(() => (data.value.relationships || []).filter((r: any) => (!userSearch.value || String(r.user_id).toLowerCase().includes(userSearch.value.toLowerCase())) && (!userStage.value || r.stage === userStage.value)))
async function openUser(userId: string) {
  selectedUser.value = userId; detailTab.value = 'overview'; detailLoading.value = true
  const [result, topics, portrait] = await Promise.all([
    act('user_detail', { user_id: userId, limit: 100, memory_limit: 100 }),
    query('open_topic_list', { user_id: userId, limit: 10 }).catch(() => ({ topics: [] })),
    query('portrait_get', { user_id: userId }).catch(() => null),
  ])
  detail.value = result || null; detailTopics.value = topics?.topics || []; detailPortrait.value = portrait; detailLoading.value = false
}
function closeUser() { selectedUser.value = ''; detail.value = null; detailTopics.value = []; detailPortrait.value = null }
async function deleteMemory(id: string) { await act('delete_memory', { id }); if (selectedUser.value) void openUser(selectedUser.value) }
async function resolveTopic(topic: string) { if (!selectedUser.value) return; const r = await act('open_topic_resolve', { user_id: selectedUser.value, topics: [topic] }); flash(r?.resolved ? '已标记完成' : '已处理') }

const month = ref(localToday().slice(0, 7))
const calendar = ref<any>({ events: [], candidates: [], conflicts: [] })
const goalForm = ref({ title: '', detail: '', kind: 'growth' })
const goalLogs = ref<Record<string, any[]>>({})
const goalLogForm = ref<Record<string, string>>({})
const foodForm = ref({ name: '', tags: '', note: '' })
const words = computed(() => data.value.word_cloud || [])
const calendarCells = computed(() => {
  const [y, m] = month.value.split('-').map(Number); if (!y || !m) return [] as any[]
  const days = new Date(y, m, 0).getDate(); const startPad = new Date(y, m - 1, 1).getDay(); const byDay: Record<string, any[]> = {}
  for (const e of calendar.value.events || []) { const day = String(e.start_at || '').replace('T', ' ').slice(0, 10); (byDay[day] ||= []).push(e) }
  const cells: any[] = []; for (let i = 0; i < startPad; i++) cells.push({ key: `pad-${i}`, empty: true })
  for (let d = 1; d <= days; d++) { const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; cells.push({ key: iso, day: d, iso, events: byDay[iso] || [], today: iso === todayKey }) }
  return cells
})
async function loadCalendar() { try { const result = await query('calendar_month', { month: month.value }); if (result) calendar.value = result } catch { /* optional */ } }
function shiftMonth(delta: number) { const [y, m] = month.value.split('-').map(Number); const d = new Date(y, m - 1 + delta, 1); month.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; void loadCalendar() }
async function addGoal() { if (!goalForm.value.title.trim()) return; await act('goal_add', { ...goalForm.value }); goalForm.value = { title: '', detail: '', kind: 'growth' } }
async function completeGoal(id: string) { await act('goal_update', { id, status: 'done', progress: 1 }) }
async function removeGoal(id: string) { await act('goal_delete', { id }) }
async function loadGoalLogs(id: string) { const r = await query('goal_logs', { id, limit: 20 }); goalLogs.value[id] = r?.logs || [] }
async function addGoalLog(id: string) { const text = (goalLogForm.value[id] || '').trim(); if (!text) return; await act('goal_log_add', { id, evidence: text }); goalLogForm.value[id] = ''; void loadGoalLogs(id) }
async function addFood() { if (!foodForm.value.name.trim()) return; await act('food_add', { ...foodForm.value }); foodForm.value = { name: '', tags: '', note: '' } }
async function removeFood(id: string) { await act('food_delete', { id }) }

const digests = ref<any[]>([])
async function loadContent() { try { const r = await query('content_list', { limit: 30 }); digests.value = r?.digests || [] } catch { /* optional */ } }
async function gatherContent() {
  const r = await act('content_tick', {}); void loadContent(); if (!r) return
  if (r.skipped === 'disabled') flash('内容抓取未开启（配置 → 环境与内容 打开 enable_content_fetch）')
  else if (r.skipped === 'done') flash('今天已经抓取过了')
  else if (r.skipped === 'sleeping') flash('睡眠中，暂不抓取')
  else flash(r.stored != null ? `已抓取 ${r.stored} 条见闻` : '已处理')
}
async function outfitToday() {
  const r = await act('outfit_tick', {}); if (!r) return
  if (r.outfit) flash(`今日穿搭：${r.outfit}`)
  else if (r.skipped === 'no_wardrobe') flash('衣橱还没有条目（世界知识 → wardrobe）')
  else if (r.skipped === 'done') flash('今天已经有穿搭了')
  else flash('已处理')
}
async function tryImage() { const r = await act('image_generate', { prompt: '今天的穿搭' }); flash(r?.ok ? '已生成' : `生图不可用：${r?.reason || '未配置扩展'}`) }
async function addTopic() {
  if (!selectedUser.value || !topicForm.value.trim()) return
  const r = await act('open_topic_add', { user_id: selectedUser.value, topic: topicForm.value.trim() })
  if (r) { topicForm.value = ''; flash('已加入未完话题') }
}
const activity = computed(() => {
  const map: Record<string, number> = {}
  for (const item of (data.value.timeline || [])) { const d = String(item.created_at || '').slice(0, 10); if (d) map[d] = (map[d] || 0) + 1 }
  const days: { day: string; count: number }[] = []
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const key = d.toISOString().slice(0, 10); days.push({ day: key.slice(5), count: map[key] || 0 }) }
  return days
})
const activityMax = computed(() => Math.max(1, ...activity.value.map((d) => d.count)))

const registry = ref<any[]>([])
const targetOptions = computed(() => {
  const opts: { value: string; label: string }[] = []
  for (const c of (data.value.conversations || [])) opts.push({ value: `session:${c}`, label: `会话 · ${c}` })
  for (const r of (data.value.relationships || [])) opts.push({ value: `user:${r.user_id}`, label: `用户 · ${r.user_id}` })
  for (const g of registry.value) opts.push({ value: `group:${g.group_id}`, label: `群 · ${g.alias || g.group_id}` })
  return opts
})
const groupForm = ref({ group_id: '', policy: 'observe', alias: '' })
const groupSlang = ref<Record<string, any[]>>({})
const groupMembers = ref<Record<string, any[]>>({})
const groupAtmo = ref<Record<string, any>>({})
const slangForm = ref<Record<string, string>>({})
async function loadGroups() { try { const r = await query('group_list', {}); registry.value = r.groups || [] } catch { /* optional */ } }
async function addGroup() { if (!groupForm.value.group_id.trim()) return; await act('group_upsert', { ...groupForm.value }); groupForm.value = { group_id: '', policy: 'observe', alias: '' } }
async function removeGroup(id: string) { await act('group_delete', { group_id: id }); if (openGroup.value === id) openGroup.value = '' }
async function setPolicy(g: any, e: Event) { const policy = (e.target as HTMLSelectElement).value; await act('group_upsert', { group_id: g.group_id, policy, alias: g.alias || '', note: g.note || '' }) }
async function setMemberFlag(id: string, userId: string, e: Event) { const flag = (e.target as HTMLSelectElement).value; await act('group_member_flag', { group_id: id, user_id: userId, flag }); void loadGroupDetail(id) }
async function loadGroupDetail(id: string) {
  const [s, m, a] = await Promise.all([act('group_slang_list', { group_id: id }), act('group_members', { group_id: id }), query('group_atmosphere', { group_id: id }).catch(() => null)])
  groupSlang.value[id] = s?.slang || []; groupMembers.value[id] = m?.members || []; if (a) groupAtmo.value[id] = a
}
function toggleGroup(id: string) { openGroup.value = openGroup.value === id ? '' : id; if (openGroup.value) void loadGroupDetail(id) }
async function addSlang(id: string) { const topic = (slangForm.value[id] || '').trim(); if (!topic) return; await act('group_slang_update', { group_id: id, topic, score: 1 }); slangForm.value[id] = ''; void loadGroupDetail(id) }
async function removeSlang(id: string, topic: string) { await act('group_slang_delete', { group_id: id, topic }); void loadGroupDetail(id) }
async function wakeGroup() { const r = await act('group_wake_tick', {}); flash(r?.proposed != null ? `已生成 ${r.proposed} 条群聊插话候选` : '本次没有合适的群聊兴趣点') }

const skillForm = ref({ name: '', category: 'general', level: 1, keywords: '' })
const exprForm = ref({ text: '', scene: '' })
const exprStatus = ref<'pending' | 'approved' | 'rejected'>('pending')
const nodeForm = ref({ user_id: '', name: '', tags: '' })
const edgeForm = ref({ source_id: '', target_id: '', relation: '' })
const expressions = computed(() => (data.value.expressions || []).filter((e: any) => e.status === exprStatus.value))
const exprCounts = computed(() => { const all = data.value.expressions || []; return { pending: all.filter((e: any) => e.status === 'pending').length, approved: all.filter((e: any) => e.status === 'approved').length, rejected: all.filter((e: any) => e.status === 'rejected').length } })
async function addSkill() { if (!skillForm.value.name.trim()) return; await act('skill_add', { ...skillForm.value, level: Number(skillForm.value.level) }); skillForm.value = { name: '', category: 'general', level: 1, keywords: '' } }
async function growSkill(name: string) { const r = await act('skill_grow', { name }); flash(r?.updated ? `${name} 升到 Lv.${r.level}` : '技能未找到') }
async function removeSkill(id: string) { await act('skill_delete', { id }) }
async function addExpression() { if (!exprForm.value.text.trim()) return; await act('expression_add', { ...exprForm.value }); exprForm.value = { text: '', scene: '' } }
async function reviewExpression(id: string, accept: boolean) { await act('expression_review', { id, accept }) }
async function removeExpression(id: string) { await act('expression_delete', { id }) }
async function addNode() { if (!nodeForm.value.user_id.trim()) return; await act('social_node_upsert', { ...nodeForm.value }); nodeForm.value = { user_id: '', name: '', tags: '' } }
async function addEdge() { if (!edgeForm.value.source_id.trim() || !edgeForm.value.target_id.trim()) return; await act('social_edge_add', { ...edgeForm.value }); edgeForm.value = { source_id: '', target_id: '', relation: '' } }
async function removeEdge(id: string) { await act('social_edge_delete', { id }) }

const settingsForm = ref<Record<string, any>>({})
const modelRoutesText = ref('{}')
const diagnostics = ref<any>(null)
const importText = ref('')
const extensions = ref<Record<string, any>>({})
const extensionList = computed(() => Object.entries(extensions.value || {}).map(([name, meta]: any) => ({ name, ...meta })))
async function loadExtensions() { try { const r = await query('extension_status', {}); extensions.value = r?.extensions || {} } catch { /* optional */ } }
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
    owner_user_ids: pick('owner_user_ids', ''), secondary_user_ids: pick('secondary_user_ids', ''),
    other_stage_cap: pick('other_stage_cap', '熟悉'), secondary_stage_cap: pick('secondary_stage_cap', '友好'),
    enable_exclusive_bond: pick('enable_exclusive_bond', '1') === '1',
    affinity_decay_per_day: Number(pick('affinity_decay_per_day', '0.02')), affinity_decay_after_days: Number(pick('affinity_decay_after_days', '3')),
    reply_deceleration: pick('reply_deceleration', '1') === '1',
    env_timezone: pick('env_timezone', 'Asia/Shanghai'), env_city: pick('env_city', ''),
    env_latitude: pick('env_latitude', ''), env_longitude: pick('env_longitude', ''),
    enable_environment_fetch: pick('enable_environment_fetch', '0') === '1', weather_cache_minutes: Number(pick('weather_cache_minutes', '60')),
    enable_content_fetch: pick('enable_content_fetch', '0') === '1', news_feeds: pick('news_feeds', ''), content_items_per_feed: Number(pick('content_items_per_feed', '3')),
    tts_endpoint: pick('tts_endpoint', ''), locale: pick('locale', 'zh-CN'),
  }
  modelRoutesText.value = pick('model_routes', '{}') || '{}'
}
async function saveSettings() {
  const s = settingsForm.value
  const payload: Record<string, string> = {
    proactive_daily_limit: String(s.proactive_daily_limit), proactive_target_limit: String(s.proactive_target_limit),
    quiet_start: String(s.quiet_start), quiet_end: String(s.quiet_end), idle_minutes: String(s.idle_minutes),
    min_interval_minutes: String(s.min_interval_minutes), check_interval_seconds: String(s.check_interval_seconds),
    burst_max: String(s.burst_max), daily_token_limit: String(s.daily_token_limit),
    enable_proactive: s.enable_proactive ? '1' : '0', enable_group_observe: s.enable_group_observe ? '1' : '0', enable_dream: s.enable_dream ? '1' : '0',
    owner_user_ids: String(s.owner_user_ids), secondary_user_ids: String(s.secondary_user_ids),
    other_stage_cap: String(s.other_stage_cap), secondary_stage_cap: String(s.secondary_stage_cap), enable_exclusive_bond: s.enable_exclusive_bond ? '1' : '0',
    affinity_decay_per_day: String(s.affinity_decay_per_day), affinity_decay_after_days: String(s.affinity_decay_after_days), reply_deceleration: s.reply_deceleration ? '1' : '0',
    env_timezone: String(s.env_timezone), env_city: String(s.env_city), env_latitude: String(s.env_latitude), env_longitude: String(s.env_longitude),
    enable_environment_fetch: s.enable_environment_fetch ? '1' : '0', weather_cache_minutes: String(s.weather_cache_minutes),
    enable_content_fetch: s.enable_content_fetch ? '1' : '0', news_feeds: String(s.news_feeds), content_items_per_feed: String(s.content_items_per_feed),
    tts_endpoint: String(s.tts_endpoint), locale: String(s.locale),
  }
  const result = await act('settings_set', { settings: payload })
  if (result?.rejected?.length) flash(`已保存，忽略无效项：${result.rejected.join('、')}`); else flash('设置已保存')
}
async function saveModelRoutes() {
  let parsed: any; try { parsed = JSON.parse(modelRoutesText.value || '{}') } catch { error.value = '模型分流不是合法 JSON'; return }
  await act('model_routes_set', { routes: parsed }); await act('settings_set', { settings: { model_routes: JSON.stringify(parsed) } }); flash('模型分流已保存并生效')
}
async function exportConfig() {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'config_export', payload: {} }) })
  if (!r.ok) { error.value = await r.text(); return }
  const blob = new Blob([JSON.stringify(await r.json(), null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `life-companion-${localToday()}.json`; a.click(); URL.revokeObjectURL(url)
}
async function importConfig() {
  if (!importText.value.trim()) return
  let snapshot: any; try { snapshot = JSON.parse(importText.value) } catch { error.value = '导入内容不是合法 JSON'; return }
  const result = await act('config_import', { snapshot })
  if (result) { importText.value = ''; flash(`已导入：${Object.entries(result.applied || {}).map(([k, v]) => `${k} ${v}`).join(' · ')}`) }
}
async function exportAll() {
  const r = await fetch('/api/life/companion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'export_all', payload: {} }) })
  if (!r.ok) { error.value = friendlyError(await r.text()); return }
  const blob = new Blob([JSON.stringify(await r.json(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `life-full-${localToday()}.json`; a.click(); URL.revokeObjectURL(url)
}
async function importAll() {
  if (!importText.value.trim()) return
  let snapshot: any; try { snapshot = JSON.parse(importText.value) } catch { error.value = '导入内容不是合法 JSON'; return }
  const result = await act('import_all', { snapshot })
  if (result) { importText.value = ''; flash(`已全量导入：${Object.entries(result.applied || {}).map(([k, v]) => `${k} ${v}`).join(' · ')}`) }
}
async function runDiagnostics() { const result = await act('diagnostics', {}); if (result) diagnostics.value = result }

const auditKind = ref(''); const auditOutcome = ref(''); const auditItems = ref<any[]>([]); const auditTotal = ref(0)
async function loadAudit() { try { const r = await query('audit_query', { kind: auditKind.value, outcome: auditOutcome.value, limit: 120 }); auditItems.value = r?.items || []; auditTotal.value = r?.total || 0 } catch { /* optional */ } }

const worldKinds = ['persona', 'worldview', 'style', 'background', 'wardrobe', 'reference']
const worldKind = ref('')
const worldForm = ref({ id: '', kind: 'worldview', title: '', content: '', tags: '' })
const worldList = computed(() => (data.value.world || []).filter((w: any) => !worldKind.value || w.kind === worldKind.value))
function editWorld(w: any) { worldForm.value = { id: w.id, kind: w.kind, title: w.title, content: w.content, tags: w.tags || '' } }
async function saveWorld() { if (!worldForm.value.title.trim() || !worldForm.value.content.trim()) return; await act('world_upsert', { ...worldForm.value }); worldForm.value = { id: '', kind: 'worldview', title: '', content: '', tags: '' } }
async function removeWorld(id: string) { await act('world_delete', { id }) }

const timeline = computed(() => data.value.timeline || [])
const openTopics = computed(() => data.value.open_topics || [])
const portraits = computed(() => data.value.portraits || [])
const reviews = computed(() => data.value.reviews || [])
function parseFindings(review: any) { try { return JSON.parse(review.findings || '[]') } catch { return [] } }
const tlSearch = ref('')
const filteredTimeline = computed(() => {
  const q = tlSearch.value.trim().toLowerCase()
  return timeline.value.filter((item: any) => !q || `${item.topic} ${item.summary} ${item.detail || ''}`.toLowerCase().includes(q))
})
const groupSearch = ref('')
const filteredRegistry = computed(() => {
  const q = groupSearch.value.trim().toLowerCase()
  return registry.value.filter((g: any) => !q || `${g.group_id} ${g.alias || ''}`.toLowerCase().includes(q))
})
const emotion = computed(() => data.value.emotion || { valence: 0, arousal: 0.5, connection: 0.5, irritation: 0 })
const radarPoints = computed(() => {
  const e = emotion.value
  const values = [(Number(e.valence) + 1) / 2, Number(e.arousal), Number(e.connection), Number(e.irritation)]
  const cx = 60, cy = 60, radius = 46
  return values.map((value, index) => {
    const angle = (-90 + index * 90) * Math.PI / 180
    const length = radius * Math.max(0.05, Math.min(1, Number(value) || 0))
    return `${(cx + length * Math.cos(angle)).toFixed(1)},${(cy + length * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
})
const mediaForm = ref({ kind: 'tts', target: '', text: '', file: '' })
async function sendMedia() {
  const r = await act('send_media', { ...mediaForm.value })
  flash(r?.ok ? '已发送' : `发送失败：${r?.reason || '未知'}`)
}
async function backupNow() { const r = await act('backup_now', {}); flash(r?.backup ? '已备份陪伴数据' : `备份失败：${r?.error || '未知'}`) }
const todayStr = localToday()
const currentAgenda = computed(() => { const now = Date.now(); return todayAgenda.value.filter((x: any) => { if (!x.start_at) return false; const t = new Date(String(x.start_at).replace(' ', 'T')).getTime(); return !Number.isNaN(t) && t <= now }).slice(-1)[0] || null })
const nextAgenda = computed(() => { const now = Date.now(); return todayAgenda.value.find((x: any) => { if (!x.start_at) return false; const t = new Date(String(x.start_at).replace(' ', 'T')).getTime(); return !Number.isNaN(t) && t > now }) || null })
const upcomingDates = computed(() => (data.value.important_dates || []).map((d: any) => ({ ...d, inDays: daysUntil(d.date_text) })).filter((d: any) => d.inDays !== null).sort((a: any, b: any) => a.inDays - b.inDays).slice(0, 3))
const latestJournal = computed(() => (data.value.journal || [])[0] || null)
const latestDream = computed(() => (data.value.dreams || [])[0] || null)
function jump(target: string) { tab.value = target; const el = pageEl.value; if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(load)
</script>

<template>
  <main class="pcp" ref="pageEl">
    <header class="hero">
      <div class="hero-main">
        <div class="hero-copy">
          <p class="eyebrow"><b>●</b> L.I.F.E / COMPANION</p>
          <h1>陪伴面板</h1>
          <p class="sub">日程、关系、主动、群聊、成长与诊断集中在这里；功能卡片点击进入对应视图。</p>
        </div>
        <div class="hero-actions">
          <button class="fab" :disabled="planning" @click="planNow"><span class="fab-ic">✦</span>{{ planning ? '规划中…' : '让 LIFE 规划' }}</button>
          <button class="btn tonic" :disabled="loading" @click="load">{{ loading ? '刷新中…' : '刷新' }}</button>
          <button class="btn text" @click="jump('config')">配置引导</button>
        </div>
      </div>

      <div class="hero-stats">
        <button class="stat" @click="jump('users')"><span class="stat-ic t1">☺</span><span class="stat-num">{{ data.relationships?.length || 0 }}</span><span class="stat-cap">关系对象</span></button>
        <button class="stat" @click="jump('overview')"><span class="stat-ic t2">▤</span><span class="stat-num">{{ todayAgenda.filter((x: any) => x.status === 'active').length }}</span><span class="stat-cap">待进行日程</span></button>
        <button class="stat" @click="jump('proactive')"><span class="stat-ic t3">✦</span><span class="stat-num">{{ activeCandidates.length }}</span><span class="stat-cap">待投递主动</span></button>
        <button class="stat" @click="jump('groups')"><span class="stat-ic t4">☷</span><span class="stat-num">{{ groups.length }}</span><span class="stat-cap">观察群聊</span></button>
        <button class="stat" @click="jump('observe')"><span class="stat-ic t5">◎</span><span class="stat-num">{{ openTopics.length }}</span><span class="stat-cap">未完话题</span></button>
        <button class="stat" @click="jump('observe')"><span class="stat-ic t6">✎</span><span class="stat-num">{{ digests.length }}</span><span class="stat-cap">内容见闻</span></button>
      </div>

      <div class="state-row">
        <span class="pill">精力 {{ Math.round(data.circadian?.mental_energy ?? 0) }}</span>
        <span class="pill" :class="{ bad: (data.circadian?.hunger ?? 0) >= 75 }">饥饿 {{ Math.round(data.circadian?.hunger ?? 0) }}</span>
        <span class="pill" :class="{ bad: (data.circadian?.health ?? 100) < 60 }">健康 {{ Math.round(data.circadian?.health ?? 100) }}</span>
        <span class="pill" v-if="data.circadian?.is_sleeping">睡眠中</span>
        <span class="pill soft" v-if="data.settings?.env_timezone">{{ data.settings.env_timezone }}</span>
        <span class="pill soft" v-if="data.settings?.env_city">{{ data.settings.env_city }}</span>
        <button class="chip-btn" @click="eat">吃饭</button>
        <button class="chip-btn" @click="outfitToday">今日穿搭</button>
        <button class="chip-btn" @click="decayRelationships">关系回落</button>
      </div>
    </header>

    <p v-if="error" class="banner err">{{ error }}</p>
    <p v-if="notice" class="banner ok">{{ notice }}</p>

    <nav class="tabs" aria-label="视图">
      <button v-for="item in navItems" :key="item.key" class="tab" :class="{ active: tab === item.key }" @click="jump(item.key)">
        <i>{{ item.i }}</i><span class="tab-ic">{{ item.icon }}</span>{{ item.label }}
      </button>
    </nav>

    <!-- 01 总览 -->
    <section v-show="tab === 'overview'" class="panel">
      <div class="section-head"><div><h2>今日概览</h2><p class="desc">生活工作台：今天发生了什么、现在在做什么、接下来做什么。</p></div>
        <div class="head-actions"><button class="btn tonal sm" @click="arrangeAgenda">安排今天</button><button class="btn tonal sm" @click="generate('journal')">生成日记</button><button class="btn tonal sm" @click="generate('dream')">生成梦境</button></div>
      </div>
      <div class="desk">
        <div class="desk-col">
          <article class="dcard">
            <header><span class="dot ic"></span><h3>今日</h3><small>{{ todayStr }}</small></header>
            <div class="fact-grid">
              <div class="fact"><b>{{ data.relationships?.length || 0 }}</b><span>记住的人</span></div>
              <div class="fact"><b>{{ activeCandidates.length }}</b><span>待投递</span></div>
              <div class="fact"><b>{{ todayAgenda.length }}</b><span>今日日程</span></div>
              <div class="fact"><b>{{ openTopics.length }}</b><span>未完话题</span></div>
            </div>
            <div v-if="upcomingDates.length" class="mini-list">
              <span v-for="d in upcomingDates" :key="d.id" class="chip warn">{{ d.title }} · {{ d.inDays === 0 ? '今天' : d.inDays + '天后' }}</span>
            </div>
          </article>
          <article class="dcard">
            <header><span class="dot ic"></span><h3>当前</h3></header>
            <div v-if="currentAgenda" class="cur"><strong>{{ currentAgenda.title }}</strong><span class="chip ok">进行中</span></div>
            <p v-else class="empty">此刻没有进行中的日程。</p>
            <div v-if="nextAgenda" class="meta">接下来：{{ nextAgenda.start_at }} {{ nextAgenda.title }}</div>
          </article>
          <article class="dcard" v-if="data.calendar_candidates?.filter((x: any) => x.status === 'pending_confirmation').length">
            <header><span class="dot ic"></span><h3>待确认日程</h3><small>{{ data.calendar_candidates.filter((x: any) => x.status === 'pending_confirmation').length }}</small></header>
            <ul class="mini-list">
              <li v-for="c in data.calendar_candidates.filter((x: any) => x.status === 'pending_confirmation')" :key="c.id">
                <span>{{ c.title }}<em class="meta"> · {{ c.when_text }}</em></span>
                <span class="mini-actions"><button class="btn filled sm" @click="act('confirm_agenda', { id: c.id })">确认</button><button class="btn text sm" @click="act('reject_agenda', { id: c.id })">拒绝</button></span>
              </li>
            </ul>
          </article>
          <article class="dcard">
            <header><span class="dot ic"></span><h3>新增日程</h3><button class="link" @click="arrangeAgenda">让 LIFE 安排</button></header>
            <div class="form-row"><input v-model="agendaTitle" class="field" placeholder="日程标题" @keyup.enter="addAgenda" /></div>
            <div class="form-row"><input v-model="agendaWhen" class="field" placeholder="时间，如 2026-09-25 20:00" /></div>
            <textarea v-model="agendaDetail" class="field area" placeholder="说明（可选）"></textarea>
            <button class="btn filled sm" @click="addAgenda" :disabled="!agendaTitle.trim()">添加到日程</button>
            <p class="hint">直接加入日程，无需确认。</p>
          </article>
        </div>

        <div class="desk-col">
          <article class="dcard">
            <header><span class="dot ic"></span><h3>时间轴</h3><button class="link" @click="jump('observe')">完整日程</button></header>
            <ol class="tl">
              <li v-for="item in todayAgenda" :key="item.id" :class="agendaState(item).cls">
                <time>{{ (item.start_at || '').replace('T', ' ').slice(11, 16) || '--:--' }}</time>
                <div><strong :class="{ done: item.status === 'completed' }">{{ item.title }}</strong><span v-if="item.detail" class="meta">{{ item.detail }}</span></div>
                <span class="chip" :class="agendaState(item).cls">{{ agendaState(item).label }}</span>
              </li>
              <li v-if="!todayAgenda.length" class="empty">今天还没有安排。</li>
            </ol>
          </article>
          <article class="dcard">
            <header><span class="dot ic"></span><h3>最新日记</h3><button class="link" @click="jump('observe')">全部</button></header>
            <p v-if="latestJournal" class="prose">{{ latestJournal.content }}</p>
            <p v-else class="empty">今天还没有写下什么。</p>
            <div class="actions-row"><textarea v-model="journal" class="field area" placeholder="为今天写下一点…"></textarea><button class="btn filled sm" @click="addEntry('journal', journal)">写入日记</button></div>
            <div class="actions-row"><textarea v-model="dream" class="field area" placeholder="记录一个梦…"></textarea><button class="btn tonal sm" @click="addEntry('dream', dream)">写入梦境</button></div>
          </article>
        </div>

        <div class="desk-col">
          <article class="dcard">
            <header><span class="dot ic"></span><h3>动态与记忆</h3><button class="link" @click="jump('observe')">观察</button></header>
            <ol class="mini-tl">
              <li v-for="item in timeline.slice(0, 5)" :key="item.id"><span class="dot"></span><div><strong>{{ item.topic }}</strong><span class="meta">{{ item.summary }}</span></div></li>
              <li v-if="!timeline.length" class="empty">还没有记录。</li>
            </ol>
          </article>
          <article class="dcard">
            <header><span class="dot ic"></span><h3>运行能力</h3><button class="link" @click="jump('models')">模型</button></header>
            <div class="caps">
              <span v-for="ext in extensionList" :key="ext.name" class="cap" :class="{ off: !ext.available }"><b>{{ ext.name }}</b><small>{{ ext.available ? '可用' : '未就绪' }}</small></span>
              <span v-if="!extensionList.length" class="empty">没有注册的扩展。</span>
            </div>
          </article>
        </div>
      </div>

      <details class="fold" open>
        <summary><b>关系与主动策略</b><small>私聊、群聊与长线主动的当前概况</small></summary>
        <div class="grid3">
          <article class="card"><h3>私聊关系</h3>
            <ul class="mini-list">
              <li v-for="r in (data.relationships || []).slice(0, 5)" :key="r.user_id"><span>{{ r.user_id }}<em v-if="ownerIds.includes(r.user_id)" class="owner">owner</em></span><b>{{ r.stage }} · {{ Math.round((r.affinity || 0) * 100) }}%</b></li>
              <li v-if="!(data.relationships || []).length" class="empty">暂无</li>
            </ul>
          </article>
          <article class="card"><h3>群聊观察</h3>
            <ul class="mini-list">
              <li v-for="g in registry.slice(0, 5)" :key="g.group_id"><span>{{ g.alias || g.group_id }}</span><b>{{ g.policy }} · {{ g.observations }} 条</b></li>
              <li v-if="!registry.length" class="empty">暂无</li>
            </ul>
          </article>
          <article class="card"><h3>长线主动</h3>
            <div class="policy">
              <label><span>每日上限</span><input v-model.number="policy.daily_limit" type="number" min="0" class="field tiny" /></label>
              <label><span>单人上限</span><input v-model.number="policy.per_target_limit" type="number" min="0" class="field tiny" /></label>
              <label><span>免打扰起</span><input v-model.number="policy.quiet_start" type="number" min="0" max="23" class="field tiny" /></label>
              <label><span>免打扰止</span><input v-model.number="policy.quiet_end" type="number" min="0" max="23" class="field tiny" /></label>
              <button class="btn tonal sm" @click="savePolicy">保存策略</button>
            </div>
            <p class="hint">未回应会降速：连续 2 次暂停 24h、3 次暂停 3 天；回复即重置。</p>
          </article>
        </div>
      </details>

      <details class="fold">
        <summary><b>观察与内容记录</b><small>关系分布、群聊分布、内容见闻与活跃</small></summary>
        <div class="grid2">
          <article class="card"><h3>私聊关系分布</h3>
            <div class="bars"><div v-for="r in (data.relationships || []).slice(0, 8)" :key="r.user_id" class="bar-row"><span class="bar-label">{{ r.user_id }}</span><div class="bar"><i :style="{ width: relPct(r.affinity) }"></i></div><b>{{ Math.round((r.affinity || 0) * 100) }}%</b></div><p v-if="!(data.relationships || []).length" class="empty">暂无</p></div>
          </article>
          <article class="card"><h3>群聊观测分布</h3>
            <div class="bars"><div v-for="g in registry.slice(0, 8)" :key="g.group_id" class="bar-row"><span class="bar-label">{{ g.alias || g.group_id }}</span><div class="bar"><i :style="{ width: Math.min(100, g.observations) + '%' }"></i></div><b>{{ g.observations }}</b></div><p v-if="!registry.length" class="empty">暂无</p></div>
          </article>
          <article class="card"><h3>内容见闻 <button class="link" @click="gatherContent">抓取</button></h3>
            <ol class="feed"><li v-for="d in digests.slice(0, 6)" :key="d.id"><strong>{{ d.title }}</strong><span class="meta">{{ d.kind }} · {{ fmtTime(d.created_at) }}</span></li><li v-if="!digests.length" class="empty">暂无；在配置里填 news_feeds 并开启内容抓取。</li></ol>
          </article>
          <article class="card"><h3>最近活跃</h3>
            <ol class="feed"><li v-for="item in timeline.slice(0, 8)" :key="item.id"><strong>{{ item.topic }}</strong><span class="meta">{{ fmtTime(item.created_at) }} · {{ item.summary }}</span></li><li v-if="!timeline.length" class="empty">暂无</li></ol>
          </article>
        </div>
      </details>
    </section>

    <!-- 02 世界知识 -->
    <section v-show="tab === 'world'" class="panel">
      <div class="section-head"><div><h2>世界知识</h2><p class="desc">角色资料、世界观、衣橱与引用资料；作为日程、状态、日记与主动行为的背景，不覆盖主回复人格。</p></div>
        <div class="head-actions"><button class="btn tonal sm" @click="outfitToday">今日穿搭</button><button class="btn filled sm" @click="saveWorld" :disabled="!worldForm.title.trim() || !worldForm.content.trim()">{{ worldForm.id ? '保存' : '添加' }}</button></div>
      </div>
      <div class="world-layout">
        <aside class="world-nav">
          <button :class="{ active: worldKind === '' }" @click="worldKind = ''">全部 <b>{{ (data.world || []).length }}</b></button>
          <button v-for="k in worldKinds" :key="k" :class="{ active: worldKind === k }" @click="worldKind = k">{{ k }}</button>
        </aside>
        <div class="world-body">
          <article class="card">
            <h3>{{ worldForm.id ? '编辑条目' : '新增条目' }}</h3>
            <div class="form-row">
              <select v-model="worldForm.kind" class="field" style="max-width:150px"><option v-for="k in worldKinds" :key="k" :value="k">{{ k }}</option></select>
              <input v-model="worldForm.title" class="field" placeholder="标题，如 世界观 / 今日穿搭" />
            </div>
            <textarea v-model="worldForm.content" class="field area" placeholder="内容…"></textarea>
            <input v-model="worldForm.tags" class="field" placeholder="标签（可选）" />
            <div class="actions-row"><button class="btn filled sm" @click="saveWorld" :disabled="!worldForm.title.trim() || !worldForm.content.trim()">{{ worldForm.id ? '保存' : '添加' }}</button><button v-if="worldForm.id" class="btn text sm" @click="worldForm = { id: '', kind: 'worldview', title: '', content: '', tags: '' }">取消编辑</button></div>
          </article>
          <div class="cards">
            <article v-for="w in worldList" :key="w.id" class="card item-card">
              <div class="row"><strong>{{ w.title }}</strong><span class="chip muted">{{ w.kind }}</span></div>
              <p class="prose">{{ w.content }}</p>
              <span v-if="w.tags" class="meta">{{ w.tags }}</span>
              <div class="actions-row"><button class="btn tonal sm" @click="editWorld(w)">编辑</button><button class="btn danger sm" @click="removeWorld(w.id)">删除</button></div>
            </article>
            <p v-if="!worldList.length" class="empty">还没有条目。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 用户 -->
    <section v-show="tab === 'users'" class="panel">
      <div class="section-head"><div><h2>用户档案</h2><p class="desc">关系阶段、互动表达、未完话题与画像；先看身份，再进入详情。</p></div>
        <div class="head-actions"><input v-model="userSearch" class="field search" placeholder="搜索用户 ID" />
          <select v-model="userStage" class="field" style="max-width:150px"><option value="">全部阶段</option><option v-for="s in userStages" :key="s" :value="s">{{ s }}</option></select>
        </div>
      </div>
      <div class="user-layout">
        <aside class="roster">
          <div class="roster-head"><span class="eyebrow">PEOPLE</span><span class="count-pill">{{ filteredUsers.length }}</span></div>
          <button v-for="rel in filteredUsers" :key="rel.user_id" class="roster-row" :class="{ active: selectedUser === rel.user_id }" @click="openUser(rel.user_id)">
            <span class="avatar">{{ (rel.user_id || '?').slice(0, 1).toUpperCase() }}</span>
            <span class="rmain"><span class="rtop">{{ rel.user_id }}<em v-if="ownerIds.includes(rel.user_id)" class="owner">owner</em></span><span class="bar"><i :style="{ width: relPct(rel.affinity) }"></i></span><span class="meta">{{ rel.stage }} · {{ Math.round((rel.affinity || 0) * 100) }}%</span></span>
          </button>
          <p v-if="!filteredUsers.length" class="empty">没有匹配的用户。</p>
        </aside>
        <div class="user-detail">
          <button v-if="selectedUser" class="btn text sm" @click="closeUser">← 返回目录</button>
          <div v-if="detailLoading" class="empty">加载中…</div>
          <template v-else-if="detail">
            <div class="detail-head"><span class="avatar lg">{{ (detail.user_id || '?').slice(0, 1).toUpperCase() }}</span><div><strong>{{ detail.user_id }}</strong><span class="meta">角色 {{ detail.role || 'other' }} · 阶段 {{ detail.relationship?.stage }} · 互动 {{ detail.expression?.interaction }} · 好感 {{ Math.round((detail.relationship?.affinity || 0) * 100) }}%</span></div></div>
            <nav class="subtabs"><button v-for="t in detailTabs" :key="t.key" :class="{ active: detailTab === t.key }" @click="detailTab = t.key">{{ t.label }}</button></nav>
            <div v-if="detailTab === 'overview'">
              <div class="kv-grid">
                <div class="kv"><span>关系事件</span><b>{{ detail.counts?.ledger || 0 }}</b></div>
                <div class="kv"><span>主动候选</span><b>{{ detail.counts?.candidates || 0 }}</b></div>
                <div class="kv"><span>已投递</span><b>{{ detail.counts?.delivered || 0 }}</b></div>
                <div class="kv"><span>记忆条数</span><b>{{ detail.memories?.total || 0 }}</b></div>
                <div class="kv"><span>主动额度</span><b>{{ detail.expression?.proactive_limit ?? '—' }}</b></div>
              </div>
              <div v-if="detailPortrait?.summary" class="note"><b>画像：</b>{{ detailPortrait.summary }}<template v-if="detailPortrait.traits"> · {{ detailPortrait.traits }}</template></div>
              <div v-if="detail.expression?.tone" class="note"><b>表达基调：</b>{{ detail.expression.tone }}</div>
              <h4 class="sub-label">未完话题</h4>
              <div class="chips"><span v-for="t in detailTopics" :key="t" class="chip">{{ t }}<button @click="resolveTopic(t)">×</button></span><span v-if="!detailTopics.length" class="meta">暂无</span></div>
              <div class="form-row"><input v-model="topicForm" class="field" placeholder="手动加一条待跟进话题…" @keyup.enter="addTopic" /><button class="btn tonal sm" @click="addTopic" :disabled="!topicForm.trim()">加入</button></div>
            </div>
            <div v-else-if="detailTab === 'relationship'">
              <div class="bar big"><i :style="{ width: relPct(detail.relationship?.affinity) }"></i></div>
              <p class="meta">阶段 {{ detail.expression?.stage }} · 互动 {{ detail.expression?.interaction }} · 额度 {{ detail.expression?.proactive_limit }} · 专属联结 {{ detail.expression?.bond ? '是' : '否' }}</p>
              <div class="actions-row"><button class="btn tonal sm" @click="adjustRelationship(detail.user_id, 0.05)">更亲近 +</button><button class="btn tonal sm" @click="adjustRelationship(detail.user_id, -0.05)">更疏远 −</button></div>
              <h4 class="sub-label">事件账本</h4>
              <ol class="feed"><li v-for="e in detail.ledger" :key="e.id"><span :class="e.delta >= 0 ? 'pos' : 'neg'">{{ e.delta >= 0 ? '+' : '' }}{{ e.delta }}</span> {{ e.event_key }} · {{ e.reason }} · {{ fmtTime(e.created_at) }}</li><li v-if="!(detail.ledger || []).length" class="empty">暂无</li></ol>
            </div>
            <div v-else-if="detailTab === 'proactive'">
              <ol class="feed"><li v-for="c in (detail.proactive?.candidates || [])" :key="c.id"><strong>{{ c.motive }}</strong> · {{ c.status }}<span class="meta">{{ c.content }}</span><button v-if="!['delivered','cancelled'].includes(c.status)" class="btn danger sm" @click="cancelProactive(c.id)">取消</button></li><li v-if="!(detail.proactive?.candidates || []).length" class="empty">暂无</li></ol>
            </div>
            <div v-else-if="detailTab === 'memory'">
              <ol class="feed"><li v-for="m in (detail.memories?.items || [])" :key="m.id">{{ m.content }}<span class="meta">scope {{ m.scope }} · 重要度 {{ Math.round((m.importance || 0) * 100) }}%</span><button class="btn danger sm" @click="deleteMemory(m.id)">删除</button></li><li v-if="!(detail.memories?.items || []).length" class="empty">没有相关记忆</li></ol>
            </div>
            <div v-else>
              <ol class="feed"><li v-for="item in (detail.audit || [])" :key="item.id"><strong>{{ item.kind }}</strong> · {{ item.outcome }}<span class="meta">{{ item.target }} · {{ fmtTime(item.created_at) }}</span></li><li v-if="!(detail.audit || []).length" class="empty">暂无</li></ol>
            </div>
          </template>
          <p v-else class="empty">从左侧选择一个用户查看详情。</p>
        </div>
      </div>
    </section>

    <!-- 04 群聊 -->
    <section v-show="tab === 'groups'" class="panel">
      <div class="section-head"><div><h2>群聊观察</h2><p class="desc">群气氛、话题线、黑话与成员安全。</p></div>
        <div class="head-actions"><input v-model="groupSearch" class="field search" placeholder="搜索群号 / 备注" /><button class="btn tonal sm" @click="wakeGroup">兴趣唤醒一次</button></div>
      </div>
      <article class="card">
        <div class="group-form"><input v-model="groupForm.group_id" class="field" placeholder="群号" /><select v-model="groupForm.policy" class="field" style="max-width:130px"><option value="observe">观察</option><option value="whitelist">白名单</option><option value="blacklist">黑名单</option></select><input v-model="groupForm.alias" class="field" placeholder="备注名（可选）" /><button class="btn filled sm" @click="addGroup" :disabled="!groupForm.group_id.trim()">添加群</button></div>
        <div class="cards">
          <article v-for="g in filteredRegistry" :key="g.group_id" class="card sub">
            <div class="row"><strong>{{ g.group_id }}</strong><span v-if="g.alias" class="chip muted">{{ g.alias }}</span><span class="chip" :class="g.policy === 'blacklist' ? 'danger' : g.policy === 'whitelist' ? 'ok' : 'muted'">{{ g.policy }}</span></div>
            <span class="meta">{{ g.observations }} 条观察 · {{ g.topics }} 个话题<template v-if="groupAtmo[g.group_id]"> · 气氛 {{ groupAtmo[g.group_id].label }}</template></span>
            <div v-if="openGroup === g.group_id" class="group-detail">
              <h4 class="sub-label">话题线</h4>
              <div class="chips"><span v-for="t in (groupAtmo[g.group_id]?.threads || [])" :key="t.topic" class="chip muted">{{ t.topic }} · {{ Math.round(t.score) }}</span><span v-if="!(groupAtmo[g.group_id]?.threads || []).length" class="meta">暂无</span></div>
              <h4 class="sub-label">黑话 / 话题</h4>
              <div class="chips"><span v-for="s in (groupSlang[g.group_id] || [])" :key="s.topic" class="chip muted">{{ s.topic }} · {{ Math.round(s.score) }}<button @click="removeSlang(g.group_id, s.topic)">×</button></span></div>
              <div class="form-row"><input v-model="slangForm[g.group_id]" class="field" placeholder="新增黑话 / 话题" /><button class="btn tonal sm" @click="addSlang(g.group_id)">添加</button></div>
              <h4 class="sub-label">成员安全</h4>
              <div class="members"><div v-for="m in (groupMembers[g.group_id] || [])" :key="m.user_id" class="member"><span>{{ m.user_id }}</span><span class="meta">{{ m.messages }} 条</span><select :value="m.flag" @change="setMemberFlag(g.group_id, m.user_id, $event)" class="field tiny"><option value="watch">关注</option><option value="allow">放行</option><option value="mute">禁言</option></select></div></div>
            </div>
            <div class="actions-row"><select :value="g.policy" @change="setPolicy(g, $event)" class="field tiny" style="max-width:120px"><option value="observe">观察</option><option value="whitelist">白名单</option><option value="blacklist">黑名单</option></select><button class="btn tonal sm" @click="toggleGroup(g.group_id)">{{ openGroup === g.group_id ? '收起' : '管理' }}</button><button class="btn danger sm" @click="removeGroup(g.group_id)">删除</button></div>
          </article>
          <p v-if="!filteredRegistry.length" class="empty">还没有群记录。</p>
        </div>
      </article>
    </section>

    <!-- 05 学习 -->
    <section v-show="tab === 'learning'" class="panel">
      <div class="section-head"><div><h2>学习</h2><p class="desc">技能成长、表达学习与社交关系网。</p></div></div>
      <div class="grid3">
        <article class="card">
          <h3>技能学习 <span class="count-pill">{{ (data.skills || []).length }}</span></h3>
          <div class="form-row"><input v-model="skillForm.name" class="field" placeholder="技能，如 弹钢琴" /><input v-model.number="skillForm.level" type="number" min="1" max="10" class="field tiny" /></div>
          <input v-model="skillForm.keywords" class="field" placeholder="关键词（逗号分隔，可选）" />
          <button class="btn filled sm" @click="addSkill" :disabled="!skillForm.name.trim()">添加技能</button>
          <ol class="feed"><li v-for="s in data.skills" :key="s.id"><strong>{{ s.name }}</strong> <span class="chip muted">Lv.{{ s.level }}</span> {{ s.category }}<div class="actions-row"><button class="btn tonal sm" @click="growSkill(s.name)">练习 +1</button><button class="btn danger sm" @click="removeSkill(s.id)">删除</button></div></li><li v-if="!(data.skills || []).length" class="empty">还没有技能</li></ol>
        </article>
        <article class="card">
          <h3>表达学习</h3>
          <div class="subtabs"><button :class="{ active: exprStatus === 'pending' }" @click="exprStatus = 'pending'">待审 {{ exprCounts.pending }}</button><button :class="{ active: exprStatus === 'approved' }" @click="exprStatus = 'approved'">已用 {{ exprCounts.approved }}</button><button :class="{ active: exprStatus === 'rejected' }" @click="exprStatus = 'rejected'">已拒 {{ exprCounts.rejected }}</button></div>
          <div class="form-row"><input v-model="exprForm.text" class="field" placeholder="表达，如 晚安呀" /><input v-model="exprForm.scene" class="field" style="max-width:120px" placeholder="场景" /><button class="btn filled sm" @click="addExpression" :disabled="!exprForm.text.trim()">入库</button></div>
          <ol class="feed"><li v-for="e in expressions" :key="e.id"><strong>{{ e.text }}</strong> <span class="meta">{{ e.scene || '通用' }} · {{ e.source }}</span><div class="actions-row"><button v-if="e.status === 'pending'" class="btn tonal sm" @click="reviewExpression(e.id, true)">采用</button><button v-if="e.status === 'pending'" class="btn text sm" @click="reviewExpression(e.id, false)">拒绝</button><button class="btn danger sm" @click="removeExpression(e.id)">删除</button></div></li><li v-if="!expressions.length" class="empty">该分类下没有表达</li></ol>
        </article>
        <article class="card">
          <h3>社交关系网 <span class="count-pill">{{ (data.social_nodes || []).length }} / {{ (data.social_edges || []).length }}</span></h3>
          <div class="form-row"><input v-model="nodeForm.user_id" class="field" placeholder="用户 ID" /><input v-model="nodeForm.name" class="field" placeholder="称呼（可选）" /><button class="btn filled sm" @click="addNode" :disabled="!nodeForm.user_id.trim()">加入</button></div>
          <ol class="feed"><li v-for="n in data.social_nodes" :key="n.user_id"><strong>{{ n.name || n.user_id }}</strong> <span class="meta">{{ n.user_id }}</span></li><li v-if="!(data.social_nodes || []).length" class="empty">关系网还是空的</li></ol>
          <h4 class="sub-label">关系连线</h4>
          <div class="form-row"><input v-model="edgeForm.source_id" class="field" placeholder="A" /><input v-model="edgeForm.target_id" class="field" placeholder="B" /><input v-model="edgeForm.relation" class="field" placeholder="关系" /><button class="btn tonal sm" @click="addEdge">连线</button></div>
          <ol class="feed"><li v-for="e in data.social_edges" :key="e.id">{{ e.source_id }} → {{ e.target_id }} · {{ e.relation }} <button class="btn danger sm" @click="removeEdge(e.id)">×</button></li><li v-if="!(data.social_edges || []).length" class="empty">还没有连线</li></ol>
        </article>
      </div>
    </section>

    <!-- 06 观察 -->
    <section v-show="tab === 'observe'" class="panel">
      <div class="section-head"><div><h2>观察</h2><p class="desc">日程日历、目标、性格演化、未完话题、画像与自我时间线。</p></div>
        <div class="head-actions"><button class="btn tonal sm" @click="shiftMonth(-1)">←</button><strong>{{ month }}</strong><button class="btn tonal sm" @click="shiftMonth(1)">→</button></div>
      </div>
      <div class="grid2">
        <article class="card cal-card">
          <div class="cal-week"><span v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</span></div>
          <div class="cal-grid"><div v-for="cell in calendarCells" :key="cell.key" class="cal-cell" :class="{ empty: cell.empty, today: cell.today, has: cell.events?.length }"><span v-if="!cell.empty" class="cal-day">{{ cell.day }}</span><span v-for="e in (cell.events || []).slice(0, 2)" :key="e.id" class="cal-chip">{{ e.title }}</span><span v-if="(cell.events || []).length > 2" class="cal-more">+{{ cell.events.length - 2 }}</span></div></div>
          <p v-if="calendar.conflicts?.length" class="warnline">⚠ {{ calendar.conflicts.length }} 处时间冲突：{{ calendar.conflicts.map((c: any) => c.titles.join(' / ')).join('；') }}</p>
          <h4 class="sub-label">本月待确认候选 ({{ calendar.candidates?.length || 0 }})</h4>
          <ol class="feed">
            <li v-for="c in (calendar.candidates || []).slice(0, 8)" :key="c.id">{{ c.title }} · {{ c.when_text }}
              <div class="actions-row"><button class="btn filled sm" @click="act('confirm_agenda', { id: c.id }).then(loadCalendar)">确认</button><button class="btn text sm" @click="act('reject_agenda', { id: c.id }).then(loadCalendar)">拒绝</button></div>
            </li>
            <li v-if="!(calendar.candidates || []).length" class="empty">没有待确认候选</li>
          </ol>
        </article>
        <article class="card"><h3>近 14 天活跃</h3>
          <div class="spark">
            <div v-for="d in activity" :key="d.day" class="spark-col" :title="`${d.day} · ${d.count}`"><i :style="{ height: Math.max(4, Math.round((d.count / activityMax) * 100)) + '%' }"></i><span>{{ d.day }}</span></div>
          </div>
          <p class="hint">来自 Bot 自我时间线（日记/梦境/任务/主动/见闻）。</p>
        </article>
        <article class="card">
          <h3>个人目标 <span class="count-pill">{{ (data.goals || []).length }}</span></h3>
          <div class="form-row"><input v-model="goalForm.title" class="field" placeholder="目标，如 学会一首钢琴曲" /><button class="btn filled sm" @click="addGoal" :disabled="!goalForm.title.trim()">添加</button></div>
          <ol class="feed"><li v-for="g in data.goals" :key="g.id"><strong :class="{ done: g.status === 'done' }">{{ g.title }}</strong><span class="bar"><i :style="{ width: relPct(g.progress) }"></i></span><div class="form-row"><input v-model="goalLogForm[g.id]" class="field" placeholder="记录一次进展…" /><button class="btn tonal sm" @click="addGoalLog(g.id)">记一笔</button><button class="btn text sm" @click="loadGoalLogs(g.id)">日志</button></div><ol v-if="goalLogs[g.id]?.length" class="feed"><li v-for="log in goalLogs[g.id]" :key="log.id" class="meta">{{ log.evidence }} · {{ fmtTime(log.created_at) }}</li></ol></li><li v-if="!(data.goals || []).length" class="empty">还没有目标</li></ol>
        </article>
        <article class="card"><h3>成长中的性格</h3><ol class="feed"><li v-for="t in data.persona_evolution" :key="t.id"><strong>{{ t.trait }}</strong> <span class="chip">{{ t.value }}</span><span class="meta">支持 {{ t.support_count }} · 置信 {{ Math.round((t.confidence || 0) * 100) }}%</span></li><li v-if="!data.persona_evolution?.length" class="empty">LIFE 还在观察。</li></ol></article>
        <article class="card"><h3>未完话题 <span class="count-pill">{{ openTopics.length }}</span></h3><ol class="feed"><li v-for="t in openTopics" :key="t.id"><strong>{{ t.topic }}</strong><span class="meta">{{ t.user_id }} · {{ fmtTime(t.updated_at) }}</span><button class="btn tonal sm" @click="openUser(t.user_id); jump('users')">查看用户</button></li><li v-if="!openTopics.length" class="empty">没有待跟进的话题。</li></ol></article>
        <article class="card"><h3>轻量画像 <span class="count-pill">{{ portraits.length }}</span></h3><ol class="feed"><li v-for="p in portraits" :key="p.user_id"><strong>{{ p.user_id }}</strong><span class="meta">{{ p.summary }}<template v-if="p.traits"> · {{ p.traits }}</template></span></li><li v-if="!portraits.length" class="empty">还没有稳定画像。</li></ol></article>
        <article class="card cal-card"><h3>Bot 自我时间线 <span class="count-pill">{{ filteredTimeline.length }}/{{ timeline.length }}</span><input v-model="tlSearch" class="field search" style="margin-left:auto" placeholder="搜索时间线" /></h3><ol class="tl"><li v-for="item in filteredTimeline" :key="item.id"><time>{{ fmtTime(item.created_at).slice(5, 16) }}</time><div><strong>{{ item.topic }}</strong><span class="meta">{{ item.summary }}</span></div></li><li v-if="!filteredTimeline.length" class="empty">没有匹配的记录。</li></ol></article>
        <article class="card"><h3>情绪雷达</h3>
          <div class="radar-wrap">
            <svg viewBox="0 0 120 120" class="radar" aria-label="情绪雷达">
              <polygon points="60,14 106,60 60,106 14,60" class="radar-grid" />
              <polygon points="60,37 83,60 60,83 37,60" class="radar-grid" />
              <polygon :points="radarPoints" class="radar-fill" />
              <text x="60" y="10" class="radar-lbl" text-anchor="middle">心情</text>
              <text x="112" y="63" class="radar-lbl" text-anchor="end">激活</text>
              <text x="60" y="119" class="radar-lbl" text-anchor="middle">连接</text>
              <text x="8" y="63" class="radar-lbl">烦扰</text>
            </svg>
            <p class="hint">心情 {{ Math.round(((emotion.valence + 1) / 2) * 100) }}% · 激活 {{ Math.round(emotion.arousal * 100) }}% · 连接 {{ Math.round(emotion.connection * 100) }}% · 烦扰 {{ Math.round(emotion.irritation * 100) }}%</p>
          </div>
        </article>
        <article class="card cal-card"><h3>每日复盘 <span class="count-pill">{{ reviews.length }}</span><button class="btn tonal sm" style="margin-left:auto" @click="act('daily_review', {})">立即复盘</button></h3>
          <ol class="feed">
            <li v-for="r in reviews" :key="r.date"><strong>{{ r.date }}</strong><span class="meta">{{ r.summary }}</span>
              <ul v-if="parseFindings(r).length" class="findings">
                <li v-for="(f, i) in parseFindings(r)" :key="i"><span class="chip" :class="f.level === 'warn' ? 'warn' : 'muted'">{{ f.title }}</span><span class="meta">{{ f.detail }}</span></li>
              </ul>
            </li>
            <li v-if="!reviews.length" class="empty">还没有复盘记录；每天会自动生成一次。</li>
          </ol>
        </article>
      </div>
    </section>

    <!-- 07 主动 -->
    <section v-show="tab === 'proactive'" class="panel">
      <div class="section-head"><div><h2>主动行为</h2><p class="desc">候选、投递时机、配额与未回应降速。</p></div>
        <div class="head-actions"><button class="btn tonal sm" @click="suggestProactive">让 LIFE 建议一条</button><button class="btn tonal sm" :disabled="ticking" @click="tickNow">{{ ticking ? '检查中…' : '立即检查投递' }}</button></div>
      </div>
      <div class="grid2">
        <article class="card">
          <h3>候选队列 <span class="count-pill">{{ activeCandidates.length }}</span></h3>
          <div class="form-row">
            <select v-model="targetChoice" class="field">
              <option value="">选择发送到哪个对话 / 对象…</option>
              <option v-for="o in targetOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              <option value="__manual__">手动输入…</option>
            </select>
            <input v-if="targetChoice === '__manual__'" v-model="targetManual" class="field" placeholder="session:<会话ID> / user:<QQ> / group:<群号>" />
          </div>
          <div class="form-row"><input v-model="proactiveForm.motive" class="field" placeholder="动机，如 care" /><input v-model="proactiveForm.preferred_at" class="field" placeholder="期望时间（ISO，可选）" /></div>
          <textarea v-model="proactiveForm.content" class="field area" placeholder="想说的内容…"></textarea>
          <button class="btn filled sm" @click="createProactive" :disabled="!proactiveForm.target.trim() || !proactiveForm.content.trim()">创建候选</button>
          <ol class="feed"><li v-for="c in activeCandidates" :key="c.id"><strong>{{ c.target }} · {{ c.motive }}</strong><span class="meta">{{ c.content }}</span><span class="meta">窗口 {{ fmtTime(c.preferred_at) }}<template v-if="c.best_until"> → {{ fmtTime(c.best_until) }}</template></span><button class="btn danger sm" @click="cancelProactive(c.id)">取消</button></li><li v-if="!activeCandidates.length" class="empty">没有待投递候选</li></ol>
        </article>
        <article class="card">
          <h3>投递记录</h3>
          <ol class="feed"><li v-for="r in receipts" :key="r.id">{{ r.phase }} · {{ r.content }}<span class="meta">{{ fmtTime(r.created_at) }}</span></li><li v-if="!receipts.length" class="empty">还没有投递记录</li></ol>
        </article>
      </div>
    </section>

    <!-- 08 Token -->
    <section v-show="tab === 'tokens'" class="panel">
      <div class="section-head"><div><h2>Token 用量</h2><p class="desc">模型调用与 token 统计。</p></div><div class="head-actions"><button class="btn tonal sm" @click="loadUsage">刷新</button></div></div>
      <div class="stat-cards">
        <article class="stat-card"><b>{{ (usage?.total_tokens || 0).toLocaleString() }}</b><span>总 Token</span></article>
        <article class="stat-card"><b>{{ (usage?.total_prompt_tokens || 0).toLocaleString() }}</b><span>输入</span></article>
        <article class="stat-card"><b>{{ (usage?.total_completion_tokens || 0).toLocaleString() }}</b><span>输出</span></article>
        <article class="stat-card"><b>{{ usage?.request_count || 0 }}</b><span>请求次数</span></article>
      </div>
      <article class="card"><h3>按模型</h3><ol class="feed"><li v-for="(value, name) in (usage?.by_model || {})" :key="name"><strong>{{ name }}</strong> <span class="meta">{{ (value.total || 0).toLocaleString() }} tokens · {{ value.count }} 次</span></li><li v-if="!usage || !Object.keys(usage.by_model || {}).length" class="empty">暂无用量记录</li></ol></article>
    </section>

    <!-- 09 排障 -->
    <section v-show="tab === 'troubleshooting'" class="panel">
      <div class="section-head"><div><h2>排障与审计</h2><p class="desc">运行检查、主动行为审计与记忆维护。</p></div>
        <div class="head-actions"><button class="btn tonal sm" @click="runDiagnostics">运行诊断</button><button class="btn tonal sm" @click="act('memory_maintenance', {})">记忆维护</button><button class="btn tonal sm" @click="backupNow">备份数据</button></div>
      </div>
      <div class="grid2">
        <article class="card">
          <h3>运行检查</h3>
          <ol class="feed"><li v-for="c in (diagnostics?.checks || [])" :key="c.name"><strong>{{ c.name }}</strong><span class="meta">{{ c.detail }}</span><span class="chip" :class="c.status === 'ok' ? 'ok' : c.status === 'warn' ? 'warn' : 'muted'">{{ c.status }}</span></li><li v-if="!diagnostics" class="empty">点击运行诊断</li></ol>
          <div v-if="diagnostics" class="kv-grid"><div v-for="(v, k) in diagnostics.counts" :key="k" class="kv"><span>{{ k }}</span><b>{{ v }}</b></div></div>
        </article>
        <article class="card">
          <h3>主动行为审计 <span class="count-pill">{{ auditTotal }}</span></h3>
          <div class="form-row"><input v-model="auditKind" class="field" placeholder="类型筛选" /><input v-model="auditOutcome" class="field" placeholder="结果" /><button class="btn tonal sm" @click="loadAudit">查询</button></div>
          <ol class="tl"><li v-for="item in auditItems" :key="item.id"><time>{{ fmtTime(item.created_at).slice(5, 16) }}</time><div><strong>{{ item.kind }}</strong> <span class="chip" :class="item.outcome === 'ok' ? 'ok' : 'warn'">{{ item.outcome }}</span><span class="meta">{{ item.target }}</span><p v-if="item.detail" class="tl-detail">{{ item.detail }}</p></div></li><li v-if="!auditItems.length" class="empty">暂无审计记录</li></ol>
        </article>
      </div>
    </section>

    <!-- 10 配置 -->
    <section v-show="tab === 'config'" class="panel">
      <div class="section-head"><div><h2>配置</h2><p class="desc">运行设置、用户边界、环境与内容、导入导出。</p></div><div class="head-actions"><button class="btn filled sm" @click="saveSettings">保存</button></div></div>
      <div class="grid2">
        <article class="card">
          <h3>主动行为</h3>
          <div class="settings-grid">
            <label><span>每日主动上限</span><input v-model.number="settingsForm.proactive_daily_limit" type="number" min="0" class="field tiny" /></label>
            <label><span>单人上限</span><input v-model.number="settingsForm.proactive_target_limit" type="number" min="0" class="field tiny" /></label>
            <label><span>免打扰起</span><input v-model.number="settingsForm.quiet_start" type="number" min="0" max="23" class="field tiny" /></label>
            <label><span>免打扰止</span><input v-model.number="settingsForm.quiet_end" type="number" min="0" max="23" class="field tiny" /></label>
            <label><span>空闲分钟</span><input v-model.number="settingsForm.idle_minutes" type="number" class="field tiny" /></label>
            <label><span>最小间隔(分)</span><input v-model.number="settingsForm.min_interval_minutes" type="number" class="field tiny" /></label>
            <label><span>检查间隔(秒)</span><input v-model.number="settingsForm.check_interval_seconds" type="number" class="field tiny" /></label>
            <label><span>连发上限</span><input v-model.number="settingsForm.burst_max" type="number" class="field tiny" /></label>
            <label><span>每日 Token</span><input v-model.number="settingsForm.daily_token_limit" type="number" class="field tiny" /></label>
          </div>
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.enable_proactive" /><span>启用主动消息</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.enable_group_observe" /><span>群聊观察</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.enable_dream" /><span>梦境生成</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.reply_deceleration" /><span>未回应降速</span></label>
          </div>
          <h4 class="sub-label">用户边界</h4>
          <div class="settings-grid">
            <label class="wide"><span>主要用户 ID（逗号分隔）</span><input v-model="settingsForm.owner_user_ids" class="field" /></label>
            <label class="wide"><span>次要用户 ID（逗号分隔）</span><input v-model="settingsForm.secondary_user_ids" class="field" /></label>
            <label><span>普通用户阶段上限</span><select v-model="settingsForm.other_stage_cap" class="field"><option v-for="s in ['警惕','疏离','陌生','认识','熟悉','友好','亲近','亲密']" :key="s" :value="s">{{ s }}</option></select></label>
            <label><span>次要用户阶段上限</span><select v-model="settingsForm.secondary_stage_cap" class="field"><option v-for="s in ['警惕','疏离','陌生','认识','熟悉','友好','亲近','亲密']" :key="s" :value="s">{{ s }}</option></select></label>
            <label><span>好感回落/天</span><input v-model.number="settingsForm.affinity_decay_per_day" type="number" step="0.01" min="0" max="1" class="field tiny" /></label>
            <label><span>未互动多久才回落(天)</span><input v-model.number="settingsForm.affinity_decay_after_days" type="number" min="0" class="field tiny" /></label>
          </div>
          <label class="sw"><input type="checkbox" v-model="settingsForm.enable_exclusive_bond" /><span>允许主要用户的专属联结</span></label>
        </article>
        <article class="card">
          <h3>环境与内容</h3>
          <div class="settings-grid">
            <label><span>时区</span><input v-model="settingsForm.env_timezone" class="field" /></label>
            <label><span>城市</span><input v-model="settingsForm.env_city" class="field" /></label>
            <label><span>纬度</span><input v-model="settingsForm.env_latitude" class="field tiny" /></label>
            <label><span>经度</span><input v-model="settingsForm.env_longitude" class="field tiny" /></label>
            <label><span>天气缓存(分)</span><input v-model.number="settingsForm.weather_cache_minutes" type="number" min="5" class="field tiny" /></label>
            <label><span>每条源条数</span><input v-model.number="settingsForm.content_items_per_feed" type="number" min="1" class="field tiny" /></label>
            <label><span>语言</span><select v-model="settingsForm.locale" class="field"><option value="zh-CN">简体中文</option><option value="en-US">English</option></select></label>
          </div>
          <input v-model="settingsForm.news_feeds" class="field" placeholder="news_feeds：ai:https://… , bilibili:https://… , https://…" />
          <input v-model="settingsForm.tts_endpoint" class="field" placeholder="tts_endpoint（可选）" />
          <div class="switches">
            <label class="sw"><input type="checkbox" v-model="settingsForm.enable_environment_fetch" /><span>允许联网取天气</span></label>
            <label class="sw"><input type="checkbox" v-model="settingsForm.enable_content_fetch" /><span>允许联网取内容</span></label>
          </div>
          <h4 class="sub-label">数据导入导出</h4>
          <div class="actions-row"><button class="btn tonal sm" @click="exportConfig">导出配置</button><button class="btn tonal sm" @click="exportAll">导出全部（含关系/日记/时间线）</button></div>
          <textarea v-model="importText" class="field area" placeholder="粘贴导出 JSON 后点导入…"></textarea>
          <div class="actions-row"><button class="btn filled sm" @click="importConfig" :disabled="!importText.trim()">导入配置</button><button class="btn filled sm" @click="importAll" :disabled="!importText.trim()">全量导入</button></div>
        </article>
      </div>
    </section>

    <!-- 11 模型 -->
    <section v-show="tab === 'models'" class="panel">
      <div class="section-head"><div><h2>模型与扩展</h2><p class="desc">逐任务模型分流，以及可选扩展的可用状态（fail-closed）。</p></div><div class="head-actions"><button class="btn filled sm" @click="saveModelRoutes">保存分流</button><button class="btn tonal sm" @click="loadExtensions">刷新扩展</button></div></div>
      <div class="grid2">
        <article class="card">
          <h3>逐任务模型分流</h3>
          <p class="hint">JSON：任务 → 模型。可用任务：think / output / reflect / journal / dream / agenda / plan / compact。</p>
          <textarea v-model="modelRoutesText" class="field area" placeholder='{"think":"deepseek-v4-pro","output":"deepseek-flash"}'></textarea>
          <button class="btn filled sm" @click="saveModelRoutes">保存并生效</button>
        </article>
        <article class="card">
          <h3>扩展状态</h3>
          <ol class="feed"><li v-for="ext in extensionList" :key="ext.name"><strong>{{ ext.name }}</strong><span class="meta">api {{ ext.api_version }} · {{ ext.reason || '—' }}</span><span class="chip" :class="ext.available ? 'ok' : 'muted'">{{ ext.available ? '可用' : '未就绪' }}</span></li><li v-if="!extensionList.length" class="empty">没有注册的扩展。</li></ol>
          <p class="hint">未就绪的扩展不会伪装成可用；配置对应端点或开关后即可转为可用。</p>
        </article>
      </div>
    </section>

    <!-- 12 实验 -->
    <section v-show="tab === 'experimental'" class="panel">
      <div class="section-head"><div><h2>实验与手动触发</h2><p class="desc">一次性触发内容抓取、群聊兴趣唤醒、关系回落、穿搭与生图（扩展未就绪时失败即报）。</p></div></div>
      <div class="grid3">
        <article class="card"><h3>内容</h3><div class="actions-row"><button class="btn tonal sm" @click="gatherContent">抓取见闻</button><button class="btn tonal sm" @click="generate('journal')">生成日记</button><button class="btn tonal sm" @click="generate('dream')">生成梦境</button></div></article>
        <article class="card"><h3>行为</h3><div class="actions-row"><button class="btn tonal sm" @click="wakeGroup">群聊兴趣唤醒</button><button class="btn tonal sm" @click="decayRelationships">关系自然回落</button><button class="btn tonal sm" @click="outfitToday">今日穿搭</button></div></article>
        <article class="card"><h3>生图（扩展门控）</h3><p class="hint">未安装生图扩展或未配置端点时不会伪装成功。</p><div class="actions-row"><button class="btn tonal sm" @click="tryImage">尝试生图</button></div></article>
        <article class="card"><h3>多模态出站</h3>
          <div class="form-row">
            <select v-model="mediaForm.kind" class="field" style="max-width:140px"><option value="tts">语音 TTS</option><option value="image">图片</option><option value="poke">戳一戳</option><option value="status">QQ 状态</option></select>
            <select v-model="mediaForm.target" class="field"><option value="">选择目标…</option><option v-for="o in targetOptions" :key="o.value" :value="o.value">{{ o.label }}</option></select>
          </div>
          <textarea v-if="mediaForm.kind === 'tts'" v-model="mediaForm.text" class="field area" placeholder="语音内容…"></textarea>
          <input v-else-if="mediaForm.kind === 'image'" v-model="mediaForm.file" class="field" placeholder="图片路径 / URL" />
          <button class="btn filled sm" @click="sendMedia" :disabled="!mediaForm.target">发送</button>
          <p class="hint">需要 OneBot 已连接；未连接会明确失败。</p>
        </article>
        <article class="card"><h3>食物菜单</h3><div class="form-row"><input v-model="foodForm.name" class="field" placeholder="食物，如 番茄牛腩" /><input v-model="foodForm.tags" class="field" placeholder="标签（可选）" /><button class="btn filled sm" @click="addFood" :disabled="!foodForm.name.trim()">加入</button></div><ol class="feed"><li v-for="f in data.food" :key="f.id">{{ f.name }} <span class="meta">{{ f.tags || '—' }}</span><button class="btn danger sm" @click="removeFood(f.id)">删除</button></li><li v-if="!(data.food || []).length" class="empty">菜单还是空的</li></ol></article>
        <article class="card"><h3>重要日期</h3><div class="form-row"><input v-model="dateForm.title" class="field" placeholder="名称，如 生日" /><input v-model="dateForm.date" class="field" placeholder="YYYY-MM-DD 或 MM-DD" /><button class="btn filled sm" @click="addDate" :disabled="!dateForm.title.trim() || !dateForm.date.trim()">添加</button></div><label class="sw"><input type="checkbox" v-model="dateForm.repeat_yearly" /><span>每年重复</span></label><ol class="feed"><li v-for="item in data.important_dates" :key="item.id">{{ item.title }} · {{ item.date_text }}<button class="btn danger sm" @click="removeDate(item.id)">删除</button></li><li v-if="!data.important_dates?.length" class="empty">还没有重要日期</li></ol></article>
        <article class="card"><h3>群聊黑话词云</h3><div class="cloud"><span v-for="w in words" :key="w.topic" class="cloud-word" :style="{ fontSize: (12 + Math.min(18, Math.log(w.score + 1) * 6)) + 'px', opacity: 0.55 + Math.min(0.45, w.score / 20) }">{{ w.topic }}</span><span v-if="!words.length" class="empty">还没有词云数据</span></div></article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.pcp{
  --r-xs:10px; --r-sm:14px; --r-md:20px; --r-lg:28px; --r-xl:36px;
  --spring:cubic-bezier(.2,.9,.25,1.15);
  height:100%;overflow-y:auto;padding:var(--space-xl) var(--space-xl) 96px;
  background:var(--md-surface);color:var(--md-on-surface);
  max-width:1240px;margin:0 auto;
}
h1,h2,h3,h4{margin:0;letter-spacing:-.01em}
.eyebrow{margin:0 0 8px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em}
.eyebrow b{font-size:9px}

/* Hero */
.hero{position:relative;border-radius:var(--r-xl);padding:28px 28px 22px;margin-bottom:22px;
  background:linear-gradient(135deg,var(--md-primary-container),var(--md-surface-container-high) 70%);
  color:var(--md-on-surface);box-shadow:var(--shadow-1);overflow:hidden}
.hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--md-primary) 34%,transparent),transparent 68%);pointer-events:none}
.hero-main{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:flex-start;position:relative;z-index:1}
.hero-copy h1{font-size:clamp(26px,3.4vw,40px);font-weight:800}
.sub{margin:8px 0 0;max-width:620px;font-size:13.5px;line-height:1.6;color:var(--md-on-surface-variant)}
.hero-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.fab{height:52px;padding:0 22px;border:0;border-radius:18px;background:var(--md-primary);color:var(--md-on-primary,#fff);
  font:700 14px/1 inherit;display:inline-flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 6px 18px color-mix(in srgb,var(--md-primary) 34%,transparent);
  transition:transform .28s var(--spring),box-shadow .28s}
.fab:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}
.fab:disabled{opacity:.6;cursor:not-allowed}
.fab-ic{font-size:17px}
.hero-stats{position:relative;z-index:1;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:22px}
.stat{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border:0;border-radius:var(--r-md);
  background:color-mix(in srgb,var(--md-surface-container-lowest) 78%,transparent);cursor:pointer;text-align:left;
  transition:transform .25s var(--spring),background .25s;backdrop-filter:blur(4px)}
.stat:hover{transform:translateY(-2px);background:var(--md-surface-container-lowest)}
.stat-ic{font-size:14px;opacity:.85}
.stat-num{font-size:26px;font-weight:800;letter-spacing:-.02em}
.stat-cap{font-size:11.5px;color:var(--md-on-surface-variant)}
.t1{color:var(--md-primary)} .t2{color:#9a6a00} .t3{color:#7b4bb7} .t4{color:#0d8a5f} .t5{color:#b5473c} .t6{color:#1a6fb4}
.state-row{position:relative;z-index:1;display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;align-items:center}
.pill{padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--md-surface-container-lowest) 70%,transparent);font-size:12.5px;font-weight:700}
.pill.soft{font-weight:500;color:var(--md-on-surface-variant)}
.pill.bad{background:#ffdcc6;color:#7a3a00}
.chip-btn{border:0;border-radius:999px;padding:7px 14px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);
  font:700 12.5px/1 inherit;cursor:pointer;transition:transform .2s var(--spring)}
.chip-btn:hover{transform:translateY(-1px)}

.banner{padding:12px 16px;border-radius:var(--r-sm);font-size:13px;margin:0 0 16px}
.banner.err{background:var(--md-error-container);color:#410e0b}
.banner.ok{background:var(--md-primary-container);color:var(--md-on-primary-container)}

/* Tabs */
.tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 4px 14px;margin-bottom:6px;scrollbar-width:thin}
.tab{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border:1px solid var(--md-outline-variant);
  border-radius:999px;background:var(--md-surface-container-low);color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;
  transition:background .25s,color .25s,transform .25s var(--spring)}
.tab i{font-style:normal;font:700 10px/1 ui-monospace,monospace;opacity:.6}
.tab-ic{font-size:14px}
.tab:hover{background:var(--md-surface-container-high)}
.tab.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent;transform:translateY(-1px);
  box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
.tab.active i{opacity:.85}

.panel{animation:fade .32s var(--spring)}
@keyframes fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:8px 0 18px}
.section-head h2{font-size:22px;font-weight:800}
.desc{margin:6px 0 0;font-size:13px;color:var(--md-on-surface-variant);max-width:720px;line-height:1.55}
.head-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}

/* Buttons */
.btn{height:40px;padding:0 16px;border:1px solid transparent;border-radius:999px;font:700 13px/1 inherit;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .22s var(--spring),background .22s,box-shadow .22s}
.btn.sm{height:34px;padding:0 14px;font-size:12.5px}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn:hover:not(:disabled){transform:translateY(-1px)}
.btn.filled{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.btn.tonic{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn.text{background:transparent;color:var(--md-primary)}
.btn.danger{background:var(--md-error-container);color:#410e0b}
.link{border:0;background:transparent;color:var(--md-primary);font:700 12px/1 inherit;cursor:pointer;padding:4px}

/* Cards */
.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;margin-bottom:16px}
.card > h3{font-size:16px;font-weight:750;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.card.sub{padding:16px;margin-bottom:0}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.item-card{display:flex;flex-direction:column;gap:8px}
.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sub-label{margin:16px 0 8px;font-size:11.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--md-on-surface-variant)}
.hint{font-size:12px;color:var(--md-on-surface-variant);line-height:1.55;margin:6px 0}
.meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5}
.prose{margin:0;font-size:13.5px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}
.empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant)}

/* Fields */
.field{width:100%;height:48px;padding:0 16px;border:1px solid var(--md-outline-variant);border-radius:var(--r-sm);
  background:var(--md-surface-container-high);color:var(--md-on-surface);font:400 14px/1.4 inherit;outline:none;transition:border-color .2s,box-shadow .2s}
.field:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.field.area{height:auto;padding:12px 16px;line-height:1.6;resize:vertical;min-height:84px}
.field.tiny{width:104px;height:38px;padding:0 12px;font-size:13px}
.field.search{max-width:200px}
.form-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.form-row .field{flex:1;min-width:120px}
.actions-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
.switches{display:flex;gap:16px;flex-wrap:wrap;margin:8px 0}
.sw{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--md-on-surface-variant);cursor:pointer}
.sw input{width:18px;height:18px;accent-color:var(--md-primary)}
.settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.settings-grid label{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:var(--md-on-surface-variant)}
.settings-grid label.wide{grid-column:span 2}
.settings-grid .field{height:40px}

/* Chips / status */
.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 12px;border-radius:999px;font-size:11.5px;font-weight:700;
  background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.chip.ok{background:var(--md-success-container);color:#0d3b1e}
.chip.warn{background:#ffe6c2;color:#7a4400}
.chip.danger{background:var(--md-error-container);color:#410e0b}
.chip button{border:0;background:transparent;color:inherit;cursor:pointer;font-weight:800;margin-left:2px}
.count-pill{margin-left:auto;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.owner{margin-left:6px;font-style:normal;font-size:10px;font-weight:800;background:var(--md-success-container);color:#0d3b1e;border-radius:999px;padding:2px 7px}
.note{margin:10px 0;padding:12px 14px;border-radius:var(--r-sm);background:var(--md-surface-container);font-size:12.5px;line-height:1.6}

/* Dashboard desk */
.desk{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:16px;align-items:start}
.desk-col{display:flex;flex-direction:column;gap:16px}
.dcard{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px}
.dcard header{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.dcard header h3{font-size:14px;font-weight:800}
.dcard header small,.dcard header .link{margin-left:auto}
.dcard .link{margin-left:auto}
.dot{width:11px;height:11px;border-radius:50%;background:var(--md-outline)}
.dot.ic{background:var(--md-primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--md-primary) 18%,transparent)}
.fact-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fact{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.fact b{font-size:22px;font-weight:800}
.fact span{font-size:11.5px;color:var(--md-on-surface-variant)}
.mini-list{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
.mini-list li{display:flex;justify-content:space-between;gap:10px;font-size:13px;align-items:center}
.cur{display:flex;align-items:center;gap:10px;font-size:15px}
.tl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.tl li{display:flex;gap:12px;align-items:flex-start;padding:8px 10px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}
.tl li time{font:600 11.5px/1.4 ui-monospace,monospace;color:var(--md-on-surface-variant);flex:0 0 46px}
.tl li > div{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.tl li strong.done{text-decoration:line-through;color:var(--md-on-surface-variant)}
.tl li.ok{background:var(--md-success-container)}
.tl li.warn{background:#fff3dd}
.mini-tl{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.mini-tl li{display:flex;gap:10px;align-items:flex-start}
.mini-tl li > div{display:flex;flex-direction:column;gap:2px}
.caps{display:flex;flex-wrap:wrap;gap:8px}
.cap{display:flex;flex-direction:column;gap:1px;padding:8px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);min-width:96px}
.cap b{font-size:12.5px}
.cap small{font-size:11px;color:#0d8a5f;font-weight:700}
.cap.off small{color:var(--md-on-surface-variant)}
.fold{border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);margin-top:16px;background:var(--md-surface-container-lowest);overflow:hidden}
.fold summary{padding:16px 20px;cursor:pointer;display:flex;flex-direction:column;gap:2px;list-style:none}
.fold summary::-webkit-details-marker{display:none}
.fold summary b{font-size:15px}
.fold summary small{font-size:12px;color:var(--md-on-surface-variant)}
.fold[open] summary{border-bottom:1px solid var(--md-outline-variant)}
.fold .grid3,.fold .grid2{padding:18px;margin:0}
.stat-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:16px}
.stat-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:18px;display:flex;flex-direction:column;gap:4px}
.stat-card b{font-size:28px;font-weight:800}
.stat-card span{font-size:12px;color:var(--md-on-surface-variant)}

/* Bars */
.bars{display:flex;flex-direction:column;gap:10px}
.bar-row{display:flex;align-items:center;gap:10px;font-size:12.5px}
.bar-label{flex:0 0 84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--md-on-surface-variant)}
.bar{flex:1;height:10px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 60%,#fff));transition:width .4s var(--spring)}
.bar.big{height:14px;margin:8px 0}

/* Feed */
.feed{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.feed li{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:var(--r-sm);background:var(--md-surface-container-low);font-size:13px}
.feed li .actions-row{margin-top:4px}
.pos{color:var(--md-success);font-weight:800}
.neg{color:var(--md-error);font-weight:800}
.tl-detail{margin:4px 0 0;font-size:12px;color:var(--md-on-surface-variant);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;white-space:pre-wrap;overflow-wrap:anywhere}

/* User workspace */
.user-layout{display:grid;grid-template-columns:300px 1fr;gap:16px;align-items:start}
.roster{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:14px;display:flex;flex-direction:column;gap:8px}
.roster-head{display:flex;align-items:center;gap:8px;padding:4px 6px 8px}
.roster-row{display:flex;gap:10px;align-items:center;padding:10px;border:0;border-radius:var(--r-sm);background:transparent;cursor:pointer;text-align:left;transition:background .2s}
.roster-row:hover{background:var(--md-surface-container-low)}
.roster-row.active{background:var(--md-secondary-container)}
.avatar{width:38px;height:38px;border-radius:50%;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:800;flex:0 0 auto}
.avatar.lg{width:52px;height:52px;font-size:20px}
.rmain{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.rtop{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700}
.user-detail{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--r-lg);padding:20px;min-height:320px}
.detail-head{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--md-outline-variant);margin-bottom:12px}
.subtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.subtabs button{height:32px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 12px/1 inherit;cursor:pointer}
.subtabs button.active{background:var(--md-primary);color:var(--md-on-primary,#fff);border-color:transparent}
.kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:8px}
.kv{background:var(--md-surface-container-low);border-radius:var(--r-sm);padding:12px 14px;display:flex;flex-direction:column;gap:3px}
.kv span{font-size:11.5px;color:var(--md-on-surface-variant)}
.kv b{font-size:22px;font-weight:800}

/* World */
.world-layout{display:grid;grid-template-columns:190px 1fr;gap:16px;align-items:start}
.world-nav{position:sticky;top:8px;display:flex;flex-direction:column;gap:4px}
.world-nav button{display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:700 13px/1 inherit;cursor:pointer;transition:background .2s}
.world-nav button:hover{background:var(--md-surface-container-high)}
.world-nav button.active{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.world-body .cards{margin-top:0}

/* Group */
.group-form{display:grid;grid-template-columns:1fr 130px 1fr auto;gap:10px;margin-bottom:16px}
.group-detail{margin:10px 0;padding:12px;border-radius:var(--r-sm);background:var(--md-surface-container-low)}
.members{display:flex;flex-direction:column;gap:6px}
.member{display:flex;align-items:center;gap:10px;font-size:12.5px}
.member .meta{flex:1}

/* Calendar */
.cal-card{grid-column:auto}
.cal-week{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}
.cal-week span{text-align:center;font-size:11px;color:var(--md-on-surface-variant);font-weight:700}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.cal-cell{min-height:74px;border:1px solid var(--md-outline-variant);border-radius:12px;padding:6px;display:flex;flex-direction:column;gap:3px;background:var(--md-surface-container-lowest)}
.cal-cell.empty{border-color:transparent;background:transparent}
.cal-cell.today{border-color:var(--md-primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--md-primary) 20%,transparent)}
.cal-cell.has{background:var(--md-surface-container-low)}
.cal-day{font-size:12px;font-weight:800;color:var(--md-on-surface-variant)}
.cal-chip{font-size:10.5px;line-height:1.3;background:var(--md-primary-container);color:var(--md-on-primary-container);border-radius:6px;padding:2px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal-more{font-size:10px;color:var(--md-on-surface-variant)}

.cloud{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:8px 0}
.cloud-word{font-weight:800;color:var(--md-primary);line-height:1.2}

.mini-actions{display:flex;gap:6px;flex:0 0 auto}
.warnline{margin:12px 0 0;padding:10px 12px;border-radius:var(--r-sm);background:#fff3dd;color:#7a4400;font-size:12.5px}
.spark{display:flex;align-items:flex-end;gap:6px;height:120px;padding:8px 2px 0}
.spark-col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;height:100%}
.spark-col i{width:100%;max-width:22px;border-radius:7px 7px 3px 3px;background:linear-gradient(180deg,var(--md-primary),color-mix(in srgb,var(--md-primary) 55%,#fff));transition:height .4s var(--spring)}
.spark-col span{font-size:9.5px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace}
.radar-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
.radar{width:180px;height:180px}
.radar-grid{fill:none;stroke:var(--md-outline-variant);stroke-width:1}
.radar-fill{fill:color-mix(in srgb,var(--md-primary) 34%,transparent);stroke:var(--md-primary);stroke-width:2;transition:all .4s var(--spring)}
.radar-lbl{font-size:8px;fill:var(--md-on-surface-variant);font-weight:700}
.findings{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}
.findings li{display:flex;gap:8px;align-items:center}

@media (prefers-color-scheme: dark){
  .pill.bad{background:#5a2d00;color:#ffd7b0}
  .chip.warn{background:#5a3d00;color:#ffe0a3}
  .warnline{background:#3d2b00;color:#ffd89a}
  .tl li.warn{background:#3d2b00}
}

@media(max-width:1080px){.desk{grid-template-columns:1fr 1fr}.stat-cards{grid-template-columns:repeat(2,1fr)}.hero-stats{grid-template-columns:repeat(3,1fr)}}
@media(max-width:820px){.grid2,.grid3,.desk,.user-layout,.world-layout{grid-template-columns:1fr}.group-form{grid-template-columns:1fr}.settings-grid label.wide{grid-column:span 1}.hero-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.pcp{padding:var(--space-lg) var(--space-lg) 80px}.hero{padding:20px}.hero-actions{width:100%}}
</style>
