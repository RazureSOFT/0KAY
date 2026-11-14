<script setup lang="ts">
/**
 * The workspace map: modules, what depends on what, and what changed.
 *
 * The extraction runs in the agent (it is the component that knows how to read a
 * codebase) and Core forwards to it, so this panel only asks and renders. That
 * matters for one design decision here: it does not go through the model. A
 * compute job dressed as a conversation would cost a turn, could be reworded,
 * and would need a session before anyone could look at their own code.
 *
 * The diagram is rendered from mermaid text by the browser. Shipping the source
 * alongside means an offline reader still sees the structure, which a PNG would
 * not give them.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type Drift = {
  clean?: boolean
  drift?: string
  added?: string[]
  removed?: string[]
  newDependencies?: Array<{ from: string; to: string }>
  droppedDependencies?: Array<{ from: string; to: string }>
  changedButStillPresent?: string[]
  savedAt?: string | null
}

type MapNode = {
  id: string
  label: string
  files: number
  lines: number
  languages: string[]
  orphan: boolean
}

const props = defineProps<{ path: string }>()

const { t } = useI18n()

const loading = ref(false)
const error = ref('')
const mermaid = ref('')
const modules = ref(0)
const totalModules = ref(0)
const sourceFiles = ref(0)
const nodes = ref<MapNode[]>([])
const links = ref<Array<{ from: string; to: string; weight: number }>>([])
const drift = ref<Drift | null>(null)
const showAll = ref(false)
const copied = ref('')

const LIMIT = 24

const summary = computed(() => t('ide.archSummary', {
  files: sourceFiles.value,
  modules: totalModules.value,
  edges: links.value.length,
}))

const orphans = computed(() => nodes.value.filter((node) => node.orphan))

/** Strongest edges first: a diagram without weights still reads as one. */
const rankedLinks = ref<Array<{ from: string; to: string; weight: number }>>([])

async function load() {
  if (!props.path) return
  loading.value = true
  error.value = ''
  try {
    const limit = showAll.value ? 60 : LIMIT
    const response = await fetch(`/api/agent/architecture?path=${encodeURIComponent(props.path)}&action=scan&max_modules=${limit}`)
    if (!response.ok) {
      let detail = `HTTP ${response.status}`
      try {
        const body = await response.json()
        if (body?.error) detail = String(body.error)
      } catch { /* not JSON */ }
      throw new Error(detail)
    }
    const data = await response.json()
    // The tool returns the diagram source and the graph it was built from, so
    // the panel never has to reverse a prose summary into structure.
    mermaid.value = String(data.mermaid || '')
    modules.value = Number(data.modules) || 0
    totalModules.value = Number(data.totalModules) || 0
    sourceFiles.value = Number(data.sourceFiles) || 0
    nodes.value = Array.isArray(data.nodes) ? data.nodes : []
    links.value = Array.isArray(data.links) ? data.links : []
    rankedLinks.value = [...links.value].sort((a, b) => b.weight - a.weight).slice(0, 20)
    drift.value = data.savedAt !== undefined ? (data as Drift) : null
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
    mermaid.value = ''
    nodes.value = []
    links.value = []
  } finally {
    loading.value = false
  }
}

async function copySource() {
  try {
    await navigator.clipboard.writeText(mermaid.value)
    copied.value = 'ok'
    window.setTimeout(() => { copied.value = '' }, 1500)
  } catch {
    copied.value = ''
  }
}

async function toggleAll() {
  showAll.value = !showAll.value
  await load()
}

onMounted(load)
watch(() => props.path, () => { void load() })
</script>

<template>
  <div class="arch-panel">
    <header class="arch-head">
      <span class="arch-title">{{ summary }}</span>
      <button type="button" class="ghost" :disabled="loading" @click="load">{{ t('ide.archRefresh') }}</button>
      <button type="button" class="ghost" :disabled="loading" @click="toggleAll">
        {{ showAll ? t('ide.archKeepBusiest', { n: LIMIT }) : t('ide.archShowAll') }}
      </button>
    </header>

    <p v-if="loading" class="hint">{{ t('ide.archLoading') }}</p>
    <p v-else-if="error" class="hint bad">{{ error }}</p>
    <p v-else-if="!modules" class="hint">{{ t('ide.archEmpty') }}</p>

    <template v-else>
      <p v-if="drift?.drift" class="drift" :class="{ clean: drift.clean }">{{ drift.drift }}</p>

      <div class="arch-scroll">
        <!-- Rendered from the graph the tool returned, so the picture cannot
             disagree with the numbers above it. No diagram library: the shape
             is a layered flow, which is a grid, and a 5 MB dependency would be
             the largest thing in the bundle to draw it. -->
        <div class="graph" role="img" :aria-label="summary">
          <div class="graph-grid">
            <div v-for="node in nodes" :key="node.id" class="graph-node" :class="{ orphan: node.orphan }" :title="node.id">
              <span class="node-label">{{ node.label }}</span>
              <span class="node-meta">{{ node.files }}f · {{ node.lines }}L · {{ node.languages.slice(0, 2).join('/') }}</span>
            </div>
          </div>
          <ul v-if="rankedLinks.length" class="graph-links">
            <li v-for="link in rankedLinks" :key="`${link.from}->${link.to}`">
              <code>{{ link.from }}</code>
              <span class="arrow">→</span>
              <code>{{ link.to }}</code>
              <span v-if="link.weight > 1" class="weight">×{{ link.weight }}</span>
            </li>
          </ul>
        </div>

        <details class="arch-source-box">
          <summary>Mermaid</summary>
          <div class="source-actions">
            <button type="button" class="ghost" @click="copySource">{{ copied ? '✓' : t('ide.copyPlan') }}</button>
          </div>
          <pre class="arch-source">{{ mermaid }}</pre>
        </details>
      </div>

      <details v-if="orphans.length" class="arch-orphans">
        <summary>{{ t('ide.archOrphanHint') }} ({{ orphans.length }})</summary>
        <ul>
          <li v-for="node in orphans" :key="node.id"><code>{{ node.id }}</code></li>
        </ul>
      </details>
    </template>
  </div>
</template>

<style scoped>
.arch-panel { display: flex; flex-direction: column; min-height: 0; height: 100%; }
.arch-head { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--md-outline-variant); }
.arch-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; color: var(--md-on-surface-variant); }
.arch-scroll { flex: 1; overflow: auto; padding: 8px; }
.graph-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.graph-node { display: flex; flex-direction: column; gap: 1px; padding: 5px 7px; border: 1px solid var(--md-outline-variant); border-radius: 8px; background: var(--md-surface-container-lowest); min-width: 0; }
.graph-node.orphan { border-style: dashed; border-color: color-mix(in srgb, #d97706 60%, var(--md-outline-variant)); }
.node-label { font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.node-meta { font-size: 10px; color: var(--md-on-surface-variant); font-variant-numeric: tabular-nums; }
.graph-links { margin: 10px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.graph-links li { display: flex; align-items: center; gap: 5px; min-width: 0; }
.graph-links code { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.graph-links .arrow { color: var(--md-primary); flex: none; }
.graph-links .weight { flex: none; color: var(--md-on-surface-variant); font-variant-numeric: tabular-nums; }
.arch-source-box { margin-top: 10px; font-size: 11.5px; }
.arch-source-box summary { cursor: pointer; color: var(--md-on-surface-variant); }
.source-actions { display: flex; justify-content: flex-end; margin: 4px 0; }
.arch-source { margin: 0; font: 11px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--md-on-surface-variant); background: var(--md-surface-container-lowest); border: 1px solid var(--md-outline-variant); border-radius: 8px; padding: 6px; }
.drift { margin: 0; padding: 5px 8px; font-size: 11.5px; background: color-mix(in srgb, #d97706 14%, transparent); color: var(--md-on-surface); border-bottom: 1px solid var(--md-outline-variant); }
.drift.clean { background: color-mix(in srgb, var(--md-primary) 8%, transparent); color: var(--md-on-surface-variant); }
.arch-orphans { border-top: 1px solid var(--md-outline-variant); padding: 6px 8px; font-size: 11.5px; }
.arch-orphans summary { cursor: pointer; color: var(--md-on-surface-variant); }
.arch-orphans ul { margin: 6px 0 0; padding-left: 18px; }
.arch-orphans code { font-size: 11px; }
.hint { margin: 8px; color: var(--md-on-surface-variant); font-size: 12px; }
.hint.bad { color: var(--md-error); }
.ghost { border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 8px; padding: 2px 8px; font-size: 11px; cursor: pointer; color: var(--md-on-surface-variant); }
.ghost:disabled { opacity: .45; cursor: not-allowed; }
</style>