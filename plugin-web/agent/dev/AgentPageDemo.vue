<script setup lang="ts">
/**
 * Layout demo for the agent page, inside the real host shell.
 *
 * Two things this version fixes that the previous ones got wrong.
 *
 * **1. The plugin does not own the window.** The host renders a 76px header (brand,
 * page title, locale, theme) and a 100px nav rail (对话 / Agent / 记忆 / …) and hands the
 * plugin only `.app-main`. Drawing a rail here produced two side by side.
 *
 * **2. Three different concepts were sharing one control.** The real page has:
 *
 *    a. *Execution strategy* — Plan / Agent / Work. How much autonomy this turn gets:
 *       propose only, act with approvals, or do one focused pass. Per-turn, so it belongs
 *       beside the composer.
 *    b. *Agent type* — general / code / code_explore / research / science. Which executor
 *       and system prompt handle the turn. A setting, not a per-turn choice, and it is
 *       what `agent_type` in the request body carries.
 *    c. *Assessment kind* — recon / engineering / craft. What a **task** is. Only
 *       meaningful once a task exists, so it belongs in the task view, never in the
 *       composer.
 *
 * The page merged (a) and (b) into one piece of state:
 *
 *     const agentMode = computed(() => taskKind === 'agent' ? agentSubKind : taskKind)
 *
 * so picking Plan silently discarded the chosen agent type, and picking `code` silently
 * became "Agent". They are now three separate pieces of state in three separate places:
 *
 *     strategy  → composer (segmented, 40dp, changes per turn)
 *     agentType → a sheet behind the composer's type chip
 *     kind      → the task view's own header
 *
 * That separation is why this demo has a task view at all: the ten task tabs need
 * somewhere to live that is not the conversation, because they describe a *task*, not a
 * chat.
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import ButtonGroup from '../src/md/ButtonGroup.vue'
import IconButton from '../src/md/IconButton.vue'
import LoadingIndicator from '../src/md/LoadingIndicator.vue'
import ProgressIndicator from '../src/md/ProgressIndicator.vue'
import Tabs from '../src/md/Tabs.vue'
import DiffStat from '../src/md/DiffStat.vue'
import FloatingPanel from '../src/md/FloatingPanel.vue'
import TaskViewDemo from './TaskViewDemo.vue'
import Tooltip from '../src/md/Tooltip.vue'

const ICON = {
  chat: 'M12 3c-4.97 0-9 3.58-9 8 0 2.5 1.3 4.72 3.34 6.16V21l3.2-1.8c.79.16 1.6.24 2.46.24 4.97 0 9-3.58 9-8s-4.03-8-9-8Z',
  agent: 'M12 4v3m0 10v3M4 12h3m10 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1m0-11.4-2.1 2.1m-7.2 7.2-2.1 2.1',
  memory: 'M6 4h12v16l-6-3-6 3V4Z',
  partner: 'M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9c0-3.3 3.1-6 7-6s7 2.7 7 6',
  plugins: 'M9 3v3m6-3v3M6 9h3m6 0h3M4 6h16v12H4zM9 13h6m-6 3h4',
  usage: 'M5 19V9m4 10V5m4 14v-7m4 7V8',
  console: 'M4 5h16v14H4zM7 10l3 2.5L7 15m5 0h5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  plus: 'M12 5v14M5 12h14',
  attach: 'M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6',
  send: 'M4 12 20 4l-4 8 4 8-16-8Zm0 0h10',
  more: 'M12 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  browser: 'M4 5h16v14H4zM4 9h16',
  tree: 'M4 5h6v4H4zM14 15h6v4h-6zM7 9v7h7',
  git: 'M12 3v6M12 15v6M6 12h6',
  terminal: 'M4 5h16v14H4zM7 10l3 2.5-3 2.5M13 15h4',
  copy: 'M9 9h9v9H9zM6 15V6h9',
  check: 'M5 13l4 4 10-10',
  stop: 'M7 7h10v10H7z',
  moon: 'M20 13a8 8 0 1 1-9-9 6.5 6.5 0 0 0 9 9Z',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  file: 'M6 3h7l5 5v13H6zM13 3v5h5',
}

/* ============ host shell (reproduced, not owned) ============ */
const hostNav = [
  { id: 'chat', label: '对话', icon: ICON.chat, active: true },
  { id: 'agent', label: 'Agent', icon: ICON.agent },
  { id: 'memory', label: '记忆', icon: ICON.memory },
  { id: 'partner', label: '伴侣', icon: ICON.partner },
  { id: 'plugins', label: '插件', icon: ICON.plugins },
  { id: 'usage', label: '用量', icon: ICON.usage },
  { id: 'console', label: '控制台', icon: ICON.console },
  { id: 'settings', label: '设置', icon: ICON.settings },
]

/* ============ plugin state ============ */
/** Which column the sidebar shows. Two views, not one list with a filter. */
const sideView = ref<'sessions' | 'tasks'>('sessions')
const sideSwitch = [
  { id: 'sessions', label: '对话', tone: 'ghost' as const },
  { id: 'tasks', label: '任务', tone: 'ghost' as const },
]

const filterItems = [
  { id: 'all', label: '全部', tone: 'ghost' as const },
  { id: 'user', label: '我的', tone: 'ghost' as const },
  { id: 'life', label: 'Life', tone: 'ghost' as const },
]
const filter = ref('all')

const workspaces = ref([
  {
    name: '0KAY',
    sessions: [
      { id: 's1', title: '重整 agent 页面布局', when: '16:04', active: true, running: true },
      { id: 's2', title: 'MD3 组件的 token 对齐', when: '14:52', active: false, running: false },
      { id: 's3', title: '拆 3780 行单文件', when: '11:20', active: false, running: false },
    ],
  },
  {
    name: 'notes',
    sessions: [
      { id: 's4', title: '本周读的书和想法', when: '昨天', active: false, running: false },
      { id: 's5', title: '周报草稿', when: '周三', active: false, running: false },
    ],
  },
])

/** An assessment is a different object from a session: it has a kind and a lifecycle. */
const tasks = ref([
  { id: 't1', objective: '对 dsh 目标做端口与服务取证', kind: '侦察', status: 'running', met: 4, total: 11 },
  { id: 't2', objective: '复刻 0kay 的侧栏交互', kind: '复刻', status: 'running', met: 7, total: 9 },
  { id: 't3', objective: '改造 gateway 的会话落库', kind: '工程', status: 'done', met: 6, total: 6 },
  { id: 't4', objective: '审计 HTTP 鉴权路径', kind: '工程', status: 'stopped', met: 3, total: 8 },
])
interface TaskRow { id: string; objective: string; kind: string; status: string; met: number; total: number }

const collapsed = ref<string[]>([])
function toggleGroup(name: string) {
  collapsed.value = collapsed.value.includes(name)
    ? collapsed.value.filter((n) => n !== name)
    : [...collapsed.value, name]
}

const current = ref('重整 agent 页面布局')
function pickSession(session: { id: string; title: string }) {
  current.value = session.title
  for (const ws of workspaces.value) {
    for (const s of ws.sessions) s.active = s.id === session.id
  }
}

/* ---- (a) execution strategy: per-turn, in the composer ---- */
const strategyItems = [
  { id: 'plan', label: 'Plan', tone: 'ghost' as const },
  { id: 'agent', label: 'Agent', tone: 'ghost' as const },
  { id: 'work', label: 'Work', tone: 'ghost' as const },
]
const strategy = ref('agent')
const STRATEGY_HINT: Record<string, string> = {
  plan: '只读代码、给出方案，不动任何文件',
  agent: '自行调用工具并改文件，按权限逐条审批',
  work: '不做规划循环，一次专注做完',
}

/* ---- permission: a global switch, and a second one per task ----
 *
 * Two layers, because they answer different questions:
 *
 *   permissionMode   the composer's shield. "For this session, do I want to be asked?"
 *                    normal = every tool call asks; full_access = none do.
 *
 *   newTaskPermission the new-task form. The same question, but the answer is pinned to
 *                    that task and survives the session, because a long assessment may
 *                    outlive the tab you started it in.
 *
 * Neither existed in the earlier demo, which made the agent look as though it never
 * needed permission — the approval card then had no way to be turned on or off.
 */
const permissionMode = ref<'normal' | 'full_access'>('normal')
const newTaskPermission = ref<'normal' | 'full_access'>('normal')

/** Only when the session asks for approval does the inline approval card appear. */
const needsApproval = computed(() => permissionMode.value === 'normal')

function togglePermission() {
  permissionMode.value = permissionMode.value === 'normal' ? 'full_access' : 'normal'
  appendNotice(
    permissionMode.value === 'full_access'
      ? '已切到完全访问：本轮不再询问，工具直接执行'
      : '已切回全部审批：每次工具调用都会先问你',
  )
}

/* ---- (b) agent type: a setting, behind a chip ---- */
const agentTypes = [
  { id: 'general', label: '通用 Agent', desc: '日常问答与小任务' },
  { id: 'code', label: '编程 Agent', desc: '读写仓库、运行测试' },
  { id: 'code_explore', label: '编程 · 多路探索', desc: '并行试多个方案再收敛' },
  { id: 'research', label: '调研 Agent', desc: '多源检索并交叉验证' },
  { id: 'science', label: '科学 Agent', desc: '计算与实验流程' },
]
const agentType = ref('code')
const agentTypeLabel = computed(() => agentTypes.find((t) => t.id === agentType.value)?.label || '')
const optionsOpen = ref(false)

function chooseType(id: string) {
  agentType.value = id
  optionsOpen.value = false
}

/**
 * Escape closes the sheet and puts focus back on the chip that opened it.
 *
 * Without this the scrim swallows the click that would dismiss it, so a keyboard user
 * who opens the sheet has no way out: the only visible control is behind an overlay
 * that does not respond to Escape. Focus restoration matters too — closing a popover
 * should not drop focus to the document body, which loses the user's place.
 */
const chipEl = ref<HTMLElement | null>(null)

/**
 * Where to put the sheet.
 *
 * Measured from the chip at open time and written to CSS variables, because the chip's
 * position depends on what is left of it in the composer row (the strategy group and
 * send button are to its right) — a fixed corner offset covered those controls.
 *
 * `inset-block-end` is the distance from the viewport bottom to the sheet's bottom edge:
 * the chip's top, minus a gap, so the sheet clears the composer entirely.
 */
const sheetPos = ref({ x: 0, y: 0 })

function measureChip() {
  const el = chipEl.value
  if (!el) return
  const box = el.getBoundingClientRect()
  sheetPos.value = {
    x: Math.round(box.left),
    /* Bottom edge of the sheet = chip's top minus 8px gap. */
    y: Math.round(window.innerHeight - box.top + 8),
  }
}

watch(optionsOpen, (open) => {
  if (open) measureChip()
})

function onSheetKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && optionsOpen.value) {
    optionsOpen.value = false
    event.stopPropagation()
  }
}

watch(optionsOpen, (open) => {
  if (!open) nextTick(() => chipEl.value?.focus())
})

onMounted(() => window.addEventListener('keydown', onSheetKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onSheetKey))

/* ---- (c) assessment kind: belongs to a task ---- */
const taskOpen = ref(false)
const openTask = ref<TaskRow | null>(null)
const taskKindItems = [
  { id: 'recon', label: '侦察', tone: 'ghost' as const },
  { id: 'engineering', label: '工程', tone: 'ghost' as const },
  { id: 'craft', label: '复刻', tone: 'ghost' as const },
]
const newTaskKind = ref('engineering')

/** The task view's tabs. Fewer than the real ten on purpose: five that differ. */
const taskTabs = [
  { id: 'overview', label: '总览' },
  { id: 'plans', label: '计划评审' },
  { id: 'findings', label: '发现', badge: 4 },
  { id: 'assets', label: '测试资产' },
  { id: 'approvals', label: '拦截审批', badge: 2 },
  { id: 'report', label: '报告' },
]
const taskTab = ref('overview')
const taskTabLabel = computed(() => taskTabs.find((t) => t.id === taskTab.value)?.label || '')

const taskGoals = ['端口与服务枚举', '依赖版本指纹', '已知漏洞比对', '进入路径验证']

function openTaskView(task: TaskRow) {
  openTask.value = task
  taskTab.value = 'overview'
  taskOpen.value = true
}

const taskFindings = [
  { sev: 'high', text: 'gateway 的会话列表未校验 executor 归属', at: '17:01' },
  { sev: 'medium', text: 'file/raw 对符号链接未做解析后再判定', at: '16:48' },
  { sev: 'low', text: 'tree 接口在空目录返回 500 而非空数组', at: '16:33' },
]

/* ---- conversation ---- */
const turns = ref([
  {
    role: 'user' as const,
    text: '把 agent 页面的排版按 MD3 重新做一遍，先把骨架搭出来我看看。',
    when: '16:05',
    strategy: 'Agent',
  },
  {
    role: 'agent' as const,
    paragraphs: [
      '执行策略、Agent 类型、任务类型是三件事，之前挤在一个下拉里，选了这个就丢了那个。现在分开放：策略在输入框旁边，类型在芯片里，任务类型只在任务视图里出现。',
      '下面是抽取出来的四步，前两步已经跑完。',
    ],
    tools: [
      { name: 'read', target: 'plugin-web/agent/src/AgentsPage.vue', state: 'done', summary: '', added: 0, removed: 0, expanded: false, code: [] as string[] },
      {
        name: 'grep',
        target: 'agentMode|taskKind',
        state: 'done',
        summary: '',
        added: 0,
        removed: 0,
        expanded: true,
        code: [
          'const agentMode = computed(() =>',
          "  taskKind === 'agent' ? agentSubKind : taskKind)",
          '// 选 Plan 就丢了 agentSubKind；选 code 就变成了 Agent',
        ],
      },
      { name: 'write', target: 'plugin-web/agent/src/md/Toolbar.vue', state: 'done', summary: '64dp 高', added: 128, removed: 0, expanded: false, code: [] as string[] },
      {
        name: 'edit',
        target: 'plugin-web/agent/src/AgentsPage.vue',
        state: 'done',
        summary: '拆出 agentMode',
        added: 12,
        removed: 31,
        expanded: false,
        code: [],
      },
    ],
    streaming: true,
  },
])

const strategyLabel = computed(
  () => strategyItems.find((s) => s.id === strategy.value)?.label || 'Agent',
)

const suggestions = [
  '读一遍 gateway 的鉴权路径',
  '把这次改动写成周报',
  '看看 0KAY 上还有哪些旧日志',
]

const plan = { title: '阶段 2：拆分 AgentsPage', progress: 35 }

/* Drives the wavy indicator through 0 → 100 so the amplitude gate can be seen. Runs once
   on mount; the point is the shape change, not a realistic duration. */
const waveProgress = ref(0)
function runWaveDemo() {
  const started = Date.now()
  const step = () => {
    const t = Math.min(1, (Date.now() - started) / 9000)
    waveProgress.value = Math.round(t * 100)
    if (t < 1) setTimeout(step, 120)
  }
  setTimeout(step, 800)
}
const planSteps = [
  { n: 1, text: '改造 6 个读源码的测试', done: true },
  { n: 2, text: '抽出 panels/ 与 useFloatingWindow', done: false },
  { n: 3, text: '拆 pages/ 与 stores/', done: false },
]

/* Approvals: the agent stops at a tool boundary and waits. The real page puts them in
   a task tab, but an approval is not something you go and visit — it blocks the run
   right now, so it belongs inline where the run is. */
const pendingApprovals = ref([
  {
    id: 'a1',
    tool: 'exec',
    args: 'rm -rf .run/tmp && go clean -cache',
    reason: '命令包含删除操作，且不在白名单内',
  },
])

function decideApproval(id: string, allow: boolean) {
  pendingApprovals.value = pendingApprovals.value.filter((a) => a.id !== id)
  if (!allow) appendNotice('已拒绝该操作，agent 会换一种做法')
}

/* Notices report a fact about something the user did; errors report a failure. They were
   the same toast before, so a successful action looked like a warning. */
const notice = ref('')
let noticeTimer: ReturnType<typeof setTimeout> | null = null
function appendNotice(text: string) {
  notice.value = text
  if (noticeTimer) clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => {
    notice.value = ''
  }, 3200)
}

/* Queued messages: while a task runs, what you type is held until the agent's next tool
   boundary rather than dropped. Saying that is what keeps the composer honest about
   what Enter will do. */
const queued = ref<string[]>([])

/* Attachments as chips: a filename inside the message text is not removable. */
const attachments = ref<Array<{ id: string; name: string; size: string }>>([])
function attachDemoFile() {
  attachments.value = [
    ...attachments.value,
    { id: 'f' + Date.now(), name: 'design-notes.md', size: '12 KB' },
  ]
}
function removeAttachment(id: string) {
  attachments.value = attachments.value.filter((a) => a.id !== id)
}

/* Empty session: a new conversation has nothing in it, which is not the same as a
   transcript that failed to load. */
const started = ref(false)
const draft = ref('')
const canSend = computed(() => draft.value.trim().length > 0)
const transcriptEl = ref<HTMLElement | null>(null)

/**
 * Follow the newest content.
 *
 * `onMounted` alone is not enough: the transcript does not exist until `started` flips,
 * which happens when the user picks a suggestion. Scrolling on mount therefore ran
 * against a null ref, leaving `scrollTop` at 0 while the content was already taller than
 * the viewport — the last turn, and any approval below it, sat clipped under the composer.
 *
 * Watching `started` covers the first real render; watching the pending approvals covers
 * a card arriving while the user is already reading.
 */
async function scrollToLatest() {
  await nextTick()
  const el = transcriptEl.value
  if (el) el.scrollTop = el.scrollHeight
}

onMounted(() => {
  scrollToLatest()
  runWaveDemo()
})
watch(started, (value) => { if (value) void scrollToLatest() })
watch(() => pendingApprovals.value.length, () => void scrollToLatest())

/* ---- dock ---- */
const rightDock = [
  { id: 'browser', label: '浏览器', icon: ICON.browser },
  { id: 'tree', label: '项目树', icon: ICON.tree },
  { id: 'file', label: '文件', icon: ICON.file },
  { id: 'term', label: '终端', icon: ICON.terminal },
  { id: 'git', label: 'Git', icon: ICON.git },
  { id: 'usage', label: '用量', icon: ICON.usage },
] as const

/**
 * The dock is a set of window switches, not a decorative toolbar.
 *
 * The real page keeps one boolean per panel (`browserOpen`, `fileOpen`, `termOpen`,
 * `treeOpen`, `usageOpen`, `hostOpen`) and persists each panel's geometry under
 * `0kay.agent.<panel>.pos` / `.size`. So the right side is six free-floating windows that
 * the user positions themselves. A dock with no panels behind it was the largest gap in
 * the earlier demos.
 */
type PanelId = (typeof rightDock)[number]['id']

const openPanels = ref<Set<PanelId>>(new Set())

function togglePanel(id: PanelId) {
  const next = new Set(openPanels.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openPanels.value = next
}

const PANEL_META: Record<PanelId, { title: string; subtitle: string; w: number; h: number }> = {
  browser: { title: '浏览器', subtitle: 'localhost:3000', w: 480, h: 340 },
  tree: { title: '项目树', subtitle: 'D:\\0KAY', w: 340, h: 380 },
  file: { title: 'AgentsPage.vue', subtitle: 'plugin-web/agent/src', w: 560, h: 300 },
  term: { title: '终端', subtitle: '0KAY · zsh', w: 520, h: 240 },
  git: { title: 'Git', subtitle: 'main · 3 个待提交', w: 380, h: 280 },
  usage: { title: '用量', subtitle: '本会话', w: 320, h: 300 },
}

/* --- sample contents --- */
const treeRows = [
  { depth: 0, name: '0KAY', dir: true, active: false, changed: '', added: 0 },
  { depth: 1, name: 'agent', dir: true, active: false, changed: '', added: 0 },
  { depth: 2, name: 'src', dir: true, active: false, changed: '', added: 0 },
  { depth: 3, name: 'md', dir: true, active: true, changed: '', added: 0 },
  { depth: 4, name: 'DiffStat.vue', dir: false, active: false, changed: '', added: 128 },
  { depth: 4, name: 'FloatingPanel.vue', dir: false, active: false, changed: '', added: 210 },
  { depth: 4, name: 'ProgressIndicator.vue', dir: false, active: false, changed: '±12', added: 0 },
  { depth: 2, name: 'AgentsPage.vue', dir: false, active: false, changed: '', added: 0 },
  { depth: 1, name: 'core', dir: true, active: false, changed: '', added: 0 },
  { depth: 1, name: 'docs', dir: true, active: false, changed: '', added: 0 },
]

const codeLines = [
  { n: 12, kind: 'ctx', text: 'const agentMode = computed(() =>' },
  { n: 13, kind: 'del', text: "  taskKind === 'agent' ? agentSubKind : taskKind)" },
  { n: 14, kind: 'add', text: 'const strategy = ref("plan" | "agent" | "work")' },
  { n: 15, kind: 'add', text: 'const agentType = ref("code")' },
  { n: 16, kind: 'ctx', text: '' },
  { n: 17, kind: 'add', text: '// 三件事分开放，互不覆盖' },
]

const terminalLines = [
  '$ npm run build',
  'vite v7.3.7 building for production...',
  '\u2713 145 modules transformed.',
  'dist/index.js  3,523.85 kB \u2502 gzip: 897.78 kB',
  '\u2713 built in 16.78s',
  '$ ',
]

const gitRows = [
  { status: 'M', path: 'plugin-web/agent/src/md/FloatingPanel.vue' },
  { status: 'M', path: 'plugin-web/agent/src/md/ProgressIndicator.vue' },
  { status: 'A', path: 'plugin-web/agent/src/md/DiffStat.vue' },
]

const usageRows = [
  { label: '系统提示', tokens: '8.2k', ratio: 0.32 },
  { label: '工具定义', tokens: '5.1k', ratio: 0.2 },
  { label: '对话历史', tokens: '11.4k', ratio: 0.45 },
  { label: '文件上下文', tokens: '0.8k', ratio: 0.03 },
]
const usageTotal = 25.5
const usageWindow = 100
const usageRatio = usageTotal / usageWindow

</script>

<template>
  <div class="shell">
    <header class="host-header">
      <div class="host-brand">
        <span class="host-mark" aria-hidden="true">0</span>
        <span class="host-title md-type-title-small">Agent</span>
      </div>
      <div class="host-actions">
        <span class="host-locale md-type-label-small">简体中文</span>
        <IconButton variant="standard" size="s" label="切换主题">
          <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.moon" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </IconButton>
      </div>
    </header>

    <div class="host-body">
      <nav class="host-rail" aria-label="主导航">
        <button
          v-for="item in hostNav"
          :key="item.id"
          type="button"
          class="host-nav-item"
          :class="{ 'is-active': item.active }"
          :aria-current="item.active ? 'page' : undefined"
        >
          <span class="host-nav-glyph">
            <svg viewBox="0 0 24 24" fill="none"><path :d="item.icon" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <span class="host-nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <main class="plug">
        <!-- ============ sidebar: sessions OR tasks, never both at once ============ -->
        <aside class="col-side" aria-label="侧栏">
          <header class="side-head">
            <ButtonGroup
              v-model="sideView"
              :items="sideSwitch"
              variant="connected"
              shape="round"
              label="侧栏视图"
              class="side-switch"
            />
            <Tooltip>
              <IconButton variant="tonal" size="s" :label="sideView === 'sessions' ? '新建会话' : '新建任务'">
                <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.plus" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              </IconButton>
              <template #body><i>{{ sideView === 'sessions' ? '新建会话 · ⌘N' : '新建任务' }}</i></template>
            </Tooltip>
          </header>

          <!-- ---------- sessions ---------- -->
          <div v-if="sideView === 'sessions'" class="side-body">
            <div class="conn md-type-label-small"><i class="conn-dot" />7 个执行器在线</div>
            <ButtonGroup v-model="filter" :items="filterItems" variant="connected" shape="round" label="会话来源" />
            <input class="search md-type-body-medium" type="search" placeholder="搜索会话" aria-label="搜索会话" />

            <div class="scroll">
              <section v-for="ws in workspaces" :key="ws.name" class="group">
                <button type="button" class="group-head" :aria-expanded="!collapsed.includes(ws.name)" @click="toggleGroup(ws.name)">
                  <span class="caret md-type-label-small" :class="{ 'is-collapsed': collapsed.includes(ws.name) }" aria-hidden="true">▾</span>
                  <span class="group-name md-type-label-large">{{ ws.name }}</span>
                  <span class="group-count md-type-label-small">{{ ws.sessions.length }}</span>
                </button>
                <div class="rows" :class="{ 'is-collapsed': collapsed.includes(ws.name) }">
                  <div class="rows-inner">
                    <button
                      v-for="s in ws.sessions"
                      :key="s.id"
                      type="button"
                      class="row md-state-layer"
                      :class="{ 'is-active': s.active }"
                      @click="pickSession(s)"
                    >
                      <span class="row-title md-type-body-medium">{{ s.title }}</span>
                      <span class="row-meta md-type-label-small">
                        <LoadingIndicator v-if="s.running" :size="14" label="运行中" />
                        <template v-else>{{ s.when }}</template>
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- ---------- tasks: a different list, not a filtered one ---------- -->
          <div v-else class="side-body">
            <p class="side-note md-type-label-small">任务是独立对象：有类型、有目标进度，会一直留在这里。</p>
            <div class="scroll">
              <button
                v-for="t in tasks"
                :key="t.id"
                type="button"
                class="task-row md-state-layer"
                :class="{ 'is-active': openTask?.id === t.id && taskOpen }"
                @click="openTaskView(t)"
              >
                <span class="task-top">
                  <span class="task-kind md-type-label-small">{{ t.kind }}</span>
                  <span class="task-state md-type-label-small" :class="`is-${t.status}`">{{ t.status === 'running' ? '进行中' : t.status === 'done' ? '已完成' : '已停止' }}</span>
                </span>
                <span class="task-title md-type-body-medium">{{ t.objective }}</span>
                <span class="task-progress">
                  <ProgressIndicator :value="t.status === 'done' ? 100 : Math.round((t.met / t.total) * 100)" variant="linear" :label="`${t.met}/${t.total}`" />
                  <span class="md-type-label-small">{{ t.met }}/{{ t.total }}</span>
                </span>
              </button>
            </div>
            <div class="new-task">
              <span class="md-type-label-small">新建任务的类型</span>
              <ButtonGroup v-model="newTaskKind" :items="taskKindItems" variant="connected" shape="round" label="任务类型" />

              <!-- Per-task permission. Two cards rather than a switch: the consequence of
                   "完全访问" is not obvious from the word alone, so each option states what
                   happens to the asking. -->
              <span class="md-type-label-small new-task-gap">权限</span>
              <div class="perm-choice" role="group" aria-label="任务权限">
                <button
                  type="button"
                  class="perm-card md-state-layer"
                  :class="{ 'is-active': newTaskPermission === 'normal' }"
                  :aria-pressed="newTaskPermission === 'normal'"
                  @click="newTaskPermission = 'normal'"
                >
                  <span class="md-type-label-large">先询问</span>
                  <span class="md-type-label-small perm-desc">危险工具需批准</span>
                </button>
                <button
                  type="button"
                  class="perm-card is-danger md-state-layer"
                  :class="{ 'is-active': newTaskPermission === 'full_access' }"
                  :aria-pressed="newTaskPermission === 'full_access'"
                  @click="newTaskPermission = 'full_access'"
                >
                  <span class="md-type-label-large">完全访问</span>
                  <span class="md-type-label-small perm-desc">不再询问</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- ============ main: a conversation, or one task ============ -->
        <section class="col-main">
          <!-- ---------- task view: ten tabs, each with real content ---------- -->
          <TaskViewDemo
            v-if="taskOpen && openTask"
            :task="openTask"
            @back="taskOpen = false"
          />

          <!-- ---------- conversation ---------- -->
          <template v-else>
            <header class="main-head">
              <div class="main-head-text">
                <h2 class="main-title md-type-title-small">{{ current }}</h2>
                <span class="md-type-label-small muted">
                  0KAY · 3 步已完成
                  <span v-if="permissionMode === 'full_access'" class="perm-badge">完全访问</span>
                </span>
              </div>
              <div class="main-head-actions">
                <Tooltip><IconButton variant="standard" size="s" label="复制"><svg viewBox="0 0 24 24" fill="none"><path :d="ICON.copy" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></IconButton><template #body><i>复制会话</i></template></Tooltip>
                <IconButton variant="standard" size="s" label="更多"><svg viewBox="0 0 24 24" fill="none"><path :d="ICON.more" fill="currentColor" /></svg></IconButton>
              </div>
            </header>

            <!-- Empty session: not a blank pane. It states the live settings and offers a way
                 in, which is the only thing a first message actually needs. -->
            <div v-if="!started" class="empty-chat">
              <span class="empty-mark" aria-hidden="true">0</span>
              <h2 class="md-type-title-large">开始一个对话</h2>
              <p class="empty-lead md-type-body-medium">
                这一轮用 <strong>{{ strategyLabel }}</strong> 策略，执行器是
                <strong>{{ agentTypeLabel }}</strong>。
              </p>
              <p class="empty-why md-type-label-small">{{ STRATEGY_HINT[strategy] }}</p>
              <div class="empty-suggestions">
                <button
                  v-for="sug in suggestions"
                  :key="sug"
                  type="button"
                  class="suggestion md-type-body-medium md-state-layer"
                  @click="draft = sug; started = true"
                >
                  {{ sug }}
                </button>
              </div>
            </div>

            <div v-else ref="transcriptEl" class="transcript">
              <article v-for="(turn, index) in turns" :key="index" class="turn" :class="`turn--${turn.role}`">
                <template v-if="turn.role === 'user'">
                  <div class="bubble-user md-type-body-large">{{ turn.text }}</div>
                  <div class="turn-meta md-type-label-small">
                    <span class="turn-strategy">{{ turn.strategy }}</span>{{ turn.when }}
                  </div>
                </template>

                <template v-else>
                  <div class="agent-body">
                    <p v-for="(line, li) in turn.paragraphs" :key="li" class="md-type-body-large agent-p">{{ line }}</p>

                    <div class="tools">
                      <section v-for="(tool, ti) in turn.tools" :key="ti" class="tool-card" :class="{ 'is-open': tool.expanded }">
                        <button type="button" class="tool-head md-state-layer" :aria-expanded="tool.expanded" @click="tool.expanded = !tool.expanded">
                          <span class="tool-kind md-type-label-small">{{ tool.name }}</span>
                          <span class="tool-target md-type-label-small">{{ tool.target }}</span>
                          <DiffStat :added="tool.added" :removed="tool.removed" class="tool-stat" />
                          <span v-if="tool.summary" class="tool-dur md-type-label-small">{{ tool.summary }}</span>
                          <span class="tool-caret md-type-label-small" :class="{ 'is-open': tool.expanded }" aria-hidden="true">▾</span>
                        </button>
                        <div class="tool-body" :class="{ 'is-open': tool.expanded }">
                          <div class="tool-body-inner">
                            <pre class="tool-code md-type-label-small"><code>{{ tool.code.join('\n') }}</code></pre>
                          </div>
                        </div>
                      </section>
                    </div>

                    <!-- The wavy shape is gated on progress: flat below 10%, a wave in
                         between, flat again from 95%. This card drives it through the
                         whole range so the transition is observable. -->
                    <section class="plan plan-wave">
                      <header class="plan-head">
                        <span class="md-type-label-large">构建产物校验</span>
                        <span class="plan-pct md-type-label-small">{{ waveProgress }}%</span>
                      </header>
                      <ProgressIndicator :value="waveProgress" variant="linear" shape="wavy" label="校验进度" />
                      <p class="plan-note md-type-label-small">
                        {{ waveProgress >= 95 ? '接近完成，波形已收平' : waveProgress <= 10 ? '刚开始，还在平直段' : '进行中，波浪可见' }}
                      </p>
                    </section>

                    <section class="plan">
                      <header class="plan-head">
                        <span class="md-type-label-large">{{ plan.title }}</span>
                        <span class="plan-pct md-type-label-small">{{ plan.progress }}%</span>
                      </header>
                      <ProgressIndicator :value="plan.progress" variant="linear" label="计划进度" />
                      <ol class="plan-steps">
                        <li v-for="step in planSteps" :key="step.n" class="plan-step md-type-body-medium" :class="{ done: step.done }">
                          <span class="plan-mark" aria-hidden="true">
                            <svg v-if="step.done" viewBox="0 0 24 24" fill="none"><path :d="ICON.check" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            <template v-else>{{ step.n }}</template>
                          </span>
                          {{ step.text }}
                        </li>
                      </ol>
                    </section>

                    <!-- Approval request, inline: it blocks the run, so putting it behind
                         navigation would leave the user staring at a stalled transcript. -->
                    <section v-for="a in pendingApprovals" v-show="permissionMode === 'normal'" :key="a.id" class="approval">
                      <header class="approval-head">
                        <span class="approval-mark" aria-hidden="true">!</span>
                        <span class="md-type-label-large">需要你确认</span>
                        <span class="approval-tool md-type-label-small">{{ a.tool }}</span>
                      </header>
                      <pre class="approval-args md-type-label-small"><code>{{ a.args }}</code></pre>
                      <p class="approval-why md-type-label-small">{{ a.reason }}</p>
                      <div class="approval-actions">
                        <button type="button" class="approval-btn is-allow md-type-label-large md-state-layer" @click="decideApproval(a.id, true)">
                          允许一次
                        </button>
                        <button type="button" class="approval-btn is-deny md-type-label-large md-state-layer" @click="decideApproval(a.id, false)">
                          拒绝
                        </button>
                      </div>
                    </section>

                    <div v-if="turn.streaming" class="streaming">
                      <LoadingIndicator :size="26" label="正在生成" />
                      <span class="md-type-body-medium">正在写第 4 步…</span>
                    </div>

                    <div class="agent-actions">
                      <button type="button" class="ghost-act md-type-label-small md-state-layer">
                        <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.copy" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        复制
                      </button>
                      <button type="button" class="ghost-act md-type-label-small md-state-layer">
                        <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.refresh" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        重试
                      </button>
                    </div>
                  </div>
                </template>
              </article>
            </div>

            <!-- ---------- composer: strategy lives here, type does not ---------- -->
            <form class="composer" @submit.prevent>
              <p v-if="notice" class="notice md-type-label-large" role="status">{{ notice }}</p>
              <div v-if="queued.length" class="queue">
                <span class="queue-label md-type-label-small">待发送 {{ queued.length }} 条 · 下一步工具后提交</span>
                <span v-for="(q, qi) in queued" :key="qi" class="queue-item md-type-label-small">{{ q }}</span>
              </div>
              <div class="composer-box">
                <textarea
                  v-model="draft"
                  class="composer-input md-type-body-large"
                  rows="1"
                  placeholder="描述你要做的事，或输入 / 调用命令"
                  aria-label="输入消息"
                />
                <div v-if="attachments.length" class="attachments">
                  <span v-for="f in attachments" :key="f.id" class="attach-chip md-type-label-small">
                    <span class="attach-name">{{ f.name }}</span>
                    <span class="attach-size">{{ f.size }}</span>
                    <button type="button" class="attach-x" :aria-label="`移除 ${f.name}`" @click="removeAttachment(f.id)">×</button>
                  </span>
                </div>
                <div class="composer-row">
                  <Tooltip>
                    <IconButton variant="standard" size="s" label="添加附件" @click="attachDemoFile">
                      <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.attach" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </IconButton>
                    <template #body><i>图片、文件或整个目录</i></template>
                  </Tooltip>

                  <!-- (b) agent type: a chip opening a sheet, not a segmented control.
                       Shown as a peer of the strategy, people read it as the same kind of
                       choice; as a field, it reads as a setting. -->
                  <button
                    ref="chipEl"
                    type="button"
                    class="type-chip md-type-label-large md-state-layer"
                    aria-haspopup="listbox"
                    :aria-expanded="optionsOpen"
                    @click="optionsOpen = !optionsOpen"
                  >
                    {{ agentTypeLabel }}
                    <span class="chip-caret" :class="{ 'is-open': optionsOpen }" aria-hidden="true">▾</span>
                  </button>

                  <span class="composer-spacer" />

                  <!-- (a) execution strategy: per-turn, so it stays visible -->
                  <ButtonGroup v-model="strategy" :items="strategyItems" variant="connected" shape="round" label="执行策略" />

                  <!-- Permission shield. An icon button, not a segmented control: it is
                       a mode with two states, and the filled/tonal change plus the tooltip
                       is enough to read which one is on. `danger` styling for full access
                       matters — it is the state where nothing will stop and ask. -->
                  <Tooltip>
                    <IconButton
                      :variant="permissionMode === 'full_access' ? 'filled' : 'standard'"
                      :round="false"
                      size="s"
                      :label="permissionMode === 'full_access' ? '完全访问 · 自动执行' : '正常 · 全部审批'"
                      :selected="permissionMode === 'full_access'"
                      class="perm-btn"
                      @click="togglePermission"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6l7-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                        <path v-if="permissionMode === 'full_access'" d="M9 12l2.2 2.2L15.5 10" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </IconButton>
                    <template #title>
                      <b>权限 · {{ permissionMode === 'full_access' ? '完全访问 · 自动执行' : '正常 · 全部审批' }}</b>
                    </template>
                    <template #body>
                      <i>{{ permissionMode === 'full_access'
                        ? '工具直接执行，不再逐条询问。谨慎使用。'
                        : '每次工具调用都先问你；危险操作会停下来等你确认。' }}</i>
                    </template>
                  </Tooltip>

                  <Tooltip>
                    <IconButton variant="standard" size="s" label="停止">
                      <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.stop" fill="currentColor" /></svg>
                    </IconButton>
                    <template #body><i>停止当前任务</i></template>
                  </Tooltip>

                  <Tooltip>
                    <IconButton :variant="canSend ? 'filled' : 'standard'" size="m" round label="发送" class="send" :class="{ 'is-ready': canSend }">
                      <svg viewBox="0 0 24 24" fill="none"><path :d="ICON.send" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </IconButton>
                    <template #body><i>Enter 发送，Shift+Enter 换行</i></template>
                  </Tooltip>
                </div>
                <p class="strategy-hint md-type-label-small">
                  {{ STRATEGY_HINT[strategy] }}
                  <span v-if="permissionMode === 'full_access'" class="hint-warn">· 完全访问已开启，不会停下来问你</span>
                </p>
              </div>
            </form>
          </template>
        </section>

        <!-- ============ dock ============ -->
        <aside class="col-dock" aria-label="工具">
          <Tooltip v-for="item in rightDock" :key="item.id" placement="left">
            <IconButton
              variant="standard"
              size="s"
              :label="item.label"
              :selected="openPanels.has(item.id)"
              @click="togglePanel(item.id)"
            >
              <svg viewBox="0 0 24 24" fill="none"><path :d="item.icon" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </IconButton>
            <template #body><i>{{ item.label }}{{ openPanels.has(item.id) ? ' · 已打开' : '' }}</i></template>
          </Tooltip>
        </aside>
      </main>
    </div>

    <!-- ============ floating panels ============
         Six windows, each independently positioned and sized, persisted per panel. They
         sit above the page but below the type sheet, and each one is a real switch in the
         dock rather than a decoration. -->
    <FloatingPanel
      v-if="openPanels.has('browser')"
      id="browser" :title="PANEL_META.browser.title" :subtitle="PANEL_META.browser.subtitle"
      :width="PANEL_META.browser.w" :height="PANEL_META.browser.h" @close="togglePanel('browser')"
    >
      <div class="browser-bar">
        <span class="url md-type-label-small">http://localhost:3000/agents</span>
        <span class="browser-fps md-type-label-small">60 fps</span>
      </div>
      <div class="browser-canvas">
        <div class="browser-mock">
          <span class="md-type-label-small">预览区</span>
          <p class="md-type-body-small">这个面板在真实页面里是一个可交互的远程浏览器（`/api/agent/browser/action`），支持滚轮缩放、拖拽平移和键盘输入。</p>
        </div>
      </div>
    </FloatingPanel>

    <FloatingPanel
      v-if="openPanels.has('tree')"
      id="tree" :title="PANEL_META.tree.title" :subtitle="PANEL_META.tree.subtitle"
      :width="PANEL_META.tree.w" :height="PANEL_META.tree.h" @close="togglePanel('tree')"
    >
      <ul class="tree">
        <li
          v-for="(row, ri) in treeRows" :key="ri"
          class="tree-row md-type-label-small"
          :class="{ 'is-dir': row.dir, 'is-active': row.active }"
          :style="{ paddingInlineStart: `${8 + row.depth * 14}px` }"
        >
          <span class="tree-caret" aria-hidden="true">{{ row.dir ? '▾' : '' }}</span>
          <span class="tree-name">{{ row.name }}</span>
          <span v-if="row.changed" class="tree-mark">{{ row.changed }}</span>
          <DiffStat v-if="row.added" :added="row.added" :removed="0" />
        </li>
      </ul>
    </FloatingPanel>

    <FloatingPanel
      v-if="openPanels.has('file')"
      id="file" :title="PANEL_META.file.title" :subtitle="PANEL_META.file.subtitle"
      :width="PANEL_META.file.w" :height="PANEL_META.file.h" @close="togglePanel('file')"
    >
      <div class="file-bar">
        <DiffStat :added="12" :removed="31" variant="block" path="plugin-web/agent/src/AgentsPage.vue" />
      </div>
      <div class="code">
        <div v-for="(line, li) in codeLines" :key="li" class="code-line md-type-label-small" :class="`is-${line.kind}`">
          <span class="code-no">{{ line.n }}</span>
          <span class="code-sign" aria-hidden="true">{{ line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : ' ' }}</span>
          <span class="code-text">{{ line.text || ' ' }}</span>
        </div>
      </div>
    </FloatingPanel>

    <FloatingPanel
      v-if="openPanels.has('term')"
      id="term" :title="PANEL_META.term.title" :subtitle="PANEL_META.term.subtitle"
      :width="PANEL_META.term.w" :height="PANEL_META.term.h" @close="togglePanel('term')"
    >
      <div class="term">
        <pre class="term-out md-type-label-small"><code>{{ terminalLines.join('\n') }}</code></pre>
        <div class="term-input">
          <span class="term-prompt">$</span>
          <input class="term-field md-type-label-small" placeholder="输入命令" aria-label="终端输入" />
        </div>
      </div>
    </FloatingPanel>

    <FloatingPanel
      v-if="openPanels.has('git')"
      id="git" :title="PANEL_META.git.title" :subtitle="PANEL_META.git.subtitle"
      :width="PANEL_META.git.w" :height="PANEL_META.git.h" @close="togglePanel('git')"
    >
      <ul class="git-list">
        <li v-for="(g, gi) in gitRows" :key="gi" class="git-row md-type-label-small">
          <span class="git-status" :class="`is-${g.status === 'A' ? 'add' : 'mod'}`">{{ g.status }}</span>
          <span class="git-path">{{ g.path }}</span>
        </li>
      </ul>
    </FloatingPanel>

    <FloatingPanel
      v-if="openPanels.has('usage')"
      id="usage" :title="PANEL_META.usage.title" :subtitle="PANEL_META.usage.subtitle"
      :width="PANEL_META.usage.w" :height="PANEL_META.usage.h" @close="togglePanel('usage')"
    >
      <div class="usage-wrap">
        <div class="usage-head">
          <ProgressIndicator :value="Math.round(usageRatio * 100)" variant="circular" :size="56" label="上下文用量" />
          <div class="usage-total">
            <span class="md-type-title-small">{{ usageTotal }}k</span>
            <span class="md-type-label-small muted">共 {{ usageWindow }}k 窗口</span>
          </div>
        </div>
        <ul class="usage-list">
          <li v-for="u in usageRows" :key="u.label" class="usage-row">
            <span class="usage-label md-type-label-small">{{ u.label }}</span>
            <span class="usage-tokens md-type-label-small">{{ u.tokens }}</span>
            <span class="usage-bar" :style="{ inlineSize: `${u.ratio * 100}%` }" />
          </li>
        </ul>
      </div>
    </FloatingPanel>

    <!-- agent type sheet: a light-dismiss popover, not a modal -->
    <div v-if="optionsOpen" class="sheet-scrim" @click="optionsOpen = false" />
    <div
      v-if="optionsOpen"
      class="type-sheet"
      :style="{ '--sheet-anchor-x': `${sheetPos.x}px`, '--sheet-anchor-y': `${sheetPos.y}px` }"
      role="listbox"
      aria-label="Agent 类型"
    >
      <p class="sheet-title md-type-label-small">Agent 类型 · 决定执行器与系统提示</p>
      <button
        v-for="t in agentTypes"
        :key="t.id"
        type="button"
        class="type-option md-state-layer"
        :class="{ 'is-active': agentType === t.id }"
        role="option"
        :aria-selected="agentType === t.id"
        @click="chooseType(t.id)"
      >
        <span class="type-name md-type-label-large">{{ t.label }}</span>
        <span class="type-desc md-type-label-small">{{ t.desc }}</span>
        <svg v-if="agentType === t.id" class="type-check" viewBox="0 0 24 24" fill="none"><path :d="ICON.check" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
  overflow: hidden;
  background: var(--md-surface);
  color: var(--md-on-surface);
}

/* ---------- host ---------- */
.host-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  block-size: 76px;
  padding-inline: 16px 20px;
  flex: none;
}
.host-brand { display: flex; align-items: center; gap: 10px; }
.host-mark {
  display: grid;
  place-items: center;
  inline-size: 28px;
  block-size: 28px;
  border-radius: var(--md-shape-full);
  background: var(--md-primary);
  color: var(--md-on-primary);
  font: var(--md-type-label-large-font);
}
.host-title { color: var(--md-on-surface); }
.host-actions { display: flex; align-items: center; gap: 8px; }
.host-locale {
  padding: 4px 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  color: var(--md-on-surface-variant);
}
.host-body { display: flex; flex: 1; min-block-size: 0; }
.host-rail {
  display: flex;
  flex-direction: column;
  gap: 6px;
  inline-size: 100px;
  padding: 8px 4px;
  flex: none;
  overflow-y: auto;
}
.host-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 0;
  border: 0;
  border-radius: var(--md-shape-medium);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition:
    background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.host-nav-item:hover { background: color-mix(in srgb, var(--md-on-surface) 6%, transparent); }
.host-nav-item.is-active { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.host-nav-glyph { display: grid; place-items: center; inline-size: 24px; block-size: 24px; }
.host-nav-glyph svg { inline-size: 100%; block-size: 100%; }
.host-nav-label { font: var(--md-type-label-small-font); letter-spacing: var(--md-type-label-small-tracking); }

/* ---------- plugin ---------- */
.plug {
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr) 52px;
  flex: 1;
  min-inline-size: 0;
  min-block-size: 0;
  padding: 0 12px 12px 4px;
  gap: 12px;
}

/* ---------- sidebar ---------- */
.col-side {
  display: flex;
  flex-direction: column;
  min-block-size: 0;
  padding: 12px;
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container-low);
}
.side-head { display: flex; align-items: center; gap: 8px; margin-block-end: 10px; }
.side-switch { flex: 1; }
.side-body { display: flex; flex-direction: column; gap: 10px; flex: 1; min-block-size: 0; }
.side-note { margin: 0; color: var(--md-on-surface-variant); }
.conn { display: flex; align-items: center; gap: 5px; color: var(--md-on-surface-variant); }
.conn-dot { inline-size: 6px; block-size: 6px; border-radius: var(--md-shape-full); background: var(--md-success); }

.search {
  inline-size: 100%;
  block-size: 36px;
  padding-inline: 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  box-sizing: border-box;
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.search::placeholder { color: var(--md-on-surface-variant); }
.search:focus { outline: none; border-color: var(--md-primary); background: var(--md-surface-container-high); }

.scroll { flex: 1; min-block-size: 0; overflow-y: auto; }
.group { margin-block-end: 6px; }
.group-head {
  display: flex;
  align-items: center;
  gap: 5px;
  inline-size: 100%;
  min-block-size: 32px;
  padding: 4px 6px;
  border: 0;
  border-radius: var(--md-shape-small);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
.group-head:hover { background: color-mix(in srgb, var(--md-on-surface) 5%, transparent); }
.group-name { color: var(--md-on-surface); }
.group-count { margin-inline-start: auto; opacity: 0.75; }
.caret { display: inline-block; transition: rotate var(--md-spring-expressive-fast-spatial-dur) var(--md-spring-soft); }
.caret.is-collapsed { rotate: -90deg; }

/* Fold instead of pop: grid rows 1fr → 0fr animates an auto height without a
   measuring pass, which is the only way to do it in CSS alone. */
.rows {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows var(--md-spring-expressive-default-spatial-dur) var(--md-spring-soft);
}
.rows.is-collapsed { grid-template-rows: 0fr; }
.rows-inner { overflow: hidden; min-block-size: 0; }

.row {
  display: flex;
  align-items: center;
  gap: 8px;
  inline-size: 100%;
  min-block-size: 44px;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--md-shape-medium);
  background: transparent;
  color: var(--md-on-surface-variant);
  text-align: start;
  cursor: pointer;
  transition:
    background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.row.is-active { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.row-title { flex: 1; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-meta { flex: none; opacity: 0.8; }

/* ---------- task rows: the shape says "task", not "chat" ---------- */
.task-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  inline-size: 100%;
  padding: 9px 10px;
  margin-block-end: 8px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container);
  text-align: start;
  cursor: pointer;
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.task-row:hover:not(.is-active) {
  background: var(--md-surface-container-high);
  border-color: var(--md-outline);
}
.task-row.is-active { border-color: var(--md-primary); background: var(--md-surface-container-high); }
.task-top { display: flex; align-items: center; gap: 6px; }
.task-kind {
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
}
.task-state { margin-inline-start: auto; }
.task-state.is-running { color: var(--md-primary); }
.task-state.is-done { color: var(--md-success); }
.task-state.is-stopped { color: var(--md-on-surface-variant); }
.task-title { color: var(--md-on-surface); }
.task-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-on-surface-variant);
}
/* A full-weight 4dp indicator inside every card competes with the card's own border.
   The bar is scaled to 70% and the track muted so the card stays the dominant shape;
   the ratio on the right carries the exact number anyway. */
.task-progress > :first-child {
  flex: 1;
  scale: 1 0.7;
  transform-origin: left center;
}

.new-task {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-block-start: 10px;
  margin-block-start: 2px;
  border-block-start: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface-variant);
}
.new-task :deep(.md-button-group) {
  display: flex;
  inline-size: 100%;
}
.new-task :deep(.md-button-group__item) {
  /* The group defaults to `flex: 0 0 auto` so a toolbar segment keeps its label width.
     Here the three kinds should share the row evenly, which is a caller's decision. */
  flex: 1 1 0;
  min-inline-size: 0;
}

/* ---------- main ---------- */
.col-main {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  min-block-size: 0;
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container-lowest);
}
.main-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  flex: none;
  gap: 12px;
}
.main-head-text { display: flex; flex-direction: column; gap: 2px; min-inline-size: 0; }
.main-head-line { display: flex; align-items: center; gap: 8px; }
.main-title { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.main-head-actions { display: flex; align-items: center; gap: 6px; flex: none; }
.muted { color: var(--md-on-surface-variant); }
.back {
  padding: 2px 8px;
  border: 0;
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-primary);
  cursor: pointer;
}
.main-tabs { padding-inline: 8px; flex: none; }

.task-body {
  flex: 1;
  min-block-size: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px 20px 20px;
}
.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.panel h3 { margin: 0; color: var(--md-on-surface); }
.goal-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.goal { display: flex; align-items: center; gap: 8px; color: var(--md-on-surface-variant); }
.goal.done { color: var(--md-on-surface); }
.goal-mark {
  display: grid;
  place-items: center;
  inline-size: 18px;
  block-size: 18px;
  flex: none;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container-high);
  font: var(--md-type-label-small-font);
}
.goal.done .goal-mark { background: var(--md-primary); color: var(--md-on-primary); }
.goal-mark svg { inline-size: 12px; block-size: 12px; }

.finding { display: flex; align-items: baseline; gap: 8px; }
.sev {
  flex: none;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.sev.is-high { background: var(--md-error-container); color: var(--md-on-error-container); }
.sev.is-medium { background: var(--md-warning-container); color: var(--md-on-warning-container); }
.finding-text { flex: 1; min-inline-size: 0; }
.finding-at { flex: none; color: var(--md-on-surface-variant); }

.running-note { display: flex; align-items: center; gap: 8px; color: var(--md-on-surface-variant); }

/* Empty state: centred in the remaining space, with a glyph that is one step smaller
   than the panel it replaces, so switching tabs does not change the page's weight. */
.empty-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  color: var(--md-on-surface-variant);
  padding-block: 40px;
}
.empty-glyph {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container);
  color: var(--md-on-surface-variant);
  margin-block-end: 4px;
}
.empty-glyph svg { inline-size: 22px; block-size: 22px; }
.empty-tab .md-type-title-small { color: var(--md-on-surface); margin: 0; }
.empty-hint { margin: 0; max-inline-size: 280px; }

/* ---------- transcript ---------- */
.transcript {
  flex: 1;
  min-block-size: 0;
  overflow-y: auto;
  padding: 8px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.turn { display: flex; flex-direction: column; gap: 5px; max-inline-size: 720px; }
.turn--user { align-self: flex-end; align-items: flex-end; }
.bubble-user {
  padding: 10px 16px;
  border-radius: var(--md-shape-large) var(--md-shape-large) var(--md-shape-xs) var(--md-shape-large);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.turn-meta { display: flex; align-items: center; gap: 6px; color: var(--md-on-surface-variant); }
/* The strategy this turn was sent with, recorded on the turn — not a global toggle. */
.turn-strategy {
  padding: 1px 6px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
}

.agent-body { display: flex; flex-direction: column; gap: 12px; }
.agent-p { margin: 0; }

.tools { display: flex; flex-direction: column; gap: 5px; }
.tool-card {
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container-low);
  overflow: hidden;
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.tool-card.is-open { border-color: var(--md-outline); background: var(--md-surface-container); }
.tool-head {
  display: flex;
  align-items: center;
  gap: 8px;
  inline-size: 100%;
  min-block-size: 44px;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: var(--md-on-surface-variant);
  text-align: start;
  cursor: pointer;
}
.tool-kind {
  flex: none;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.tool-target {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
.tool-stat { flex: none; }
.tool-dur { flex: none; opacity: 0.75; }
.tool-caret {
  flex: none;
  opacity: 0.6;
  transition: rotate var(--md-spring-expressive-fast-spatial-dur) var(--md-spring-soft);
}
.tool-caret.is-open { rotate: 180deg; }
.tool-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--md-spring-expressive-default-spatial-dur) var(--md-spring-soft);
}
.tool-body.is-open { grid-template-rows: 1fr; }
.tool-body-inner { overflow: hidden; min-block-size: 0; }
.tool-code {
  margin: 0;
  padding: 10px 12px;
  border-block-start: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-lowest);
  overflow-x: auto;
}
.tool-code code {
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  color: var(--md-on-surface);
}

.plan {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.plan-head { display: flex; align-items: baseline; justify-content: space-between; }
.plan-pct { color: var(--md-primary); }
.plan-note { margin: 0; color: var(--md-on-surface-variant); }
.plan-steps { display: flex; flex-direction: column; gap: 7px; margin: 2px 0 0; padding: 0; list-style: none; }
.plan-step { display: flex; align-items: center; gap: 8px; color: var(--md-on-surface-variant); }
.plan-step.done { color: var(--md-on-surface); }
.plan-mark {
  display: grid;
  place-items: center;
  inline-size: 18px;
  block-size: 18px;
  flex: none;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container-high);
  font: var(--md-type-label-small-font);
  transition:
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.plan-step.done .plan-mark { background: var(--md-primary); color: var(--md-on-primary); }
.plan-mark svg { inline-size: 12px; block-size: 12px; }

.streaming { display: flex; align-items: center; gap: 8px; color: var(--md-on-surface-variant); }

.agent-actions { display: flex; gap: 2px; margin-block-start: 2px; }
.ghost-act {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-block-size: 44px;
  padding: 12px 9px;
  margin-block: -9px;
  border: 0;
  border-radius: var(--md-shape-small);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition:
    background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.ghost-act svg { inline-size: 14px; block-size: 14px; }

/* ---------- empty session ---------- */
.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 24px 64px;
  text-align: center;
}
.empty-mark {
  display: grid;
  place-items: center;
  /* 56dp, not 48: at 48 with a 16px glyph it read as a bullet rather than as the
     product mark. Matches the host header's own mark at a larger scale. */
  inline-size: 56px;
  block-size: 56px;
  border-radius: var(--md-shape-full);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font: var(--md-type-title-large-font);
  font-weight: 500;
  margin-block-end: 4px;
}
.empty-chat h2 { margin: 0; }
.empty-lead { margin: 0; max-inline-size: 380px; color: var(--md-on-surface-variant); }
.empty-suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-block-start: 8px;
  inline-size: 100%;
  /* No narrow cap: a 520px cap put two chips on one line and the third alone, which
     reads as a mistake rather than as three options. */
  max-inline-size: 640px;
}
.empty-why {
  margin: 0;
  color: var(--md-on-surface-variant);
  opacity: 0.9;
}
.suggestion {
  padding: 8px 14px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.suggestion:hover {
  border-color: var(--md-primary);
  color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 6%, transparent);
}

/* ---------- approval ---------- */
.approval {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--md-warning);
  border-radius: var(--md-shape-large);
  background: var(--md-warning-container);
  color: var(--md-on-warning-container);
}
.approval-head { display: flex; align-items: center; gap: 8px; }
.approval-mark {
  display: grid;
  place-items: center;
  inline-size: 18px;
  block-size: 18px;
  flex: none;
  border-radius: var(--md-shape-full);
  background: var(--md-warning);
  color: var(--md-on-warning);
  font: var(--md-type-label-small-font);
  font-weight: 700;
}
.approval-tool {
  margin-inline-start: auto;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: color-mix(in srgb, var(--md-on-warning-container) 10%, transparent);
}
.approval-args {
  margin: 0;
  padding: 8px 10px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  overflow-x: auto;
}
.approval-args code {
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
.approval-why { margin: 0; opacity: 0.85; }
.approval-actions { display: flex; gap: 8px; margin-block-start: 2px; }
.approval-btn {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: var(--md-shape-full);
  cursor: pointer;
  transition:
    background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat),
    border-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.approval-btn.is-allow {
  background: var(--md-primary);
  color: var(--md-on-primary);
}
.approval-btn.is-allow:hover { background: color-mix(in srgb, var(--md-primary) 88%, #000); }
.approval-btn.is-deny {
  border-color: var(--md-on-warning-container);
  background: transparent;
  color: var(--md-on-warning-container);
}
.approval-btn.is-deny:hover {
  background: color-mix(in srgb, var(--md-on-warning-container) 8%, transparent);
}

/* ---------- notice + queue + attachments ---------- */
/* A notice is transient, so it must not resize the composer when it appears — it floats
   over the page just above the composer, the same relationship a snackbar has to the
   content behind it. In flow it pushed the composer up by 40px for three seconds. */
.notice {
  position: absolute;
  inset-inline: 16px;
  /* Sits fully above `.composer-box`. `100%` is the composer's height, and the box starts
     2px below the composer's top edge (its padding), so the notice's bottom edge is
     placed at `100% + 2px` and then lifted by the 8px gap. */
  inset-block-end: calc(100% + 2px + 8px);
  margin: 0;
  padding: 8px 14px;
  border-radius: var(--md-shape-full);
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  box-shadow: var(--md-elevation-2);
  animation: notice-in var(--md-spring-expressive-fast-spatial-dur) var(--md-spring-soft);
}
@keyframes notice-in {
  from { opacity: 0; translate: 0 6px; }
  to { opacity: 1; translate: 0 0; }
}
.queue {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-block-end: 8px;
  color: var(--md-on-surface-variant);
}
.queue-label { margin-inline-end: 2px; }
.queue-item {
  padding: 2px 8px;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  max-inline-size: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 2px 2px 8px;
}
.attach-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 4px 3px 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  max-inline-size: 220px;
}
.attach-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.attach-size { flex: none; color: var(--md-on-surface-variant); }
.attach-x {
  display: grid;
  place-items: center;
  inline-size: 18px;
  block-size: 18px;
  flex: none;
  border: 0;
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  line-height: 1;
}
.attach-x:hover { background: var(--md-surface-container-highest); color: var(--md-on-surface); }

/* ---------- composer ---------- */
.composer {
  position: relative;
  padding: 2px 16px 14px;
  flex: none;
}
.composer-box {
  padding: 10px 10px 8px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-xl);
  background: var(--md-surface-container);
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.composer-box:focus-within { border-color: var(--md-primary); background: var(--md-surface-container-high); }
.composer-input {
  inline-size: 100%;
  min-block-size: 40px;
  max-block-size: 180px;
  padding: 4px 6px;
  border: 0;
  background: transparent;
  color: var(--md-on-surface);
  resize: none;
  box-sizing: border-box;
  field-sizing: content;
  font: var(--md-type-body-large-font);
  letter-spacing: var(--md-type-body-large-tracking);
}
.composer-input::placeholder { color: var(--md-on-surface-variant); }
.composer-input:focus { outline: none; }

.composer-row { display: flex; align-items: center; gap: 8px; }
.composer-spacer { flex: 1; }

/* Agent type chip: reads as a field, not as a mode switch. */
.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.type-chip:hover { border-color: var(--md-outline); color: var(--md-on-surface); }
.chip-caret { display: inline-block; transition: rotate var(--md-spring-expressive-fast-spatial-dur) var(--md-spring-soft); }
.chip-caret.is-open { rotate: 180deg; }

.strategy-hint { margin: 6px 2px 0; color: var(--md-on-surface-variant); }

.send {
  transition:
    transform var(--md-spring-expressive-fast-spatial-dur) var(--md-spring-bounce),
    background-color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat),
    color var(--md-spring-expressive-default-effects-dur) var(--md-spring-flat);
}
.send.is-ready { transform: scale(1.04); }

/* ---------- dock ---------- */
.col-dock { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-block: 10px; }

/* ---------- agent type sheet ---------- */
.sheet-scrim {
  position: fixed;
  inset: 0;
  /* Transparent: a light-dismiss surface, not a modal that dims the page. */
  background: transparent;
  z-index: 40;
}
.type-sheet {
  position: fixed;
  /* Anchored to the chip, not to the viewport corner: opening above the chip keeps the
     composer's trailing controls (strategy, stop, send) uncovered, which is what a
     popover is for. Left-aligned to the chip so the two read as one control. */
  inset-inline-start: var(--sheet-anchor-x, 340px);
  inset-block-end: var(--sheet-anchor-y, 92px);
  z-index: 41;
  inline-size: 300px;
  padding: 8px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container-high);
  box-shadow: var(--md-elevation-3);
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: sheet-in var(--md-spring-expressive-default-spatial-dur) var(--md-spring-soft);
}
@keyframes sheet-in {
  from { opacity: 0; translate: 0 8px; }
  to { opacity: 1; translate: 0 0; }
}
.sheet-title { margin: 4px 8px 6px; color: var(--md-on-surface-variant); }
.type-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 10px;
  border: 0;
  border-radius: var(--md-shape-medium);
  background: transparent;
  text-align: start;
  cursor: pointer;
  transition: background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.type-option.is-active { background: var(--md-secondary-container); }
.type-name { color: var(--md-on-surface); }
.type-option.is-active .type-name { color: var(--md-on-secondary-container); }
.type-desc { color: var(--md-on-surface-variant); }
.type-check {
  position: absolute;
  inset-inline-end: 10px;
  inset-block-start: 10px;
  inline-size: 16px;
  block-size: 16px;
  color: var(--md-primary);
}
.type-option.is-active .type-check { color: var(--md-on-secondary-container); }

/* ---------- floating panel contents ---------- */
.browser-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  flex: none;
  border-block-end: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-low);
}
.url {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 8px;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface-variant);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
}
.browser-fps { flex: none; color: var(--md-on-surface-variant); }
.browser-canvas {
  flex: 1;
  min-block-size: 0;
  display: grid;
  place-items: center;
  padding: 12px;
  background: var(--md-surface-container-lowest);
}
.browser-mock {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-inline-size: 340px;
  padding: 14px;
  border: 1px dashed var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  color: var(--md-on-surface-variant);
  text-align: center;
}
.browser-mock p { margin: 0; }

/* --- tree --- */
.tree { margin: 0; padding: 6px 0; list-style: none; }
.tree-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-block: 3px;
  padding-inline-end: 8px;
  color: var(--md-on-surface-variant);
  cursor: default;
}
.tree-row:hover { background: color-mix(in srgb, var(--md-on-surface) 5%, transparent); }
.tree-row.is-dir { color: var(--md-on-surface); }
.tree-row.is-active { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.tree-caret {
  inline-size: 10px;
  flex: none;
  opacity: 0.6;
}
.tree-name { flex: 1; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-mark { flex: none; color: var(--md-warning); }

/* --- file editor --- */
.file-bar { padding: 8px 10px 4px; flex: none; }
.code {
  flex: 1;
  min-block-size: 0;
  overflow: auto;
  padding-block: 4px 8px;
  background: var(--md-surface-container-lowest);
}
.code-line {
  display: flex;
  gap: 8px;
  padding-inline: 10px;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
  white-space: pre;
}
.code-no {
  inline-size: 24px;
  flex: none;
  text-align: end;
  color: var(--md-on-surface-variant);
  opacity: 0.5;
  font-variant-numeric: tabular-nums;
}
.code-sign { inline-size: 8px; flex: none; }
.code-text { flex: 1; }
.code-line.is-add { background: var(--md-success-container); }
.code-line.is-add .code-sign { color: var(--md-on-success-container); }
.code-line.is-del { background: var(--md-error-container); }
.code-line.is-del .code-sign { color: var(--md-on-error-container); }

/* --- terminal --- */
.term {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-block-size: 0;
  background: var(--md-inverse-surface);
}
.term-out {
  flex: 1;
  min-block-size: 0;
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  color: var(--md-inverse-on-surface);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
  white-space: pre-wrap;
}
.term-input {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 10px;
  flex: none;
}
.term-prompt { color: var(--md-primary); font-family: ui-monospace, monospace; }
.term-field {
  flex: 1;
  min-inline-size: 0;
  border: 0;
  background: transparent;
  color: var(--md-inverse-on-surface);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
}
.term-field:focus { outline: none; }
.term-field::placeholder { color: color-mix(in srgb, var(--md-inverse-on-surface) 50%, transparent); }

/* --- git --- */
.git-list { margin: 0; padding: 6px 0; list-style: none; }
.git-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
}
.git-status {
  inline-size: 16px;
  flex: none;
  text-align: center;
  font-weight: 700;
  font-family: ui-monospace, monospace;
}
.git-status.is-add { color: var(--md-success); }
.git-status.is-mod { color: var(--md-warning); }
.git-path {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
}

/* --- usage --- */
.usage-wrap { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.usage-head { display: flex; align-items: center; gap: 14px; }
.usage-total { display: flex; flex-direction: column; gap: 1px; }
.usage-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.usage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-block: 4px;
  color: var(--md-on-surface-variant);
}
.usage-label { flex: 1; min-inline-size: 0; }
.usage-tokens { flex: none; font-variant-numeric: tabular-nums; }
.usage-bar {
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: 0;
  block-size: 2px;
  border-radius: var(--md-shape-full);
  background: var(--md-primary);
}

/* ---------- permission ---------- */
.perm-badge {
  margin-inline-start: 6px;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-error-container);
  color: var(--md-on-error-container);
}
.hint-warn { color: var(--md-error); }

.new-task-gap { margin-block-start: 4px; }
.perm-choice {
  display: flex;
  /* Side by side: stacked cards with a description each took 150px, which pushed the
     list off the bottom of a 900px window. Two compact choices fit one row; the
     description stays as the accessible label. */
  gap: 6px;
}
.perm-card {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1 1 0;
  min-inline-size: 0;
  padding: 6px 9px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: transparent;
  text-align: start;
  cursor: pointer;
  color: var(--md-on-surface-variant);
  transition:
    border-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat),
    background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.perm-card .md-type-label-large { color: var(--md-on-surface); }
.perm-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.perm-card:hover { border-color: var(--md-outline); }
.perm-card.is-active {
  border-color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 8%, transparent);
}
.perm-card.is-active .md-type-label-large { color: var(--md-primary); }
/* Full access is not a preference, it is a risk: state it in the error role so it cannot
   be mistaken for the safe default once selected. */
.perm-card.is-danger.is-active {
  border-color: var(--md-error);
  background: var(--md-error-container);
}
.perm-card.is-danger.is-active .md-type-label-large,
.perm-card.is-danger.is-active .md-type-label-small {
  color: var(--md-on-error-container);
}

/* ---------- responsive: the sidebar yields first ---------- */
@media (max-width: 1240px) {
  .plug { grid-template-columns: 248px minmax(0, 1fr) 52px; }
}
@media (max-width: 1080px) {
  .plug { grid-template-columns: 212px minmax(0, 1fr) 52px; }
  .row-meta { display: none; }
}
@media (max-width: 940px) {
  .plug { grid-template-columns: 76px minmax(0, 1fr) 52px; padding-inline-start: 0; }
  .col-side { padding: 8px 6px; }
  .side-switch, .conn, .search, .side-note, .group-name, .group-count, .caret,
  .new-task > span, .task-top, .task-progress { display: none; }
  .row { justify-content: center; padding: 6px 4px; }
  .row-title { max-inline-size: 44px; font: var(--md-type-label-small-font); }
  .task-row { align-items: center; padding: 8px 4px; }
}
</style>