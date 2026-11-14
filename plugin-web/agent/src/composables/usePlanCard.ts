/**
 * The plan card: which steps exist, which the user vetoed, and what Build sends.
 *
 * Logic only — the card's markup and styles stay in the page. That is the
 * pattern for this file: a child component would move the DOM under a different
 * scope id and the scoped CSS would stop applying, but a composable moves
 * nothing the stylesheet can see.
 */
import { computed, ref, type ComputedRef, type Ref } from 'vue';

export interface PlanCard {
  title: string;
  markdown: string;
  steps: number;
  demo: string;
  diagram: string;
  openQuestions: string[];
}

export interface PlanStep {
  n: number;
  text: string;
}

const SECTION_WORDS = /^(问题|边界|数据|步骤|迁移|验证|风险|problem|scope|data|step|migration|verify|risk)/i;

export function usePlanCard(options: {
  currentPlan: ComputedRef<PlanCard | null>;
  busy: Ref<boolean>;
  active: Ref<boolean>;
  send: (text: string) => Promise<void>;
  t: (key: string, named?: Record<string, unknown>) => string;
}) {
  const { currentPlan, busy, active, send, t } = options;
  const planOpen = ref(true);
  const rejectedSteps = ref<number[]>([]);

  const planSteps = computed<PlanStep[]>(() => {
    const markdown = currentPlan.value?.markdown || '';
    const found: PlanStep[] = [];
    for (const line of markdown.split(String.fromCharCode(10))) {
      const heading = /^#{2,4}\s+(.+)$/.exec(line.trim());
      const numbered = /^(\d{1,2})[.)]\s+(.+)$/.exec(line.trim());
      const text = heading ? heading[1].trim() : numbered ? numbered[2].trim() : '';
      if (!text) continue;
      if (SECTION_WORDS.test(text)) continue;
      found.push({ n: found.length + 1, text: text.replace(/[*`]/g, '').slice(0, 90) });
      if (found.length >= 12) break;
    }
    return found;
  });

  const isRejected = (n: number) => rejectedSteps.value.includes(n);

  function toggleStep(n: number) {
    rejectedSteps.value = isRejected(n)
      ? rejectedSteps.value.filter((entry) => entry !== n)
      : [...rejectedSteps.value, n];
  }

  async function buildPlan() {
    if (!currentPlan.value || busy.value || active.value) return;
    planOpen.value = false;
    const vetoed = planSteps.value.filter((step) => isRejected(step.n));
    if (!vetoed.length) {
      await send(t('agent.page.planBuildMessage'));
      return;
    }
    // The veto travels inside the message so every executor sees it, no matter
    // which transport carried the request.
    const note = t('agent.page.planRejectedNote', {
      steps: vetoed.map((step) => `${step.n}. ${step.text}`).join(String.fromCharCode(10)),
    });
    const gap = String.fromCharCode(10, 10);
    await send(`${t('agent.page.planBuildMessage')}${gap}${note}`);
    rejectedSteps.value = [];
  }

  return { planOpen, planSteps, rejectedSteps, isRejected, toggleStep, buildPlan };
}
