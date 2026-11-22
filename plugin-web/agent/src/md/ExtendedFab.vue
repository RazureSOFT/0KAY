<script setup lang="ts">
/**
 * MD3 extended FAB.
 *
 * The agent page's "new chat" control is a pill button inside the session list's
 * header — visually a chip, semantically the page's primary creation action. MD3
 * puts that action in a FAB, floating over the content it creates into, so it is
 * always reachable without scrolling and always in the same place.
 *
 * Values are `ExtendedFabPrimaryTokens` (v0_103):
 *
 *   ContainerHeight            56dp
 *   ContainerShape             CornerLarge = 16dp     ← not the Increased 20dp
 *   ContainerColor             primary-container
 *   IconColor / LabelTextColor on-primary-container
 *   IconSize                   24dp
 *   LabelTextFont              LabelLarge
 *   ContainerElevation         Level3
 *   HoverContainerElevation    Level4      ← lifts on hover
 *   PressedContainerElevation  Level3      ← back to rest, NOT scaled
 *
 * The label is what makes it an *extended* FAB rather than a round one; a round FAB
 * with no text would leave the action unnamed, which is worse here because "new chat"
 * is not self-evident from a plus icon in a page that also creates tasks.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Button label. Extended FABs are labelled by design. */
  label: string
  /** Lower-case MD3 size; `sm` for secondary creation actions. */
  size?: 'sm' | 'md'
  disabled?: boolean
}>(), {
  size: 'md',
  disabled: false,
})

defineEmits<{ (event: 'click', value: MouseEvent): void }>()

const classes = computed(() => ['md-extended-fab', `md-extended-fab--${props.size}`, 'md-state-layer'])

/**
 * Radius inline, for the same reason the icon button does it: the host sets
 * `#app button { border-radius: 18px }` at (1,0,1), and a scoped `.md-extended-fab`
 * is (0,2,0), so a rule in this file loses. Computed geometry is data — inline style
 * outranks every selector without an id.
 *
 * `ContainerShape = CornerLarge`, which is the baseline 16dp, not the Increased 20dp.
 */
const style = computed(() => ({
  borderRadius: 'var(--md-shape-large)',
}) as Record<string, string>)
</script>

<template>
  <button
    type="button"
    :class="classes"
    :style="style"
    :disabled="disabled"
    :aria-label="label"
  >
    <span class="md-extended-fab__icon" aria-hidden="true">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </slot>
    </span>
    <span class="md-extended-fab__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.md-extended-fab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding-inline: 20px 24px;
  border: 0;
  /* Radius is inline (`style`), see the note there. */
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  /* ContainerElevation = Level3 (6dp of cast height). */
  box-shadow: var(--md-elevation-3);
  font: var(--md-type-label-large-font);
  letter-spacing: var(--md-type-label-large-tracking);
  cursor: pointer;
  white-space: nowrap;
  transition: box-shadow var(--duration-medium) var(--ease-out);
}

/* 56dp default, 48dp for the small step. Both above the 44px target floor. */
.md-extended-fab--md {
  block-size: 56px;
}
.md-extended-fab--sm {
  block-size: 48px;
  padding-inline: 16px 20px;
  gap: 8px;
}

.md-extended-fab__icon {
  display: grid;
  place-items: center;
  inline-size: 24px;
  block-size: 24px;
  flex: none;
}

.md-extended-fab__icon :deep(svg) {
  inline-size: 100%;
  block-size: 100%;
  display: block;
}

.md-extended-fab__label {
  line-height: 1;
}

/* Elevation is the FAB's affordance: it lifts on hover and settles on press. Only
   the shadow changes — a FAB that also moved would jitter at the edge of a scroll
   container, and these tokens say exactly that:
     ContainerElevation        Level3
     HoverContainerElevation   Level4
     PressedContainerElevation Level3  (back to rest) */
.md-extended-fab:hover:not(:disabled) {
  box-shadow: var(--md-elevation-4);
}

.md-extended-fab:active:not(:disabled) {
  /* Back to the rest elevation. No scale: the FAB is a large surface, and scaling a
     large surface reads as a glitch rather than as feedback. */
  box-shadow: var(--md-elevation-3);
}

.md-extended-fab:disabled {
  background: color-mix(in srgb, var(--md-on-surface) 12%, transparent);
  color: color-mix(in srgb, var(--md-on-surface) 38%, transparent);
  box-shadow: none;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .md-extended-fab {
    transition: none;
  }
}
</style>