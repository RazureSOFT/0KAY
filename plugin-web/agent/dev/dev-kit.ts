/**
 * Kitchen sink for the MD3 components.
 *
 * These components are not used by any page yet — stage 3 is where they replace
 * the eight segmented controls and three spinners. Until then they are tree-shaken
 * out of the build, which means there is no way to look at them: unit tests assert
 * attributes, not whether a corner radius renders or whether the loading arc reads
 * as a loading arc.
 *
 * This page mounts every component with every variant so it can be inspected and
 * measured in a real browser. It lives outside `src/` so it never enters the plugin
 * bundle, and it imports the host's token stylesheets directly — the one place
 * reaching across packages is correct, because the kit is a dev tool.
 */
import { createApp, h } from 'vue'
import '@tokens/spring-tokens.css'
import '@tokens/theme.css'
import ButtonGroup from '../src/md/ButtonGroup.vue'
import IconButton from '../src/md/IconButton.vue'
import Badge from '../src/md/Badge.vue'
import LoadingIndicator from '../src/md/LoadingIndicator.vue'
import ProgressIndicator from '../src/md/ProgressIndicator.vue'
import ExtendedFab from '../src/md/ExtendedFab.vue'
import Toolbar from '../src/md/Toolbar.vue'
import Tabs from '../src/md/Tabs.vue'
import StateLayer from '../src/md/StateLayer.vue'
import Tooltip from '../src/md/Tooltip.vue'
import ToolStepCard from '../src/ToolStepCard.vue'

const PlusIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
  h('path', { d: 'M12 5v14M5 12h14', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round' }),
])

const PaperclipIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none' }, [
  h('path', {
    d: 'M16.5 6.5 8.9 14.1a2.5 2.5 0 0 0 3.5 3.5l7.6-7.6a4.5 4.5 0 0 0-6.4-6.4l-8.3 8.3a6.5 6.5 0 0 0 9.2 9.2l5.6-5.6',
    stroke: 'currentColor',
    'stroke-width': '1.7',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }),
])

/**
 * Mount one demo into its own app instance.
 *
 * Separate roots on purpose: if one component throws, the rest of the page still
 * renders, which is what makes this useful for spotting a broken piece.
 */
function demo(title: string, render: () => unknown): void {
  const section = document.createElement('section')
  const heading = document.createElement('h2')
  heading.textContent = title
  const host = document.createElement('div')
  host.className = 'row'
  section.append(heading, host)
  document.getElementById('mount')!.appendChild(section)
  createApp({ render }).mount(host)
}

const SIZES = ['xs', 's', 'm', 'l', 'xl'] as const
const VARIANTS = ['standard', 'filled', 'tonal', 'outlined'] as const

// --- ButtonGroup: two variants × two shapes (one size only — upstream has no ladder) ---
const GROUP_ITEMS = [
  { id: 'all', label: '全部', tone: 'ghost' as const },
  { id: 'chat', label: '对话', tone: 'ghost' as const },
  { id: 'life', label: 'Life', tone: 'ghost' as const },
]
for (const variant of ['connected', 'standard'] as const) {
  for (const shape of ['round', 'square'] as const) {
    demo(`ButtonGroup · ${variant} · ${shape}（40dp，官方唯一尺寸）`, () => h('div', { class: 'row' }, [
      h(ButtonGroup, { items: GROUP_ITEMS, modelValue: 'chat', variant, shape, label: `${variant} ${shape}` }),
    ]))
  }
}

// multi-select
demo('ButtonGroup · multi-select（选中段变药丸）', () => h('div', { class: 'row' }, [
  h(ButtonGroup, { items: GROUP_ITEMS, modelValues: ['all', 'life'], multiple: true, label: 'multi' }),
]))

// --- IconButton ---
demo('IconButton · variants', () => h('div', { class: 'row' }, [
  ...VARIANTS.map((variant) => h(IconButton, { variant, label: variant }, () => h(PlusIcon))),
]))

demo('IconButton · sizes（xs 32 / s 40 / m 56 / l 96 / xl 136）', () => h('div', { class: 'row' }, [
  ...SIZES.map((size) => h(IconButton, { size, round: true, variant: 'tonal', label: size }, () => h(PaperclipIcon))),
]))

// --- Badge ---
demo('Badge', () => h('div', { class: 'row' }, [
  h('span', { class: 'tag' }, 'small dot:'),
  h(Badge, { size: 'small' }),
  h('span', { class: 'tag' }, 'large:'),
  h(Badge, { size: 'large', value: 3 }),
  h(Badge, { size: 'large', value: 12 }),
  h(Badge, { size: 'large', value: 99, tone: 'primary' }),
  h(Badge, { size: 'large', value: 'OK', tone: 'success' }),
]))

// --- LoadingIndicator ---
demo('LoadingIndicator · 尺寸从 24 到 240（token 比例 38:48）', () => h('div', { class: 'row' }, [
  h(LoadingIndicator, { size: 24, label: '24dp' }),
  h(LoadingIndicator, { size: 36, label: '36dp' }),
  h(LoadingIndicator, { size: 48, label: '48dp（默认）' }),
  h(LoadingIndicator, { size: 96, label: '96dp' }),
  h(LoadingIndicator, { size: 48, contained: true, label: '48dp contained' }),
]))

// --- ProgressIndicator ---
demo('ProgressIndicator · linear（含 indeterminate）', () => h('div', {
  style: 'display:flex;flex-direction:column;gap:10px;width:360px',
}, [
  h(ProgressIndicator, { value: 0 }),
  h(ProgressIndicator, { value: 40 }),
  h(ProgressIndicator, { value: 100 }),
  h(ProgressIndicator, {}),
]))

demo('ProgressIndicator · wavy（Expressive 形状）', () => h('div', {
  style: 'display:flex;flex-direction:column;gap:16px;width:360px',
}, [
  h(ProgressIndicator, { value: 35, shape: 'wavy' }),
  h(ProgressIndicator, { value: 80, shape: 'wavy' }),
  h(ProgressIndicator, { shape: 'wavy' }),
]))

demo('ProgressIndicator · circular', () => h('div', { class: 'row' }, [
  h(ProgressIndicator, { variant: 'circular', value: 25 }),
  h(ProgressIndicator, { variant: 'circular', value: 66 }),
  h(ProgressIndicator, { variant: 'circular', value: 100 }),
  h(ProgressIndicator, { variant: 'circular' }),
]))

// --- ExtendedFab ---
demo('ExtendedFab', () => h('div', { class: 'row' }, [
  h(ExtendedFab, { label: '新对话' }),
  h(ExtendedFab, { label: 'New task', size: 'sm' }),
  h(ExtendedFab, { label: 'Disabled', disabled: true }),
]))

// --- Toolbar ---
demo('Toolbar · standard / vibrant / sm', () => h('div', { style: 'display:flex;flex-direction:column;gap:8px' }, [
  h(Toolbar, { label: 'Standard' }, {
    leading: () => h(IconButton, { size: 's', label: 'Back' }, () => h(PlusIcon)),
    default: () => h('span', { class: 'md-type-label-large' }, 'Standard toolbar'),
    trailing: () => h(IconButton, { size: 's', label: 'Close' }, () => h(PlusIcon)),
  }),
  h(Toolbar, { variant: 'vibrant', label: 'Vibrant' }, {
    default: () => h('span', { class: 'md-type-label-large' }, 'Vibrant toolbar'),
  }),
  h(Toolbar, { size: 'sm', label: 'Small' }, {
    default: () => h('span', { class: 'md-type-label-small' }, 'sm · 44dp（面板头）'),
  }),
]))

// --- Tabs ---
const TABS = [
  { id: 'overview', label: '概览' },
  { id: 'findings', label: '发现', badge: 3 },
  { id: 'report', label: '报告' },
  { id: 'blocked', label: '阻塞', disabled: true },
]
demo('Tabs · primary（48dp）/ secondary（40dp）', () => h('div', {
  style: 'display:flex;flex-direction:column;gap:16px',
}, [
  h(Tabs, { tabs: TABS, modelValue: 'overview', variant: 'primary', label: '任务视图' }),
  h(Tabs, { tabs: TABS, modelValue: 'findings', variant: 'secondary', label: '任务子视图' }),
]))

// --- StateLayer ---
demo('StateLayer · hover 8% / focus 10% / press 10%', () => h('div', { class: 'row' }, [
  h(StateLayer, { color: 'on-surface' }, () => h('div', {
    class: 'swatch',
    style: 'width:220px;background: var(--md-surface-container-low)',
  }, [
    h('div', { class: 'md-type-label-large' }, '悬停看叠加层'),
    h('div', { class: 'md-type-label-small' }, '宿主颜色不变，只是叠加'),
  ])),
]))

// --- Tooltip ---
demo('Tooltip · hover 与键盘 focus 都能出', () => h('div', { class: 'row' }, [
  h(Tooltip, { placement: 'top' }, {
    default: () => h(IconButton, { label: '发送' }, () => h(PaperclipIcon)),
    title: () => h('b', '发送'),
    body: () => h('i', 'Enter 发送，Shift+Enter 换行'),
  }),
  h(Tooltip, { placement: 'bottom' }, {
    default: () => h('button', { class: 'btn btn-tonal', type: 'button' }, '下方浮层'),
    title: () => h('b', 'placement="bottom"'),
  }),
]))

console.log('[md3 kit] mounted')

// --- ToolStepCard: the surface a long reply is mostly made of -----------------
//
// A reply of any length is mostly these rows, so their weight sets the tone of the whole
// transcript. They were never previewable here, which is why the hover-lift and the 16px
// radius survived as long as they did.

const toolStep = (over: Record<string, unknown>) => ({
  task_id: 't',
  kind: 'tool',
  started_at: '2026-11-21T10:00:00+08:00',
  ...over,
} as never)

demo('ToolStepCard · 状态（done / running / failed / cancelled）', () => h('div', { class: 'col' }, [
  h(ToolStepCard, { step: toolStep({ prompt: 'read', state: 'done', result: 'loaded 3780 lines' }) }),
  h(ToolStepCard, { step: toolStep({ prompt: 'bash', state: 'running', result: '' }) }),
  h(ToolStepCard, { step: toolStep({ prompt: 'bash', state: 'failed', error: 'command not found: rg' }) }),
  h(ToolStepCard, { step: toolStep({ prompt: 'write', state: 'cancelled' }) }),
]))

demo('ToolStepCard · 带 diff 统计（write / edit）', () => h('div', { class: 'col' }, [
  // `write` counts `lines`; `edit` counts `+`/`-` lines inside a unified diff. Different
  // shapes on purpose: a whole-file write knows its line count, an edit knows its patch.
  h(ToolStepCard, {
    step: toolStep({
      prompt: 'write',
      state: 'done',
      args: JSON.stringify({ path: 'plugin-web/agent/src/md/Toolbar.vue' }),
      result: JSON.stringify({ lines: 128 }),
    }),
  }),
  h(ToolStepCard, {
    step: toolStep({
      prompt: 'edit',
      state: 'done',
      args: JSON.stringify({ path: 'plugin-web/agent/src/AgentsPage.vue' }),
      result: JSON.stringify({
        diff: [
          '--- a/AgentsPage.vue',
          '+++ b/AgentsPage.vue',
          '@@ -1,4 +1,3 @@',
          '-const a = 1',
          '-const b = 2',
          '+const a = 2',
          ' const keep = true',
        ].join('\n'),
      }),
    }),
  }),
]))

demo('ToolStepCard · bash 输出与退出码', () => h('div', { class: 'col' }, [
  h(ToolStepCard, {
    step: toolStep({
      prompt: 'bash',
      state: 'done',
      args: JSON.stringify({ command: 'go build ./... && go vet ./...' }),
      result: JSON.stringify({ cwd: 'D:/0KAY', exitCode: 0, stdout: 'ok 0KAY/core\nok 0KAY/core/internal/gateway' }),
    }),
  }),
  h(ToolStepCard, {
    step: toolStep({
      prompt: 'bash',
      state: 'failed',
      args: JSON.stringify({ command: 'rg TODO src/' }),
      result: JSON.stringify({ exitCode: 127, stderr: 'rg: command not found' }),
    }),
  }),
]))
