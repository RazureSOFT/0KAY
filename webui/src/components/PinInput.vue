<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  length?: number
  disabled?: boolean
  autofocus?: boolean
  invalid?: boolean
  /** id of an external error element to associate via aria-describedby. */
  errorId?: string
}>(), { modelValue: '', length: 6, disabled: false, autofocus: false, invalid: false, errorId: '' })

const emit = defineEmits<{ 'update:modelValue': [string]; complete: [string] }>()

const boxes = ref<string[]>(Array.from({ length: props.length }, (_, i) => props.modelValue[i] || ''))
const refs = ref<HTMLInputElement[]>([])

function emitValue() {
  const value = boxes.value.join('')
  emit('update:modelValue', value)
  if (value.length === props.length && boxes.value.every(b => b)) emit('complete', value)
}

function focusAt(index: number) {
  nextTick(() => refs.value[Math.max(0, Math.min(props.length - 1, index))]?.focus())
}

function onInput(index: number, event: Event) {
  const el = event.target as HTMLInputElement
  const digits = el.value.replace(/\D/g, '')
  if (!digits) { boxes.value[index] = ''; emitValue(); return }
  const chars = digits.split('')
  for (let k = 0; k < chars.length && index + k < props.length; k++) boxes.value[index + k] = chars[k]
  el.value = boxes.value[index]
  focusAt(index + chars.length)
  emitValue()
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace') {
    if (boxes.value[index]) { boxes.value[index] = ''; emitValue() }
    else if (index > 0) { boxes.value[index - 1] = ''; focusAt(index - 1); emitValue() }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') { focusAt(index - 1); event.preventDefault() }
  else if (event.key === 'ArrowRight') { focusAt(index + 1); event.preventDefault() }
}

function onPaste(index: number, event: ClipboardEvent) {
  // maxlength=1 truncates a pasted code in the browser before any input event,
  // so "paste the 6-digit code" must be handled here explicitly.
  const digits = (event.clipboardData?.getData('text') || '').replace(/\D/g, '')
  if (!digits) return
  event.preventDefault()
  for (let k = 0; k < digits.length && index + k < props.length; k++) boxes.value[index + k] = digits[k]
  focusAt(index + digits.length)
  emitValue()
}

function clear() {
  boxes.value = Array.from({ length: props.length }, () => '')
  emitValue()
  focusAt(0)
}
function focus() { focusAt(0) }
defineExpose({ clear, focus })

watch(() => props.modelValue, value => {
  if (value !== boxes.value.join('')) {
    boxes.value = Array.from({ length: props.length }, (_, i) => value[i] || '')
  }
})
watch(() => props.length, length => {
  boxes.value = Array.from({ length }, (_, i) => boxes.value[i] || '')
})

onMounted(() => { if (props.autofocus) focusAt(0) })
</script>

<template>
  <div
    class="pin-boxes"
    :class="{ invalid }"
    :style="{ gridTemplateColumns: `repeat(${length}, 1fr)` }"
  >
    <input
      v-for="(digit, index) in boxes"
      :key="index"
      :ref="el => { if (el) refs[index] = el as HTMLInputElement }"
      class="pin-box"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      :disabled="disabled"
      :value="digit"
      :aria-invalid="invalid"
      :aria-describedby="invalid && errorId ? errorId : undefined"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste(index, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<style scoped>
.pin-boxes { display: grid; gap: 10px; }
.pin-boxes.invalid { animation: pin-shake 0.32s; }
.pin-box {
  width: 100%;
  aspect-ratio: 1 / 1.12;
  border: 1.5px solid var(--md-outline-variant);
  border-radius: 14px;
  background: var(--md-surface-container-low);
  color: var(--md-on-surface);
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;
  transition: border-color 160ms, box-shadow 160ms, background-color 160ms;
}
.pin-box:focus {
  outline: none;
  border-color: var(--md-primary);
  background: var(--md-surface-container-lowest);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 16%, transparent);
}
.pin-box:disabled { opacity: 0.5; }
.pin-box:not(:placeholder-shown) { background: var(--md-surface-container); }
@keyframes pin-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
@media (max-width: 420px) { .pin-boxes { gap: 7px; } .pin-box { font-size: 20px; border-radius: 11px; } }
</style>
