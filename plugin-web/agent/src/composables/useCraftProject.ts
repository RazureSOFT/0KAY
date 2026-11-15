/**
 * The craft project pane: the four-stage loop, the "how alike" checks, the
 * mismatch list and the change-request inbox.
 *
 * Logic only, like the other composables here — the markup and its scoped CSS
 * stay in the page so the style scope id is the same one the rules were written
 * against. The data comes from `assessments(action:"get")` (craft summary) and
 * every button goes through `assessments(action:"craft", operation:…)`.
 */
import { computed, ref, type Ref } from 'vue'

export interface CraftStageRow { id: string; done: boolean; active: boolean }
export interface CraftWidthRow { width: number; element: number; pixel?: number; differences: number; pass: boolean }
export interface CraftCheckRow {
  round: number
  at: string
  overall: number
  element: number
  pixel?: number
  differences: number
  confidence: number
  limitations: string[]
  widths: CraftWidthRow[]
  report: string
  json: string
  diffImages: string[]
  ready: boolean
}
export interface CraftInboxRow { id: string; at: string; text: string; applied: boolean; round: number; file: string }
export interface CraftArtifactRow { kind: string; name: string; file: string; bytes: number; at: string }
export interface CraftDifferenceRow { width: number; kind: string; path: string; original: string; rebuilt: string; delta?: number }

export interface CraftDetail {
  id: string
  taskId?: string
  root: string
  objective: string
  target: string
  mode: 'clean_room' | 'deep'
  stage: 'study' | 'build' | 'check' | 'ready'
  stages: CraftStageRow[]
  round: number
  threshold: number
  best?: { round: number; overall: number } | null
  latest?: CraftCheckRow | null
  checklist: CraftWidthRow[]
  checks: number
  inbox: CraftInboxRow[]
  limitations: string[]
  readyAt?: string | null
  study?: { url: string; widths: number[]; evidence: Array<{ width: number; confidence: number; coverage: number; limitations: string[] }>; screenshots: string[] } | null
  build?: { at: string; round: number; note: string; files: string[] } | null
  paths: { app: string; entry: string; report: string; checks: string; investigation: string; inbox: string }
  differences?: CraftDifferenceRow[]
  differenceTotal?: number
  artifacts?: CraftArtifactRow[]
}

const EMPTY_STAGES: CraftStageRow[] = ['study', 'build', 'check', 'ready'].map((id) => ({ id, done: false, active: id === 'study' }))

export function useCraftProject(options: {
  taskId: Ref<string | null>
  craft: Ref<CraftDetail | null>
  runAssessments: (args: Record<string, any>) => Promise<any>
  reload: () => Promise<void>
  openPath: (path: string) => void
}) {
  const { taskId, craft, runAssessments, reload, openPath } = options
  const craftBusy = ref(false)
  const craftError = ref('')
  const craftStudyUrl = ref('')
  const craftBuildNote = ref('')
  const craftRequestText = ref('')
  const craftThresholdDraft = ref('')
  const craftModeDraft = ref<'clean_room' | 'deep'>('clean_room')

  const craftStages = computed<CraftStageRow[]>(() => craft.value?.stages?.length ? craft.value.stages : EMPTY_STAGES)
  const craftLatest = computed<CraftCheckRow | null>(() => craft.value?.latest || null)
  const craftChecklist = computed<CraftWidthRow[]>(() => craft.value?.checklist || [])
  const craftDifferences = computed<CraftDifferenceRow[]>(() => craft.value?.differences || [])
  const craftDifferenceTotal = computed(() => craft.value?.differenceTotal ?? craftDifferences.value.length)
  const craftInbox = computed<CraftInboxRow[]>(() => (craft.value?.inbox || []).filter((row) => !row.applied))
  const craftLimitations = computed<string[]>(() => craft.value?.limitations || [])
  const craftArtifacts = computed<Array<CraftArtifactRow & { absolute: string }>>(() => {
    const root = (craft.value?.root || '').replace(/\\/g, '/').replace(/\/$/, '')
    return (craft.value?.artifacts || []).map((row) => ({ ...row, absolute: `${root}/${row.file}` }))
  })
  const craftHasStudy = computed(() => Boolean(craft.value?.study))
  const craftCanCheck = computed(() => craftHasStudy.value)

  /** One choke point: every button reports failure inline and refreshes the pane. */
  async function craftAction(args: Record<string, any>): Promise<any | null> {
    if (!taskId.value) return null
    craftBusy.value = true
    craftError.value = ''
    try {
      const result = await runAssessments({ action: 'craft', id: taskId.value, ...args })
      await reload().catch(() => {})
      return result
    } catch (e: any) {
      craftError.value = e?.message || String(e)
      return null
    } finally {
      craftBusy.value = false
    }
  }

  async function craftStudy(): Promise<void> {
    const url = craftStudyUrl.value.trim() || craft.value?.target || ''
    if (!url) { craftError.value = 'a target URL is required'; return }
    await craftAction({ operation: 'study', url, mode: craftModeDraft.value })
  }

  async function craftBuild(): Promise<void> {
    const result = await craftAction({ operation: 'build', note: craftBuildNote.value.trim() })
    if (result) craftBuildNote.value = ''
  }

  async function craftCheck(): Promise<void> {
    await craftAction({ operation: 'check' })
  }

  async function craftRequest(): Promise<void> {
    const text = craftRequestText.value.trim()
    if (!text) return
    const result = await craftAction({ operation: 'request', text })
    if (result) craftRequestText.value = ''
  }

  async function craftApply(id: string): Promise<void> {
    await craftAction({ operation: 'apply', applied_ids: [id] })
  }

  async function craftReady(): Promise<void> {
    await craftAction({ operation: 'ready' })
  }

  async function craftSetMode(mode: 'clean_room' | 'deep'): Promise<void> {
    craftModeDraft.value = mode
    await craftAction({ operation: 'mode', mode })
  }

  async function craftSetThreshold(): Promise<void> {
    const value = Number(craftThresholdDraft.value)
    if (!Number.isFinite(value) || craftThresholdDraft.value.trim() === '') return
    await craftAction({ operation: 'threshold', threshold: value })
  }

  async function craftRefresh(): Promise<void> {
    await craftAction({ operation: 'project' })
  }

  function craftOpen(row: CraftArtifactRow & { absolute: string }): void { openPath(row.absolute) }
  function craftOpenApp(): void { if (craft.value?.paths.entry) openPath(craft.value.paths.entry) }
  function craftOpenReport(): void { if (craft.value?.paths.report) openPath(craft.value.paths.report) }

  /** A score's tone: red is for work still to do, green for a passed check. */
  function craftTone(value: number | undefined): 'good' | 'warn' | 'bad' {
    if (value == null) return 'warn'
    if (value >= (craft.value?.threshold ?? 95)) return 'good'
    return value >= 60 ? 'warn' : 'bad'
  }

  function craftBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  /** A missing measurement is a dash, never "—%" or a fabricated zero. */
  function craftPercent(value: number | undefined): string {
    return value == null ? '—' : `${value}%`
  }

  return {
    craftBusy, craftError, craftStudyUrl, craftBuildNote, craftRequestText,
    craftThresholdDraft, craftModeDraft,
    craftStages, craftLatest, craftChecklist, craftDifferences, craftDifferenceTotal,
    craftInbox, craftLimitations, craftArtifacts, craftHasStudy, craftCanCheck,
    craftStudy, craftBuild, craftCheck, craftRequest, craftApply, craftReady,
    craftSetMode, craftSetThreshold, craftRefresh,
    craftOpen, craftOpenApp, craftOpenReport, craftTone, craftBytes, craftPercent,
  }
}
