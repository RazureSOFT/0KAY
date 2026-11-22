<script setup lang="ts">
/**
 * MD3 state layer, as a component.
 *
 * A state layer is the translucent overlay MD3 puts *over* a control's own colour
 * for hover, focus and press. The point is that the control never changes what it
 * is: a filled button stays filled when hovered, a tonal one stays tonal. The app
 * previously did the opposite — hovering swapped the background to
 * `secondary-container` — which made "the pointer is here" and "this is selected"
 * the same colour.
 *
 * Most controls can get this with the `.md-state-layer` utility class in
 * theme.css. This component exists for the cases where the layer needs to be an
 * actual element: a media tile, a list row whose own background is an image, or a
 * surface that is drawn by a canvas.
 *
 * `intensity` exists because a state layer over a light surface and one over a
 * dark surface need different alphas to read the same; it multiplies the MD3
 * opacity rather than replacing it, so the spec values stay the source of truth.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Multiply the spec opacities. 1 = MD3 defaults (8% hover, 10% focus/press). */
  intensity?: number
  /** Use the control's text colour rather than a fixed role. */
  color?: 'on-surface' | 'primary' | 'current'
  /** Draw the layer inset from the edge, e.g. to sit inside a padded row. */
  inset?: number
  disabled?: boolean
}>(), {
  intensity: 1,
  color: 'current',
  inset: 0,
  disabled: false,
})

const style = computed(() => ({
  '--md-state-inset': `${props.inset}px`,
  '--md-state-intensity': String(props.intensity),
}) as Record<string, string>)

const classes = computed(() => [
  'md-state-host',
  `md-state-host--${props.color}`,
  { 'is-disabled': props.disabled },
])
</script>

<template>
  <div :class="classes" :style="style">
    <slot />
    <span class="md-state-host__layer" aria-hidden="true" />
  </div>
</template>

<style scoped>
.md-state-host {
  position: relative;
  isolation: isolate;
}

.md-state-host__layer {
  position: absolute;
  inset: var(--md-state-inset);
  border-radius: inherit;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-short) var(--ease-out);
  /* Above the content but below popovers; without a negative stacking context the
     layer would sit over text and mute it. */
  z-index: 0;
}

.md-state-host--on-surface {
  color: var(--md-on-surface);
}
.md-state-host--primary {
  color: var(--md-primary);
}

/* Hover is disabled while the host is disabled: a state layer on a dead control
   suggests it can be used. */
.md-state-host:not(.is-disabled):hover .md-state-host__layer {
  opacity: calc(var(--md-state-hover) * var(--md-state-intensity));
}

.md-state-host:not(.is-disabled):focus-within .md-state-host__layer {
  opacity: calc(var(--md-state-focus) * var(--md-state-intensity));
}

.md-state-host:not(.is-disabled):active .md-state-host__layer {
  opacity: calc(var(--md-state-pressed) * var(--md-state-intensity));
}

@media (prefers-reduced-motion: reduce) {
  .md-state-host__layer {
    transition: none;
  }
}
</style>