<script setup lang="ts">
import {computed,ref,nextTick,onMounted,onUnmounted,watch} from 'vue'
import {i18n,uid} from '@0kay/host'
import ThinkingSlider from './ThinkingSlider.vue'
const t=(key:string,named?:Record<string,unknown>)=>i18n.global.t(key,named??{})

interface ModelOption { id: string; label: string }

const props=defineProps<{modelId:string;intensity:number;models:ModelOption[];disabled?:boolean;compact?:boolean}>()
const emit=defineEmits<{'update:modelId':[value:string];'update:intensity':[value:number];'open':[]}>()

const opened=ref(false)
const query=ref('')
const position=ref<Record<string,string>>({})
const trigger=ref<HTMLButtonElement|null>(null)
const panel=ref<HTMLElement|null>(null)
const searchInput=ref<HTMLInputElement|null>(null)
const list=ref<HTMLElement|null>(null)
const active=ref(-1)
const id=uid('mtp')

const autoLabel=computed(()=>t('agent.page.mocrAuto'))
const options=computed<ModelOption[]>(()=>[{id:'MOCR',label:autoLabel.value},...props.models])
const filtered=computed(()=>{
  const q=query.value.trim().toLowerCase()
  if(!q)return options.value
  return options.value.filter(o=>o.label.toLowerCase().includes(q)||o.id.toLowerCase().includes(q))
})
const currentLabel=computed(()=>props.modelId==='MOCR'?autoLabel.value:(props.models.find(m=>m.id===props.modelId)?.label||props.modelId))
const effortLabel=computed(()=>{
  const v=props.intensity
  return v===0?t('agent.thinking.off'):v<35?t('agent.thinking.low'):v<62.5?t('agent.thinking.medium'):v<87.5?t('agent.thinking.high'):t('agent.thinking.max')
})

function layout(){
  const rect=trigger.value?.getBoundingClientRect();if(!rect)return
  const width=Math.min(400,innerWidth-16)
  const height=Math.min(520,innerHeight-24)
  const up=rect.top>=height+8||innerHeight-rect.bottom<height
  position.value={left:`${Math.max(8,Math.min(rect.left,innerWidth-width-8))}px`,width:`${width}px`,maxHeight:`${height}px`,...(up?{bottom:`${innerHeight-rect.top+8}px`}:{top:`${rect.bottom+8}px`})}
}
function reveal(){list.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.scrollIntoView({block:'nearest'})}
function close(restore=true){opened.value=false;query.value='';active.value=-1;if(restore)trigger.value?.focus()}
async function toggle(){
  if(props.disabled)return
  if(opened.value){close();return}
  opened.value=true;query.value='';active.value=Math.max(0,filtered.value.findIndex(o=>o.id===props.modelId))
  emit('open');layout();await nextTick()
  searchInput.value?.focus();reveal()
}
function pick(id:string){emit('update:modelId',id);close()}
function choose(index:number){const option=filtered.value[index];if(option)pick(option.id)}
async function keydown(event:KeyboardEvent){
  if(event.key==='Tab'){close(false);return}
  if(event.key==='Escape'){if(opened.value){event.preventDefault();close()}return}
  if(!['ArrowDown','ArrowUp','Home','End','Enter'].includes(event.key))return
  if(event.target===searchInput.value&&event.key!=='Enter'&&event.key!=='Escape')return
  event.preventDefault()
  if(!filtered.value.length)return
  if(event.key==='Enter'){choose(active.value);return}
  const total=filtered.value.length
  active.value=event.key==='Home'?0
    :event.key==='End'?total-1
    :Math.min(total-1,Math.max(0,active.value+(event.key==='ArrowDown'?1:-1)))
  await nextTick();reveal()
}
function outside(event:PointerEvent){const target=event.target as Node;if(!trigger.value?.contains(target)&&!panel.value?.contains(target))opened.value=false}
function scroll(event:Event){if(opened.value&&(!(event.target instanceof Node)||!panel.value?.contains(event.target)))layout()}
watch(filtered,()=>{if(opened.value)active.value=filtered.value.length?0:-1})
watch(()=>props.disabled,value=>{if(value)close(false)})
onMounted(()=>{document.addEventListener('pointerdown',outside,true);window.addEventListener('resize',layout);window.addEventListener('scroll',scroll,true)})
onUnmounted(()=>{document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',layout);window.removeEventListener('scroll',scroll,true)})
</script>
<template>
 <div class="mtp" :class="{compact}">
  <span v-if="!compact" class="mtp-caption">{{ t('agent.page.model') }}</span>
  <button ref="trigger" type="button" class="mtp-trigger" :disabled="disabled" :aria-label="t('agent.page.model')" aria-haspopup="listbox" :aria-expanded="opened" :aria-controls="opened?id:undefined" @click="toggle" @keydown="keydown">
   <span class="mtp-model">{{ currentLabel }}</span>
   <span class="mtp-effort">✦ {{ effortLabel }}</span>
   <span class="mtp-caret" aria-hidden="true"><svg :class="{ 'is-open': opened }" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
   <span v-if="compact" class="hint right"><b>{{ t('agent.page.model') }} · {{ currentLabel }}</b><i>{{ t('agent.page.tipModel') }} · {{ effortLabel }}</i></span>
  </button>
  <Teleport to="body">
   <Transition name="mtp-menu">
    <section v-if="opened" :id="id" ref="panel" class="mtp-popover" :style="position" role="dialog" :aria-label="t('agent.page.model')" @keydown="keydown">
     <ThinkingSlider inline :model-value="intensity" :disabled="disabled" @update:model-value="emit('update:intensity',$event)" />
     <div class="mtp-divider" />
     <input ref="searchInput" v-model="query" class="mtp-search" type="search" :placeholder="t('agent.page.modelSearch')" :aria-label="t('agent.page.modelSearch')" />
     <div ref="list" class="mtp-list" role="listbox" :aria-label="t('agent.page.model')">
            <div v-for="(option,index) in filtered" :id="`${id}-${index}`" :key="option.id" class="mtp-option" :class="{sel:option.id===modelId,active:active===index}" role="option" :aria-selected="option.id===modelId" :data-index="index" @pointermove="active=index" @click="choose(index)">
       <span class="mtp-option-label">{{ option.label }}</span>
       <span v-if="option.id===modelId" class="mtp-check" aria-hidden="true">✓</span>
      </div>
      <div v-if="!filtered.length" class="mtp-empty">{{ t('agent.page.noModelMatches') }}</div>
     </div>
    </section>
   </Transition>
  </Teleport>
 </div>
</template>
<style scoped>
.mtp{min-width:130px;flex:1;display:flex;flex-direction:column;gap:5px}
.mtp-caption{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--md-on-surface-variant)}

#app .execution-options .mtp-trigger{display:flex;align-items:center;gap:10px;width:100%;min-height:52px;padding:0 14px 0 16px;border:1px solid transparent;border-radius:16px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:13px;font-weight:600;text-align:left;text-transform:none;letter-spacing:0.1px;cursor:pointer;box-shadow:none;transition:background-color var(--duration-short) var(--ease-out),border-color var(--duration-short) var(--ease-out),box-shadow var(--duration-medium) var(--ease-out)}
#app .execution-options .mtp-trigger:hover:not(:disabled){background:var(--md-surface-container-highest)}
#app .execution-options .mtp-trigger[aria-expanded="true"],#app .execution-options .mtp-trigger:focus-visible{border-color:var(--md-primary);background:var(--md-surface-container-lowest);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 16%,transparent);outline:none}
#app .execution-options .mtp-trigger:disabled{opacity:.5;cursor:not-allowed}
.mtp-model{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.mtp-effort{flex:none;font-size:11.5px;color:var(--md-primary);white-space:nowrap}
.mtp-caret{flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;color:var(--md-on-surface-variant);transition:background-color var(--duration-short) var(--ease-out)}
.mtp-caret svg{transition:transform var(--duration-medium) var(--ease-spring)}
.mtp-caret svg.is-open{transform:rotate(180deg)}
#app .execution-options .mtp-trigger:hover:not(:disabled) .mtp-caret{background:color-mix(in srgb,var(--md-on-surface) 8%,transparent)}
.mtp-popover{position:fixed;z-index:var(--z-popover,5000);display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:20px;background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);box-shadow:0 10px 32px #16244026;color:var(--md-on-surface);overflow:auto}
.mtp-divider{height:1px;background:var(--md-outline-variant);margin:2px 0}
.mtp-search{width:100%;padding:8px 11px;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-low);color:var(--md-on-surface);font:inherit;font-size:12.5px}
.mtp-search:focus{outline:2px solid var(--md-primary);outline-offset:1px}
.mtp-list{display:flex;flex-direction:column;gap:2px;max-height:240px;overflow:auto}
.mtp-option{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border:0;border-radius:9px;background:transparent;color:var(--md-on-surface);font:inherit;font-size:12.5px;text-align:left;cursor:pointer}
.mtp-option:hover{background:var(--md-surface-container-high)}
.mtp-option.active{background:var(--md-surface-container-high)}
.mtp-option.sel{background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:600}
.mtp-option-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mtp-check{flex:none;color:var(--md-primary)}
.mtp-empty{padding:14px;text-align:center;color:var(--md-on-surface-variant);font-size:12.5px}
.mtp-menu-enter-active{transition:opacity 160ms var(--ease-out),transform 160ms var(--ease-out)}
.mtp-menu-leave-active{transition:opacity 120ms var(--ease-out),transform 120ms var(--ease-out)}
.mtp-menu-enter-from,.mtp-menu-leave-to{opacity:0;transform:translateY(-6px)}
@media (prefers-reduced-motion: reduce){.mtp-menu-enter-active,.mtp-menu-leave-active{transition-duration:1ms}.mtp-menu-enter-from,.mtp-menu-leave-to{transform:none}}

.mtp.compact{min-width:0;flex:none;flex-direction:row;align-items:center}
#app .composer-footer .mtp-trigger{position:relative;display:inline-flex;align-items:center;gap:7px;width:auto;max-width:260px;min-height:0;height:30px;padding:0 8px 0 11px;border:1px solid transparent;border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface);font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;box-shadow:none;transition:background-color 160ms var(--ease-out),border-color 160ms var(--ease-out)}
#app .composer-footer .mtp-trigger:hover:not(:disabled){background:var(--md-secondary-container)}
#app .composer-footer .mtp-trigger[aria-expanded="true"]{border-color:var(--md-primary);background:var(--md-surface-container-lowest)}
#app .composer-footer .mtp-trigger:disabled{opacity:.5;cursor:not-allowed}
#app .composer-footer .mtp-model{max-width:150px}
#app .composer-footer .mtp-effort{font-size:11px;opacity:.85}
#app .composer-footer .mtp-caret{width:18px;height:18px}
</style>
