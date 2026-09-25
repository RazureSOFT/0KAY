<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import {useI18n} from 'vue-i18n'
import {uid} from '../uid'
const {locale}=useI18n()
defineOptions({ inheritAttrs:false })
type Option = { value: string; label: string; disabled?: boolean }
const props = withDefaults(defineProps<{ modelValue?: string; options: Array<string | Option>; disabled?: boolean; placeholder?: string; ariaLabel?: string }>(), { modelValue:'', placeholder:'请选择', disabled:false })
const emit = defineEmits<{ 'update:modelValue':[value:string]; change:[value:string]; focus:[event:FocusEvent]; open:[] }>()
const trigger=ref<HTMLButtonElement|null>(null), menu=ref<HTMLElement|null>(null)
const opened=ref(false),active=ref(-1),position=ref<Record<string,string>>({}), upwards=ref(false)
const id=uid('select')
const items=computed<Option[]>(()=>props.options.map(option=>typeof option==='string'?{value:option,label:option}:option))
const label=computed(()=>items.value.find(item=>item.value===props.modelValue)?.label || props.modelValue || props.placeholder)
let query='',lastKey=0
function layout(){
 const rect=trigger.value?.getBoundingClientRect();if(!rect)return
 const height=window.visualViewport?.height || innerHeight,width=window.visualViewport?.width || innerWidth
 const below=height-rect.bottom-10,above=rect.top-10
 upwards.value=below<Math.min(280,items.value.length*40+12)&&above>below
 const maxHeight=Math.max(48,Math.min(320,upwards.value?above:below))
 const menuWidth=Math.min(Math.max(rect.width,200),width-16)
 position.value={position:'fixed',left:`${Math.max(8,Math.min(rect.left,width-menuWidth-8))}px`,width:`${menuWidth}px`,maxHeight:`${maxHeight}px`,...(upwards.value?{bottom:`${height-rect.top+6}px`}:{top:`${rect.bottom+6}px`})}
}
function close(restore=false){opened.value=false;query='';if(restore)trigger.value?.focus()}
async function show(){
 if(props.disabled||opened.value)return
 opened.value=true;active.value=items.value.findIndex(item=>item.value===props.modelValue&&!item.disabled)
 if(active.value<0)active.value=items.value.findIndex(item=>!item.disabled)
 layout();emit('open');await nextTick();reveal()
}
function reveal(){menu.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.scrollIntoView({block:'nearest'})}
function choose(index:number){const item=items.value[index];if(!item||item.disabled)return;emit('update:modelValue',item.value);emit('change',item.value);close(true)}
async function keydown(event:KeyboardEvent){
 if(props.disabled||event.isComposing)return
 if(event.key==='Tab'){close();return}
 if(event.key==='Escape'){if(opened.value){event.preventDefault();close(true)}return}
 if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)){
  event.preventDefault()
  if(!opened.value){await show();return}
  if(event.key==='Enter'||event.key===' '){choose(active.value);return}
  const enabled=items.value.map((item,index)=>item.disabled?-1:index).filter(index=>index>=0)
  if(!enabled.length)return
  const current=enabled.indexOf(active.value)
  active.value=event.key==='Home'?enabled[0]:event.key==='End'?enabled[enabled.length-1]:enabled[(current+(event.key==='ArrowDown'?1:-1)+enabled.length)%enabled.length]
  await nextTick();reveal();return
 }
 if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
  await show();const now=Date.now();query=now-lastKey>700?event.key:query+event.key;lastKey=now
  const index=items.value.findIndex(item=>!item.disabled&&item.label.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()))
  if(index>=0){active.value=index;await nextTick();reveal()}
 }
}
function outside(event:PointerEvent){const node=event.target as Node;if(!trigger.value?.contains(node)&&!menu.value?.contains(node))close()}
function scroll(event:Event){if(opened.value&&(!(event.target instanceof Node)||!menu.value?.contains(event.target)))layout()}
watch(()=>props.disabled,value=>{if(value)close()})
watch(items,()=>{if(opened.value){if(active.value>=items.value.length)active.value=items.value.findIndex(item=>!item.disabled);nextTick(layout)}})
onMounted(()=>{document.addEventListener('pointerdown',outside,true);window.addEventListener('resize',layout);window.addEventListener('scroll',scroll,true)})
onUnmounted(()=>{document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',layout);window.removeEventListener('scroll',scroll,true)})
</script>
<template>
 <div v-bind="$attrs" class="app-select" :class="{ 'is-disabled':disabled }">
  <button ref="trigger" type="button" class="app-select-trigger" role="combobox" aria-haspopup="listbox" :aria-expanded="opened" :aria-controls="opened?id:undefined" :aria-activedescendant="opened&&active>=0?`${id}-${active}`:undefined" :aria-label="ariaLabel" :disabled="disabled" @click="opened?close():show()" @keydown="keydown" @focus="emit('focus',$event)">
   <span class="app-select-value">{{ label }}</span><svg :class="{'is-open':opened}" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <Teleport to="body"><Transition name="select-menu"><div v-if="opened" :id="id" ref="menu" class="app-select-menu" :class="{'opens-up':upwards}" :style="position" role="listbox" :aria-label="ariaLabel || '选项'" @pointerdown.prevent>
   <div v-for="(item,index) in items" :id="`${id}-${index}`" :key="`${item.value}:${index}`" role="option" :aria-selected="item.value===modelValue" :aria-disabled="!!item.disabled" :data-index="index" class="app-select-option" :class="{highlighted:active===index,selected:item.value===modelValue,disabled:item.disabled}" @pointermove="!item.disabled&&(active=index)" @click.stop="choose(index)"><span>{{ item.label }}</span><svg v-if="item.value===modelValue" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
   <div v-if="!items.length" class="app-select-empty">{{ locale==='en'?'No options available':'暂无可选项' }}</div>
  </div></Transition></Teleport>
 </div>
</template>
<style>
#app .app-select{min-width:0;position:relative;font-size:inherit}#app .app-select.input{padding:0;border:0;min-height:44px;background:transparent}#app .app-select .app-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:38px;padding:9px 12px;border:1px solid var(--md-outline-variant);border-radius:9px;background:var(--md-surface-container-low);color:var(--md-on-surface);font:inherit;text-align:left;cursor:pointer;box-shadow:none}#app .app-select.input .app-select-trigger{min-height:46px;font-size:14px}#app .app-select .app-select-trigger:focus-visible{outline:2px solid var(--md-primary);outline-offset:2px}.app-select-value{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.app-select-trigger>svg{flex-shrink:0;transition:transform 160ms}.app-select-trigger>svg.is-open{transform:rotate(180deg)}.app-select-menu{z-index:10000;overflow-y:auto;overscroll-behavior:contain;padding:5px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);box-shadow:0 8px 30px #16244026;font-family:var(--font-family);font-size:13px;transform-origin:top}.app-select-menu.opens-up{transform-origin:bottom}.app-select-option{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;min-height:38px;border-radius:7px;cursor:pointer;overflow-wrap:anywhere;line-height:1.45}.app-select-option>span{min-width:0}.app-select-option>svg{flex-shrink:0;color:var(--md-primary)}.app-select-option.highlighted{background:var(--md-surface-container)}.app-select-option.selected{color:var(--md-primary);font-weight:600}.app-select-option.disabled{opacity:.4;cursor:not-allowed}.app-select-empty{padding:14px;color:var(--md-on-surface-variant)}.select-menu-enter-active,.select-menu-leave-active{transition:opacity 130ms,transform 130ms}.select-menu-enter-from,.select-menu-leave-to{opacity:0;transform:scaleY(.97) translateY(-3px)}
</style>
