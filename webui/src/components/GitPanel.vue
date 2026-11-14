<script setup lang="ts">
/**
 * The git panel: what is uncommitted, what changed, and committing it.
 *
 * Everything here talks to `/api/agent/git`, which already did status, log,
 * diff, stage, unstage, discard, commit and init — the surface existed and had
 * no way to reach it. So this is a view, not a second implementation: it does
 * not run git, and it does not decide what a valid repository is.
 *
 * Two rules it does hold itself to:
 *
 *   - Discard asks first. It is the one irreversible action on the panel, and a
 *     mis-click would destroy work that was never committed anywhere.
 *   - Commit says why it will not run, rather than failing after the click. An
 *     empty message or an empty index is a reason, not an error.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { groupStatus, parseUnifiedDiff, type DiffFile } from '../stores/git-diff'
import { useConfirm } from '../composables/confirm'

type StatusFile = { path: string; index: string; worktree: string; staged?: boolean }
type GitCommit = { hash: string; author: string; date: string; subject: string }

const props = defineProps<{ path: string }>()
const emit = defineEmits<{ (e: 'changed'): void }>()

const { t } = useI18n()
const { confirm } = useConfirm()

const loading = ref(false)
const error = ref('')
const notRepo = ref(false)
const branch = ref('')
const files = ref<StatusFile[]>([])
const commits = ref<GitCommit[]>([])
const message = ref('')
const committing = ref(false)
const selected = ref('')
const diff = ref<DiffFile[]>([])
const diffStaged = ref(false)
const diffLoading = ref(false)

const groups = computed(() => groupStatus(files.value))
const stagedCount = computed(() => groups.value.staged.length)
const canCommit = computed(() => !!message.value.trim() && stagedCount.value > 0 && !committing.value)

async function call<T>(query: string, init?: RequestInit): Promise<T | undefined> {
  const response = await fetch(`/api/agent/git?path=${encodeURIComponent(props.path)}${query}`, init)
  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const body = await response.json()
      if (body?.error) detail = String(body.error)
    } catch { /* not JSON */ }
    throw new Error(detail)
  }
  return (await response.json()) as T
}

async function load() {
  if (!props.path) return
  loading.value = true
  error.value = ''
  try {
    const status = await call<{ root: string; branch: string; files: StatusFile[] }>('&action=status')
    notRepo.value = false
    branch.value = status?.branch || ''
    files.value = status?.files || []
    const log = await call<{ commits: GitCommit[] }>('&action=log').catch(() => undefined)
    commits.value = log?.commits || []
  } catch (failure) {
    // A path with no repository is a state to render, not an error to shout
    // about: the panel offers to create one.
    const text = failure instanceof Error ? failure.message : String(failure)
    if (/not a git repository|not_a_repo|git_failed|400/i.test(text)) {
      notRepo.value = true
      files.value = []
      commits.value = []
    } else {
      error.value = t('ide.gitFailed', { error: text })
    }
  } finally {
    loading.value = false
  }
}

async function post(action: string, body: Record<string, unknown>) {
  error.value = ''
  try {
    const response = await fetch('/api/agent/git', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: props.path, action, ...body }),
    })
    if (!response.ok) {
      let detail = `HTTP ${response.status}`
      try {
        const parsed = await response.json()
        if (parsed?.error) detail = String(parsed.error)
      } catch { /* not JSON */ }
      throw new Error(detail)
    }
    await load()
    emit('changed')
    return true
  } catch (failure) {
    error.value = t('ide.gitFailed', { error: failure instanceof Error ? failure.message : String(failure) })
    return false
  }
}

async function openDiff(path: string, staged: boolean) {
  selected.value = path
  diffStaged.value = staged
  diffLoading.value = true
  diff.value = []
  try {
    const payload = await call<{ diff: string }>(`&action=diff&file=${encodeURIComponent(path)}${staged ? '&staged=1' : ''}`)
    diff.value = parseUnifiedDiff(payload?.diff || '')
  } catch (failure) {
    error.value = t('ide.gitFailed', { error: failure instanceof Error ? failure.message : String(failure) })
  } finally {
    diffLoading.value = false
  }
}

async function stage(path: string) {
  await post('stage', { files: [path] })
}

async function unstage(path: string) {
  await post('unstage', { files: [path] })
}

async function discard(path: string) {
  const ok = await confirm({
    title: t('ide.gitDiscard'),
    message: t('ide.gitDiscardConfirm', { name: path }),
    confirmLabel: t('ide.gitDiscard'),
    danger: true,
  })
  if (!ok) return
  await post('discard', { files: [path] })
}

async function commit() {
  if (!canCommit.value) return
  committing.value = true
  try {
    const done = await post('commit', { message: message.value.trim() })
    if (done) message.value = ''
  } finally {
    committing.value = false
  }
}

async function init() {
  await post('init', {})
  await load()
}

onMounted(load)
watch(() => props.path, () => { void load() })
</script>

<template>
  <div class="git-panel">
    <p v-if="loading" class="hint">{{ t('ide.gitLoading') }}</p>

    <div v-else-if="notRepo" class="git-empty">
      <p class="hint">{{ t('ide.gitNotARepo') }}</p>
      <button type="button" class="ghost" @click="init">{{ t('ide.gitInit') }}</button>
    </div>

    <template v-else>
      <header class="git-head">
        <span class="branch" :title="path">{{ branch || '—' }}</span>
        <button type="button" class="ghost" :disabled="loading" @click="load">{{ t('ide.gitRefresh') }}</button>
      </header>

      <p v-if="error" class="hint bad">{{ error }}</p>
      <p v-if="!files.length" class="hint">{{ t('ide.gitClean') }}</p>

      <div v-if="files.length" class="git-body">
        <section class="git-lists">
          <div v-if="groups.staged.length" class="git-group">
            <h3>{{ t('ide.gitStaged') }} · {{ groups.staged.length }}</h3>
            <div v-for="file in groups.staged" :key="`s-${file.path}`" class="git-row">
              <button type="button" class="git-file" :class="{ active: selected === file.path && diffStaged }" @click="openDiff(file.path, true)">
                <span class="state">{{ file.state }}</span>
                <span class="name">{{ file.path }}</span>
              </button>
              <button type="button" class="mini" :title="t('ide.gitUnstage')" @click="unstage(file.path)">{{ t('ide.gitUnstage') }}</button>
            </div>
          </div>

          <div v-if="groups.unstaged.length" class="git-group">
            <h3>{{ t('ide.gitChanges') }} · {{ groups.unstaged.length }}</h3>
            <div v-for="file in groups.unstaged" :key="`u-${file.path}`" class="git-row">
              <button type="button" class="git-file" :class="{ active: selected === file.path && !diffStaged }" @click="openDiff(file.path, false)">
                <span class="state">{{ file.state }}</span>
                <span class="name">{{ file.path }}</span>
              </button>
              <button type="button" class="mini" :title="t('ide.gitStage')" @click="stage(file.path)">{{ t('ide.gitStage') }}</button>
              <button type="button" class="mini danger" :title="t('ide.gitDiscard')" @click="discard(file.path)">{{ t('ide.gitDiscard') }}</button>
            </div>
          </div>

          <div class="commit-box">
            <textarea v-model="message" rows="2" :placeholder="t('ide.gitCommitMessage')"></textarea>
            <div class="commit-actions">
              <span v-if="!message.trim()" class="hint inline">{{ t('ide.gitCommitNeedsMessage') }}</span>
              <span v-else-if="!stagedCount" class="hint inline">{{ t('ide.gitCommitNeedsStaged') }}</span>
              <button type="button" class="primary" :disabled="!canCommit" @click="commit">{{ t('ide.gitCommit') }}</button>
            </div>
          </div>

          <div v-if="commits.length" class="git-log">
            <h3>{{ t('ide.gitHistory') }}</h3>
            <div v-for="entry in commits" :key="entry.hash" class="commit-row" :title="`${entry.author} · ${entry.date}`">
              <code>{{ entry.hash }}</code>
              <span class="subject">{{ entry.subject }}</span>
            </div>
          </div>
        </section>

        <section class="git-diff">
          <p v-if="diffLoading" class="hint">{{ t('ide.gitLoading') }}</p>
          <p v-else-if="!selected" class="hint">{{ t('ide.gitDiffHint') }}</p>
          <p v-else-if="!diff.length" class="hint">{{ t('ide.gitDiffHint') }}</p>
          <div v-else class="diff-scroll">
            <div v-for="(file, index) in diff" :key="index" class="diff-file">
              <div class="diff-file-head">
                <span class="diff-path">{{ file.path }}</span>
                <span class="diff-stat"><span class="plus">+{{ file.added_ }}</span> <span class="minus">-{{ file.removed }}</span></span>
              </div>
              <pre class="diff-body"><span
                v-for="(line, i) in file.lines"
                :key="i"
                class="diff-line"
                :class="line.kind"
              ><span class="ln">{{ line.oldLine ?? '' }}</span><span class="ln">{{ line.newLine ?? '' }}</span><span class="mark">{{ line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : line.kind === 'context' ? ' ' : '' }}</span>{{ line.text }}</span></pre>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.git-panel { display: flex; flex-direction: column; min-height: 0; height: 100%; }
.git-head { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-bottom: 1px solid var(--md-outline-variant); }
.branch { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 12px/1.4 ui-monospace, Consolas, monospace; color: var(--md-on-surface-variant); }
.git-empty { padding: 12px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.git-body { display: grid; grid-template-columns: minmax(220px, 40%) 1fr; min-height: 0; flex: 1; }
.git-lists { border-right: 1px solid var(--md-outline-variant); overflow: auto; padding: 8px; display: flex; flex-direction: column; gap: 10px; }
.git-group h3, .git-log h3 { margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--md-on-surface-variant); }
.git-row { display: flex; align-items: center; gap: 4px; }
.git-file { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; border: 0; background: transparent; border-radius: 6px; padding: 3px 5px; text-align: left; font: inherit; font-size: 12px; cursor: pointer; color: var(--md-on-surface); }
.git-file:hover, .git-file.active { background: color-mix(in srgb, var(--md-primary) 12%, transparent); }
.git-file .state { flex: none; color: var(--md-on-surface-variant); font-size: 10.5px; text-transform: uppercase; }
.git-file .name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: rtl; text-align: left; }
.mini { flex: none; border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 6px; padding: 1px 5px; font-size: 10.5px; cursor: pointer; color: var(--md-on-surface-variant); }
.mini:hover { color: var(--md-primary); border-color: var(--md-primary); }
.mini.danger:hover { color: var(--md-error); border-color: var(--md-error); }
.commit-box { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; border-top: 1px solid var(--md-outline-variant); }
.commit-box textarea { width: 100%; resize: vertical; border: 1px solid var(--md-outline-variant); border-radius: 8px; padding: 6px 8px; font: inherit; font-size: 12px; background: var(--md-surface-container-lowest); color: var(--md-on-surface); }
.commit-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.git-log { display: flex; flex-direction: column; gap: 2px; }
.commit-row { display: flex; gap: 6px; font-size: 11.5px; min-width: 0; }
.commit-row code { flex: none; color: var(--md-primary); font-size: 10.5px; }
.commit-row .subject { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--md-on-surface-variant); }
.git-diff { min-width: 0; display: flex; flex-direction: column; }
.diff-scroll { overflow: auto; flex: 1; }
.diff-file-head { display: flex; align-items: center; gap: 8px; padding: 5px 8px; background: var(--md-surface-container); border-bottom: 1px solid var(--md-outline-variant); position: sticky; top: 0; }
.diff-path { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 11.5px/1.4 ui-monospace, Consolas, monospace; }
.diff-stat { flex: none; font-size: 11px; font-variant-numeric: tabular-nums; }
.diff-stat .plus { color: #15803d; }
.diff-stat .minus { color: #b91c1c; }
.diff-body { margin: 0; font: 11.5px/1.5 ui-monospace, Consolas, monospace; }
.diff-line { display: block; white-space: pre; padding: 0 8px; }
.diff-line .ln { display: inline-block; width: 34px; text-align: right; margin-right: 6px; color: var(--md-on-surface-variant); opacity: .5; user-select: none; }
.diff-line .mark { display: inline-block; width: 10px; user-select: none; }
.diff-line.add { background: color-mix(in srgb, #16a34a 14%, transparent); }
.diff-line.add .mark { color: #15803d; }
.diff-line.del { background: color-mix(in srgb, #dc2626 14%, transparent); }
.diff-line.del .mark { color: #b91c1c; }
.diff-line.hunk { color: var(--md-primary); background: color-mix(in srgb, var(--md-primary) 8%, transparent); }
.diff-line.meta { color: var(--md-on-surface-variant); opacity: .7; }
.hint { margin: 8px; color: var(--md-on-surface-variant); font-size: 12px; }
.hint.bad { color: var(--md-error); }
.hint.inline { margin: 0; }
.ghost { border: 1px solid var(--md-outline-variant); background: transparent; border-radius: 8px; padding: 2px 8px; font-size: 11px; cursor: pointer; color: var(--md-on-surface-variant); }
.primary { border: 0; border-radius: 8px; padding: 4px 12px; background: var(--md-primary); color: var(--md-on-primary); font-weight: 600; font-size: 11.5px; cursor: pointer; }
.primary:disabled { opacity: .45; cursor: not-allowed; }
</style>