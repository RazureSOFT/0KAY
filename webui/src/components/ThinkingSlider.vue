<script setup lang="ts">
import {computed,ref,watch,nextTick,onMounted,onUnmounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {uid} from '../uid'
const {locale}=useI18n();const en=computed(()=>locale.value==='en')
const props=defineProps<{modelValue:number;disabled?:boolean}>()
const emit=defineEmits<{'update:modelValue':[value:number]}>()
const stops=computed(()=>[{value:0,label:en.value?'Off':'关闭思考'},{value:20,label:en.value?'Low':'低'},{value:50,label:en.value?'Medium':'中'},{value:75,label:en.value?'High':'高'},{value:100,label:en.value?'Max':'最高'}])
const index=computed(()=>props.modelValue===0?0:props.modelValue<35?1:props.modelValue<62.5?2:props.modelValue<87.5?3:4)
const opened=ref(false),position=ref<Record<string,string>>({}),trigger=ref<HTMLButtonElement|null>(null),panel=ref<HTMLElement|null>(null),range=ref<HTMLInputElement|null>(null)
const dragValue=ref(index.value*25),pulse=ref(false)
const full=computed(()=>index.value===4)
const id=uid('thinking')
let timer:ReturnType<typeof setTimeout>|undefined
watch(()=>props.modelValue,()=>{if(!opened.value)dragValue.value=index.value*25})
watch(full,(value,previous)=>{if(value&&!previous){pulse.value=true;clearTimeout(timer);timer=setTimeout(()=>pulse.value=false,900)}})
watch(()=>props.disabled,value=>{if(value)opened.value=false})
function layout(){const rect=trigger.value?.getBoundingClientRect();if(!rect)return;const width=Math.min(352,innerWidth-16),height=236;const up=rect.top>=height+8||innerHeight-rect.bottom<height;position.value={left:`${Math.max(8,Math.min(rect.left,innerWidth-width-8))}px`,width:`${width}px`,...(up?{bottom:`${innerHeight-rect.top+8}px`}:{top:`${rect.bottom+8}px`})}}
async function toggle(){if(props.disabled)return;opened.value=!opened.value;if(opened.value){dragValue.value=index.value*25;layout();await nextTick();range.value?.focus()}}
function close(){opened.value=false;trigger.value?.focus()}
function update(event:Event){dragValue.value=Number((event.target as HTMLInputElement).value);emit('update:modelValue',stops.value[Math.round(dragValue.value/25)].value)}
function select(i:number){dragValue.value=i*25;emit('update:modelValue',stops.value[i].value)}
function outside(event:PointerEvent){const target=event.target as Node;if(!trigger.value?.contains(target)&&!panel.value?.contains(target))opened.value=false}
function scroll(event:Event){if(opened.value&&(!(event.target instanceof Node)||!panel.value?.contains(event.target)))layout()}
onMounted(()=>{document.addEventListener('pointerdown',outside,true);window.addEventListener('resize',layout);window.addEventListener('scroll',scroll,true)})
onUnmounted(()=>{clearTimeout(timer);document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',layout);window.removeEventListener('scroll',scroll,true)})
</script>
<template>
 <div class="thinking-control" :class="{full,pulse}">
  <span class="thinking-caption">{{ en?'Thinking effort':'思考强度' }}</span>
  <button ref="trigger" type="button" class="thinking-trigger" :disabled="disabled" aria-label="思考强度" aria-haspopup="dialog" :aria-expanded="opened" :aria-controls="opened?id:undefined" @click="toggle" @keydown.esc="close"><span>{{ full?'✦ ':'' }}{{ stops[index].label }}</span><span aria-hidden="true">⌄</span></button>
  <Teleport to="body"><Transition name="thinking-menu"><section v-if="opened" :id="id" ref="panel" class="thinking-popover" :class="{full,pulse}" :style="position" role="dialog" aria-label="调整思考强度" @keydown.esc.prevent.stop="close">
   <header><strong>{{ en?'Thinking effort':'思考强度' }}</strong><output>{{ full?'✦ ':'' }}{{ stops[index].label }}</output></header>
   <div class="thinking-track" :style="{'--intensity':`${dragValue}%`}">
    <div class="thinking-capsule" aria-hidden="true"><div class="thinking-fill"/><span v-for="(_,i) in stops" :key="i" class="thinking-tick" :class="{passed:dragValue>=i*25}" :style="{left:`${i*25}%`}"/></div>
    <input ref="range" type="range" min="0" max="100" step="0.1" :value="dragValue" aria-label="思考强度滑块" :aria-valuetext="stops[index].label" @input="update" @change="dragValue=index*25" @keydown.home.prevent="select(0)" @keydown.end.prevent="select(4)" @keydown.arrow-right.prevent="select(Math.min(4,index+1))" @keydown.arrow-left.prevent="select(Math.max(0,index-1))"/><span v-if="full" class="energy-wave" aria-hidden="true" />
   </div>
   <div class="thinking-stops"><button v-for="(stop,i) in stops" :key="stop.value" type="button" :class="{selected:index===i}" :aria-pressed="index===i" @click="select(i)">{{ stop.label }}</button></div>
   <p>{{ en?(index===0?'Disable model reasoning':full?'Maximum effort':'Drag to adjust; release to snap to a level'):(index===0?'不启用模型思考模式':full?'全力思考 · 已达到最高档':'拖动滑块调整，松开后定位到对应档位') }}</p>
   <p class="thinking-provider-note">{{ en?'Actual reasoning controls depend on the selected provider. Max may map to High.':'实际推理参数取决于供应商；最高档可能映射为高档。' }}</p>
  </section></Transition></Teleport>
 </div>
</template>
<style>
.thinking-control{min-width:110px;flex:1;display:flex;flex-direction:column;gap:5px}.thinking-caption{font-size:12px}#app .thinking-trigger{display:flex;justify-content:space-between;gap:12px;width:100%;text-align:left;padding:9px 12px;background:var(--md-surface-container-low);border:1px solid var(--md-outline-variant);font-size:12px;border-radius:9px}.thinking-popover{position:fixed;z-index:10000;padding:16px;border-radius:14px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);font-family:var(--font-family)}.thinking-popover header{display:flex;justify-content:space-between;gap:12px;font-size:13px}.thinking-popover output{color:var(--md-primary);font-weight:600}.thinking-track{position:relative;padding:22px 4px 16px;display:flex;align-items:center}.thinking-track input{appearance:none;-webkit-appearance:none;width:100%;height:5px;padding:0;margin:0;border:0;border-radius:5px;background:linear-gradient(to right,var(--md-primary) var(--intensity),var(--md-outline-variant) var(--intensity));cursor:pointer;z-index:1}.thinking-track input::-webkit-slider-thumb{appearance:none;width:17px;height:17px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface);box-shadow:0 1px 4px #24345d40}.thinking-track input::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--md-primary);border:2px solid var(--md-surface)}.thinking-track input:focus-visible{outline:2px solid var(--md-primary);outline-offset:7px}.thinking-stops{display:flex;justify-content:space-between;gap:3px}.thinking-stops button{font:inherit;font-size:12px;border:0;background:transparent;color:var(--md-on-surface-variant);padding:6px 5px;border-radius:6px;cursor:pointer}.thinking-stops button.selected{background:var(--md-primary-container);color:var(--md-primary);font-weight:700}.thinking-popover p{font-size:12px;line-height:1.5;color:var(--md-on-surface-variant);margin:12px 0 0}.thinking-control.full .thinking-trigger,.thinking-popover.full{--md-primary:#a050db;border-color:#a050db88;box-shadow:0 0 16px #a050db25}.thinking-popover.full .energy-wave{position:absolute;inset:14px 0 8px;pointer-events:none;border-radius:20px;box-shadow:0 0 12px #a050db66}.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger{animation:thinking-boost 850ms ease-out}.thinking-popover.pulse .energy-wave{animation:thinking-wave 850ms ease-out}@keyframes thinking-boost{0%{box-shadow:0 0 0 0 #a050db66}45%{box-shadow:0 0 0 5px #a050db20,0 0 30px #a050db40}100%{box-shadow:0 0 16px #a050db25}}@keyframes thinking-wave{from{transform:scale(.95);opacity:1}to{transform:scale(1.15,2);opacity:0}}.thinking-menu-enter-active,.thinking-menu-leave-active{transition:opacity 130ms,transform 130ms}.thinking-menu-enter-from,.thinking-menu-leave-to{opacity:0;transform:translateY(4px)}@media(prefers-reduced-motion:reduce){.thinking-popover.pulse,.thinking-control.pulse .thinking-trigger,.thinking-popover.pulse .energy-wave{animation:none}}
/* Expressive slider: pill-shaped track, separated vertical handle, tonal stops. */
.thinking-popover {
 padding:20px; border-radius:28px;
 background:var(--md-surface-container-low);
 border-color:transparent; box-shadow:0 8px 28px #24345d24;
}
.thinking-popover header {align-items:center;font-size:14px;min-height:30px}
.thinking-popover output {padding:6px 12px;border-radius:999px;background:var(--md-primary-container);font-size:12px}
.thinking-track {height:68px;padding:0;margin:12px 0 0;isolation:isolate}
.thinking-capsule {
 position:absolute;left:5px;right:5px;height:28px;
 border-radius:999px;background:var(--md-primary-container);overflow:hidden;
 pointer-events:none;
}
.thinking-fill {height:100%;width:var(--intensity);background:var(--md-primary);border-radius:999px}
.thinking-tick {position:absolute;top:50%;width:4px;height:4px;border-radius:50%;background:var(--md-primary);transform:translate(-50%,-50%)}
.thinking-tick:first-of-type{left:8px!important}
.thinking-tick:last-of-type{left:calc(100% - 8px)!important}
.thinking-tick.passed{background:var(--md-on-primary)}
.thinking-track input {
 position:relative;height:48px;background:transparent;border-radius:999px;touch-action:pan-y;
}
.thinking-track input::-webkit-slider-runnable-track {height:28px;background:transparent;border-radius:999px}
.thinking-track input::-webkit-slider-thumb {
 width:10px;height:44px;margin-top:-8px;border-radius:999px;border:0;
 background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low);
 transition:width 140ms,height 140ms,margin-top 140ms;
}
.thinking-track input:active::-webkit-slider-thumb {width:6px;height:48px;margin-top:-10px}
.thinking-track input::-moz-range-track {height:28px;background:transparent;border-radius:999px}
.thinking-track input::-moz-range-thumb {width:10px;height:44px;border:0;border-radius:999px;background:var(--md-primary);box-shadow:0 0 0 5px var(--md-surface-container-low)}
.thinking-track input:active::-moz-range-thumb {width:6px;height:48px}
.thinking-track input:focus-visible{outline-offset:3px}
.thinking-stops{align-items:center;gap:2px;margin-top:2px}
.thinking-stops button{border-radius:999px;min-height:30px;padding:6px 9px;transition:background-color 160ms,color 160ms}
.thinking-popover.full {background:color-mix(in srgb,var(--md-surface-container-low) 93%,#a050db);border-color:#a050db55}
.thinking-popover.full .thinking-fill {background:linear-gradient(90deg,#7255c8,#ad50d6)}
.thinking-popover.full .energy-wave{inset:18px 5px;border-radius:999px;z-index:-1}
.thinking-popover p{margin-top:12px}
</style>
