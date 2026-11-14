/**
 * Session list ordering, grouping and the "just finished" badge.
 *
 * Logic only. The list markup and its scoped styles stay in the page; this
 * module owns the state machine that decides what floats to the top and which
 * dot a row shows.
 */
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';
import type { TaskRow } from '../store';

export interface WorkspaceRow {
  id: string;
  title: string;
  path: string;
  createdAt?: string;
  updatedAt?: string;
  sessionIds?: string[];
  sessions?: TaskRow[];
  exists?: boolean;
}

const RECENT_DONE_MS = 5 * 60 * 1000;

export function useSessionList(options: {
  sessions: ComputedRef<TaskRow[]>;
  tasks: ComputedRef<TaskRow[]>;
  workspaces: Ref<WorkspaceRow[]>;
  selectedId: Ref<string>;
  notifyDone: (text: string) => void;
  t: (key: string, named?: Record<string, unknown>) => string;
}) {
  const { sessions, tasks, workspaces, selectedId, notifyDone, t } = options;

  const collapsed = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem('0kay.agent.ws.collapsed') || '[]')));
  const expandedGroups = ref<Set<string>>(new Set());
  const orderMode = ref<'manual' | 'recent'>(localStorage.getItem('0kay.agent.ws.order') === 'recent' ? 'recent' : 'manual');

  function setOrderMode(mode: 'manual' | 'recent') {
    orderMode.value = mode;
    localStorage.setItem('0kay.agent.ws.order', mode);
  }

  function sessionActivity(item: TaskRow): number {
    let latest = Date.parse(item.started_at || '') || 0;
    for (const task of tasks.value) {
      if (task.session_id === item.session_id && task.started_at) latest = Math.max(latest, Date.parse(task.started_at) || 0);
    }
    return latest;
  }

  /** Sessions with a task still in flight — the list marks them and floats them up. */
  const runningSessionIds = computed(() => new Set(
    tasks.value.filter((row) => row.session_id && ['running', 'pending'].includes(row.state)).map((row) => row.session_id as string),
  ));

  /**
   * When each session last finished, so a run that just completed can sit at the
   * top for a few minutes instead of being buried under newer-but-idle sessions.
   */
  const finishedAt = ref<Record<string, number>>({});
  const previousRunning = new Set<string>();
  watch(runningSessionIds, (now) => {
    const stamp = Date.now();
    for (const id of previousRunning) {
      if (!now.has(id)) {
        finishedAt.value = { ...finishedAt.value, [id]: stamp };
        // A session that finished while another was selected is worth a word:
        // the run may have been long enough that the user moved on.
        if (id !== selectedId.value) {
          const row = sessions.value.find((item) => item.session_id === id);
          notifyDone(row?.prompt || t('agent.page.untitledSession'));
        }
      }
    }
    previousRunning.clear();
    now.forEach((id) => previousRunning.add(id));
  }, { immediate: true });

  const recentlyDone = (sessionId?: string) => {
    const at = finishedAt.value[sessionId || ''] || 0;
    return at > 0 && Date.now() - at < RECENT_DONE_MS;
  };

  /** '' | 'running' | 'done' — drives the dot on the session card. */
  const sessionState = (item: TaskRow) => runningSessionIds.value.has(item.session_id || '')
    ? 'running'
    : recentlyDone(item.session_id) ? 'done' : '';

  const arrange = (list: TaskRow[]) => {
    // Running first, then what just finished, then the user's chosen order.
    const running = list.filter((item) => sessionState(item) === 'running');
    const done = list.filter((item) => sessionState(item) === 'done')
      .sort((a, b) => (finishedAt.value[b.session_id as string] || 0) - (finishedAt.value[a.session_id as string] || 0));
    const seen = new Set([...running, ...done].map((item) => item.task_id));
    const rest = list.filter((item) => !seen.has(item.task_id));
    const ordered = orderMode.value === 'recent'
      ? [...rest].sort((a, b) => sessionActivity(b) - sessionActivity(a))
      : rest;
    return [...running, ...done, ...ordered];
  };

  const sessionGroups = computed(() => {
    const groups = workspaces.value.map((workspace) => ({
      id: workspace.id,
      title: workspace.title,
      path: workspace.path,
      exists: workspace.exists !== false,
      sessions: arrange(sessions.value.filter((item) => (workspace.sessionIds || []).includes(item.session_id || ''))),
    }));
    const claimed = new Set(workspaces.value.flatMap((workspace) => workspace.sessionIds || []));
    return { groups, ungrouped: arrange(sessions.value.filter((item) => !claimed.has(item.session_id || ''))) };
  });

  function toggleGroup(id: string) {
    const next = new Set(collapsed.value);
    if (next.has(id)) next.delete(id); else next.add(id);
    collapsed.value = next;
    localStorage.setItem('0kay.agent.ws.collapsed', JSON.stringify([...next]));
  }

  const isExpanded = (id: string) => expandedGroups.value.has(id);
  function toggleExpanded(id: string) {
    const next = new Set(expandedGroups.value);
    if (next.has(id)) next.delete(id); else next.add(id);
    expandedGroups.value = next;
  }
  const visibleSessions = (group: { id: string; sessions: TaskRow[] }) => isExpanded(group.id) ? group.sessions : group.sessions.slice(0, 5);

  return {
    collapsed,
    expandedGroups,
    orderMode,
    setOrderMode,
    sessionState,
    sessionGroups,
    toggleGroup,
    isExpanded,
    toggleExpanded,
    visibleSessions,
  };
}
