<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiSend } from '../api'
import { useChatStore } from '../stores/chat'

// The ARTEX view, in the width of the chat column: what the target IS, what has
// been TRIED, and how much of it is covered. Everything here comes from the same
// recon_graph the agent writes to, so the panel and the model never disagree.

const { t } = useI18n()
const chat = useChatStore()
const emit = defineEmits<{ (event: 'close'): void }>()

interface Asset { id: string; kind: string; key: string; parentId?: string }
interface Node { id: string; kind: string; text: string; status: string; assetIds: string[]; derivedFrom: string[] }

const assets = ref<Asset[]>([])
const nodes = ref<Node[]>([])
const coverage = ref({ total: 0, tested: 0 })
const loading = ref(false)
const error = ref('')

const byKind = computed(() => {
  const counts = new Map<string, number>()
  for (const asset of assets.value) counts.set(asset.kind, (counts.get(asset.kind) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
})

const findings = computed(() => nodes.value.filter((node) => node.kind === 'finding'))
const intents = computed(() => nodes.value.filter((node) => node.kind === 'intent' && node.status === 'open'))

const percent = computed(() => {
  if (!coverage.value.total) return 0
  return Math.round((coverage.value.tested / coverage.value.total) * 100)
})

const isEmpty = computed(() => !loading.value && !assets.value.length && !nodes.value.length)

// Long lists are truncated: the column is a glance, not the graph itself.
const LIMIT = 12

function textOf(id: string): string {
  return nodes.value.find((node) => node.id === id)?.text || ''
}

/** A finding's provenance, one level up: the intent that produced it. */
function originOf(finding: Node): string {
  const parent = finding.derivedFrom.map(textOf).find(Boolean)
  return parent || ''
}

async function fetchGraph() {
  const response = await apiSend<any>('/api/run', 'POST', {
    tool: 'recon_graph',
    args: JSON.stringify({ action: 'export' }),
    session_id: chat.sessionId,
  })
  if (!response?.success) throw new Error(response?.error || 'recon_graph export failed')
  const payload = typeof response.result === 'string' ? JSON.parse(response.result) : response.result
  assets.value = Array.isArray(payload?.assets) ? payload.assets : []
  nodes.value = Array.isArray(payload?.nodes) ? payload.nodes : []
  coverage.value = {
    total: Number(payload?.coverage?.total) || 0,
    tested: Number(payload?.coverage?.tested) || 0,
  }
}

function clear() {
  assets.value = []
  nodes.value = []
  coverage.value = { total: 0, tested: 0 }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    await fetchGraph()
  } catch (cause: any) {
    error.value = cause?.message || String(cause)
    clear()
  } finally {
    loading.value = false
  }
}

/**
 * Silent re-read while the agent is working. A scan is the one time this panel
 * matters, and a graph you have to refresh by hand is a report, not a view.
 * Failures are swallowed on purpose: a poll that cannot reach the tool must not
 * replace a good graph with an error banner.
 */
async function refresh() {
  try {
    await fetchGraph()
  } catch {
    /* keep the last good read */
  }
}

let timer: number | undefined
onMounted(() => {
  load()
  timer = window.setInterval(() => {
    if (document.visibilityState === 'visible' && !loading.value) refresh()
  }, 4000)
})
onUnmounted(() => {
  if (timer !== undefined) window.clearInterval(timer)
})
</script>

<template>
  <section class="recon-panel">
    <header class="recon-head">
      <h2>{{ t('recon.title') }}</h2>
      <div class="recon-actions">
        <button type="button" class="icon-btn" :title="t('recon.refresh')" :aria-label="t('recon.refresh')" @click="load">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M4 12a8 8 0 1 1 2.6 5.9M4 12V7m0 5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button type="button" class="icon-btn" :title="t('recon.close')" :aria-label="t('recon.close')" @click="emit('close')">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </header>

    <p v-if="error" class="recon-error">{{ error }}</p>
    <p v-else-if="loading" class="recon-muted">{{ t('recon.loading') }}…</p>

    <template v-else>
      <div v-if="coverage.total" class="coverage">
        <div class="coverage-line">
          <span class="coverage-label">{{ t('recon.coverage') }}</span>
          <span class="coverage-value">
            <strong>{{ coverage.tested }}</strong> / {{ coverage.total }}
            <em>{{ t('recon.tested') }}</em>
          </span>
        </div>
        <div class="coverage-bar" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
          <span :style="{ width: `${percent}%` }"></span>
        </div>
      </div>

      <p v-if="isEmpty" class="recon-empty">{{ t('recon.empty') }}</p>

      <template v-else>
        <section v-if="byKind.length" class="block">
          <h3>{{ t('recon.assets') }}</h3>
          <div class="chips">
            <span v-for="[kind, count] in byKind" :key="kind" class="chip" :data-kind="kind">
              {{ kind }} <b>{{ count }}</b>
            </span>
          </div>
        </section>

        <section class="block">
          <h3>{{ t('recon.intents') }} <b>{{ intents.length }}</b></h3>
          <p v-if="!intents.length" class="recon-muted">{{ t('recon.noIntents') }}</p>
          <ul v-else class="items">
            <li v-for="intent in intents.slice(0, LIMIT)" :key="intent.id" class="item intent">
              <span class="dot"></span>{{ intent.text }}
            </li>
          </ul>
          <p v-if="intents.length > LIMIT" class="recon-more">
            {{ t('recon.more', { n: intents.length - LIMIT }) }}
          </p>
        </section>

        <section class="block">
          <h3>{{ t('recon.findings') }} <b>{{ findings.length }}</b></h3>
          <p v-if="!findings.length" class="recon-muted">{{ t('recon.noFindings') }}</p>
          <ul v-else class="items">
            <li v-for="finding in findings.slice(0, LIMIT)" :key="finding.id" class="item finding">
              <span class="dot"></span>
              <div>
                <p class="finding-text">{{ finding.text }}</p>
                <p v-if="originOf(finding)" class="finding-origin">← {{ originOf(finding) }}</p>
              </div>
            </li>
          </ul>
          <p v-if="findings.length > LIMIT" class="recon-more">
            {{ t('recon.more', { n: findings.length - LIMIT }) }}
          </p>
        </section>
      </template>
    </template>
  </section>
</template>

<style scoped>
.recon-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  padding: 14px 16px 24px;
  overflow-y: auto;
}
.recon-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.recon-head h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--md-on-surface);
}
.recon-actions {
  display: flex;
  gap: 4px;
}
/* `#app button` is (1,0,1) and forces min-height:36px + an 18px radius on every
   button, which turns these 26px squares into pills. Id prefix wins it back. */
#app .icon-btn {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  min-height: 0;
  padding: 0;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}
#app .icon-btn:hover {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.coverage-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 12px;
  color: var(--md-on-surface-variant);
}
.coverage-value strong {
  color: var(--md-on-surface);
  font-size: 15px;
}
.coverage-value em {
  font-style: normal;
  margin-left: 2px;
}
.coverage-bar {
  margin-top: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--md-surface-container-high);
  overflow: hidden;
}
.coverage-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--md-primary), var(--md-tertiary));
  transition: width 0.3s ease;
}
.block h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
}
.block h3 b {
  font-weight: 600;
  color: var(--md-on-surface-variant);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--md-secondary-container);
  font-size: 11px;
  color: var(--md-on-secondary-container);
}
.chip b {
  font-weight: 700;
  color: var(--md-on-secondary-container);
}
.items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.item {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--md-on-surface-variant);
}
.dot {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--md-outline-variant);
}
.finding .dot {
  background: var(--md-warning);
}
.finding-text {
  margin: 0;
  color: var(--md-on-surface);
}
.finding-origin {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--md-on-surface-variant);
}
.recon-more {
  margin: 6px 0 0;
  padding-left: 14px;
  font-size: 11px;
  color: var(--md-on-surface-variant);
  opacity: 0.85;
}
.recon-empty,
.recon-muted {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--md-on-surface-variant);
}
.recon-error {
  margin: 0;
  font-size: 12px;
  color: var(--md-error);
}
</style>
