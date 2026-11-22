<script setup lang="ts">
/**
 * MD3 button group.
 *
 * Material describes a button group as "an invisible container that adds padding
 * between buttons and modifies button shape" — it holds no colour of its own and
 * contains no buttons by default. That description is the whole design.
 *
 * This replaces eight hand-rolled segmented controls in the agent plugin
 * (`.filter-bar`, `.sidebar-mode`, `.mode-switch`, `.order-toggle`,
 * `.task-kind-switch`, `.task-perm`, `.recon-tabs`, `.craft-mode-switch`) which
 * disagreed on height (26/30/32/**23**px), padding and selected-state colour.
 *
 * **The group renders its own buttons.** An earlier version took them through a
 * slot and tried to shape its children with `:deep()`. That cannot work: the host's
 * `.btn` rule and a scoped `:deep()` rule have the same specificity, so the host won
 * the cascade and every child kept `border-radius: var(--radius-full)` — the group
 * had no visible effect at all. Owning the markup is what the spec means by "the
 * group modifies button shape"; it also removes the need to fight specificity.
 *
 * Variants:
 *  - `connected` — 2dp between buttons at every size; only the touched button
 *    changes shape; neighbours do not move. The default, because it is stable:
 *    pressing a segment never reflows the row.
 *  - `standard` — a gap between buttons and independently rounded children. More
 *    expressive, and the row does reflow on selection. Use where that is the point.
 *
 * Colour comes from the item's own `tone`, so a group is not committed to one role:
 * a segmented control is usually `tonal` for the selected item and `ghost` for the
 * rest, while a row of actions might be all `filled`.
 */
import { computed } from 'vue'

export interface ButtonGroupItem {
  /** Stable id, also the emitted value. */
  id: string
  /** Visible label. */
  label: string
  /** Optional leading glyph. A string is treated as text, not HTML. */
  icon?: string
  disabled?: boolean
  /**
   * Colour treatment. `ghost` is the quiet default for unselected items;
   * `tonal` / `filled` is what a selected item usually takes.
   */
  tone?: 'ghost' | 'tonal' | 'filled'
}

type Variant = 'connected' | 'standard'

const props = withDefaults(defineProps<{
  items: ButtonGroupItem[]
  /** Selected id for single-select groups (v-model). */
  modelValue?: string
  /** Selected ids for multi-select groups (v-model). Takes precedence over modelValue. */
  modelValues?: string[]
  variant?: Variant
  /**
   * Fill the parent's width, splitting it between the items.
   *
   * Default is content width, on purpose: in a toolbar a segmented control that squeezes
   * its own labels is unreadable. But a sidebar switch is the other case — it should sit
   * flush with the column it heads. Making that a prop keeps the decision with the caller
   * instead of having every caller fight the component's `inline-size: max-content` with
   * an `!important` override, which is what the page was about to do.
   */
  stretch?: boolean
  shape?: 'round' | 'square'
  /** Allow more than one selection. */
  multiple?: boolean
  /** Accessible label for the group as a whole. */
  label?: string
}>(), {
  variant: 'connected',
  stretch: false,
  shape: 'round',
  multiple: false,
  label: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'update:modelValues', value: string[]): void
}>()

/**
 * The single official token set.
 *
 * `ButtonGroup.kt` has **no size-tier parameter**: it hard-wires
 * `ButtonGroupSmallTokens` and `ConnectedButtonGroupSmallTokens`, and the only literal
 * dp in the file is `0.dp` for a default compression limit. So there is one button
 * group size, and an `xs`/`l`/`xl` ladder — which the first version invented — is not a
 * thing the specification offers.
 *
 *   ContainerHeight                40dp   (both variants)
 *   Connected: BetweenSpace         2dp
 *   Connected: InnerCorner          8dp   (CornerValueSmall)
 *   Connected: PressedInnerCorner   4dp   (CornerValueExtraSmall)
 *   Connected: SelectedInnerCorner  50%   (the segment becomes a pill)
 *   Standard:  BetweenSpace        12dp
 */
const TOKENS = {
  height: 40,
  connectedGap: 2,
  standardGap: 12,
  innerCorner: 8,
  pressedInnerCorner: 4,
  padX: 16,
} as const

/* `size` is still accepted from callers for API compatibility, but upstream has one
   size, so it no longer selects anything. Declaring it keeps existing call sites
   compiling while the value stops having an effect — better than silently honouring a
   tier that the specification does not define. */

const style = computed(() => {
  const { height, connectedGap, standardGap, innerCorner, pressedInnerCorner, padX } = TOKENS
  return {
    '--md-bg-gap': `${props.variant === 'connected' ? connectedGap : standardGap}px`,
    '--md-bg-height': `${height}px`,
    '--md-bg-inner': `${innerCorner}px`,
    '--md-bg-inner-pressed': `${pressedInnerCorner}px`,
    '--md-bg-padx': `${padX}px`,
    '--md-bg-outer': `${props.shape === 'square' ? innerCorner : 0}px`,
  } as Record<string, string>
})

const classes = computed(() => [
  'md-button-group',
  'md-button-group',
  `md-button-group--${props.variant}`,
  { 'is-stretched': props.stretch },
  `md-button-group--${props.shape}`,
])

/**
 * Radius for one item, written inline.
 *
 * The host sets `#app button { border-radius: 18px }` at (1,0,1). A scoped component
 * class is (0,2,0) and loses to it, so a CSS rule here cannot win — the exemption
 * tricks that look like they should (`revert-layer`, `unset`) either fall back to the
 * browser default 0 or are not applicable at all. A computed radius is data, and inline
 * style outranks every selector, so that is where the geometry goes.
 *
 * Connected groups: the two outer corners are the shape (`full` or the size step) and
 * the inner ones are the size step. Standard groups round every item fully, since they
 * are not attached.
 */
function itemRadius(index: number): string {
  const outer = props.shape === 'square' ? `${TOKENS.innerCorner}px` : 'var(--md-shape-full)'
  const inner = `${TOKENS.innerCorner}px`
  /* Connected segments that are *selected* go fully round on their inner corners too:
     `SelectedInnerCornerCornerSizePercent = 50`. That is what makes the chosen segment
     read as a pill inside the group rather than as a coloured square. */
  const innerFor = (boundary: 'first' | 'last' | 'middle') => {
    if (props.variant === 'standard') return outer
    if (boundary === 'middle') return isSelected(props.items[index].id) ? 'var(--md-shape-full)' : inner
    return inner
  }

  if (props.variant === 'standard') return outer
  const first = index === 0
  const last = index === props.items.length - 1
  if (first && last) return outer
  if (first) return `${outer} ${innerFor('first')} ${innerFor('first')} ${outer}`
  if (last) return `${innerFor('last')} ${outer} ${outer} ${innerFor('last')}`
  return innerFor('middle')
}

function isSelected(id: string): boolean {
  return props.multiple ? (props.modelValues || []).includes(id) : props.modelValue === id
}

function choose(item: ButtonGroupItem): void {
  if (item.disabled) return
  if (!props.multiple) {
    if (item.id !== props.modelValue) emit('update:modelValue', item.id)
    return
  }
  const current = props.modelValues || []
  const next = current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]
  emit('update:modelValues', next)
}
</script>

<template>
  <div
    :class="classes"
    :style="style"
    :aria-label="label || undefined"
    :role="label ? 'group' : undefined"
  >
    <button
      v-for="(item, index) in items"
      :key="item.id"
      type="button"
      class="md-button-group__item md-state-layer"
      :class="[`md-button-group__item--${item.tone || 'ghost'}`, { 'is-selected': isSelected(item.id) }]"
      :style="{ borderRadius: itemRadius(index) }"
      :disabled="item.disabled"
      :aria-pressed="multiple ? isSelected(item.id) : undefined"
      :aria-current="!multiple && isSelected(item.id) ? 'true' : undefined"
      @click="choose(item)"
    >
      <span v-if="item.icon" class="md-button-group__icon" aria-hidden="true">{{ item.icon }}</span>
      <span class="md-button-group__label">{{ item.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.md-button-group {
  display: inline-flex;
  align-items: stretch;
  gap: var(--md-bg-gap);
  /* An inline-flex box is still a flex item when its parent is one, and a flex item
     shrinks by default. That shrank the group to 182px against 181px of content plus
     36px of gaps, and the items — which are `flex: 0 0 auto` — overflowed into a
     wrapping mess. The group's width is its content; it must not be negotiated. */
  flex: none;
  /* The group's width IS its content. No `max-inline-size: 100%`: that would let a
     cramped parent shrink it again, which is the problem this replaced. A parent that
     needs to scroll should scroll; a segmented control that squeezes its own labels is
     unreadable. */
  inline-size: max-content;
  /* No colour of its own — the spec is explicit that the group carries none. */
  background: transparent;
  border: 0;
  padding: 0;
}

/* Opt-in full width. The items share it evenly: a switch that heads a column should read
   as one control spanning that column, not as a pill floating in it. Only the flex
   properties belong here — the item's own colours and padding stay in the base rule. */
.md-button-group.is-stretched {
  display: flex;
  inline-size: 100%;
}
.md-button-group.is-stretched .md-button-group__item {
  flex: 1 1 0;
  min-inline-size: 0;
}

.md-button-group__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  block-size: var(--md-bg-height);
  padding-inline: var(--md-bg-padx);
  border: 1px solid transparent;
  /* Set inline by `itemRadius()`; declared here only as the pre-hydration value. */
  border-radius: var(--md-bg-inner);
  background: transparent;
  color: var(--md-on-surface-variant);
  font: var(--md-type-label-large-font);
  letter-spacing: var(--md-type-label-large-tracking);
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-radius var(--md-spring-expressive-fast-spatial-dur, 366ms) var(--md-spring-soft, ease-out),
    color var(--duration-short) var(--ease-out);
}

/* The visible height is the token's 40dp. The *target* still has to be usable, so a
   pseudo-element extends it to 44px vertically without changing the painted box —
   the same technique the icon button uses for its 48dp target. */
.md-button-group__item::after {
  content: '';
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 0;
  inset-inline-end: 0;
  block-size: 44px;
  /* Centred on the item, so the extra height extends equally above and below rather
     than being clamped by the parent's box. */
  translate: 0 -50%;
  pointer-events: auto;
}

.md-button-group__item:active:not(:disabled) {
  /* PressedInnerCornerCornerSize = 4dp: the segment tightens while held. */
  border-radius: var(--md-bg-inner-pressed);
}

.md-button-group__item:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

/* Tones. `ghost` is the quiet default; the selected item normally takes `tonal`. */
.md-button-group__item--ghost {
  background: transparent;
  color: var(--md-on-surface-variant);
}
.md-button-group__item--tonal {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}
.md-button-group__item--filled {
  background: var(--md-primary);
  color: var(--md-on-primary);
}

/* Selected: whichever tone the item asks for above is kept, and the label is
   emphasised. A ghost item that becomes selected reads as tonal, because a
   selection with no fill is not visible in a toolbar. */
.md-button-group__item--ghost.is-selected {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}
.md-button-group__item.is-selected .md-button-group__label {
  font-weight: 700;
}

/* Corner geometry is written inline by `itemRadius()` — see the note there for why a
   rule in this file cannot win the cascade. */

@media (prefers-reduced-motion: reduce) {
  .md-button-group__item {
    transition: color 1ms;
  }
}
</style>