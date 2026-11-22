<script setup lang="ts">
/**
 * MD3 Expressive icon button.
 *
 * Replaces the scattered `.ct` (30px), `.icon-btn` (32px), `.dock-btn` (42px) and the
 * composer's circular `.attach-fly` / `.send-fly` (46px) — four sizes for one idea,
 * one of which needed three `!important`s just to stay round.
 *
 * Sizes are the five-tier Expressive ramp, from the tokens
 * (`XSmall`/`Small`/`Medium`/`Large`/`XLarge` IconButtonTokens, v14_1_0). The first
 * version used an invented 32/40/48/56/64 scale, which understated medium by 8dp,
 * large by 40dp and extra-large by 72dp — the ramp is far wider than it looks, because
 * the big tiers exist for hero actions and pull-to-refresh, not for toolbars.
 *
 *   tier  container  icon  square  pressed  outline
 *   xs        32      20     12       8        1
 *   s         40      24     12       8        1
 *   m         56      24     16      12        1
 *   l         96      32     28      16        2
 *   xl       136      40     28      16        3
 *
 * Round shape is `CornerFull` at every tier. The radius change on press and on
 * selection is not decoration — it is how the component says "pressed" and "on"
 * without moving, which keeps a toolbar row from reflowing.
 *
 * Geometry is inline because the host sets `#app button { border-radius: 18px }` at
 * (1,0,1), which outranks a scoped component class. See the note in theme.css.
 */
import { computed } from 'vue'

type Variant = 'standard' | 'filled' | 'tonal' | 'outlined'
type Size = 'xs' | 's' | 'm' | 'l' | 'xl'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  /** Circular container (`CornerFull` at every tier upstream). */
  round?: boolean
  /** Toggle buttons: `true` applies the selected radius and colour. */
  selected?: boolean
  disabled?: boolean
  /** Accessible name. Required: these controls are icon-only. */
  label: string
}>(), {
  variant: 'standard',
  size: 's',
  round: false,
  selected: false,
  disabled: false,
})

/**
 * `click` is declared *and* re-emitted.
 *
 * Declaring an emit with the same name as a native event stops Vue from treating it as a
 * native listener: the parent's `@click` binds to the component's emit instead of the
 * DOM button. Without the handler below that emit is never fired, so `@click` on an
 * `<IconButton>` was silently dead — the button looked pressable, the state layer reacted
 * to hover, and nothing happened on click.
 *
 * Re-emitting the native event fixes it for every caller without them needing to know.
 */
const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

/** Per-tier metrics from the tokens: `ContainerHeight`, `IconSize`, `CornerMedium`
 *  / `CornerLarge` / `CornerExtraLarge`, the pressed corner one step down, and
 *  `OutlinedOutlineWidth`. */
const METRICS: Record<Size, { box: number; icon: number; square: number; pressed: number; outline: number }> = {
  xs: { box: 32, icon: 20, square: 12, pressed: 8, outline: 1 },
  s: { box: 40, icon: 24, square: 12, pressed: 8, outline: 1 },
  m: { box: 56, icon: 24, square: 16, pressed: 12, outline: 1 },
  l: { box: 96, icon: 32, square: 28, pressed: 16, outline: 2 },
  xl: { box: 136, icon: 40, square: 28, pressed: 16, outline: 3 },
}

const metric = computed(() => METRICS[props.size])

/**
 * Rest radius. A selected toggle takes the next tier up, which upstream expresses as
 * `SelectedContainerShapeRound` / `SelectedContainerShapeSquare`.
 */
const radius = computed(() => {
  if (props.round) return 'var(--md-shape-full)'
  if (props.selected) {
    const selected = props.size === 'xs' || props.size === 's' ? 12 : props.size === 'm' ? 16 : 28
    return `${selected}px`
  }
  return `${metric.value.square}px`
})

const style = computed(() => ({
  '--md-ib-box': `${metric.value.box}px`,
  '--md-ib-icon': `${metric.value.icon}px`,
  '--md-ib-outline': `${metric.value.outline}px`,
  /* The pressed radius is a variable rather than a `:active`-only declaration so the
     change can interpolate; a `:active` rule would snap. */
  '--md-ib-radius': radius.value,
  '--md-ib-radius-pressed': props.round ? 'var(--md-shape-full)' : `${metric.value.pressed}px`,
}) as Record<string, string>)

const classes = computed(() => [
  'md-icon-button',
  `md-icon-button--${props.variant}`,
  'md-state-layer',
])
</script>

<template>
  <button
    type="button"
    :class="classes"
    :style="style"
    :disabled="disabled"
    :aria-label="label"
    :aria-pressed="selected ? 'true' : undefined"
    @click="onClick"
  >
    <span class="md-icon-button__glyph" aria-hidden="true">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.md-icon-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  inline-size: var(--md-ib-box);
  block-size: var(--md-ib-box);
  padding: 0;
  /* Touch target is 48dp even when the visual box is smaller.
   *
   * `LocalMinimumInteractiveComponentSize = 48.dp` upstream, and
   * `Modifier.minimumInteractiveComponentSize()` does not enlarge the visual box — it
   * reserves layout space around it so the touch target can extend. In CSS the
   * equivalent is a pseudo-element that reaches out past the painted edge. Without
   * this, the 32dp tier is a 32dp target, which is below the accessibility minimum. */
  position: relative;
  /* Border width is a per-tier token (1 / 2 / 3dp), reserved here and painted only by
     the outlined variant. `border-box` keeps the icon centred inside it. */
  border: var(--md-ib-outline) solid transparent;
  box-sizing: border-box;
  border-radius: var(--md-ib-radius);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition:
    border-radius var(--md-spring-expressive-fast-spatial-dur, 366ms) var(--md-spring-soft, ease-out),
    color var(--duration-short) var(--ease-out),
    background-color var(--duration-short) var(--ease-out),
    border-color var(--duration-short) var(--ease-out);
}

.md-icon-button::after {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline: 0;
  /* Never smaller than 48dp on either axis, centred on the button. */
  min-inline-size: 48px;
  min-block-size: 48px;
  margin: auto;
  /* Invisible; it only extends the hit area. */
  background: none;
  border-radius: inherit;
  pointer-events: auto;
}

.md-icon-button__glyph {
  display: grid;
  place-items: center;
  inline-size: var(--md-ib-icon);
  block-size: var(--md-ib-icon);
  pointer-events: none;
}
.md-icon-button__glyph :deep(svg) {
  inline-size: 100%;
  block-size: 100%;
  display: block;
}

.md-icon-button > * {
  pointer-events: none;
}

.md-icon-button:active:not(:disabled) {
  border-radius: var(--md-ib-radius-pressed);
}

.md-icon-button:disabled {
  cursor: not-allowed;
  /* Upstream: content at 38% (`DisabledOpacity`), container at 10%. */
  opacity: 0.38;
}

/* --- variants: colour only, geometry comes from the tiers --- */
.md-icon-button--standard {
  color: var(--md-on-surface-variant);
}

/* A selected standard button takes `primary` as content colour, not a fill —
   `StandardIconButtonTokens.SelectedColor = primary`. */
.md-icon-button--standard[aria-pressed='true'] {
  color: var(--md-primary);
}

.md-icon-button--filled {
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.md-icon-button--tonal {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.md-icon-button--tonal[aria-pressed='true'] {
  background: var(--md-secondary);
  color: var(--md-on-secondary);
}

.md-icon-button--outlined {
  border-color: var(--md-outline-variant);
  color: var(--md-on-surface-variant);
}

/* `OutlinedIconButtonTokens`: a selected outlined button inverts rather than filling
   with the accent, which keeps it distinct from the filled variant beside it. */
.md-icon-button--outlined[aria-pressed='true'] {
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  border-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .md-icon-button {
    transition: color 1ms, background-color 1ms;
  }
  .md-icon-button:active:not(:disabled) {
    border-radius: var(--md-ib-radius);
  }
}
</style>