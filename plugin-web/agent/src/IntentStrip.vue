<script setup lang="ts">
import { computed, ref } from 'vue'
import { i18n } from '@0kay/host'

// The intent ledger, shown as it is being written.
//
// The gate is only credible if the user can watch it work: what the agent thinks
// the request is, how it plans to get there, and how far it has actually got.
// The percentage is the derived one — the same number the gate computes — not
// whatever the model last typed into a progress bar.

export interface IntentRow {
  id: string
  description: string
  method?: string
  status: 'pending' | 'in_progress' | 'done' | 'blocked'
  evidence?: string
  source?: string
}

const props = defineProps<{
  intents: IntentRow[]
  rate: number
  approach?: string
  review?: { status?: string; actual_completion?: string; fix_feedback?: string; missing_intents?: string[]; audit?: string; source?: string } | null
}>()

const t = (key: string, params?: Record<string, unknown>) => i18n.global.t(key, params || {})
const open = ref(true)

const done = computed(() => props.intents.filter((row) => row.status === 'done').length)
const statusLabel = (status: string) => t(`agent.page.intentStatus.${status}`)
const rateClass = computed(() => {
  if (props.rate >= 100) return 'full'
  if (props.rate >= 50) return 'half'
  return 'low'
})
const rejected = computed(() => props.review?.status === 'reject')
</script>

<template>
  <section v-if="intents.length || review" class="intent-strip" :class="rateClass">
    <header class="intent-head" @click="open = !open">
      <span class="intent-chevron" :class="{ open }" aria-hidden="true">▸</span>
      <strong>{{ t('agent.page.intentTitle') }}</strong>
      <span class="intent-count">{{ done }}/{{ intents.length }}</span>
      <div class="intent-meter" :aria-label="`${rate}%`">
        <i :style="{ width: `${Math.max(0, Math.min(100, rate))}%` }" />
      </div>
      <span class="intent-rate">{{ rate }}%</span>
      <span
        v-if="review"
        class="intent-verdict"
        :class="rejected ? 'reject' : 'pass'"
        :title="review.audit || ''"
      >{{ rejected ? t('agent.page.intentRejected') : t('agent.page.intentPassed') }}</span>
    </header>

    <div v-if="open" class="intent-body">
      <p v-if="approach" class="intent-approach"><span>{{ t('agent.page.intentApproach') }}</span>{{ approach }}</p>
      <ul class="intent-list">
        <li v-for="row in intents" :key="row.id" :class="row.status">
          <span class="intent-dot" aria-hidden="true" />
          <span class="intent-id">{{ row.id }}</span>
          <span class="intent-desc">{{ row.description }}</span>
          <span class="intent-status">{{ statusLabel(row.status) }}</span>
          <small v-if="row.method" class="intent-method">{{ row.method }}</small>
          <small v-if="row.evidence" class="intent-evidence">{{ row.evidence }}</small>
          <span v-if="row.source === 'reviewer'" class="intent-source">{{ t('agent.page.intentFromReviewer') }}</span>
        </li>
      </ul>
      <div v-if="review && rejected" class="intent-feedback">
        <strong>{{ t('agent.page.intentFeedback') }}</strong>
        <p>{{ review.fix_feedback }}</p>
        <ul v-if="review.missing_intents?.length">
          <li v-for="item in review.missing_intents" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intent-strip{margin:6px 0 10px;border-radius:12px;background:var(--md-surface-container-low);overflow:hidden;border:1px solid transparent}
.intent-strip.low{border-color:color-mix(in srgb,var(--md-error,#b3261e) 20%,transparent)}
.intent-head{display:flex;align-items:center;gap:8px;padding:7px 11px;cursor:pointer;font-size:12px;color:var(--md-on-surface-variant)}
.intent-head strong{font-weight:650;color:var(--md-on-surface);letter-spacing:.01em}
.intent-chevron{display:inline-block;transition:transform .15s;font-size:10px}
.intent-chevron.open{transform:rotate(90deg)}
.intent-count{font-family:var(--code-font);font-size:11px;opacity:.85}
.intent-meter{flex:1;min-width:48px;height:4px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.intent-meter i{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .35s ease}
.intent-strip.full .intent-meter i{background:var(--md-success,#2e7d32)}
.intent-rate{font-family:var(--code-font);font-size:11px;font-weight:650;color:var(--md-on-surface);min-width:32px;text-align:right}
.intent-verdict{padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:650;letter-spacing:.02em}
.intent-verdict.pass{background:color-mix(in srgb,var(--md-success,#2e7d32) 16%,transparent);color:var(--md-success,#2e7d32)}
.intent-verdict.reject{background:color-mix(in srgb,var(--md-error,#b3261e) 14%,transparent);color:var(--md-error,#b3261e)}
.intent-body{padding:2px 11px 10px}
.intent-approach{margin:0 0 8px;font-size:12px;line-height:1.55;color:var(--md-on-surface-variant)}
.intent-approach span{font-weight:650;color:var(--md-on-surface);margin-right:6px}
.intent-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px}
.intent-list li{display:flex;align-items:baseline;gap:7px;flex-wrap:wrap;padding:4px 0;font-size:12.5px;line-height:1.5}
.intent-dot{width:7px;height:7px;border-radius:50%;flex:none;background:var(--md-outline);align-self:center}
.intent-list li.done .intent-dot{background:var(--md-success,#2e7d32)}
.intent-list li.in_progress .intent-dot{background:var(--md-primary)}
.intent-list li.blocked .intent-dot{background:var(--md-error,#b3261e)}
.intent-list li.pending .intent-dot{background:var(--md-outline-variant,var(--md-outline))}
.intent-id{font-family:var(--code-font);font-size:10.5px;opacity:.6}
.intent-desc{flex:1;min-width:140px;color:var(--md-on-surface)}
.intent-list li.done .intent-desc{color:var(--md-on-surface-variant)}
.intent-status{font-size:10.5px;font-weight:650;letter-spacing:.02em;padding:1px 7px;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant)}
.intent-list li.done .intent-status{background:color-mix(in srgb,var(--md-success,#2e7d32) 15%,transparent);color:var(--md-success,#2e7d32)}
.intent-list li.blocked .intent-status{background:color-mix(in srgb,var(--md-error,#b3261e) 13%,transparent);color:var(--md-error,#b3261e)}
.intent-method,.intent-evidence{flex-basis:100%;font-size:11px;color:var(--md-on-surface-variant);padding-left:14px}
.intent-evidence{font-family:var(--code-font);opacity:.8}
.intent-source{font-size:10px;font-weight:650;color:var(--md-primary)}
.intent-feedback{margin-top:8px;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,var(--md-error,#b3261e) 8%,transparent);font-size:12px;line-height:1.55}
.intent-feedback strong{display:block;margin-bottom:3px;color:var(--md-error,#b3261e);font-size:11.5px;letter-spacing:.02em}
.intent-feedback p{margin:0}
.intent-feedback ul{margin:6px 0 0;padding-left:18px;color:var(--md-on-surface-variant)}
</style>
