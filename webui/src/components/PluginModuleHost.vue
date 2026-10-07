<script setup lang="ts">
/**
 * Renders a patch-declared plugin page.
 *
 * Every page in the app arrives as a plugin ESM bundle over the importmap
 * bridge, so this component is the app's real router surface: a network error, a
 * stale bundle URL or a throw inside the plugin must degrade to something the
 * user can act on rather than a blank pane.
 *
 * Three failure modes are handled separately, because they need different
 * responses:
 *   1. the module fails to *load*  -> show the error, offer Retry
 *   2. the module throws while *rendering* -> catch it, offer Retry
 *   3. neither, but the page is still resolving -> show a skeleton
 *
 * meta.module is read at render time rather than captured in the addRoute
 * closure, which is what lets a hot patch update swap the ESM URL without a
 * reload.
 */
import { computed, onErrorCaptured, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PatchPage from '../pages/PatchPage.vue'

const route = useRoute()
const { t } = useI18n()

const comp = shallowRef<any>(null)
const loadError = ref('')
const renderError = ref('')
/** Bumped to force a fresh import() of the same URL after a Retry. */
const attempt = ref(0)
const pending = ref(false)

const moduleUrl = computed(() => String(route.meta.module || ''))
const iframeSrc = computed(() => String(route.meta.src || ''))

const loading = computed(() => pending.value && !comp.value && !loadError.value && !renderError.value)

async function load() {
  const url = moduleUrl.value
  if (!url) {
    comp.value = null
    return
  }
  pending.value = true
  loadError.value = ''
  renderError.value = ''
  try {
    const mod: any = await import(/* @vite-ignore */ url)
    comp.value = mod?.default || mod
  } catch (err: any) {
    comp.value = null
    // A rejected dynamic import leaves a module registry entry behind in some
    // browsers, so a plain re-import of the same specifier can return the cached
    // failure. Cache-busting on retry makes the button actually work.
    loadError.value = err?.message || String(err)
  } finally {
    pending.value = false
  }
}

function retry() {
  attempt.value += 1
  void load()
}

watch(
  () => [route.meta.module, attempt.value] as const,
  () => {
    // A different page means a different module; clear first so the previous
    // page is not shown under the new route while the import is in flight.
    comp.value = null
    void load()
  },
  { immediate: true },
)

// A plugin that imports fine but throws during render would otherwise blank the
// whole shell, because the error propagates past the router outlet.
onErrorCaptured((err) => {
  renderError.value = err?.message || String(err)
  comp.value = null
  return false
})
</script>

<template>
  <div class="plugin-host">
    <!-- A skeleton rather than a bare text line: the common case is a sub-second
         wait, and a flash of "Loading…" reads as jank. -->
    <div v-if="loading" class="skeleton" role="status" :aria-label="t('patch.loading')">
      <span class="bar w60"></span>
      <span class="bar w90"></span>
      <span class="bar w40"></span>
      <span class="sr">{{ t('patch.loading') }}</span>
    </div>

    <div v-else-if="loadError || renderError" class="failure" role="alert">
      <h2 class="failure-title">{{ renderError ? t('patch.renderFailed') : t('patch.loadFailed') }}</h2>
      <p class="failure-detail">{{ renderError || loadError }}</p>
      <p v-if="moduleUrl" class="failure-url"><code>{{ moduleUrl }}</code></p>
      <div class="failure-actions">
        <button type="button" class="btn primary" @click="retry">{{ t('patch.retry') }}</button>
        <!-- Only offer the iframe fallback when the patch actually declares one;
             otherwise PatchPage would just say there is no embed URL. -->
        <RouterLink v-if="iframeSrc" class="btn" :to="{ path: route.path, query: { embed: '1' } }">
          {{ t('patch.openEmbedded') }}
        </RouterLink>
        <RouterLink class="btn" to="/settings">{{ t('patch.openSettings') }}</RouterLink>
      </div>
    </div>

    <!-- The loaded component. This branch MUST come before the "moduleUrl is
         set" fallback below: `moduleUrl` is set for every ESM route whether or
         not the import has resolved, so a skeleton keyed on it shadows the real
         component and every page renders as a permanent loading bar. -->
    <component :is="comp" v-else-if="comp" />

    <!-- Declared an ESM module that is still resolving (no component yet, no
         error). Reached only when the watch has not resolved on first paint. -->
    <div v-else-if="moduleUrl" class="skeleton" role="status">
      <span class="bar w60"></span>
    </div>

    <!-- Patch declared only an iframe (no ESM module). -->
    <PatchPage v-else-if="iframeSrc" />
  </div>
</template>

<style scoped>
.plugin-host {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: var(--space-xl);
}

.bar {
  display: block;
  height: 12px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--md-surface-container) 25%,
    var(--md-surface-container-high) 37%,
    var(--md-surface-container) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.w40 { width: 40%; }
.w60 { width: 60%; }
.w90 { width: 90%; }

@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    animation: none;
  }
}

.failure {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-self: flex-start;
  max-width: 640px;
  margin: var(--space-xl) auto;
  padding: var(--space-xl);
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--md-surface-container-low);
}

.failure-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--md-on-surface);
}

.failure-detail {
  margin: 0;
  font-size: 13px;
  color: var(--md-error);
  word-break: break-word;
}

.failure-url {
  margin: 0;
  font-size: 12px;
  color: var(--md-on-surface-variant);
  word-break: break-all;
}

.failure-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid var(--md-outline-variant);
  border-radius: var(--radius-full);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

/* Both the `<button>`s and the `<RouterLink class="btn">`s in this panel must
 * land on the same box. The platform's `#app button { min-height: 36px }` only
 * reaches the buttons, so the links used to stay 38px while the buttons shrank
 * to 36px and the row visibly misaligned. Restating the box under
 * `#app .plugin-host` (1,2,0) applies it to both. */
#app .plugin-host .btn { min-height: 38px; border-radius: var(--radius-full); }

.btn:hover {
  background: var(--md-surface-container-high);
}

.btn.primary {
  border-color: transparent;
  background: var(--md-primary);
  color: var(--md-on-primary);
}

.btn:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

/* Visible to assistive tech, not to a sighted reader: the skeleton bars are
   decorative and the status text would just repeat them. */
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
