<script setup lang="ts">
/**
 * MD3 progress indicator.
 *
 * Replaces `.recon-bar` (a div whose width was a percentage) and `.usage-ring` (a
 * `conic-gradient` string rebuilt in a template expression). Neither could show an
 * indeterminate state, and both invented their own colour treatment.
 *
 * Colours and shapes are the tokens, not invented tints
 * (`ProgressIndicatorTokens`, v0_4_0):
 *
 *   ActiveIndicatorColor = primary
 *   TrackColor           = secondary-container
 *   StopColor            = primary
 *   active / track / stop shape = CornerFull
 *
 * The first version used `primary` at 16% for the track, which is what the app had
 * been doing — and it is wrong: the track is `secondary-container`, a real colour
 * role, so it holds its contrast in dark mode instead of vanishing.
 *
 * Three parts, per the anatomy (active indicator, track, stop indicator). The stop
 * indicator is the small dot at the end of a determinate linear track; it marks where
 * the track finishes, which is what makes "almost done" legible as a proportion
 * rather than as a bar that happens to be long.
 *
 * `wavy` is the Expressive shape variant. Its wave is **not** present for the whole run:
 * androidx gates the amplitude on progress (`WavyProgressIndicatorDefaults
 * .indicatorAmplitude`, v14_1_0):
 *
 *     if (progress <= 0.1f || progress >= 0.95f) 0f else 1f
 *
 * with the comment "Sets the amplitude to the max on 10%, and back to zero on 95% of the
 * progress". So the indicator starts flat, becomes a wave, and flattens again just before
 * it completes — which is the wavy-to-flat change. The collapse is animated with an
 * *accelerate* curve (`EasingEmphasizedAccelerate`), so it eases in slowly and then snaps
 * flat, unlike the rise which uses the standard curve.
 *
 * The first version of this component waved from start to finish, which made a finishing
 * bar look like it was still travelling.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 0–100. Omit for indeterminate. */
  value?: number
  variant?: 'linear' | 'circular'
  /** Circular: diameter in px. */
  size?: number
  /** Linear: track thickness in px. Default is the spec's 4dp. */
  thickness?: number
  /** Expressive shape variant. */
  shape?: 'flat' | 'wavy'
  /** Wavy only: wave height from the resting centre to the peak. */
  amplitude?: number
  /** Wavy only: distance between adjacent peaks. */
  wavelength?: number
  label?: string
}>(), {
  variant: 'linear',
  /* Circular baseline is 44dp, not 48 — 48 is the *loading indicator's* container.
     Mixing them made a determinate ring bigger than the thing that replaces it. */
  size: 44,
  thickness: 4,
  shape: 'flat',
  amplitude: 2.5,
  wavelength: 14,
  label: '',
})

const clamped = computed(() => {
  if (props.value === undefined || Number.isNaN(props.value)) return undefined
  return Math.max(0, Math.min(100, props.value))
})

const indeterminate = computed(() => clamped.value === undefined)

/**
 * Wave amplitude factor for the current progress.
 *
 * Mirrors androidx's gate exactly: 0 below 10%, 1 between, 0 from 95% up. The thresholds
 * are fractions of the run, not px, so a short bar and a long one behave the same.
 *
 * Written as a step to match the reference implementation rather than a smooth ramp: a
 * gradual taper would look better in isolation but would not be the specified behaviour,
 * and the reference's collapse is animated by the transition, not by the function.
 */
const amplitudeFactor = computed(() => {
  const value = clamped.value
  if (value === undefined) return 1
  const fraction = value / 100
  return fraction <= 0.1 || fraction >= 0.95 ? 0 : 1
})

/** Effective amplitude in px; 0 means the path is a straight line. */
const effectiveAmplitude = computed(() => props.amplitude * amplitudeFactor.value)

/** Animate the flatten at the end with the accelerate curve androidx uses. */
const amplitudeTransition = computed(() =>
  amplitudeFactor.value === 0 && (clamped.value ?? 0) >= 95
    ? 'transform var(--md-spring-expressive-slow-spatial-dur) var(--ease-accelerate, ease-in)'
    : 'transform var(--md-spring-standard-default-spatial-dur) var(--ease-standard, ease)',
)

/* --- circular geometry --- */
const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const ringArc = computed(() => {
  const c = circumference.value
  const fraction = indeterminate.value ? 0.25 : (clamped.value as number) / 100
  return {
    dashArray: `${c * fraction} ${c}`,
    /* Start the arc at twelve o'clock: rotate the whole ring rather than offsetting
       the dash, so the stop indicator and the arc share one origin. */
    rotation: -90,
  }
})

/**
 * Linear wave path.
 *
 * A sine along the track, sampled so the stroke's own thickness gives it body. The
 * track is drawn the same way at low opacity so the two crests line up — the wave is
 * the shape of the indicator, not a decoration on top of a straight bar.
 */
function wavePath(width: number, height: number, amplitude: number, wavelength: number): string {
  const mid = height / 2
  const points: string[] = []
  const step = Math.max(2, wavelength / 8)
  for (let x = 0; x <= width; x += step) {
    const y = mid + amplitude * Math.sin((x / wavelength) * Math.PI * 2)
    points.push(`${x === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return points.join('')
}

/** The wave needs a width to be sampled against; linear bars fill their container. */
const waveViewBoxWidth = 300
const waveHeight = computed(() => props.thickness + props.amplitude * 2 + 2)
const wave = computed(() =>
  wavePath(waveViewBoxWidth, waveHeight.value, effectiveAmplitude.value, props.wavelength),
)

const style = computed(() => {
  if (props.variant === 'circular') {
    return {
      '--md-progress-size': `${props.size}px`,
      '--md-progress-thickness': `${props.thickness}px`,
    } as Record<string, string>
  }
  return {
    '--md-progress-thickness': `${props.thickness}px`,
  } as Record<string, string>
})

const classes = computed(() => [
  'md-progress',
  `md-progress--${props.variant}`,
  `md-progress--${props.shape}`,
  { 'is-indeterminate': indeterminate.value, 'is-flattened': amplitudeFactor.value === 0 },
])

const aria = computed(() => (indeterminate.value ? undefined : Math.round(clamped.value as number)))
</script>

<template>
  <div
    :class="classes"
    :style="style"
    role="progressbar"
    :aria-label="label || undefined"
    :aria-valuenow="aria"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- ---------- linear ---------- -->
    <template v-if="variant === 'linear'">
      <div v-if="shape === 'flat'" class="md-progress__track" aria-hidden="true" />
      <div
        v-if="shape === 'flat'"
        class="md-progress__bar"
        :style="indeterminate ? undefined : { inlineSize: `${clamped}%` }"
        aria-hidden="true"
      />
      <!-- The stop indicator marks the end of a determinate track. -->
      <div
        v-if="shape === 'flat' && !indeterminate"
        class="md-progress__stop"
        aria-hidden="true"
      />

      <template v-else>
        <svg
          class="md-progress__wave"
          :viewBox="`0 0 ${waveViewBoxWidth} ${waveHeight}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path class="md-progress__wave-track" :d="wave" :stroke-width="thickness" />
          <path
            class="md-progress__wave-bar"
            :d="wave"
            :stroke-width="thickness"
            :style="indeterminate ? undefined : { strokeDasharray: `${clamped} ${100 - (clamped as number)}` }"
            pathLength="100"
          />
        </svg>
      </template>
    </template>

    <!-- ---------- circular ---------- -->
    <template v-else>
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        aria-hidden="true"
      >
        <circle
          class="md-progress__ring-track"
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          :stroke-width="thickness"
        />
        <circle
          class="md-progress__ring-arc"
          :cx="size / 2"
          :cy="size / 2"
          :r="radius"
          :stroke-width="thickness"
          :stroke-dasharray="ringArc.dashArray"
          :transform="`rotate(${ringArc.rotation} ${size / 2} ${size / 2})`"
        />
      </svg>
    </template>
  </div>
</template>

<style scoped>
.md-progress {
  display: block;
}

/* ================= linear ================= */
.md-progress--linear {
  position: relative;
  inline-size: 100%;
}

.md-progress--flat.md-progress--linear {
  block-size: var(--md-progress-thickness);
}

.md-progress__track {
  position: absolute;
  inset: 0;
  border-radius: var(--md-shape-full);
  /* Token, not a tint: `secondary-container` is a real role and keeps its contrast
     in dark mode. */
  background: var(--md-secondary-container);
}

.md-progress__bar {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: var(--md-shape-full);
  background: var(--md-primary);
  transition: inline-size var(--md-spring-expressive-fast-spatial-dur, 366ms) var(--md-spring-bounce, ease-out);
}

/* The stop indicator: a 4dp dot at the trailing edge of a determinate track. */
.md-progress__stop {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  aspect-ratio: 1;
  border-radius: var(--md-shape-full);
  background: var(--md-primary);
}

/* Indeterminate: a travelling segment rather than a full-track shimmer — a bar that
   fills the whole track would suggest completion. */
.md-progress--linear.is-indeterminate.md-progress--flat .md-progress__bar {
  inline-size: 40%;
  animation: md-progress-slide 1.6s var(--ease-emphasized) infinite;
}

@keyframes md-progress-slide {
  0% {
    inset-inline-start: -40%;
  }
  100% {
    inset-inline-start: 100%;
  }
}

/* --- wavy --- */
.md-progress--wavy.md-progress--linear {
  block-size: calc(var(--md-progress-thickness) + 5px * 2 + 2px);
}

.md-progress__wave {
  inline-size: 100%;
  block-size: 100%;
  display: block;
  overflow: visible;
}

.md-progress__wave-track,
.md-progress__wave-bar {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  /* `preserveAspectRatio="none"` stretches the sampling box to the container, which
     would otherwise scale the stroke width horizontally too. */
  vector-effect: non-scaling-stroke;
}

.md-progress__wave-track {
  stroke: var(--md-secondary-container);
}

.md-progress__wave-bar {
  stroke: var(--md-primary);
  stroke-dasharray: 0 100;
  transition: stroke-dasharray var(--md-spring-expressive-fast-spatial-dur, 366ms) var(--md-spring-bounce, ease-out);
}

.md-progress--wavy.is-indeterminate .md-progress__wave-bar {
  stroke-dasharray: 40 100;
  animation: md-progress-wave-travel 1.6s var(--ease-emphasized) infinite;
}

@keyframes md-progress-wave-travel {
  0% {
    stroke-dashoffset: 40;
  }
  100% {
    stroke-dashoffset: -100;
  }
}

/* ================= circular ================= */
.md-progress--circular {
  inline-size: var(--md-progress-size);
  block-size: var(--md-progress-size);
}

.md-progress--circular svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.md-progress__ring-track {
  fill: none;
  stroke: var(--md-secondary-container);
}

.md-progress__ring-arc {
  fill: none;
  stroke: var(--md-primary);
  stroke-linecap: round;
  transition: stroke-dasharray var(--md-spring-expressive-fast-spatial-dur, 366ms) var(--md-spring-bounce, ease-out);
}

.md-progress--circular.is-indeterminate svg {
  animation: md-progress-spin 1.4s linear infinite;
}

@keyframes md-progress-spin {
  to {
    transform: rotate(-90deg) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .md-progress--linear.is-indeterminate .md-progress__bar,
  .md-progress--wavy.is-indeterminate .md-progress__wave-bar,
  .md-progress--circular.is-indeterminate svg {
    animation: none;
  }
  .md-progress__bar,
  .md-progress__wave-bar,
  .md-progress__ring-arc {
    transition: none;
  }
}
</style>