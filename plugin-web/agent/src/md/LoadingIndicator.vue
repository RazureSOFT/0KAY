<script setup lang="ts">
/**
 * MD3 Expressive loading indicator.
 *
 * **This is not a spinner, and the first version of this component got that wrong.**
 * It was built as a rotating arc — which is the *circular progress indicator* in its
 * indeterminate state, the thing the specification explicitly says the loading
 * indicator replaces ("Recommended as a replacement for indeterminate circular
 * progress indicators").
 *
 * What the component actually is, per the guidelines:
 *
 *   "The active indicator is a looping shape morph sequence composed of seven unique
 *    Material 3 shapes."
 *
 * Those seven shapes are named in androidx (`LoadingIndicatorDefaults
 * .IndeterminateIndicatorPolygons`):
 *
 *   SoftBurst → Cookie9Sided → Pentagon → Pill → Sunny → Cookie4Sided → Oval
 *
 * and the loop adds a final Oval → SoftBurst morph so it never breaks. The whole thing
 * also turns. The timing constants are from the same source:
 *
 *   MorphIntervalMillis          = 650     interval between morphs
 *   GlobalRotationDurationMillis = 4666    one full turn of the whole indicator
 *   morph spring                 = dampingRatio 0.6, stiffness 200, visibility 0.1
 *   per-morph rotation step      = 90° (`QuarterRotation`)
 *
 * So one morph takes ~650ms while the container turns once every ~4.7s, and the shape
 * steps 90° each time it completes a morph. That independence of the two rhythms is
 * what makes it read as alive rather than as a repeating animation.
 *
 * Sizes are the tokens exactly: active indicator 38dp inside a 48dp container.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  GLOBAL_ROTATION_MS,
  MORPH_INTERVAL_MS,
  MORPH_SEQUENCE,
  pathFromRadii,
  lerpShape,
  morphEase,
  sampleShape,
} from './shapes'

const props = withDefaults(defineProps<{
  /**
   * Overall size in px. The ratio between container and active indicator is fixed at
   * 48:38 by the tokens, so scaling one scales both. The spec allows 24–240dp.
   */
  size?: number
  /** Show the contrast container and swap the indicator to `on-primary-container`. */
  contained?: boolean
  /** Announced to assistive tech. Empty hides the indicator from it. */
  label?: string
}>(), {
  size: 48,
  contained: false,
  label: '',
})

/** Spec ratio: active 38 / container 48. */
const ACTIVE_RATIO = 38 / 48

const containerSize = computed(() => props.size)
const activeSize = computed(() => props.size * ACTIVE_RATIO)

const path = ref('')
const rotation = ref(0)

/* --- animation state --- */
let frame = 0
let startedAt = 0
let disposed = false

/** Pre-sampled outlines, in order, plus the closing pair for the loop. */
const outlines = MORPH_SEQUENCE.map((name) => sampleShape(name))

/** Reused buffer so the animation does not allocate per frame. */
const scratch = new Float32Array(outlines[0].length)

const reduceMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function tick(now: number) {
  if (disposed) return
  if (!startedAt) startedAt = now
  const elapsed = now - startedAt

  /* Two independent rhythms:
   *  - the morph advances one shape per interval
   *  - the container turns once per global rotation period
   * and the shape additionally steps 90° per completed morph, which is
   * androidx's `progress * 90 + morphRotationTargetAngle + globalRotation`. */
  const morphPhase = reduceMotion ? 0 : elapsed / MORPH_INTERVAL_MS
  const index = Math.floor(morphPhase) % outlines.length
  const nextIndex = (index + 1) % outlines.length
  const local = morphPhase - Math.floor(morphPhase)

  // The spring's eased progress drives the lerp; it settles inside the interval,
  // which is why the shape arrives and then holds briefly before the next one.
  const eased = reduceMotion ? 0 : morphEase(Math.min(1, local))
  const radii = lerpShape(outlines[index], outlines[nextIndex], eased, scratch)
  path.value = pathFromRadii(radii, activeSize.value)

  const completedMorphs = Math.floor(morphPhase)
  const quarterStep = (completedMorphs % 4) * 90
  const globalTurn = reduceMotion ? 0 : (elapsed / GLOBAL_ROTATION_MS) * 360
  rotation.value = quarterStep + globalTurn

  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  // Draw the first frame synchronously so the indicator is never briefly empty.
  path.value = pathFromRadii(outlines[0], activeSize.value)

  if (reduceMotion) {
    /* Without motion the shape is meaningless — it would be a random one of the seven.
     * A still circle with a soft opacity pulse is the honest reduced-motion form:
     * something is happening, and it does not pretend to be a morph. */
    path.value = pathFromRadii(sampleShape('oval'), activeSize.value)
    return
  }
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  disposed = true
  if (frame) cancelAnimationFrame(frame)
})

const style = computed(() => ({
  '--md-loading-box': `${containerSize.value}px`,
  '--md-loading-active': `${activeSize.value}px`,
}) as Record<string, string>)
</script>

<template>
  <span
    class="md-loading"
    :class="{ 'md-loading--contained': contained, 'is-reduced': reduceMotion }"
    :style="style"
    role="progressbar"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span v-if="contained" class="md-loading__container" aria-hidden="true" />
    <svg
      class="md-loading__shape"
      :width="activeSize"
      :height="activeSize"
      :viewBox="`0 0 ${activeSize} ${activeSize}`"
      aria-hidden="true"
    >
      <path
        :d="path"
        fill="currentColor"
        :transform="`rotate(${rotation} ${activeSize / 2} ${activeSize / 2})`"
      />
    </svg>
  </span>
</template>

<style scoped>
.md-loading {
  position: relative;
  display: inline-grid;
  place-items: center;
  inline-size: var(--md-loading-box);
  block-size: var(--md-loading-box);
  /* A grid/flex parent must not stretch it: the size is the component's contract, and
     an invalid -box value previously let it grow to fill the row. */
  box-sizing: border-box;
  flex: none;
  /* The active indicator is the shape; `currentColor` keeps one switch for both
     colour roles. */
  color: var(--md-primary);
}

/* Contained: the optional contrast container from the spec, `primary-container`,
   with the indicator moving to `on-primary-container` so it stays legible on it. */
.md-loading--contained {
  color: var(--md-on-primary-container);
}

.md-loading__container {
  position: absolute;
  inset: 0;
  border-radius: var(--md-shape-full);
  background: var(--md-primary-container);
}

.md-loading__shape {
  display: block;
  position: relative;
}

/* Reduced motion: the morph is gone, so a still oval carries the state with a slow
   opacity pulse rather than pretending to animate. */
.md-loading.is-reduced .md-loading__shape {
  animation: md-loading-pulse 2s ease-in-out infinite;
}

@keyframes md-loading-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>