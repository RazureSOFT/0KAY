<script setup lang="ts">
/**
 * MD3 toolbar — the container for a row of controls.
 *
 * Per spec a toolbar is "a container with configurable slots". The values are the
 * floating-toolbar tokens (`FloatingToolbarTokens`, v12_0_0):
 *
 *   ContainerHeight          64dp
 *   ContainerShape           CornerFull      ← the toolbar is a pill, not a rectangle
 *   ContainerExternalPadding 16dp
 *   ContainerLeadingSpace     8dp
 *   ContainerTrailingSpace    8dp
 *   ContainerBetweenSpace     4dp
 *   StandardContainerColor   surface-container
 *   VibrantContainerColor    primary-container
 *
 * This replaces the seven private toolbar headers inside the floating panels
 * (`.browser-toolbar`, used by browser, tree, usage, host, file and terminal),
 * which each re-stated height, padding and border. It does **not** replace the
 * panels themselves or their positioning — those stay as they are.
 *
 * Variants:
 *  - `standard` — `surface-container`, for toolbars docked to a surface
 *  - `vibrant` — `primary-container`, to make the toolbar itself the focus
 *
 * The `slot`s are `leading`, `default` (middle) and `trailing`.
 */
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'standard' | 'vibrant'
  /** Height in dp. 64 is the spec default; `sm` = 48 for panel headers. */
  size?: 'sm' | 'md'
  /** Accessible label for the toolbar as a region. */
  label?: string
}>(), {
  variant: 'standard',
  size: 'md',
  label: '',
})

const slots = useSlots()
const hasLeading = computed(() => !!slots.leading)
const hasTrailing = computed(() => !!slots.trailing)

const classes = computed(() => [
  'md-toolbar',
  `md-toolbar--${props.variant}`,
  `md-toolbar--${props.size}`,
])

/* `ContainerBetweenSpace` is 4dp at both heights, so no per-size variable is needed.
   The 16dp `ContainerExternalPadding` belongs to whatever contains the toolbar — a
   floating toolbar's margin — and is documented rather than applied here, because
   applying it would triple-pad a toolbar sitting inside an already-padded panel. */
</script>

<template>
  <div
    :class="classes"
    :aria-label="label || undefined"
    :role="label ? 'toolbar' : undefined"
  >
    <div v-if="hasLeading" class="md-toolbar__slot md-toolbar__slot--leading">
      <slot name="leading" />
    </div>
    <div class="md-toolbar__slot md-toolbar__slot--middle">
      <slot />
    </div>
    <div v-if="hasTrailing" class="md-toolbar__slot md-toolbar__slot--trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped>
.md-toolbar {
  display: flex;
  align-items: center;
  /* `ContainerBetweenSpace = 4dp`. The first version used 8, which doubled every gap
     in a panel header. */
  gap: 4px;
  /* `ContainerLeadingSpace` / `ContainerTrailingSpace = 8dp`; the 16dp external padding
     is the space *around* the toolbar, applied to the container it sits in. */
  padding-inline: 8px;
  box-sizing: border-box;
  flex: none;
  /* `ContainerShape = CornerFull`. */
  border-radius: var(--md-shape-full);
}

/* Spec default is 64dp; panel headers in this app have always been tighter, and a
   64dp header on a 420dp panel is a quarter of the panel. `sm` exists for that
   case and is documented as a deliberate deviation. */
.md-toolbar--md {
  block-size: 64px;
}
/* `sm` is a documented deviation: 64dp of header on a 420dp panel eats a quarter of
   it. The 8dp leading/trailing space and the pill shape are kept. */
.md-toolbar--sm {
  block-size: 44px;
  padding-inline: 8px;
}

.md-toolbar--standard {
  background: var(--md-surface-container);
  color: var(--md-on-surface);
}

.md-toolbar--vibrant {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.md-toolbar__slot {
  display: flex;
  align-items: center;
  gap: 4px;
  min-inline-size: 0;
}

.md-toolbar__slot--middle {
  flex: 1;
  justify-content: center;
}

.md-toolbar__slot--leading,
.md-toolbar__slot--trailing {
  flex: none;
}

/* The first and last children of a toolbar get no leading/trailing margin: the
   toolbar's own padding is the only outside spacing, which is what makes 16dp a
   single number instead of a sum of three. */
.md-toolbar__slot > :deep(:first-child) {
  margin-inline-start: 0;
}
.md-toolbar__slot > :deep(:last-child) {
  margin-inline-end: 0;
}
</style>