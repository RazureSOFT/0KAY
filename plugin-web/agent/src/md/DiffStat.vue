<script setup lang="ts">
/**
 * A file-change stat: `+12 −3`.
 *
 * The real page computes this inline in `ToolStepCard.vue` and renders it as a single
 * muted string, so "this tool changed a file" and "this tool read a file" look the same
 * in the transcript. The numbers are the whole point of a diff summary — they were
 * there in the data and absent from the design.
 *
 * Conventions kept from the existing implementation, so the two agree:
 *
 *  - the separator is U+2212 MINUS SIGN, not a hyphen. A hyphen at this size reads as a
 *    dash and sits at the wrong height next to a `+`; the real minus is optically centred.
 *  - counts are derived from the diff (`+` / `-` line prefixes), skipping `---` / `+++`
 *    headers, which is what `countDiff()` in ToolStepCard already does.
 *
 * What is new here:
 *
 *  - additions and deletions are coloured separately (green / red) rather than as one
 *    muted string, and both come from tokens instead of hex literals. The old stylesheet
 *    hardcoded `#2ea043` / `#cf222e`, so the stat did not follow the theme and had to
 *    duplicate itself under `html[data-theme="dark"]`.
 *  - `0` counts are omitted instead of printed: `+8 −0` is noise, `+8` is the fact.
 *  - an optional `path` renders as a fixed-width prefix in a tool row.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** Lines added. Omit (or pass 0) to hide. */
  added?: number
  /** Lines removed. Omit (or pass 0) to hide. */
  removed?: number
  /**
   * `inline` for a tool row (compact), `block` for a summary line above a diff (larger,
   * with the path on its own line).
   */
  variant?: 'inline' | 'block'
  /** File path, shown before the counts in `block`. */
  path?: string
  /** Accessible description. Falls back to a generated one. */
  label?: string
}>(), {
  added: 0,
  removed: 0,
  variant: 'inline',
  path: '',
  label: '',
})

const showAdded = computed(() => props.added > 0)
const showRemoved = computed(() => props.removed > 0)
const empty = computed(() => !showAdded.value && !showRemoved.value)

const ariaLabel = computed(() => {
  if (props.label) return props.label
  if (empty.value) return '没有行数变化'
  const parts: string[] = []
  if (showAdded.value) parts.push(`新增 ${props.added} 行`)
  if (showRemoved.value) parts.push(`删除 ${props.removed} 行`)
  return parts.join('，')
})

const classes = computed(() => ['md-diffstat', `md-diffstat--${props.variant}`])

</script>

<template>
  <span v-if="!empty" :class="classes" :aria-label="ariaLabel">
    <span v-if="path" class="md-diffstat__path">{{ path }}</span>
    <span class="md-diffstat__counts" aria-hidden="true">
      <span v-if="showAdded" class="md-diffstat__add">+{{ added }}</span>
      <!-- The gap between the two pills is `gap`; the space in the copied text comes from
           this interpolation, which keeps it a single text node instead of a whitespace
           node that the compiler would drop. -->
      <span v-if="showRemoved" class="md-diffstat__del"><span class="md-diffstat__space">{{ showAdded ? ' ' : '' }}</span>−{{ removed }}</span>
    </span>
  </span>
  <span v-else :class="classes" aria-hidden="true" />


</template>

<style scoped>
.md-diffstat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-inline-size: 0;
  font: var(--md-type-label-small-font);
  letter-spacing: var(--md-type-label-small-tracking);
  /* Counts line up between rows only if the digits are fixed-width. A transcript with
     ten tool rows otherwise jitters by a pixel per row. */
  font-variant-numeric: tabular-nums;
}

.md-diffstat__path {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--md-on-surface-variant);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  letter-spacing: 0;
  direction: rtl;
  text-align: left;
}

.md-diffstat__counts {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
}

/* Token colours, not hex.
 *
 * `--md-success` / `--md-error` are the roles the theme already defines for "good" and
 * "bad". Using them means the stat follows the theme, including dark mode and the
 * Fluence-style alternate themes, with no duplicated `html[data-theme="dark"]` block —
 * which is what the old hardcoded pair needed.
 *
 * The fills are a tint of the same role rather than a solid block: at label-small size a
 * solid green pill competes with the tool's own chip. */
.md-diffstat__add,
.md-diffstat__del {
  padding: 0 5px;
  border-radius: var(--md-shape-xs);
  line-height: 16px;
}

.md-diffstat__add {
  background: var(--md-success-container);
  color: var(--md-on-success-container);
}

.md-diffstat__del {
  background: var(--md-error-container);
  color: var(--md-on-error-container);
}

/* A real space for copy, collapsed to zero width on screen. `word-spacing` would have
   worked but is inherited by the digits; a zero-width node is local to this one spot. */
.md-diffstat__space {
  display: inline-block;
  inline-size: 0;
  overflow: hidden;
}

/* Block variant: one per file above its diff, so it can afford to be a little larger. */
.md-diffstat--block {
  display: flex;
  inline-size: 100%;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--md-shape-small);
  background: var(--md-surface-container);
  font: var(--md-type-label-large-font);
  letter-spacing: var(--md-type-label-large-tracking);
}
.md-diffstat--block .md-diffstat__path {
  flex: 1;
  color: var(--md-on-surface);
}
.md-diffstat--block .md-diffstat__counts {
  margin-inline-start: auto;
}
</style>