/**
 * The assessment task pane: its detail, its controls, and the tab it is on.
 *
 * Logic only. The pane's markup and styles stay in the page — the same rule as
 * the other composables here, because a child component would put the DOM under
 * a different scope id and the scoped CSS would stop applying.
 */
import { computed, ref, type Ref } from 'vue';

export interface ReconTaskRow {
  id: string;
  /** Missing on tasks created before engineering mode existed; means recon. */
  kind?: 'recon' | 'engineering';
  objective: string;
  status: string;
  createdAt: string;
  endedAt?: string;
  stopped?: string;
  error?: string;
  goalTexts: Array<{ id: string; text: string }>;
  scope: string[];
  report?: { rounds: number; intents: number; facts: number; findings: number; proven: boolean; pct: number | null };
}

/**
 * One planner round as the reviewer judged it.
 *
 * Mirrors `AssessmentReview` on the agent side. The dimension notes are the
 * substance here: a verdict word alone tells you a plan was sent back, not why.
 */
export interface TaskReview {
  round: number;
  at: string;
  plan: Array<{ id: string; text: string; needs: string[] }>;
  intents: string[];
  verdict: 'accept' | 'revise' | 'reject';
  dimensions: Array<{ id: string; question: string; verdict: 'ok' | 'weak' | 'fails'; note?: string }>;
  revision?: string;
  revised: boolean;
  error?: string;
}

export interface TaskDetail {
  state: ReconTaskRow & { activity: Array<{ at: string; round: number; kind: string; text: string }>; targets: string[]; coverageArg?: number; constraints: string[]; reviews?: TaskReview[] };
  live?: {
    coverage: { total: number; tested: number; scope: { rows: number; denominator: number; pct: number | null } };
    goals: Array<{ id: string; text: string; status: string }>;
    openIntents: Array<{ id: string; text: string }>;
    runningIntents: number;
    findings: Array<{ id: string; text: string; status: string }>;
    digests: number;
    /** The recon engine's own sessions: planner rounds, workers, system events. */
    sessions: Array<{ id: string; kind: string; refId?: string; title?: string; text?: string; status?: string; round?: number }>;
    usage?: { inTokens?: number; outTokens?: number; llmCalls?: number };
  };
}

export type TaskDetailTab = 'sessions' | 'overview' | 'plans' | 'graph' | 'board' | 'findings' | 'assets' | 'approvals' | 'report';

export function useTaskDetail(options: {
  selectedId: Ref<string>;
  locale: Ref<string>;
  t: (key: string, named?: Record<string, unknown>) => string;
  pollAssessments: () => Promise<void>;
}) {
  const { selectedId, locale, t, pollAssessments } = options;

  const taskDetail = ref<TaskDetail | null>(null);
  const taskSelectedId = ref<string | null>(null);
  const taskShowNew = ref(false);
  const taskCreating = ref(false);
  const taskError = ref('');
  const newTaskKind = ref<'recon' | 'engineering'>('recon');
  const newTaskObjective = ref('');
  const newTaskTargets = ref('');
  const newTaskCoverage = ref('');
  const newTaskModel = ref('');
  // The engine accepts these too; the form only showed the first four, so a
  // task always ran on defaults nobody could see.
  const newTaskRounds = ref('');
  const newTaskIntents = ref('');
  const newTaskConcurrency = ref('');
  const hintDraft = ref('');
  const taskDetailTab = ref<TaskDetailTab>('overview');

  async function runAssessments(args: Record<string, any>): Promise<any> {
    // A cross-session read needs no session: refusing it when nothing is selected
    // is what made the tasks tab go blank on a fresh page load.
    if (!selectedId.value && args.all !== true) throw new Error(t('agent.page.taskNeedSession'));
    // Polls fail fast so a gated or stale agent cannot stack hung requests.
    // create/report run the goals phase / render a file first and legitimately
    // take longer, so they get their own budget.
    const long = args.action === 'create' || args.action === 'report';
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'assessments', args: JSON.stringify(args), session_id: selectedId.value || 'tasks-tab' }),
      signal: AbortSignal.timeout(long ? 180_000 : 8000),
    });
    const data = await response.json();
    if (!data?.success) throw new Error(data?.error || 'assessments call failed');
    return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
  }

  async function loadTaskDetail() {
    if (!taskSelectedId.value) return;
    taskDetail.value = await runAssessments({ action: 'get', id: taskSelectedId.value });
  }

  /** Leave the task pane and go back to the conversation it was opened from. */
  function closeTask(): void {
    taskSelectedId.value = null;
    taskDetail.value = null;
  }

  async function openTask(id: string) {
    taskSelectedId.value = id;
    taskDetail.value = null;
    hintDraft.value = '';
    taskShowNew.value = false;
    taskDetailTab.value = 'overview';
    await loadTaskDetail().catch(() => {});
  }

  // Every action shows its failure INLINE: an error escaping an event handler
  // reaches the host's error boundary and takes the whole page down with it.
  async function controlTask(operation: string) {
    if (!taskSelectedId.value) return;
    taskError.value = '';
    try {
      await runAssessments({ action: 'control', id: taskSelectedId.value, operation });
      await Promise.all([pollAssessments().catch(() => {}), loadTaskDetail().catch(() => {})]);
    } catch (e: any) {
      taskError.value = e?.message || String(e);
    }
  }

  async function sendHint() {
    const text = hintDraft.value.trim();
    if (!taskSelectedId.value || !text) return;
    taskError.value = '';
    try {
      hintDraft.value = '';
      // `say` instead of `hint`: this input talks to the running agent (it lands
      // in the constraints the next planning round re-reads), which is what the
      // box promises. Graph-level hints stay available through the tool.
      await runAssessments({ action: 'say', id: taskSelectedId.value, text });
      await loadTaskDetail().catch(() => {});
    } catch (e: any) {
      taskError.value = e?.message || String(e);
    }
  }

  async function createTask() {
    const objective = newTaskObjective.value.trim();
    const targets = newTaskTargets.value.split(/[\n,]+/).map((entry) => entry.trim()).filter(Boolean);
    if (!objective || !targets.length) return;
    taskError.value = '';
    if (!selectedId.value) { taskError.value = t('agent.page.taskNeedSession'); return; }
    taskCreating.value = true;
    try {
      const created = await runAssessments({
        action: 'create',
        ...(newTaskKind.value === 'engineering' ? { kind: 'engineering' } : {}),
        objective,
        targets,
        ...(newTaskCoverage.value ? { coverage: Number(newTaskCoverage.value) } : {}),
        ...(newTaskRounds.value ? { rounds: Number(newTaskRounds.value) } : {}),
        ...(newTaskIntents.value ? { intents: Number(newTaskIntents.value) } : {}),
        ...(newTaskConcurrency.value ? { concurrency: Number(newTaskConcurrency.value) } : {}),
        ...(newTaskModel.value ? { model: newTaskModel.value } : {}),
        language: locale.value.startsWith('zh') ? 'zh' : 'en',
      });
      newTaskObjective.value = ''; newTaskTargets.value = ''; newTaskCoverage.value = '';
      newTaskRounds.value = ''; newTaskIntents.value = ''; newTaskConcurrency.value = ''; newTaskModel.value = '';
      taskShowNew.value = false;
      await pollAssessments().catch(() => {});
      if (created?.id) await openTask(created.id);
    } catch (e: any) {
      taskError.value = e?.message || String(e);
    } finally {
      taskCreating.value = false;
    }
  }

  function deleteTask(id: string) {
    if (taskSelectedId.value === id) { taskSelectedId.value = null; taskDetail.value = null; }
    void runAssessments({ action: 'control', id, operation: 'delete' }).then(() => pollAssessments()).catch(() => {});
  }

  /** Reviewer verdicts, newest round first: the newest plan is the live one. */
  const taskReviews = computed<TaskReview[]>(() => {
    const rows = taskDetail.value?.state?.reviews || [];
    return [...rows].sort((a, b) => b.round - a.round);
  });

  const taskPercent = computed(() => {
    const live = taskDetail.value?.live;
    if (!live) return null;
    if (live.coverage.scope.pct != null) return live.coverage.scope.pct;
    return live.coverage.total ? Math.round((live.coverage.tested / live.coverage.total) * 100) : 0;
  });

  return {
    taskDetail,
    taskSelectedId,
    taskShowNew,
    taskCreating,
    taskError,
    newTaskKind,
    newTaskObjective,
    newTaskTargets,
    newTaskCoverage,
    newTaskRounds,
    newTaskIntents,
    newTaskConcurrency,
    newTaskModel,
    hintDraft,
    taskDetailTab,
    runAssessments,
    loadTaskDetail,
    closeTask,
    openTask,
    controlTask,
    sendHint,
    createTask,
    deleteTask,
    taskPercent,
    taskReviews,
  };
}
