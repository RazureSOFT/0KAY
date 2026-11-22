<script setup lang="ts">
/**
 * The task view: ten-ish tabs, and three task kinds that do not look the same.
 *
 * **Planner rounds are separate sessions, not one long list.** In the real page a planner
 * round opens as its own conversation, filtered from the activity stream by round:
 *
 *     activity.filter(entry => entry.round === openedSession.round)
 *             .filter(entry => ['operator','planner','fact','finding','intent'].includes(entry.kind))
 *
 * The 计划评审 tab is a *summary across rounds*; each round is also a lane you can open,
 * read, and steer with its own composer. Stacking every round in one panel — the earlier
 * version — made three rounds read as one plan that kept changing.
 *
 * **The three kinds have different goals, so different sub-pages.** From the planner
 * prompts in `agent/src/analysis/recon/loop.ts`:
 *
 *   recon        prove facts about a target. Steps: enumerate → fingerprint → compare →
 *                verify. Evidence is a finding; progress is coverage.
 *   engineering  bring a system to a state. Steps: read → baseline → change one thing →
 *                verify. Evidence is a diff that passed its check, and a baseline exists
 *                so "did the change work" is answerable.
 *   craft        approach an original by rebuilding it. Steps: study → build → compare →
 *                ready. Evidence is a comparison score, one difference per round.
 *
 * The vocabulary is what makes a sub-page belong to its kind: 发现 / 图谱 / 覆盖 are recon,
 * 改动 / 基线 / 回归 are engineering, 阶段 / 差异清单 / 相似度 are craft. A recon page on
 * an engineering task is not "generic", it is wrong.
 */
import { ref, computed } from 'vue'
import Tabs from '../src/md/Tabs.vue'
import ButtonGroup from '../src/md/ButtonGroup.vue'
import LoadingIndicator from '../src/md/LoadingIndicator.vue'
import ProgressIndicator from '../src/md/ProgressIndicator.vue'
import DiffStat from '../src/md/DiffStat.vue'
import MarkdownContent from '@webui/components/MarkdownContent.vue'

type Kind = 'recon' | 'engineering' | 'craft'
type LaneKind = 'main' | 'planner' | 'retest' | 'worker'

interface Lane {
  id: string
  kind: LaneKind
  num: string
  title: string
  status: string
  round?: number
}

const props = defineProps<{
  task: { objective: string; kind: string; status: string; met: number; total: number }
}>()

const emit = defineEmits<{ (event: 'back'): void }>()

/**
 * Normalise a task kind to the internal union.
 *
 * The task list carries the *display* label (侦察 / 工程 / 复刻) because that is what the
 * sidebar shows, while the union here is `recon | engineering | craft`. Passing the label
 * straight through made `TAB_SETS[kind]` undefined, which rendered a tab bar with zero
 * buttons — an empty tablist with only the indicator, and no error to explain it.
 *
 * Both spellings are accepted so either side of the boundary can be the source of truth.
 */
const KIND_ALIASES: Record<string, Kind> = {
  recon: 'recon', 侦察: 'recon',
  engineering: 'engineering', 工程: 'engineering',
  craft: 'craft', 复刻: 'craft',
}

function normalizeKind(value: unknown): Kind {
  return KIND_ALIASES[String(value ?? '')] || 'recon'
}

/**
 * The demo exposes the kind as a switch so all three families can be inspected in one
 * page. On the real page the kind is fixed by the task.
 */
const kind = ref<Kind>(normalizeKind(props.task.kind))
const kindChoices = [
  { id: 'recon', label: '侦察', tone: 'ghost' as const },
  { id: 'engineering', label: '工程', tone: 'ghost' as const },
  { id: 'craft', label: '复刻', tone: 'ghost' as const },
]

const objectives: Record<Kind, string> = {
  recon: '对 dsh 目标做端口与服务取证',
  engineering: '改造 gateway 的会话落库',
  craft: '复刻 0kay 的侧栏交互',
}
const objective = computed(() => objectives[kind.value])

const PROGRESS_INFO: Record<Kind, { status: string; met: number; total: number }> = {
  recon: { status: 'running', met: 4, total: 11 },
  engineering: { status: 'running', met: 1, total: 3 },
  craft: { status: 'running', met: 2, total: 3 },
}
/* Guarded: a kind outside the union (or a stale persisted value) must not blank the page. */
const progressInfo = computed(
  () => PROGRESS_INFO[kind.value] || { status: 'running', met: 0, total: 0 },
)

/* ---------------- tab sets per kind ---------------- */
const TAB_SETS: Record<Kind, Array<{ id: string; label: string; badge?: number }>> = {
  recon: [
    { id: 'sessions', label: '会话' },
    { id: 'overview', label: '总览' },
    { id: 'plans', label: '计划评审' },
    { id: 'graph', label: '探索链路' },
    { id: 'board', label: '播报板' },
    { id: 'findings', label: '发现', badge: 4 },
    { id: 'assets', label: '测试资产' },
    { id: 'approvals', label: '拦截审批', badge: 3 },
    { id: 'report', label: '报告' },
  ],
  engineering: [
    { id: 'sessions', label: '会话' },
    { id: 'overview', label: '总览' },
    { id: 'plans', label: '计划评审' },
    { id: 'changes', label: '改动清单', badge: 3 },
    { id: 'regression', label: '回归检查' },
    { id: 'approvals', label: '拦截审批', badge: 1 },
    { id: 'report', label: '报告' },
  ],
  craft: [
    { id: 'sessions', label: '会话' },
    { id: 'overview', label: '总览' },
    { id: 'plans', label: '计划评审' },
    { id: 'craft', label: '复刻' },
    { id: 'diffs', label: '差异清单', badge: 7 },
    { id: 'approvals', label: '拦截审批' },
    { id: 'report', label: '报告' },
  ],
}

const tabs = computed(() => TAB_SETS[kind.value] || TAB_SETS.recon)
const tab = ref('sessions')

function switchKind(next: string) {
  kind.value = normalizeKind(next)
  tab.value = 'sessions'
  opened.value = null
}

/* ================= sessions: four lane types, each rendered differently ================= */
const groups = computed(() => {
  const result: Array<{ id: string; title: string; lanes: Lane[] }> = [
    {
      id: 'main',
      title: '⓿ 主 Agent',
      lanes: [{ id: 'main', kind: 'main', num: '', title: '主 Agent · 编排', status: 'running' }],
    },
    {
      id: 'planner',
      title: '◉ 规划 Planner',
      lanes: [
        { id: 'p3', kind: 'planner', num: '#3', title: '态势研判 · 第 3 轮', status: 'done', round: 3 },
        { id: 'p2', kind: 'planner', num: '#2', title: '态势研判 · 第 2 轮', status: 'done', round: 2 },
        { id: 'p1', kind: 'planner', num: '#1', title: '态势研判 · 第 1 轮', status: 'done', round: 1 },
      ],
    },
  ]

  if (kind.value === 'recon') {
    result.push({
      id: 'retest',
      title: '◍ 复测 Retest',
      lanes: [
        { id: 'r1', kind: 'retest', num: '', title: '复测 · 未鉴权访问会话列表', status: 'done' },
        { id: 'r2', kind: 'retest', num: '', title: '复测 · 符号链接绕过', status: 'running' },
      ],
    })
  }

  const workers: Record<Kind, Lane[]> = {
    recon: [
      { id: 'w1', kind: 'worker', num: '#1', title: '端口与服务枚举', status: 'done' },
      { id: 'w2', kind: 'worker', num: '#2', title: '依赖版本指纹', status: 'done' },
      { id: 'w3', kind: 'worker', num: '#3', title: '已知漏洞比对', status: 'running' },
      { id: 'w4', kind: 'worker', num: '#4', title: '进入路径验证', status: 'blocked' },
      { id: 'w5', kind: 'worker', num: '#5', title: '横向移动可能性', status: 'paused' },
    ],
    engineering: [
      { id: 'w1', kind: 'worker', num: '#1', title: '读 sessions 落库与查询路径', status: 'done' },
      { id: 'w2', kind: 'worker', num: '#2', title: '跑既有 12 个用例记基线', status: 'done' },
      { id: 'w3', kind: 'worker', num: '#3', title: '查询加 executor 过滤', status: 'running' },
      { id: 'w4', kind: 'worker', num: '#4', title: '补跨 executor 失败用例', status: 'paused' },
    ],
    craft: [
      { id: 'w1', kind: 'worker', num: '#1', title: '采集侧栏三宽度原样', status: 'done' },
      { id: 'w2', kind: 'worker', num: '#2', title: '重建侧栏结构与配色', status: 'done' },
      { id: 'w3', kind: 'worker', num: '#3', title: '修 768px 下的间距差', status: 'running' },
      { id: 'w4', kind: 'worker', num: '#4', title: '重跑三宽度比对', status: 'blocked' },
    ],
  }
  result.push({ id: 'worker', title: '((•)) Workers', lanes: workers[kind.value] })
  return result
})

const opened = ref<Lane | null>(null)

const LANE_LABEL: Record<LaneKind, string> = {
  main: '控制台',
  planner: '规划会话',
  retest: '重测记录',
  worker: '工具轨迹',
}

const MAIN_TURNS = [
  { from: 'operator', text: '对 dsh 目标做端口与服务取证，重点是 gateway 的鉴权路径。' },
  { from: 'agent', text: '先把范围拆成四项目标，再派 4 个 worker。第 1、2 项已完成。' },
  { from: 'operator', text: '第 4 项卡住了？' },
  { from: 'agent', text: '进入路径验证被一次审批挡住：exec 里包含 rm。已挂起等你确认。' },
]

/** One round's conversation. Each round is its own lane — this is what makes rounds separate. */
const PLANNER_ROUNDS: Record<number, Array<{ from: string; text: string }>> = {
  3: [
    { from: 'agent', text: '第 3 轮：4 项目标里 2 项已证、1 项在位、1 项卡在审批。' },
    { from: 'agent', text: '把「进入路径验证」拆成两步：先确认鉴权边界，再测写入。改 plan 的 s4。' },
    { from: 'operator', text: '别扩大范围，写入只要试一次就够。' },
    { from: 'agent', text: '收到。intents 提交 2 条，s4 拆为 s4a/s4b，不新增目标。' },
  ],
  2: [
    { from: 'agent', text: '第 2 轮：第 1 轮的三个方向都跑完了，第 3 项还没派。' },
    { from: 'agent', text: '但缺一条证伪条件：如果比对全无命中，怎么算这项完成？' },
    { from: 'operator', text: '比对全无命中也是结论，写进发现。' },
  ],
  1: [
    { from: 'agent', text: '第 1 轮：目标拆成 4 步，先派枚举与指纹两条。' },
    { from: 'agent', text: '基线是空的，还没有任何事实。' },
  ],
}

const RETEST_HISTORY = [
  {
    verdict: 'confirmed',
    when: '2026-11-21 16:58',
    summary: '用另一 executor 的 token 仍可列出全部会话',
    evidence: 'GET /api/agent/sessions → 200\n{"sessions":[…14 items…]}',
  },
  { verdict: 'refuted', when: '2026-11-21 15:40', summary: '早期测试用了管理员 token，结论不成立' },
]

const WORKER_TRACES: Record<string, Array<{ tool: string; ok: boolean; action: string; detail?: string }>> = {
  w1: [
    { tool: 'exec', ok: true, action: 'nmap -p- --min-rate 2000 dsh.local', detail: '22/80/443/3000 open' },
    { tool: 'exec', ok: true, action: 'curl -sI http://dsh.local:3000/api/agent/sessions', detail: 'HTTP/1.1 200 · 未带 Authorization 也返回数据' },
  ],
  w2: [
    { tool: 'exec', ok: true, action: 'cat go.sum | wc -l', detail: '128 个依赖' },
    { tool: 'read', ok: true, action: 'core/internal/gateway/agent_sessions.go', detail: 'AgentType 字段在此' },
  ],
  w3: [
    { tool: 'exec', ok: true, action: 'semgrep --config p/golang core/internal/gateway', detail: '3 条待人工确认' },
    { tool: 'step', ok: true, action: '比对结论需要人工复核' },
  ],
  w4: [{ tool: 'exec', ok: false, action: 'rm -rf .run/tmp && go clean -cache', detail: '等待审批' }],
  w5: [{ tool: 'step', ok: true, action: '已暂停：等待第 4 项结论' }],
}

const FALLBACK_TRACE = [
  { tool: 'read', ok: true, action: 'core/internal/gateway/agent_sessions.go', detail: '3780 行' },
  { tool: 'grep', ok: true, action: 'AgentType', detail: '找到 2 处' },
  { tool: 'exec', ok: false, action: 'go test ./...', detail: '1 个用例失败：sessions 归属' },
]

function laneTrace(laneId: string) {
  return WORKER_TRACES[laneId] || FALLBACK_TRACE
}

/* ================= overview ================= */
const goalsByKind = computed(() => ({
  recon: [
    { text: '端口与服务枚举', met: true },
    { text: '依赖版本指纹', met: true },
    { text: '已知漏洞比对', met: false },
    { text: '进入路径验证', met: false },
  ],
  engineering: [
    { text: '会话列表按 executor 过滤', met: true },
    { text: '归属断言有测试覆盖', met: false },
    { text: '既有 12 个用例不回归', met: false },
  ],
  craft: [
    { text: '三宽度原样采集完成', met: true },
    { text: '侧栏结构与配色一致', met: true },
    { text: '768px 间距差归零', met: false },
  ],
}[kind.value]))

const intents = computed(() => ({
  recon: ['确认 /api/agent/sessions 的鉴权边界', '核实 file/raw 的符号链接处理', '判断 empty dir 返回 500 是否可被利用'],
  engineering: ['加 executor 归属断言', '为断言补一个失败用例', '跑 sessions 相关的 12 个既有用例'],
  craft: ['量 768px 下 search 与 filter 的间距', '改一处分隔线颜色', '重跑三宽度比对并读差异清单'],
}[kind.value]))

const progressPct = computed(() => {
  if (kind.value === 'recon') return Math.round((4 / 11) * 100)
  if (kind.value === 'engineering') return Math.round((changes.filter((c) => c.state === 'done').length / changes.length) * 100)
  return Math.round((craftChecks.value.filter((c) => c.pass).length / craftChecks.value.length) * 100)
})

const progressLabel = computed(() => {
  if (kind.value === 'recon') return '4 / 11 已测'
  if (kind.value === 'engineering') return `${changes.filter((c) => c.state === 'done').length} / ${changes.length} 已改完`
  return `${craftChecks.value.filter((c) => c.pass).length} / ${craftChecks.value.length} 检查项达标`
})

/* ================= plans ================= */
const reviews = computed(() => {
  const recon = [
    {
      round: 3,
      verdict: 'approved',
      revised: true,
      revision: '第 3 轮把「进入路径验证」拆成两步：先确认鉴权，再测写入。',
      steps: [
        { id: 's1', text: '枚举端口与服务', needs: [] as string[] },
        { id: 's2', text: '指纹依赖与版本', needs: ['s1'] },
        { id: 's3', text: '比对已知漏洞', needs: ['s2'] },
        { id: 's4a', text: '确认鉴权边界', needs: ['s3'] },
        { id: 's4b', text: '测一次写入', needs: ['s4a'] },
      ],
      dimensions: [
        { id: 'D1', verdict: 'pass', note: '目标可验证' },
        { id: 'D2', verdict: 'pass', note: '步骤有序' },
        { id: 'D3', verdict: 'warn', note: '第 4b 步成本偏高' },
      ],
    },
    {
      round: 2,
      verdict: 'revise',
      revised: false,
      revision: '第 2 轮：缺少对写入路径的证伪条件。',
      steps: [
        { id: 's1', text: '枚举端口与服务', needs: [] as string[] },
        { id: 's2', text: '指纹依赖与版本', needs: ['s1'] },
        { id: 's3', text: '比对已知漏洞', needs: ['s2'] },
      ],
      dimensions: [
        { id: 'D1', verdict: 'pass', note: '目标可验证' },
        { id: 'D2', verdict: 'fail', note: '未给出证伪条件' },
      ],
    },
  ]

  if (kind.value === 'engineering') {
    return [
      {
        round: 2,
        verdict: 'approved',
        revised: true,
        revision: '第 2 轮加上「先建基线」：改之前先跑一遍现有用例，否则无法判断改动生效。',
        steps: [
          { id: 's1', text: '读 sessions 落库与查询路径', needs: [] as string[] },
          { id: 's2', text: '跑既有 12 个用例，记下基线', needs: ['s1'] },
          { id: 's3', text: '查询里加 executor 过滤', needs: ['s2'] },
          { id: 's4', text: '补一个跨 executor 失败用例', needs: ['s3'] },
          { id: 's5', text: '重跑 13 个用例，与基线对比', needs: ['s4'] },
        ],
        dimensions: [
          { id: 'D1', verdict: 'pass', note: '每步都有验证方式' },
          { id: 'D2', verdict: 'pass', note: '一处改动只改一处行为' },
          { id: 'D3', verdict: 'pass', note: '有可回退基线' },
        ],
      },
      {
        round: 1,
        verdict: 'revise',
        revised: false,
        revision: '第 1 轮：直接开始改，没有基线，改完无法判断是否生效。',
        steps: [
          { id: 's1', text: '查询里加 executor 过滤', needs: [] as string[] },
          { id: 's2', text: '跑测试', needs: ['s1'] },
        ],
        dimensions: [
          { id: 'D1', verdict: 'fail', note: '没有基线' },
          { id: 'D2', verdict: 'warn', note: '「跑测试」不可判定' },
        ],
      },
    ]
  }

  if (kind.value === 'craft') {
    return [
      {
        round: 7,
        verdict: 'approved',
        revised: true,
        revision: '第 7 轮只修 768px 下的 search 间距，不动其它。',
        steps: [
          { id: 's1', text: '采集原样（三宽度）', needs: [] as string[] },
          { id: 's2', text: '重建结构与配色', needs: ['s1'] },
          { id: 's3', text: '逐宽度比对出差异清单', needs: ['s2'] },
          { id: 's4', text: '一条意图修一项差异', needs: ['s3'] },
          { id: 's5', text: '重跑比对直到差异清零', needs: ['s4'] },
        ],
        dimensions: [
          { id: 'D1', verdict: 'pass', note: '观察在构建之前' },
          { id: 'D2', verdict: 'warn', note: '一轮改一项，轮次会多' },
        ],
      },
      {
        round: 6,
        verdict: 'revise',
        revised: false,
        revision: '第 6 轮想一次改配色 + 布局 + 字体，比对时分不清是谁生效。',
        steps: [
          { id: 's1', text: '采集原样', needs: [] as string[] },
          { id: 's2', text: '一次改配色与布局', needs: ['s1'] },
        ],
        dimensions: [{ id: 'D1', verdict: 'fail', note: '一次改多处，无法归因' }],
      },
    ]
  }

  return recon
})

function openRound(round: number) {
  opened.value = {
    id: `p${round}`,
    kind: 'planner',
    num: `#${round}`,
    title: `态势研判 · 第 ${round} 轮`,
    status: 'done',
    round,
  }
  tab.value = 'sessions'
}

/* ================= graph (recon) ================= */
interface GraphNode { id: string; kind: string; status: string; l1: string; l2: string; x: number; y: number }
const NODE_W = 132
const NODE_H = 38

const nodes: GraphNode[] = [
  { id: 'g1', kind: 'goal', status: 'met', l1: '端口与服务', l2: '4 项已完成', x: 0, y: 0 },
  { id: 'g2', kind: 'goal', status: 'met', l1: '依赖指纹', l2: '12 个包', x: 176, y: 0 },
  { id: 'g3', kind: 'goal', status: 'open', l1: '漏洞比对', l2: '进行中', x: 352, y: 0 },
  { id: 'f1', kind: 'finding', status: 'confirmed', l1: '会话列表未鉴权', l2: 'high', x: 88, y: 78 },
  { id: 'f2', kind: 'finding', status: 'pending', l1: '符号链接绕过', l2: 'medium', x: 264, y: 78 },
  { id: 'a1', kind: 'asset', status: 'tested', l1: '/api/agent/sessions', l2: 'HTTP', x: 176, y: 156 },
  { id: 'f3', kind: 'finding', status: 'pending', l1: '空目录返回 500', l2: 'low', x: 352, y: 156 },
]

const edges = [
  { from: 'g1', to: 'f1', rel: 'supports', label: '支持' },
  { from: 'g2', to: 'f2', rel: 'supports', label: '支持' },
  { from: 'g3', to: 'f3', rel: 'supports', label: '支持' },
  { from: 'f1', to: 'a1', rel: 'evidence', label: '证据' },
  { from: 'f2', to: 'a1', rel: 'refutes', label: '反证' },
  { from: 'a1', to: 'f3', rel: 'evidence', label: '证据' },
]

function edgePath(edge: { from: string; to: string }) {
  const from = nodes.find((n) => n.id === edge.from)
  const to = nodes.find((n) => n.id === edge.to)
  if (!from || !to) return ''
  const x1 = from.x + NODE_W / 2
  const y1 = from.y + NODE_H
  const x2 = to.x + NODE_W / 2
  const y2 = to.y
  const mid = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`
}

function edgeLabelX(edge: { from: string; to: string }) {
  const from = nodes.find((n) => n.id === edge.from)
  const to = nodes.find((n) => n.id === edge.to)
  return from && to ? (from.x + to.x) / 2 + NODE_W / 2 : 0
}
function edgeLabelY(edge: { from: string; to: string }) {
  const from = nodes.find((n) => n.id === edge.from)
  const to = nodes.find((n) => n.id === edge.to)
  return from && to ? (from.y + NODE_H + to.y) / 2 : 0
}

const zoom = ref(1)
const pan = ref({ x: 20, y: 10 })
let panning: { x: number; y: number; base: { x: number; y: number } } | null = null

function onCanvasDown(event: PointerEvent) {
  panning = { x: event.clientX, y: event.clientY, base: { ...pan.value } }
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}
function onCanvasMove(event: PointerEvent) {
  if (!panning) return
  pan.value = {
    x: panning.base.x + (event.clientX - panning.x),
    y: panning.base.y + (event.clientY - panning.y),
  }
}
function onCanvasUp() {
  panning = null
}
function onWheel(event: WheelEvent) {
  event.preventDefault()
  zoom.value = Math.min(2.5, Math.max(0.4, zoom.value * (event.deltaY > 0 ? 0.9 : 1.1)))
}
function fit() {
  zoom.value = 1
  pan.value = { x: 20, y: 10 }
}

const graphW = computed(() => Math.ceil(Math.max(...nodes.map((n) => n.x)) + NODE_W + 40))
const graphH = computed(() => Math.ceil(Math.max(...nodes.map((n) => n.y)) + NODE_H + 40))

/* ================= board (recon) ================= */
const board = [
  { kind: 'plan', text: '第 3 轮计划通过，进入执行', round: 3 },
  { kind: 'worker', text: 'Worker #1 完成端口枚举，4 个端口开放', round: 3 },
  { kind: 'worker', text: 'Worker #2 完成依赖指纹，12 个包', round: 3 },
  { kind: 'finding', text: '新发现：会话列表未校验 executor 归属（high）', round: 3 },
  { kind: 'approval', text: 'Worker #4 请求执行 exec，等待确认', round: 3 },
  { kind: 'worker', text: 'Worker #3 开始漏洞比对', round: 3 },
  { kind: 'system', text: '上下文用量达到 62%，暂未压缩', round: 2 },
]

/* ================= findings (recon) ================= */
const findings = ref([
  {
    id: 'f1',
    text: 'gateway 的会话列表未校验 executor 归属',
    assets: ['/api/agent/sessions', 'HTTP GET'],
    open: true,
    retests: RETEST_HISTORY,
  },
  { id: 'f2', text: 'file/raw 对符号链接未做解析后再判定', assets: ['/api/agent/file', 'path traversal'], open: false, retests: [] },
  { id: 'f3', text: 'tree 接口在空目录返回 500 而非空数组', assets: ['/api/agent/workspaces'], open: false, retests: [] },
  { id: 'f4', text: '会话列表响应未设置 Cache-Control: no-store', assets: ['/api/agent/sessions'], open: false, retests: [] },
])

/* ================= assets (recon) ================= */
const assetsTested = [
  { kind: 'http', key: '/api/agent/sessions' },
  { kind: 'http', key: '/api/agent/messages' },
  { kind: 'file', key: '/file/raw' },
  { kind: 'http', key: '/api/agent/workspaces' },
]
const assetsUntested = [
  { kind: 'http', key: '/api/agent/exec' },
  { kind: 'http', key: '/api/agent/compact' },
  { kind: 'file', key: '/file/list' },
  { kind: 'ws', key: '/ws/agent' },
  { kind: 'http', key: '/api/agent/browser/action' },
]
const assetPct = Math.round((assetsTested.length / (assetsTested.length + assetsUntested.length)) * 100)

/* ================= changes + regression (engineering) ================= */
const changes = [
  { id: 'c1', path: 'core/internal/gateway/agent_sessions.go', added: 14, removed: 3, state: 'done', why: '查询加 executor 过滤' },
  { id: 'c2', path: 'core/internal/gateway/agent_sessions_test.go', added: 28, removed: 0, state: 'running', why: '补跨 executor 的失败用例' },
  { id: 'c3', path: 'core/internal/gateway/agent_extensions.go', added: 2, removed: 2, state: 'blocked', why: '改错误码，等审批' },
]

const regression = [
  { name: 'sessions · 归属过滤', before: 'fail', after: 'pass' },
  { name: 'sessions · 列表分页', before: 'pass', after: 'pass' },
  { name: 'sessions · 空结果', before: 'pass', after: 'pass' },
  { name: 'gateway · 鉴权中间件', before: 'pass', after: 'pass' },
  { name: 'gateway · 错误码一致性', before: 'pass', after: 'pass' },
  { name: 'extensions · 加载', before: 'pass', after: 'pass' },
]
const regressionFixed = regression.filter((r) => r.before !== 'pass' && r.after === 'pass').length
const regressionBroken = regression.filter((r) => r.before === 'pass' && r.after !== 'pass').length

/* ================= craft =================
 *
 * Craft studies **something observable** and rebuilds it (`tasks.ts:136`), not "a web
 * page". The backend carries only `targets: string[]`, with no target-type field, so the
 * UI has to let the kind of thing being rebuilt change what "check" means:
 *
 *   web   three widths · element/text/layout · screenshot pixels
 *   gui   launchability · screenshot similarity · control-tree coverage
 *   cli   stdout verbatim · exit codes · flag coverage
 *   api   body/headers/status · timing
 *
 * The shared spine — study → build → check → ready, the scores, the difference list —
 * stays the same. Only the checks and the diff dimensions change. Three-width checks on a
 * CLI are not "generic", they are meaningless.
 */
const craftTarget = ref<'web' | 'gui' | 'cli' | 'api'>('web')
const craftTargetItems = [
  { id: 'web', label: '网页', tone: 'ghost' as const },
  { id: 'gui', label: '桌面程序', tone: 'ghost' as const },
  { id: 'cli', label: '命令行', tone: 'ghost' as const },
  { id: 'api', label: '接口', tone: 'ghost' as const },
]

const craftTargetLabel = computed(
  () =>
    ({
      web: '网页 / Web 应用',
      gui: '桌面可执行文件',
      cli: '命令行可执行文件',
      api: 'HTTP 接口',
    })[craftTarget.value],
)

/** What gets compared. Only this changes between target types. */
const craftChecks = computed(() => {
  const table = {
    web: [
      { key: '360 px', a: '元素 96%', b: '截图 92%', c: '差异 4', pass: true },
      { key: '768 px', a: '元素 95%', b: '截图 90%', c: '差异 7', pass: false },
      { key: '1280 px', a: '元素 97%', b: '截图 93%', c: '差异 3', pass: true },
    ],
    gui: [
      { key: '启动', a: '耗时 1.2s', b: '无崩溃', c: '窗口 3', pass: true },
      { key: '截图', a: '相似度 93%', b: '区域 12', c: '差异 5', pass: false },
      { key: '控件树', a: '覆盖 88%', b: '缺失 6', c: '状态 2', pass: false },
    ],
    cli: [
      { key: '--help', a: 'stdout 逐字 100%', b: '退出码 0', c: '差异 0', pass: true },
      { key: 'build', a: 'stdout 逐字 97%', b: '退出码 1', c: '差异 3', pass: false },
      { key: '--version', a: 'stdout 逐字 100%', b: '退出码 0', c: '差异 0', pass: true },
    ],
    api: [
      { key: 'GET /sessions', a: 'body 96%', b: '状态 200', c: '头部差 1', pass: true },
      { key: 'POST /messages', a: 'body 91%', b: '状态 201', c: '时序 +40ms', pass: false },
      { key: 'GET /workspaces', a: 'body 94%', b: '状态 200', c: '头部差 0', pass: true },
    ],
  }
  return table[craftTarget.value]
})

/** The three column headings of the check table, which also move with the surface. */
const craftCheckHeads = computed(
  () =>
    ({
      web: ['宽度', '元素', '截图', '差异'],
      gui: ['检查项', '结果', '覆盖', '差异'],
      cli: ['命令', '输出', '退出码', '差异'],
      api: ['端点', '响应体', '状态', '差异'],
    })[craftTarget.value],
)

/** Difference dimensions follow the surface being compared. */
const craftDiffs = computed(() => {
  const table = {
    web: [
      { kind: 'spacing', where: '768px', path: '.sidebar > .search', values: '8px → 12px', delta: 4 },
      { kind: 'color', where: '768px', path: '.tool-card border', values: '#79747E → #CAC4D0', delta: null },
      { kind: 'font', where: '360px', path: '.tab label', values: '14/20 → 14/20', delta: null },
      { kind: 'radius', where: '768px', path: '.composer-box', values: '28px → 24px', delta: 4 },
      { kind: 'spacing', where: '768px', path: '.filter margin-bottom', values: '10px → 14px', delta: 4 },
      { kind: 'color', where: '360px', path: '.session.is-active', values: 'secondary-container → #D9EADB', delta: null },
      { kind: 'layout', where: '768px', path: '.plug columns', values: '268px → 288px', delta: 20 },
    ],
    gui: [
      { kind: 'control', where: '主窗口', path: 'menuBar > File', values: '缺失「导出」', delta: null },
      { kind: 'label', where: '主窗口', path: 'button#save', values: '保存 → 保存(S)', delta: null },
      { kind: 'position', where: '主窗口', path: 'toolbar.y', values: '42 → 48', delta: 6 },
      { kind: 'state', where: '主窗口', path: 'checkbox#auto', values: 'checked → unchecked', delta: null },
      { kind: 'position', where: '设置窗', path: 'panel.width', values: '480 → 460', delta: 20 },
    ],
    cli: [
      { kind: 'stdout', where: 'build', path: '第 3 行', values: '"compiling" → "building"', delta: null },
      { kind: 'exit-code', where: 'build --watch', path: '—', values: '0 → 1', delta: null },
      { kind: 'stderr', where: 'build', path: '第 7 行', values: '缺少 warning 前缀', delta: null },
      { kind: 'flag', where: '--output', path: '—', values: '未实现', delta: null },
      { kind: 'stdout', where: 'init', path: '第 1 行', values: '多余空行', delta: null },
    ],
    api: [
      { kind: 'body', where: 'POST /messages', path: '$.id', values: 'uuid → 自增', delta: null },
      { kind: 'header', where: 'GET /sessions', path: 'cache-control', values: '缺失', delta: null },
      { kind: 'status', where: 'DELETE /sessions', path: '—', values: '204 → 200', delta: null },
      { kind: 'timing', where: 'POST /messages', path: 'p95', values: '120ms → 160ms', delta: 40 },
      { kind: 'body', where: 'GET /workspaces', path: '$[].name', values: '排序不同', delta: null },
    ],
  }
  return table[craftTarget.value]
})

/** The six score cards stay; only their middle labels move with the surface. */
/**
 * The "one difference per round" guidance, in the vocabulary of the surface being
 * compared. The web wording was hard-coded and read as a contradiction on a CLI.
 */
const craftDiffGuidance = computed(
  () =>
    ({
      web: '一条意图修一项差异，改完就能重新比对。把配色 + 布局 + 字体塞进一条，比对时分不清是谁生效。',
      gui: '一条意图修一处差异，改完就能重新比对。把控件缺失 + 标签 + 位置塞进一条，比对时分不清是谁生效。',
      cli: '一条意图修一处差异，改完就能重新比对。把 stdout + 退出码 + 参数塞进一条，比对时分不清是谁生效。',
      api: '一条意图修一处差异，改完就能重新比对。把响应体 + 头部 + 时序塞进一条，比对时分不清是谁生效。',
    })[craftTarget.value],
)

const craftCheckHint = computed(
  () =>
    ({
      web: '三宽度都达标才算收敛；未达标的宽度会单独列出来。',
      gui: '启动、截图、控件树三项都达标才算收敛。',
      cli: '每条命令的 stdout 与退出码都一致才算收敛。',
      api: '每个端点的响应体、头部与时序都一致才算收敛。',
    })[craftTarget.value],
)

const craftScores = computed(() => {
  const compare = {
    web: '元素 / 文字 / 布局',
    gui: '截图 / 控件树',
    cli: 'stdout / 退出码',
    api: 'body / 头部',
  }[craftTarget.value]
  const third = {
    web: '截图',
    gui: '差异区域',
    cli: '参数覆盖',
    api: '时序偏差',
  }[craftTarget.value]
  return [
    { label: '总体相似度', value: '94%' },
    { label: compare, value: '96%' },
    { label: third, value: '91%' },
    { label: '轮次', value: '7' },
    { label: '达标线', value: '95%' },
    { label: '证据可信度', value: '88%' },
  ]
})

const inbox = [
  { text: '侧栏宽度按 284 复刻，别用 288', round: 6 },
  { text: '搜索框圆角用 full', round: 5 },
]

/* ================= approvals + report (shared) ================= */
const approvals = ref([
  { id: 'a1', tool: 'exec', args: 'rm -rf .run/tmp && go clean -cache' },
  { id: 'a2', tool: 'write', args: 'plugin-web/agent/src/AgentsPage.vue' },
  { id: 'a3', tool: 'exec', args: 'git push --force origin main' },
])
const notice = ref('')

function decide(id: string, allow: boolean) {
  approvals.value = approvals.value.filter((a) => a.id !== id)
  notice.value = allow ? '已允许，worker 继续执行' : '已拒绝，worker 会换一种做法'
  window.setTimeout(() => {
    notice.value = ''
  }, 2600)
}

const report = ref('')
const reportBusy = ref(false)

const REPORT_BODY: Record<Kind, string[]> = {
  recon: [
    '## 结论',
    '1. gateway 的 `/api/agent/sessions` 未校验 executor 归属，任何有效 token 可列出全部会话。',
    '2. `file/raw` 未先解析符号链接，可用相对路径读取工作区外的文件。',
    '3. `tree` 在空目录返回 500，错误处理不一致，但未发现直接利用路径。',
    '',
    '## 建议',
    '- 会话列表按 executor 过滤，并加一次归属断言。',
    '- `file/raw` 先 realpath 再判断前缀。',
  ],
  engineering: [
    '## 结论',
    '1. 会话列表已按 executor 过滤，跨 executor 的用例从 fail 转 pass。',
    '2. 既有 12 个用例无回归；错误码一致性有小幅变化，已在 c3 标注。',
    '',
    '## 改动',
    '- `agent_sessions.go`：查询加 executor 过滤（+14 −3）。',
    '- `agent_sessions_test.go`：补跨 executor 失败用例（+28）。',
    '',
    '## 建议',
    '- c3 的错误码改动仍在等审批，合并前需再跑一次回归。',
  ],
  craft: [
    '## 结论',
    '1. 总体相似度 94%，未达 95% 达标线。',
    '2. 360 / 1280 两个宽度已达标；768px 有 7 项差异，主要是间距与配色。',
    '',
    '## 差异（768px）',
    '- `.sidebar > .search` 间距 8px → 12px（差 4px）',
    '- `.composer-box` 圆角 28px → 24px（差 4px）',
    '- `.plug` 列宽 268px → 288px（差 20px）',
    '',
    '## 下一步',
    '- 一条意图修一项差异，修完重跑比对，直到差异清零。',
  ],
}

function generate(save: boolean) {
  reportBusy.value = true
  window.setTimeout(() => {
    report.value = [
      `# ${objective.value}`,
      '',
      `状态：进行中 · 目标 ${progressInfo.value.met}/${progressInfo.value.total}`,
      '',
      ...REPORT_BODY[kind.value],
      save ? '\n（已另存到 D:\\0KAY\\.run\\reports\\task.md）' : '',
    ].join('\n')
    reportBusy.value = false
  }, 600)
}

const emptyReportHint = computed(() => ({
  recon: '报告会把目标、发现和建议汇成一份可保存的文档，附上每条发现的证据原文。',
  engineering: '报告会列出改了什么、每处改动的验证结果、有无回归，以及还没处理的部分。',
  craft: '报告会给出三宽度相似度、未达标的差异清单、以及距收敛还差多少。',
}[kind.value]))
</script>

<template>
  <div class="task-view">
    <header class="tv-head">
      <button type="button" class="tv-back md-type-label-small md-state-layer" @click="emit('back')">← 返回对话</button>
      <div class="tv-title-wrap">
        <div class="tv-title-line">
          <span class="tv-kind md-type-label-small">{{ kindChoices.find((k) => k.id === kind)?.label }}</span>
          <h2 class="tv-title md-type-title-small">{{ objective }}</h2>
        </div>
        <span class="tv-sub md-type-label-small muted">进行中 · 目标 {{ progressInfo.met }}/{{ progressInfo.total }}</span>
      </div>
      <div class="tv-kinds">
        <span class="tv-kinds-label md-type-label-small muted">演示：切换任务类型</span>
        <ButtonGroup :model-value="kind" :items="kindChoices" variant="connected" shape="round" label="任务类型" @update:model-value="switchKind" />
      </div>
    </header>

    <Tabs v-model="tab" :tabs="tabs" variant="primary" label="任务视图" class="tv-tabs" />

    <p v-if="notice" class="tv-notice md-type-label-large" role="status">{{ notice }}</p>

    <div class="tv-body">
      <!-- ============ sessions ============ -->
      <template v-if="tab === 'sessions'">
        <template v-if="!opened">
          <div class="sess-head">
            <span class="md-type-label-large">会话列表</span>
            <span class="md-type-label-small muted">用量 · in 18.4k · out 3.1k</span>
          </div>
          <section v-for="group in groups" :key="group.id" class="sess-group">
            <h5 class="sess-group-title md-type-label-small">{{ group.title }}</h5>
            <button
              v-for="lane in group.lanes"
              :key="lane.id"
              type="button"
              class="sess-row md-state-layer"
              @click="opened = lane"
            >
              <span class="sess-mark" :class="`is-${lane.status}`" aria-hidden="true">
                {{ lane.status === 'done' ? '✓' : lane.status === 'running' ? '⟳' : lane.status === 'blocked' ? '✕' : lane.status === 'paused' ? '❚❚' : '○' }}
              </span>
              <span v-if="lane.num" class="sess-num md-type-label-small">{{ lane.num }}</span>
              <span class="sess-text md-type-body-medium">{{ lane.title }}</span>
              <span class="sess-lane md-type-label-small">{{ LANE_LABEL[lane.kind] }}</span>
              <span v-if="lane.status === 'running'" class="sess-live md-type-label-small">• 实时</span>
            </button>
          </section>
        </template>

        <template v-else>
          <div class="sess-view-head">
            <button type="button" class="sess-back md-state-layer" aria-label="返回会话列表" @click="opened = null">←</button>
            <div class="sess-view-title">
              <b class="md-type-label-large">{{ opened.title }}</b>
              <small class="md-type-label-small muted">
                {{ opened.kind === 'planner' ? `第 ${opened.round} 轮规划会话` : LANE_LABEL[opened.kind] }}
              </small>
            </div>
          </div>

          <template v-if="opened.kind === 'main' || opened.kind === 'planner'">
            <div class="console">
              <div
                v-for="(turn, index) in (opened.kind === 'main' ? MAIN_TURNS : (PLANNER_ROUNDS[opened.round || 1] || []))"
                :key="index"
                class="console-turn"
                :class="`from-${turn.from}`"
              >
                <span class="console-who md-type-label-small">{{ turn.from === 'operator' ? '你' : 'Agent' }}</span>
                <p class="md-type-body-medium">{{ turn.text }}</p>
              </div>
            </div>
            <form class="hint" @submit.prevent>
              <textarea
                class="hint-input md-type-body-medium"
                rows="2"
                :placeholder="opened.kind === 'planner' ? '对这一轮的规划提要求…' : '给主 Agent 提要求…'"
              />
              <button type="submit" class="hint-send md-type-label-large md-state-layer">发送</button>
            </form>
          </template>

          <template v-else-if="opened.kind === 'retest'">
            <ul class="retests">
              <li v-for="(retest, index) in RETEST_HISTORY" :key="index" :class="`is-${retest.verdict}`">
                <span class="retest-verdict md-type-label-small">{{ retest.verdict === 'confirmed' ? '成立' : '不成立' }}</span>
                <span class="retest-when md-type-label-small muted">{{ retest.when }}</span>
                <p class="md-type-body-medium">{{ retest.summary }}</p>
                <pre v-if="retest.evidence" class="retest-evidence md-type-label-small"><code>{{ retest.evidence }}</code></pre>
              </li>
            </ul>
          </template>

          <template v-else>
            <ul class="trace">
              <li v-for="(step, index) in laneTrace(opened.id)" :key="index" class="trace-step" :class="{ fail: !step.ok }">
                <div class="trace-head">
                  <span class="trace-tool md-type-label-small">{{ step.tool }}</span>
                  <span class="trace-status">{{ step.ok ? '✓' : '✕' }}</span>
                </div>
                <pre class="trace-cmd md-type-label-small"><code>{{ step.action }}</code></pre>
                <pre v-if="step.detail" class="trace-out md-type-label-small"><code>{{ step.detail }}</code></pre>
              </li>
            </ul>
            <form class="hint" @submit.prevent>
              <textarea class="hint-input md-type-body-medium" rows="2" placeholder="你的输入会进入整个任务（和主控制台同一个通道）…" />
              <button type="submit" class="hint-send md-type-label-large md-state-layer">发送</button>
            </form>
          </template>
        </template>
      </template>

      <!-- ============ overview ============ -->
      <template v-else-if="tab === 'overview'">
        <section class="block">
          <div class="row-between">
            <span class="md-type-label-large">{{ kind === 'recon' ? '覆盖范围' : kind === 'engineering' ? '改动进度' : '复刻进度' }}</span>
            <span class="md-type-label-small muted">{{ progressLabel }}</span>
          </div>
          <ProgressIndicator :value="progressPct" variant="linear" :shape="kind === 'craft' ? 'wavy' : 'flat'" label="进度" />
        </section>
        <section class="block">
          <h4 class="md-type-label-large">
            {{ kind === 'recon' ? '目标' : kind === 'engineering' ? '验收条件' : '复刻目标' }}
            <b>{{ goalsByKind.filter((g) => g.met).length }}/{{ goalsByKind.length }}</b>
          </h4>
          <ul class="dot-list">
            <li v-for="(goal, index) in goalsByKind" :key="index" class="dot-item md-type-body-medium" :class="{ met: goal.met }">
              <i class="dot" aria-hidden="true" />{{ goal.text }}
            </li>
          </ul>
        </section>
        <section class="block">
          <h4 class="md-type-label-large">
            {{ kind === 'recon' ? '待解意图' : kind === 'engineering' ? '待做改动' : '待修差异' }}
            <b>{{ intents.length }}</b>
          </h4>
          <ul class="dot-list">
            <li v-for="(intent, index) in intents" :key="index" class="dot-item md-type-body-medium">
              <i class="dot" aria-hidden="true" />{{ intent }}
            </li>
          </ul>
        </section>
      </template>

      <!-- ============ plans ============ -->
      <template v-else-if="tab === 'plans'">
        <p class="note md-type-label-small muted">
          每轮是一份独立的规划会话。点开能读当时的推理，也能对它提要求——三轮说的是三件不同的事，不该堆成一份。
        </p>
        <article v-for="review in reviews" :key="review.round" class="plan-card" :class="`is-${review.verdict}`">
          <header class="plan-head">
            <span class="md-type-label-large">第 {{ review.round }} 轮</span>
            <span class="plan-verdict md-type-label-small">{{ review.verdict === 'approved' ? '通过' : '需修改' }}</span>
            <span v-if="review.revised" class="plan-revised md-type-label-small">已修订</span>
            <button type="button" class="plan-open md-type-label-small md-state-layer" @click="openRound(review.round)">
              打开这轮会话 →
            </button>
          </header>
          <ol class="plan-steps">
            <li v-for="step in review.steps" :key="step.id" class="plan-step md-type-body-medium">
              <span class="plan-sid md-type-label-small">{{ step.id }}</span>
              <span>{{ step.text }}</span>
              <i v-if="step.needs.length" class="plan-needs md-type-label-small">← {{ step.needs.join(', ') }}</i>
            </li>
          </ol>
          <ul class="plan-dims">
            <li v-for="dim in review.dimensions" :key="dim.id" :class="`is-${dim.verdict}`">
              <b>{{ dim.id }}</b><span class="md-type-label-small">{{ dim.verdict }}</span><i class="md-type-label-small">{{ dim.note }}</i>
            </li>
          </ul>
          <p class="plan-revision md-type-body-medium">{{ review.revision }}</p>
        </article>
      </template>

      <!-- ============ graph ============ -->
      <template v-else-if="tab === 'graph'">
        <div class="graph-tools">
          <span class="md-type-label-small muted">拖拽平移 · 滚轮缩放</span>
          <span class="graph-spacer" />
          <button type="button" class="graph-btn md-type-label-small md-state-layer" @click="fit">⤢ 适配</button>
          <button type="button" class="graph-btn md-type-label-small md-state-layer" @click="zoom = Math.max(0.4, zoom / 1.2)">−</button>
          <button type="button" class="graph-btn md-type-label-small md-state-layer" @click="zoom = Math.min(2.5, zoom * 1.2)">＋</button>
        </div>
        <div
          class="graph-canvas"
          @pointerdown="onCanvasDown"
          @pointermove="onCanvasMove"
          @pointerup="onCanvasUp"
          @pointercancel="onCanvasUp"
          @wheel="onWheel"
        >
          <svg :width="graphW * zoom + 40" :height="graphH * zoom + 40" role="img" aria-label="探索链路图">
            <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`">
              <path v-for="(edge, index) in edges" :key="index" class="edge" :class="`is-${edge.rel}`" :d="edgePath(edge)" />
              <text
                v-for="(edge, index) in edges"
                :key="`label-${index}`"
                class="edge-label"
                :class="`is-${edge.rel}`"
                :x="edgeLabelX(edge)"
                :y="edgeLabelY(edge)"
              >{{ edge.label }}</text>
              <g
                v-for="node in nodes"
                :key="node.id"
                class="gnode"
                :class="[`is-${node.kind}`, `is-${node.status}`]"
                :transform="`translate(${node.x},${node.y})`"
              >
                <title>{{ node.kind }} · {{ node.status }} — {{ node.l1 }}</title>
                <rect :width="NODE_W" :height="NODE_H" rx="8" />
                <text :y="16"><tspan x="9">{{ node.l1 }}</tspan></text>
                <text :y="29"><tspan x="9">{{ node.l2 }}</tspan></text>
              </g>
            </g>
          </svg>
        </div>
        <div class="graph-legend">
          <span class="lg is-goal">目标</span>
          <span class="lg is-finding">发现</span>
          <span class="lg is-asset">资产</span>
          <span class="lg is-supports">支持</span>
          <span class="lg is-evidence">证据</span>
          <span class="lg is-refutes">反证</span>
        </div>
      </template>

      <!-- ============ board ============ -->
      <template v-else-if="tab === 'board'">
        <ul class="board">
          <li v-for="(entry, index) in board" :key="index" class="board-row">
            <i class="dot" :class="`is-${entry.kind}`" aria-hidden="true" />
            <div>
              <p class="md-type-body-medium">{{ entry.text }}</p>
              <small class="md-type-label-small muted">{{ entry.kind }} · #{{ entry.round }}</small>
            </div>
          </li>
        </ul>
      </template>

      <!-- ============ findings ============ -->
      <template v-else-if="tab === 'findings'">
        <div class="row-between">
          <span class="md-type-label-large">发现 {{ findings.length }}</span>
          <button type="button" class="small-btn md-type-label-small md-state-layer">刷新</button>
        </div>
        <article v-for="finding in findings" :key="finding.id" class="find-card">
          <div class="find-top">
            <span class="find-text md-type-body-medium">{{ finding.text }}</span>
            <button type="button" class="small-btn md-type-label-small md-state-layer">重测</button>
          </div>
          <p v-if="finding.assets.length" class="find-assets md-type-label-small muted">{{ finding.assets.join(' · ') }}</p>
          <button v-if="!finding.open" type="button" class="find-history md-type-label-small md-state-layer" @click="finding.open = true">
            查看重测历史{{ finding.retests.length ? `（${finding.retests.length}）` : '' }}
          </button>
          <ul v-else class="retests">
            <li v-if="!finding.retests.length" class="md-type-label-small muted">还没有重测过。重测会重新跑一次证据采集。</li>
            <li v-for="(retest, index) in finding.retests" :key="index" :class="`is-${retest.verdict}`">
              <span class="retest-verdict md-type-label-small">{{ retest.verdict === 'confirmed' ? '成立' : '不成立' }}</span>
              <span class="retest-when md-type-label-small muted">{{ retest.when }}</span>
              <p class="md-type-body-medium">{{ retest.summary }}</p>
              <pre v-if="retest.evidence" class="retest-evidence md-type-label-small"><code>{{ retest.evidence }}</code></pre>
            </li>
            <li class="md-type-label-small muted">重测只记录结论，不改动原始发现。</li>
          </ul>
        </article>
      </template>

      <!-- ============ assets ============ -->
      <template v-else-if="tab === 'assets'">
        <section class="block">
          <div class="row-between">
            <span class="md-type-label-large">覆盖范围</span>
            <span class="md-type-label-small muted"><b>{{ assetsTested.length }}</b> / {{ assetsTested.length + assetsUntested.length }} 已测</span>
          </div>
          <ProgressIndicator :value="assetPct" variant="linear" label="资产覆盖" />
        </section>
        <section class="block">
          <h4 class="md-type-label-large">已测 <b>{{ assetsTested.length }}</b></h4>
          <ul class="dot-list">
            <li v-for="(asset, index) in assetsTested" :key="index" class="dot-item md-type-body-medium met">
              <i class="dot" aria-hidden="true" /><code class="mono">{{ asset.kind }}:{{ asset.key }}</code>
            </li>
          </ul>
        </section>
        <section class="block">
          <h4 class="md-type-label-large">未测 <b>{{ assetsUntested.length }}</b></h4>
          <ul class="dot-list">
            <li v-for="(asset, index) in assetsUntested" :key="index" class="dot-item md-type-body-medium">
              <i class="dot" aria-hidden="true" /><code class="mono">{{ asset.kind }}:{{ asset.key }}</code>
            </li>
          </ul>
        </section>
      </template>

      <!-- ============ changes (engineering) ============ -->
      <template v-else-if="tab === 'changes'">
        <article v-for="change in changes" :key="change.id" class="change-card">
          <div class="change-top">
            <span class="change-state md-type-label-small" :class="`is-${change.state}`">
              {{ change.state === 'done' ? '已改' : change.state === 'running' ? '进行中' : '等审批' }}
            </span>
            <code class="change-path md-type-label-small">{{ change.path }}</code>
            <DiffStat :added="change.added" :removed="change.removed" />
          </div>
          <p class="change-why md-type-body-medium">{{ change.why }}</p>
        </article>
        <p class="note md-type-label-small muted">
          工程任务的每一步都要有验证方式：改完怎么知道成了。写不出验证的改动，说明方向还没想清楚。
        </p>
      </template>

      <!-- ============ regression (engineering) ============ -->
      <template v-else-if="tab === 'regression'">
        <section class="block">
          <div class="row-between">
            <span class="md-type-label-large">回归对比</span>
            <span class="md-type-label-small muted">
              修复 <b class="ok">{{ regressionFixed }}</b> · 回归 <b :class="regressionBroken ? 'bad' : ''">{{ regressionBroken }}</b>
            </span>
          </div>
          <ul class="reg-list">
            <li v-for="row in regression" :key="row.name" class="reg-row">
              <span class="reg-name md-type-body-medium">{{ row.name }}</span>
              <span class="reg-cell md-type-label-small" :class="row.before === 'pass' ? 'ok' : 'bad'">{{ row.before }}</span>
              <span class="reg-arrow md-type-label-small" aria-hidden="true">→</span>
              <span class="reg-cell md-type-label-small" :class="row.after === 'pass' ? 'ok' : 'bad'">{{ row.after }}</span>
            </li>
          </ul>
        </section>
        <p class="note md-type-label-small muted">
          改动引发的新问题优先于新方向：发现回归就先修回归。
        </p>
      </template>

      <!-- ============ craft ============ -->
      <template v-else-if="tab === 'craft'">
        <ol class="stages">
          <li v-for="stage in stages" :key="stage.id" class="stage" :class="{ done: stage.done, active: stage.active }">
            <i class="stage-dot" aria-hidden="true" />
            <span class="md-type-label-small">{{ stage.label }}</span>
          </li>
        </ol>
        <div class="scores">
          <div v-for="score in craftScores" :key="score.label" class="score">
            <small class="md-type-label-small muted">{{ score.label }}</small>
            <b class="md-type-title-small">{{ score.value }}</b>
          </div>
        </div>
        <section class="block">
          <!-- Craft rebuilds something observable, and what counts as observable is what
               this switches. The spine — stages, scores, difference list — is shared; only
               the checks and their dimensions move. Three widths are meaningful for a web
               page and meaningless for a CLI. -->
          <div class="craft-target">
            <span class="md-type-label-small muted">复刻目标类型</span>
            <ButtonGroup v-model="craftTarget" :items="craftTargetItems" variant="connected" shape="round" label="复刻目标类型" />
            <span class="craft-target-name md-type-label-small">{{ craftTargetLabel }}</span>
          </div>
          <h4 class="md-type-label-large">检查项 <b>{{ craftChecks.length }}</b></h4>
          <ul class="width-rows">
            <li v-for="row in craftChecks" :key="row.key" class="width-row" :class="{ pass: row.pass }">
              <span class="width-tag md-type-label-small">{{ row.key }}</span>
              <span class="md-type-label-small">{{ craftCheckHeads[1] }} <b>{{ row.a }}</b></span>
              <span class="md-type-label-small">{{ craftCheckHeads[2] }} <b>{{ row.b }}</b></span>
              <span class="md-type-label-small">{{ craftCheckHeads[3] }} <b>{{ row.c }}</b></span>
              <span class="width-verdict md-type-label-small">{{ row.pass ? '达标' : '未达标' }}</span>
            </li>
          </ul>
          <p class="md-type-label-small muted">{{ craftCheckHint }}</p>
        </section>
        <section class="block">
          <h4 class="md-type-label-large">变更请求 <b>{{ inbox.length }}</b></h4>
          <ul class="inbox">
            <li v-for="(item, index) in inbox" :key="index" class="inbox-row">
              <span class="md-type-body-medium">{{ item.text }}</span>
              <small class="md-type-label-small muted">#{{ item.round }}</small>
            </li>
          </ul>
        </section>
      </template>

      <!-- ============ diffs (craft) ============ -->
      <template v-else-if="tab === 'diffs'">
        <section class="block">
          <h4 class="md-type-label-large">差异清单 <b>{{ craftDiffs.length }}</b></h4>
          <p class="md-type-label-small muted">
            比对结果决定下一步：这条清单是下一轮意图的唯一来源，优先于「我觉得还该加点什么」。
          </p>
          <ul class="diffs">
            <li v-for="(diff, index) in craftDiffs" :key="index" class="diff-row">
              <span class="diff-kind md-type-label-small">{{ diff.kind }}</span>
              <span class="md-type-label-small muted">{{ diff.where }}</span>
              <code class="diff-path md-type-label-small">{{ diff.path }}</code>
              <span class="md-type-label-small">{{ diff.values }}<i v-if="diff.delta != null"> ({{ diff.delta }}px)</i></span>
            </li>
          </ul>
        </section>
        <p class="note md-type-label-small muted">
          {{ craftDiffGuidance }}
        </p>
      </template>

      <!-- ============ approvals ============ -->
      <template v-else-if="tab === 'approvals'">
        <p v-if="!approvals.length" class="empty-text md-type-body-medium">此任务没有待审批。</p>
        <article v-for="approval in approvals" :key="approval.id" class="approval-card">
          <span class="approval-tool md-type-label-small">{{ approval.tool }}</span>
          <pre class="approval-args md-type-label-small"><code>{{ approval.args }}</code></pre>
          <div class="approval-btns">
            <button type="button" class="approval-btn is-allow md-type-label-large md-state-layer" @click="decide(approval.id, true)">允许一次</button>
            <button type="button" class="approval-btn is-deny md-type-label-large md-state-layer" @click="decide(approval.id, false)">拒绝</button>
          </div>
        </article>
      </template>

      <!-- ============ report ============ -->
      <template v-else>
        <div class="report-btns">
          <button type="button" class="report-btn md-type-label-large md-state-layer" :disabled="reportBusy" @click="generate(false)">
            {{ reportBusy ? '生成中…' : '预览报告' }}
          </button>
          <button type="button" class="report-btn md-type-label-large md-state-layer" :disabled="reportBusy" @click="generate(true)">
            另存为文件
          </button>
          <LoadingIndicator v-if="reportBusy" :size="24" label="生成中" />
        </div>
        <div v-if="report" class="report-out">
          <MarkdownContent :content="report" />
        </div>
        <div v-else class="empty-state">
          <span class="empty-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 3h7l5 5v13H6zM13 3v5h5M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <p class="md-type-title-small empty-title">还没有生成报告</p>
          <p class="md-type-body-medium empty-hint">{{ emptyReportHint }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.task-view { display: flex; flex-direction: column; flex: 1; min-block-size: 0; }
.tv-head { display: flex; align-items: center; gap: 14px; padding: 12px 16px 8px; flex: none; }
.tv-back {
  padding: 4px 10px;
  border: 0;
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-primary);
  cursor: pointer;
  flex: none;
}
.tv-title-wrap { display: flex; flex-direction: column; gap: 1px; min-inline-size: 0; flex: 1; }
.tv-title-line { display: flex; align-items: center; gap: 8px; min-inline-size: 0; }
.tv-title { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tv-kind {
  flex: none;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.tv-kinds { display: flex; flex-direction: column; gap: 3px; align-items: flex-end; flex: none; }
.tv-kinds-label { opacity: 0.8; }
.muted { color: var(--md-on-surface-variant); }
.tv-tabs { padding-inline: 8px; flex: none; }
.tv-notice {
  margin: 8px 16px 0;
  padding: 8px 12px;
  border-radius: var(--md-shape-full);
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
}
.tv-body {
  flex: 1;
  min-block-size: 0;
  overflow-y: auto;
  padding: 12px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ---------- shared ---------- */
.block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.block h4 { margin: 0; color: var(--md-on-surface); }
.block h4 b { color: var(--md-on-surface-variant); font-weight: 500; }
.dot-list { display: flex; flex-direction: column; gap: 7px; margin: 0; padding: 0; list-style: none; }
.dot-item { display: flex; align-items: center; gap: 8px; color: var(--md-on-surface-variant); }
.dot-item.met { color: var(--md-on-surface); }
.dot { inline-size: 7px; block-size: 7px; flex: none; border-radius: var(--md-shape-full); background: var(--md-outline); }
.dot-item.met .dot { background: var(--md-primary); }
.row-between { display: flex; align-items: baseline; justify-content: space-between; }
.note { margin: 0; padding: 10px 12px; border-radius: var(--md-shape-small); background: var(--md-surface-container); }
.mono { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; }
.ok { color: var(--md-success); }
.bad { color: var(--md-error); }
.small-btn {
  padding: 3px 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}

/* ---------- sessions ---------- */
.sess-group { display: flex; flex-direction: column; gap: 2px; }
.sess-group-title { margin: 0 0 2px; color: var(--md-on-surface-variant); }
.sess-row {
  display: flex;
  align-items: center;
  gap: 8px;
  inline-size: 100%;
  min-block-size: 40px;
  padding: 6px 10px;
  border: 0;
  border-radius: var(--md-shape-medium);
  background: transparent;
  color: var(--md-on-surface-variant);
  text-align: start;
  cursor: pointer;
  transition: background-color var(--md-spring-expressive-fast-effects-dur) var(--md-spring-flat);
}
.sess-row:hover { background: var(--md-surface-container); color: var(--md-on-surface); }
.sess-mark { inline-size: 14px; flex: none; text-align: center; }
.sess-mark.is-done { color: var(--md-success); }
.sess-mark.is-running { color: var(--md-primary); }
.sess-mark.is-blocked { color: var(--md-error); }
.sess-mark.is-paused { color: var(--md-warning); }
.sess-num { flex: none; font-variant-numeric: tabular-nums; opacity: 0.7; }
.sess-text { flex: 1; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The lane type is what tells a reader this row is not just another chat. */
.sess-lane {
  flex: none;
  padding: 1px 6px;
  border-radius: var(--md-shape-xs);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.sess-live { flex: none; color: var(--md-primary); }
.sess-view-head { display: flex; align-items: center; gap: 10px; }
.sess-back {
  inline-size: 28px;
  block-size: 28px;
  flex: none;
  border: 0;
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-primary);
  cursor: pointer;
}
.sess-view-title { display: flex; align-items: baseline; gap: 8px; }

.console {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.console-turn { display: flex; flex-direction: column; gap: 2px; }
.console-turn p { margin: 0; }
.console-who { color: var(--md-on-surface-variant); }
.console-turn.from-operator {
  /* The turn moves to the end, but its label stays at the start of its own line: a
     right-aligned "你" detached from the text it labels reads as a stray word. */
  align-items: flex-end;
  text-align: end;
}

.hint {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 10px 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container-low);
}
.hint-input {
  flex: 1;
  min-inline-size: 0;
  border: 0;
  background: transparent;
  color: var(--md-on-surface);
  resize: none;
  font: var(--md-type-body-medium-font);
  letter-spacing: var(--md-type-body-medium-tracking);
}
.hint-input:focus { outline: none; }
.hint-input::placeholder { color: var(--md-on-surface-variant); }
.hint-send {
  flex: none;
  padding: 6px 16px;
  border: 0;
  border-radius: var(--md-shape-full);
  background: var(--md-primary);
  color: var(--md-on-primary);
  cursor: pointer;
}

/* ---------- worker trace ---------- */
.trace { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.trace-step {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container);
}
.trace-step.fail { border-color: var(--md-error); }
.trace-head { display: flex; align-items: center; justify-content: space-between; }
.trace-tool {
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.trace-status { color: var(--md-success); }
.trace-step.fail .trace-status { color: var(--md-error); }
.trace-cmd {
  margin: 0;
  padding: 6px 8px;
  border-radius: var(--md-shape-xs);
  background: var(--md-surface-container-lowest);
  overflow-x: auto;
}
.trace-cmd code,
.trace-out code { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; }
.trace-out {
  margin: 0;
  padding: 6px 8px;
  border-radius: var(--md-shape-xs);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  overflow-x: auto;
}

/* ---------- plans ---------- */
.plan-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid var(--md-outline-variant);
  border-inline-start: 3px solid var(--md-outline);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.plan-card.is-approved { border-inline-start-color: var(--md-success); }
.plan-card.is-revise { border-inline-start-color: var(--md-warning); }
.plan-head { display: flex; align-items: baseline; gap: 8px; }
.plan-verdict { padding: 1px 7px; border-radius: var(--md-shape-small); background: var(--md-surface-container-high); }
.plan-revised { color: var(--md-primary); }
.plan-open {
  margin-inline-start: auto;
  border: 0;
  background: transparent;
  color: var(--md-primary);
  cursor: pointer;
  padding: 2px 0;
}
.plan-steps { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.plan-step { display: flex; align-items: baseline; gap: 8px; color: var(--md-on-surface); }
.plan-sid { flex: none; padding: 0 5px; border-radius: var(--md-shape-xs); background: var(--md-surface-container-high); color: var(--md-on-surface-variant); }
.plan-needs { color: var(--md-on-surface-variant); }
.plan-dims { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; }
.plan-dims li { display: flex; align-items: baseline; gap: 8px; color: var(--md-on-surface-variant); }
.plan-dims li.is-fail span { color: var(--md-error); }
.plan-dims li.is-warn span { color: var(--md-warning); }
.plan-dims b { inline-size: 22px; flex: none; color: var(--md-on-surface); }
.plan-revision { margin: 0; padding: 8px 10px; border-radius: var(--md-shape-small); background: var(--md-surface-container-high); }

/* ---------- graph ---------- */
.graph-tools { display: flex; align-items: center; gap: 6px; }
.graph-spacer { flex: 1; }
.graph-btn {
  padding: 3px 9px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
.graph-canvas {
  overflow: hidden;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
  cursor: grab;
  touch-action: none;
}
.graph-canvas:active { cursor: grabbing; }
.edge { fill: none; stroke-width: 1.4; }
.edge.is-supports { stroke: var(--md-outline); }
.edge.is-evidence { stroke: var(--md-primary); }
.edge.is-refutes { stroke: var(--md-error); stroke-dasharray: 4 3; }
.edge-label {
  font: var(--md-type-label-small-font);
  fill: var(--md-on-surface-variant);
  text-anchor: middle;
  paint-order: stroke;
  stroke: var(--md-surface-container);
  stroke-width: 3px;
  stroke-linejoin: round;
}
.gnode rect { fill: var(--md-surface-container-high); stroke: var(--md-outline-variant); stroke-width: 1; }
.gnode text { font: var(--md-type-label-small-font); fill: var(--md-on-surface); }
.gnode text + text { fill: var(--md-on-surface-variant); }
.gnode.is-goal rect { fill: var(--md-secondary-container); stroke: var(--md-primary); stroke-width: 1.5; }
.gnode.is-finding rect { fill: var(--md-warning-container); stroke: var(--md-warning); stroke-width: 1.5; }
.gnode.is-asset rect { fill: var(--md-surface-container-highest); stroke: var(--md-outline); }
.gnode.is-confirmed rect { stroke-width: 2; }
.graph-legend { display: flex; flex-wrap: wrap; gap: 12px; }
.lg { font: var(--md-type-label-small-font); color: var(--md-on-surface-variant); display: inline-flex; align-items: center; gap: 5px; }
.lg::before { content: ''; inline-size: 10px; block-size: 10px; border-radius: 3px; background: var(--md-outline); }
.lg.is-goal::before { background: var(--md-primary); }
.lg.is-finding::before { background: var(--md-warning); }
.lg.is-asset::before { background: var(--md-surface-container-highest); border: 1px solid var(--md-outline); }
.lg.is-supports::before { background: var(--md-outline); }
.lg.is-evidence::before { background: var(--md-primary); }
.lg.is-refutes::before { background: var(--md-error); }

/* ---------- board ---------- */
.board { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
.board-row {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container);
}
.board-row p { margin: 0; }
.board-row .dot { margin-block-start: 6px; }
.dot.is-plan { background: var(--md-primary); }
.dot.is-worker { background: var(--md-primary); }
.dot.is-finding { background: var(--md-warning); }
.dot.is-approval { background: var(--md-error); }
.dot.is-system { background: var(--md-outline); }

/* ---------- findings ---------- */
.find-card {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 12px 14px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.find-top { display: flex; align-items: baseline; gap: 10px; }
.find-text { flex: 1; min-inline-size: 0; }
.find-assets { margin: 0; font-family: ui-monospace, monospace; }
.find-history { align-self: flex-start; border: 0; background: transparent; color: var(--md-primary); cursor: pointer; padding: 2px 0; }
.retests { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.retests li { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: var(--md-shape-small); background: var(--md-surface-container-high); }
.retests li.is-confirmed { background: var(--md-error-container); color: var(--md-on-error-container); }
.retests li p { margin: 0; }
.retest-verdict { font-weight: 500; }
.retest-evidence {
  margin: 0;
  padding: 6px 8px;
  border-radius: var(--md-shape-xs);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  overflow-x: auto;
}
.retest-evidence code { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; }

/* ---------- changes / regression ---------- */
.change-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 11px 13px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
}
.change-top { display: flex; align-items: center; gap: 10px; }
.change-state { flex: none; padding: 1px 7px; border-radius: var(--md-shape-small); background: var(--md-surface-container-high); }
.change-state.is-done { background: var(--md-success-container); color: var(--md-on-success-container); }
.change-state.is-running { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.change-state.is-blocked { background: var(--md-warning-container); color: var(--md-on-warning-container); }
.change-path {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
  font-family: ui-monospace, monospace;
}
.change-why { margin: 0; color: var(--md-on-surface-variant); }

.reg-list { display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; list-style: none; }
.reg-row { display: flex; align-items: center; gap: 10px; }
.reg-name { flex: 1; min-inline-size: 0; }
.reg-cell { inline-size: 42px; flex: none; text-align: center; padding: 1px 0; border-radius: var(--md-shape-xs); background: var(--md-surface-container-high); }
.reg-cell.ok { color: var(--md-success); }
.reg-cell.bad { color: var(--md-error); }
.reg-arrow { flex: none; color: var(--md-on-surface-variant); }

/* ---------- craft ---------- */
.craft-target {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container-high);
}
.craft-target-name { margin-inline-start: auto; color: var(--md-on-surface); }

.stages { display: flex; gap: 6px; margin: 0; padding: 0; list-style: none; }
.stage {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  color: var(--md-on-surface-variant);
}
.stage.done { border-color: var(--md-success); color: var(--md-on-surface); }
.stage.active {
  border-color: var(--md-primary);
  background: color-mix(in srgb, var(--md-primary) 8%, transparent);
  color: var(--md-primary);
}
.stage-dot { inline-size: 8px; block-size: 8px; flex: none; border-radius: var(--md-shape-full); background: currentColor; }
.scores { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
.score {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-medium);
  background: var(--md-surface-container);
}
.width-rows { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.width-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.width-row.pass { color: var(--md-on-surface); }
.width-tag { flex: none; inline-size: 56px; font-variant-numeric: tabular-nums; }
.width-verdict { margin-inline-start: auto; color: var(--md-warning); }
.width-row.pass .width-verdict { color: var(--md-success); }
.diffs { display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; list-style: none; }
.diff-row { display: flex; align-items: baseline; gap: 10px; }
.diff-kind { padding: 1px 6px; border-radius: var(--md-shape-xs); background: var(--md-surface-container-high); }
.diff-path {
  flex: 1;
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, monospace;
}
.inbox { display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; list-style: none; }
.inbox-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }

/* ---------- approvals / report ---------- */
.empty-text { margin: 0; padding: 20px; text-align: center; color: var(--md-on-surface-variant); }
.approval-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--md-warning);
  border-radius: var(--md-shape-large);
  background: var(--md-warning-container);
  color: var(--md-on-warning-container);
}
.approval-tool {
  align-self: flex-start;
  padding: 1px 7px;
  border-radius: var(--md-shape-small);
  background: color-mix(in srgb, var(--md-on-warning-container) 12%, transparent);
}
.approval-args {
  margin: 0;
  padding: 8px 10px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  overflow-x: auto;
}
.approval-args code { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; }
.approval-btns { display: flex; gap: 8px; }
.approval-btn { padding: 8px 16px; border: 1px solid transparent; border-radius: var(--md-shape-full); cursor: pointer; }
.approval-btn.is-allow { background: var(--md-primary); color: var(--md-on-primary); }
.approval-btn.is-deny { border-color: var(--md-on-warning-container); background: transparent; color: var(--md-on-warning-container); }

.report-btns { display: flex; align-items: center; gap: 8px; }
.report-btn {
  padding: 8px 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-full);
  background: transparent;
  color: var(--md-on-surface);
  cursor: pointer;
}
.report-btn:hover { border-color: var(--md-primary); color: var(--md-primary); }
.report-btn:disabled { opacity: 0.5; cursor: default; }
.report-out {
  padding: 16px 20px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--md-shape-large);
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  overflow-x: auto;
}
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 40px 24px 64px;
  text-align: center;
  color: var(--md-on-surface-variant);
}
.empty-glyph {
  display: grid;
  place-items: center;
  inline-size: 44px;
  block-size: 44px;
  border-radius: var(--md-shape-full);
  background: var(--md-surface-container);
  margin-block-end: 4px;
}
.empty-glyph svg { inline-size: 22px; block-size: 22px; }
.empty-title { margin: 0; color: var(--md-on-surface); }
.empty-hint { margin: 0; max-inline-size: 320px; }
</style>