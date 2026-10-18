<script setup lang="ts">
/**
 * Git panel for the current workspace.
 *
 * Talks to Core's `/api/agent/git` (see core/internal/gateway/agent_git.go):
 *   GET  ?action=status&path=…            → { root, branch, files[] }
 *   POST { path, action, files?, message? } → the same status payload
 * with `action` one of stage / unstage / discard / commit / init.
 *
 * Two failures are normal rather than exceptional and get their own affordance:
 *   not_a_repo     — the folder is not a repository yet → one-click `init`
 *   git_forbidden  — the folder is outside Core's workspace roots → offer to add
 *                    it to 设置 → 工作区 without leaving the panel
 */
import { computed, onMounted, ref, watch } from 'vue'
import { i18n, useConfirm } from '@0kay/host'
import { allowWorkspaceRoot } from './workspaceRoots'

const t = (key: string, named?: Record<string, unknown>) => i18n.global.t(key, named ?? {})
const { confirm } = useConfirm()

interface GitFile { path: string; index: string; worktree: string; staged: boolean }

const props = defineProps<{ root: string }>()
const emit = defineEmits<{ close: [] }>()

const branch = ref('')
const files = ref<GitFile[]>([])
const loading = ref(false)
const busy = ref(false)
const error = ref('')
const errorCode = ref('')
const message = ref('')
const notice = ref('')

const staged = computed(() => files.value.filter(file => file.staged))
const unstaged = computed(() => files.value.filter(file => !file.staged))

function applyStatus(payload: any) {
  branch.value = String(payload?.branch || '')
  files.value = (Array.isArray(payload?.files) ? payload.files : []).map((file: any) => ({
    path: String(file?.path || ''),
    index: String(file?.index || ''),
    worktree: String(file?.worktree || ''),
    staged: !!file?.staged,
  }))
  error.value = ''
  errorCode.value = ''
}

function fail(payload: any, fallback: string) {
  errorCode.value = String(payload?.code || '')
  error.value = String(payload?.error || fallback)
  // A stale list under an error banner is worse than none: "stage all" would
  // send paths that belong to the previous workspace.
  files.value = []
  branch.value = ''
}

async function reload() {
  if (!props.root) return
  loading.value = true
  error.value = ''
  errorCode.value = ''
  try {
    const response = await fetch(`/api/agent/git?action=status&path=${encodeURIComponent(props.root)}`, { signal: AbortSignal.timeout(20000) })
    const payload = await response.json().catch(() => null)
    if (!response.ok) { fail(payload, t('agent.page.gitFailed')); return }
    applyStatus(payload)
  } catch (e: any) {
    error.value = e?.message || t('agent.page.gitFailed')
  } finally {
    loading.value = false
  }
}

async function act(action: string, list: string[] = [], extra: Record<string, unknown> = {}) {
  if (busy.value) return
  busy.value = true
  error.value = ''
  notice.value = ''
  try {
    const response = await fetch('/api/agent/git', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: props.root, action, files: list, ...extra }),
      signal: AbortSignal.timeout(30000),
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) { fail(payload, t('agent.page.gitFailed')); return }
    applyStatus(payload)
    if (action === 'commit') {
      message.value = ''
      notice.value = t('agent.page.gitCommitted')
    }
  } catch (e: any) {
    error.value = e?.message || t('agent.page.gitFailed')
  } finally {
    busy.value = false
  }
}

async function discard(file: GitFile) {
  const ok = await confirm({
    title: t('agent.page.gitDiscardTitle'),
    message: t('agent.page.gitDiscardConfirm', { name: file.path }),
    confirmLabel: t('agent.page.gitDiscard'),
    danger: true,
  })
  if (ok) await act('discard', [file.path])
}

async function allowRoot() {
  busy.value = true
  const ok = await allowWorkspaceRoot(props.root)
  busy.value = false
  if (!ok) { error.value = t('agent.page.gitAllowFailed'); return }
  await reload()
}

function badge(file: GitFile): string {
  const code = file.index !== ' ' && file.index !== '?' ? file.index : file.worktree
  if (file.index === '?' && file.worktree === '?') return 'U'
  return (code || 'M').trim() || 'M'
}

const canCommit = computed(() => !!message.value.trim() && staged.value.length > 0 && !busy.value)

onMounted(reload)
watch(() => props.root, reload)
</script>

<template>
  <section class="git-panel" role="dialog" aria-modal="false" :aria-label="t('agent.page.gitTitle')">
    <header class="git-head">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="8" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M6 8.4v7.2M18 10.4c0 3-2.4 3.6-6 3.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      <strong>{{ t('agent.page.gitTitle') }}</strong>
      <span v-if="branch" class="git-branch" :title="props.root">{{ branch }}</span>
      <span v-if="files.length" class="git-count">{{ files.length }}</span>
      <button type="button" class="git-icon" :title="t('agent.page.gitRefresh')" :aria-label="t('agent.page.gitRefresh')" :disabled="loading || busy" @click="reload">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="git-icon" :title="t('agent.page.close')" :aria-label="t('agent.page.close')" @click="emit('close')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </header>

    <p class="git-root" :title="props.root">{{ props.root || t('agent.page.gitNoRoot') }}</p>

    <div class="git-body">
      <p v-if="loading" class="git-state"><span class="git-spin" aria-hidden="true"></span>{{ t('agent.page.gitWorking') }}</p>

      <template v-else-if="errorCode === 'not_a_repo'">
        <div class="git-state block">
          <p>{{ t('agent.page.gitNoRepo') }}</p>
          <button type="button" class="git-btn primary" :disabled="busy" @click="act('init')">{{ t('agent.page.gitInit') }}</button>
        </div>
      </template>

      <template v-else-if="errorCode === 'git_forbidden'">
        <div class="git-state block">
          <p>{{ t('agent.page.gitForbidden') }}</p>
          <p class="git-error">{{ error }}</p>
          <button type="button" class="git-btn primary" :disabled="busy" @click="allowRoot">{{ t('agent.page.gitAllowRoot') }}</button>
        </div>
      </template>

      <p v-else-if="error" class="git-error">{{ error }}</p>

      <template v-else>
        <p v-if="!files.length" class="git-state">{{ t('agent.page.gitClean') }}</p>

        <section v-if="staged.length" class="git-group">
          <header><span>{{ t('agent.page.gitStaged') }}</span><small>{{ staged.length }}</small></header>
          <div v-for="file in staged" :key="`s-${file.path}`" class="git-row">
            <span class="git-badge staged">{{ badge(file) }}</span>
            <span class="git-path" :title="file.path">{{ file.path }}</span>
            <button type="button" class="git-link" :disabled="busy" @click="act('unstage', [file.path])">{{ t('agent.page.gitUnstage') }}</button>
          </div>
        </section>

        <section v-if="unstaged.length" class="git-group">
          <header>
            <span>{{ t('agent.page.gitChanges') }}</span><small>{{ unstaged.length }}</small>
            <!-- Bulk action in the header: with 60 changed files the button used
                 to sit below the last row, i.e. off-screen. -->
            <button type="button" class="git-link bulk" :disabled="busy" @click="act('stage', unstaged.map(file => file.path))">{{ t('agent.page.gitStageAll') }}</button>
          </header>
          <div v-for="file in unstaged" :key="`u-${file.path}`" class="git-row">
            <span class="git-badge">{{ badge(file) }}</span>
            <span class="git-path" :title="file.path">{{ file.path }}</span>
            <button type="button" class="git-link" :disabled="busy" @click="act('stage', [file.path])">{{ t('agent.page.gitStage') }}</button>
            <button type="button" class="git-link danger" :disabled="busy" @click="discard(file)">{{ t('agent.page.gitDiscard') }}</button>
          </div>
        </section>
      </template>
    </div>

    <footer class="git-foot">
      <textarea v-model="message" rows="2" :placeholder="t('agent.page.gitCommitMessage')" :aria-label="t('agent.page.gitCommitMessage')" :disabled="busy" @keydown.ctrl.enter.prevent="canCommit && act('commit', [], { message })" />
      <button type="button" class="git-btn primary" :disabled="!canCommit" @click="act('commit', [], { message })">{{ t('agent.page.gitCommit') }}</button>
      <p v-if="notice" class="git-notice">{{ notice }}</p>
    </footer>
  </section>
</template>

<style scoped>
/* Same visual family as the tree / browser panels, but self-contained: those
   rules live in AgentsPage's scoped block and cannot reach this component. */
.git-panel{position:fixed;right:76px;top:96px;z-index:var(--z-panel,3000);width:392px;max-width:calc(100vw - 120px);max-height:min(560px,calc(100vh - 200px));display:flex;flex-direction:column;border:1px solid var(--md-outline-variant);border-radius:14px;overflow:hidden;background:var(--md-surface-container-low);box-shadow:var(--shadow-4);color:var(--md-on-surface);font-family:var(--font-family)}
.git-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--md-outline-variant);color:var(--md-on-surface-variant)}
.git-head strong{font-size:13px;font-weight:700;color:var(--md-on-surface)}
.git-branch{max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 8px;border-radius:999px;background:var(--md-surface-container-high);font-size:11.5px;font-weight:600}
.git-count{margin-left:auto;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--md-primary) 16%,transparent);color:var(--md-primary);font-size:11px;font-weight:700;line-height:18px}
#app .git-panel .git-icon{min-height:0;width:26px;height:26px;padding:0;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;color:inherit;cursor:pointer}
#app .git-panel .git-icon:hover:not(:disabled){background:var(--md-surface-container-high);color:var(--md-on-surface)}
.git-root{margin:0;padding:6px 12px;border-bottom:1px solid var(--md-outline-variant);font-size:11px;color:var(--md-on-surface-variant);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:rtl;text-align:left}
.git-body{flex:1;min-height:0;overflow:auto;padding:8px 10px}
.git-state{display:flex;align-items:center;justify-content:center;gap:8px;padding:22px 10px;font-size:12.5px;color:var(--md-on-surface-variant);text-align:center}
.git-state.block{flex-direction:column;align-items:stretch;gap:10px;text-align:left}
.git-state.block p{margin:0;line-height:1.5}
.git-spin{width:13px;height:13px;border-radius:50%;border:2px solid var(--md-outline-variant);border-top-color:var(--md-primary);animation:git-spin 800ms linear infinite}
@keyframes git-spin{to{transform:rotate(360deg)}}
.git-group{margin-bottom:6px}
.git-group>header{display:flex;align-items:center;gap:6px;padding:6px 4px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}
.git-group>header small{padding:0 6px;border-radius:999px;background:var(--md-surface-container-high);font-size:10.5px;letter-spacing:0}
#app .git-panel .git-link.bulk{margin-left:auto;text-transform:none;letter-spacing:0;font-size:11px}
.git-row{display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:8px}
.git-row:hover{background:var(--md-surface-container)}
.git-badge{flex:none;width:18px;height:18px;display:grid;place-items:center;border-radius:5px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);font-size:10.5px;font-weight:800}
.git-badge.staged{background:color-mix(in srgb,var(--md-success,#1a9e63) 20%,transparent);color:var(--md-success,#1a9e63)}
.git-path{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;direction:rtl;text-align:left}
#app .git-panel .git-link{min-height:0;padding:2px 6px;border:0;border-radius:6px;background:transparent;color:var(--md-primary);font-size:11px;font-weight:650;cursor:pointer}
#app .git-panel .git-link:hover:not(:disabled){background:color-mix(in srgb,var(--md-primary) 12%,transparent)}
#app .git-panel .git-link.danger{color:var(--md-error)}
#app .git-panel .git-link.danger:hover:not(:disabled){background:color-mix(in srgb,var(--md-error) 12%,transparent)}
#app .git-panel .git-btn{min-height:0;padding:7px 12px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:12px;font-weight:650;cursor:pointer}
#app .git-panel .git-btn:hover:not(:disabled){background:var(--md-surface-container-highest)}
#app .git-panel .git-btn.primary{background:var(--md-primary);border-color:transparent;color:var(--md-on-primary,#fff)}
#app .git-panel .git-btn:disabled{opacity:.5;cursor:not-allowed}
.git-foot{display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-top:1px solid var(--md-outline-variant)}
.git-foot textarea{width:100%;resize:none;padding:8px 10px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:inherit;font-size:12.5px;line-height:1.5}
.git-foot textarea:focus{outline:2px solid var(--md-primary);outline-offset:1px}
.git-error{margin:0;color:var(--md-error);font-size:11.5px;line-height:1.5;word-break:break-word}
.git-notice{margin:0;color:var(--md-success,#1a9e63);font-size:11.5px}
@media (max-width:800px){.git-panel{right:12px;left:12px;width:auto;top:76px}}
</style>
