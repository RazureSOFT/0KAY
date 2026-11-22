<script setup lang="ts">
/**
 * MD3 badge — the dot on an icon, or a short count.
 *
 * The agent page has five badge-ish things (`.badge`, `.sidebar-badge`,
 * `.ws-count`, `.recon-badge`, `.queued-n`) with different radii, sizes and
 * colours. This is the one.
 *
 * MD3 has two sizes: a `small` badge is a bare 6dp dot with no text, a `large`
 * badge carries a label and sits on the container's edge. The dot deliberately
 * has no text slot — a number in a 6dp circle is unreadable, and the previous
 * implementation tried to do both at once.
 */
import { computed } from 'vue'

type Size = 'small' | 'large'

const props = withDefaults(defineProps<{
  size?: Size
  /** Badge text. Only rendered for `large`; a small badge is a dot. */
  value?: string | number
  /**
   * Colour role. `error` is the default because a badge usually means "something
   * wants you"; `primary` for neutral counts, `success` for a healthy state.
   */
  tone?: 'error' | 'primary' | 'success'
  /** Hide from assistive tech when the surrounding control already says it. */
  decorative?: boolean
}>(), {
  size: 'large',
  tone: 'error',
  decorative: false,
})

const classes = computed(() => [
  'md-badge',
  `md-badge--${props.size}`,
  `md-badge--${props.tone}`,
])

/** A small badge is a dot: text would not fit inside 6dp. */
const showText = computed(() => props.size === 'large' && props.value !== undefined && props.value !== '')
</script>

<template>
  <span
    :class="classes"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <template v-if="showText">{{ value }}</template>
  </span>
</template>

<style scoped>
.md-badge {
  display: inline-grid;
  place-items: center;
  font: var(--md-type-label-small-font);
  letter-spacing: var(--md-type-label-small-tracking);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  border-radius: var(--md-shape-full);
  white-space: nowrap;
}

/* 6dp dot, no text. Matches the spec's small badge. */
.md-badge--small {
  inline-size: 6px;
  block-size: 6px;
  padding: 0;
  min-inline-size: 6px;
}

/* Large badge: 16dp tall, hugging its label, minimum 16dp wide so a single digit
   is still a circle. */
.md-badge--large {
  block-size: 16px;
  min-inline-size: 16px;
  padding-inline: 5px;
  font-weight: 600;
}

.md-badge--error {
  background: var(--md-error);
  color: var(--md-on-error);
}
.md-badge--primary {
  background: var(--md-primary);
  color: var(--md-on-primary);
}
.md-badge--success {
  background: var(--md-success);
  color: var(--md-on-success);
}
</style>