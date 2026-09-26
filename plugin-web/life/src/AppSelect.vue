<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
defineOptions({ inheritAttrs: false })
type Option = { value: string; label: string; disabled?: boolean }
const props = withDefaults(defineProps<{ modelValue?: string; options: Array<string | Option>; disabled?: boolean; placeholder?: string; ariaLabel?: string }>(), { modelValue: '', placeholder: '请选择', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string] }>()
let uidSeq = 0
const uid = (prefix: string) => `${prefix}-${++uidSeq}`
const locale = ref('zh-CN')
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)
const opened = ref(false)
const active = ref(-1)
const position = ref<Record<string, string>>({})
const upwards = ref(false)
const id = uid('select')
const items = computed<Option[]>(() => props.options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option)))
const label = computed(() => items.value.find((item) => item.value === props.modelValue)?.label || props.modelValue || props.placeholder)
let query = '', lastKey = 0
function layout() {
  const rect = trigger.value?.getBoundingClientRect(); if (!rect) return
  const height = window.visualViewport?.height || innerHeight, width = window.visualViewport?.width || innerWidth
  const below = height - rect.bottom - 10, above = rect.top - 10
  upwards.value = (rect.top >= Math.min(320, items.value.length * 46 + 12) + 8) || (below < Math.min(320, items.value.length * 46 + 12) && above > below)
  const maxHeight = Math.max(48, Math.min(340, upwards.value ? above : below))
  const menuWidth = Math.min(Math.max(rect.width, 220), width - 16)
  position.value = { position: 'fixed', left: `${Math.max(8, Math.min(rect.left, width - menuWidth - 8))}px`, width: `${menuWidth}px`, maxHeight: `${maxHeight}px`, ...(upwards.value ? { bottom: `${height - rect.top + 8}px` } : { top: `${rect.bottom + 8}px` }) }
}
function close(restore = false) { opened.value = false; query = ''; if (restore) trigger.value?.focus() }
async function show() {
  if (props.disabled || opened.value) return
  opened.value = true
  active.value = items.value.findIndex((item) => item.value === props.modelValue && !item.disabled)
  if (active.value < 0) active.value = items.value.findIndex((item) => !item.disabled)
  layout(); await nextTick(); reveal()
}
function reveal() { menu.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.scrollIntoView({ block: 'nearest' }) }
function choose(index: number) { const item = items.value[index]; if (!item || item.disabled) return; emit('update:modelValue', item.value); emit('change', item.value); close(true) }
async function keydown(event: KeyboardEvent) {
  if (props.disabled || event.isComposing) return
  if (event.key === 'Tab') { close(); return }
  if (event.key === 'Escape') { if (opened.value) { event.preventDefault(); close(true) } return }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
    event.preventDefault()
    if (!opened.value) { await show(); return }
    if (event.key === 'Enter' || event.key === ' ') { choose(active.value); return }
    const enabled = items.value.map((item, index) => item.disabled ? -1 : index).filter((index) => index >= 0)
    if (!enabled.length) return
    const current = enabled.indexOf(active.value)
    active.value = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]
    await nextTick(); reveal(); return
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    await show(); const now = Date.now(); query = now - lastKey > 700 ? event.key : query + event.key; lastKey = now
    const index = items.value.findIndex((item) => !item.disabled && item.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
    if (index >= 0) { active.value = index; await nextTick(); reveal() }
  }
}
function outside(event: PointerEvent) { const node = event.target as Node; if (!trigger.value?.contains(node) && !menu.value?.contains(node)) close() }
function scroll(event: Event) { if (opened.value && (!(event.target instanceof Node) || !menu.value?.contains(event.target))) layout() }
watch(() => props.disabled, (value) => { if (value) close() })
watch(items, () => { if (opened.value) { if (active.value >= items.value.length) active.value = items.value.findIndex((item) => !item.disabled); nextTick(layout) } })
onMounted(() => { document.addEventListener('pointerdown', outside, true); window.addEventListener('resize', layout); window.addEventListener('scroll', scroll, true) })
onUnmounted(() => { document.removeEventListener('pointerdown', outside, true); window.removeEventListener('resize', layout); window.removeEventListener('scroll', scroll, true) })
</script>

<template>
  <div v-bind="$attrs" class="app-select" :class="{ 'is-disabled': disabled, 'is-open': opened }">
    <button ref="trigger" type="button" class="app-select-trigger" role="combobox" aria-haspopup="listbox" :aria-expanded="opened" :aria-controls="opened ? id : undefined" :aria-activedescendant="opened && active >= 0 ? `${id}-${active}` : undefined" :aria-label="ariaLabel" :disabled="disabled" @click="opened ? close() : show()" @keydown="keydown">
      <span class="app-select-value">{{ label }}</span><span class="app-select-chevron" aria-hidden="true"><svg :class="{ 'is-open': opened }" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
    </button>
    <Teleport to="body"><Transition name="select-menu"><div v-if="opened" :id="id" ref="menu" class="app-select-menu" :class="{ 'opens-up': upwards }" :style="position" role="listbox" :aria-label="ariaLabel || '选项'" @pointerdown.prevent>
      <div v-for="(item, index) in items" :id="`${id}-${index}`" :key="`${item.value}:${index}`" role="option" :aria-selected="item.value === modelValue" :aria-disabled="!!item.disabled" :data-index="index" class="app-select-option" :class="{ highlighted: active === index, selected: item.value === modelValue, disabled: item.disabled }" @pointermove="!item.disabled && (active = index)" @click.stop="choose(index)"><span>{{ item.label }}</span><span v-if="item.value === modelValue" class="app-select-check" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg></span></div>
      <div v-if="!items.length" class="app-select-empty">{{ locale === 'en' ? 'No options available' : '暂无可选项' }}</div>
    </div></Transition></Teleport>
  </div>
</template>

<style>
#app .app-select{min-width:0;position:relative;font-size:inherit}
#app .app-select.input{padding:0;border:0;min-height:0;background:transparent}
#app .app-select-trigger{
 display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;
 min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;
 background-color:var(--md-surface-container-high);color:var(--md-on-surface);
 font:inherit;font-size:14.5px;text-align:left;cursor:pointer;box-shadow:none;
 transition:background-color 180ms,border-color 180ms,box-shadow 200ms,border-radius 340ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1));
}
#app .app-select-trigger:hover:not(:disabled){background-color:var(--md-surface-container-highest)}
#app .app-select-trigger[aria-expanded="true"],#app .app-select-trigger:focus-visible{
 border-color:var(--md-primary);background-color:var(--md-surface-container-lowest);
 box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none;
}
#app .app-select-trigger:disabled{opacity:.5;cursor:not-allowed}
.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
.app-select-chevron{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:transform 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 160ms}
#app .app-select-trigger:hover .app-select-chevron{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}
.app-select-chevron svg{transition:transform 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
.app-select-chevron svg.is-open{transform:rotate(180deg)}
.app-select-menu{
 position:fixed;z-index:10000;overflow-y:auto;overscroll-behavior:contain;
 padding:8px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 55%,transparent);
 border-radius:24px;background:var(--md-surface-container-low);color:var(--md-on-surface);
 box-shadow:0 18px 50px -12px color-mix(in srgb,var(--md-scrim,#000) 45%,transparent),0 4px 14px -4px #16244026;
 font-family:var(--font-family);font-size:14px;transform-origin:top;
}
.app-select-menu.opens-up{transform-origin:bottom}
.app-select-option{
 display:flex;justify-content:space-between;align-items:center;gap:12px;
 min-height:46px;padding:0 14px;border-radius:14px;cursor:pointer;
 overflow-wrap:anywhere;line-height:1.4;color:var(--md-on-surface);
 transition:background-color 140ms,border-radius 300ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),color 140ms;
}
.app-select-option>span{min-width:0}
.app-select-check{flex-shrink:0;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:var(--md-primary)}
.app-select-option.highlighted{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}
.app-select-option.selected{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:650}
.app-select-option.selected .app-select-check{background:var(--md-primary);color:var(--md-on-primary)}
.app-select-option.disabled{opacity:.4;cursor:not-allowed}
.app-select-empty{padding:18px;color:var(--md-on-surface-variant);text-align:center;font-size:13px}
.select-menu-enter-active{transition:opacity 180ms var(--ease-emphasized,cubic-bezier(.2,0,0,1)),transform 320ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1))}
.select-menu-leave-active{transition:opacity 130ms,transform 130ms}
.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:translateY(-6px) scale(.97)}
</style>
