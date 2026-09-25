<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
const data = ref<any>({ relationships:[], agenda:[], journal:[], dreams:[], audit:[], groups:{}, proactive:{} })
const loading = ref(false); const error = ref(''); const agendaTitle = ref(''); const agendaWhen = ref(''); const agendaDetail = ref(''); const journal = ref(''); const dream = ref('')
const groups = computed(() => Object.entries(data.value.groups || {}))
async function load(){loading.value=true;error.value='';try{const r=await fetch('/api/life/companion');if(!r.ok)throw Error(String(r.status));data.value=await r.json()}catch(e:any){error.value=e?.message||'无法读取 LIFE 陪伴状态'}finally{loading.value=false}}
async function act(action:string,payload:any){try{const r=await fetch('/api/life/companion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,payload})});if(!r.ok)throw Error(await r.text());await load()}catch(e:any){error.value=e?.message||'操作失败'}}
async function addAgenda(){if(!agendaTitle.value.trim())return;await act('add_agenda',{title:agendaTitle.value,when:agendaWhen.value,detail:agendaDetail.value});agendaTitle.value='';agendaWhen.value='';agendaDetail.value=''}
async function addEntry(kind:'journal'|'dream',content:string){if(!content.trim())return;await act(kind,{content});if(kind==='journal')journal.value='';else dream.value=''}
function relPct(v:number){return `${Math.round(Math.max(0,Math.min(1,v||0))*100)}%`}
onMounted(load)
</script>

<template><main class="page"><div class="page-inner">
  <header class="page-header"><div>
    <p class="eyebrow">L.I.F.E / COMPANION</p><h1>陪伴面板</h1>
    <p class="subtitle">日程、关系、生活状态、梦境、日记、群聊观察和主动行为审计均由 LIFE 插件维护。</p>
  </div><div class="header-actions"><button class="btn btn-tonal" :disabled="loading" @click="load">{{loading?'刷新中…':'刷新'}}</button></div></header>
  <p v-if="error" class="error-banner">{{error}}</p>

  <section class="stat-grid">
    <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-1" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6M16 6.2a3.2 3.2 0 010 6M17.6 14.7c2 .7 3.3 2.2 3.7 4.3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">关系对象</span></div><strong class="stat-value">{{data.relationships?.length||0}}</strong><span class="stat-hint">被 LIFE 记住的人</span></article>
    <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-2" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><span class="stat-label">活动日程</span></div><strong class="stat-value">{{data.agenda?.filter((x:any)=>x.status==='active').length||0}}</strong><span class="stat-hint">待确认 + 已确认</span></article>
    <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-3" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18.5 15.5l.8 2.1 2.2.8-2.2.8-.8 2.1-.8-2.1-2.2-.8 2.2-.8.8-2.1z" fill="currentColor"/></svg></span><span class="stat-label">已投递主动行为</span></div><strong class="stat-value">{{data.proactive?.candidates?.filter((x:any)=>x.status==='delivered').length||0}}</strong><span class="stat-hint">LIFE 主动发起</span></article>
    <article class="stat-card"><div class="stat-head"><span class="icon-badge tone-4" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 6.5h14A1.5 1.5 0 0120.5 8v8a1.5 1.5 0 01-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 013.5 16V8A1.5 1.5 0 015 6.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="stat-label">已观察群聊</span></div><strong class="stat-value">{{groups.length}}</strong><span class="stat-hint">群消息学习</span></article>
  </section>

  <section class="grid">
    <article class="card">
      <div class="card-head"><h2 class="card-title">日程</h2></div>
      <form class="agenda-form" @submit.prevent="addAgenda">
        <input v-model="agendaTitle" class="input" placeholder="日程标题" aria-label="日程标题"/>
        <input v-model="agendaWhen" class="input" placeholder="时间，例如 2026-09-25 20:00" aria-label="时间"/>
        <button class="btn btn-primary" type="submit">创建候选</button>
        <textarea v-model="agendaDetail" class="input area" placeholder="说明（可选）"/>
      </form>
      <h3 class="section-label">待确认候选</h3>
      <ul class="item-list">
        <li v-for="item in data.calendar_candidates?.filter((x:any)=>x.status==='pending_confirmation')" :key="item.id" class="item">
          <div class="item-main"><strong>{{item.title}}</strong><span class="item-meta">{{item.when_text}} · {{item.detail||'等待你确认'}}</span></div>
          <div class="item-actions"><button class="btn btn-primary btn-sm" @click="act('confirm_agenda',{id:item.id})">确认</button><button class="btn btn-danger btn-sm" @click="act('reject_agenda',{id:item.id})">拒绝</button></div>
        </li>
        <li v-if="!data.calendar_candidates?.filter((x:any)=>x.status==='pending_confirmation').length" class="list-empty">没有待确认的日程候选</li>
      </ul>
      <h3 class="section-label">已确认日程</h3>
      <ul class="item-list">
        <li v-for="item in data.agenda" :key="item.id" class="item">
          <label class="check-label"><input :checked="item.status==='completed'" type="checkbox" @change="act('complete_agenda',{id:item.id})"/></label>
          <div class="item-main"><strong :class="{done:item.status==='completed'}">{{item.title}}</strong><span class="item-meta">{{item.start_at}}<template v-if="item.detail"> · {{item.detail}}</template></span></div>
        </li>
        <li v-if="!data.agenda?.length" class="list-empty">暂无已确认日程</li>
      </ul>
    </article>

    <article class="card">
      <div class="card-head"><h2 class="card-title">关系账本</h2><span class="chip muted">{{data.relationships?.length||0}}</span></div>
      <ul class="rel-list">
        <li v-for="rel in data.relationships" :key="rel.user_id" class="rel">
          <span class="avatar">{{(rel.user_id||'?').slice(0,1).toUpperCase()}}</span>
          <div class="rel-main">
            <div class="rel-top"><strong>{{rel.user_id}}</strong><span class="chip">{{rel.stage}}</span></div>
            <div class="rel-meter"><div class="meter-bar"><i :style="{width:relPct(rel.affinity)}"></i></div><b>{{Math.round((rel.affinity||0)*100)}}%</b></div>
            <span class="item-meta">最近互动：{{rel.last_seen||'暂无'}}</span>
          </div>
        </li>
        <li v-if="!data.relationships?.length" class="list-empty">暂无关系记录</li>
      </ul>
    </article>

    <article class="card">
      <div class="card-head"><h2 class="card-title">成长中的性格</h2></div>
      <ul class="item-list">
        <li v-for="trait in data.persona_evolution" :key="trait.id" class="item trait-item">
          <div class="item-main"><strong>{{trait.trait}}</strong><span class="item-meta">支持 {{trait.support_count}} 次 · 置信度 {{Math.round(trait.confidence*100)}}%</span></div>
          <span class="chip">{{trait.value}}</span>
        </li>
        <li v-if="!data.persona_evolution?.length" class="list-empty">LIFE 还在观察，重复出现的稳定倾向才会被确认。</li>
      </ul>
    </article>

    <article class="card">
      <div class="card-head"><h2 class="card-title">群聊观察</h2><span class="chip muted">{{groups.length}}</span></div>
      <ul class="item-list">
        <li v-for="[id,group] in groups" :key="id" class="item">
          <div class="item-main"><strong>{{id}}</strong><span class="item-meta">{{(group as any).messages?.length||0}} 条观察 · {{Object.keys((group as any).members||{}).length}} 位成员</span></div>
        </li>
        <li v-if="!groups.length" class="list-empty">群聊观察尚未启用或没有消息。</li>
      </ul>
    </article>

    <article class="card">
      <div class="card-head"><h2 class="card-title">日记</h2></div>
      <form class="stack-form" @submit.prevent="addEntry('journal',journal)"><textarea v-model="journal" class="input area" placeholder="记录 LIFE 的日记…"/><button class="btn btn-tonal" type="submit">写入日记</button></form>
      <ol class="feed">
        <li v-for="item in data.journal" :key="item.id"><time>{{item.at}}</time><p>{{item.content}}</p></li>
        <li v-if="!data.journal?.length" class="list-empty plain">还没有日记</li>
      </ol>
    </article>

    <article class="card">
      <div class="card-head"><h2 class="card-title">梦境</h2></div>
      <form class="stack-form" @submit.prevent="addEntry('dream',dream)"><textarea v-model="dream" class="input area" placeholder="记录一个梦境或睡眠反思…"/><button class="btn btn-tonal" type="submit">记录梦境</button></form>
      <ol class="feed">
        <li v-for="item in data.dreams" :key="item.id"><time>{{item.at}}</time><p>{{item.content}}</p></li>
        <li v-if="!data.dreams?.length" class="list-empty plain">还没有梦境记录</li>
      </ol>
    </article>
  </section>

  <article class="card audit-card">
    <div class="card-head"><h2 class="card-title">主动行为审计</h2><button class="btn btn-tonal btn-sm" @click="act('memory_maintenance',{})">执行记忆维护与备份</button></div>
    <ol class="timeline">
      <li v-for="item in data.audit" :key="item.at+item.kind">
        <span class="dot" :class="item.outcome==='ok'?'ok':'warn'" aria-hidden="true"></span>
        <div class="tl-body"><div class="tl-head"><strong>{{item.kind}}</strong><span class="chip" :class="item.outcome==='ok'?'chip-ok':'chip-warn'">{{item.outcome}}</span><time>{{item.at}}</time></div>
        <p class="item-meta">{{item.target}}</p><p class="tl-detail">{{item.detail}}</p></div>
      </li>
      <li v-if="!data.audit?.length" class="list-empty plain">暂无审计记录</li>
    </ol>
  </article>
</div></main></template>

<style scoped>
.page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface);color:var(--md-on-surface)}
.page-inner{max-width:1180px;margin:0 auto}

.page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.eyebrow{margin:0 0 6px;color:var(--md-primary);font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.page-header h1{margin:0;font-size:var(--font-size-lg);font-weight:650;letter-spacing:-.01em;color:var(--md-on-surface)}
.subtitle{margin:6px 0 0;max-width:620px;color:var(--md-on-surface-variant);font-size:14px;line-height:1.55}
.header-actions{display:flex;gap:var(--space-sm);padding-top:20px;flex-shrink:0}

.btn{height:36px;padding:0 15px;border:1px solid transparent;border-radius:9px;font:500 13px/1 inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:filter .15s,box-shadow .15s,background .15s}
.btn:disabled{opacity:.55;cursor:not-allowed}
.btn:hover:not(:disabled){box-shadow:var(--shadow-1);filter:brightness(.98)}
.btn-sm{height:30px;padding:0 12px;font-size:12px}
.btn-primary{background:var(--md-primary);color:var(--md-on-primary,#fff)}
.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.btn-danger{background:var(--md-error-container);color:#410E0B}

.error-banner{padding:12px 16px;border-radius:12px;background:var(--md-error-container);color:#410E0B;font-size:13px;margin:0 0 var(--space-lg)}

.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-lg)}
.stat-card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);box-shadow:var(--shadow-1);display:flex;flex-direction:column;gap:8px}
.stat-head{display:flex;align-items:center;gap:10px}
.stat-label{font-size:13px;font-weight:600;color:var(--md-on-surface-variant)}
.stat-value{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;color:var(--md-on-surface)}
.stat-hint{font-size:12px;color:var(--md-on-surface-variant);opacity:.85}
.icon-badge{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}
.tone-1{background:var(--md-primary-container);color:var(--md-on-primary-container)}
.tone-2{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.tone-3{background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#4a2230)}
.tone-4{background:var(--md-success-container);color:#0D3B1E}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg);margin-bottom:var(--space-lg)}
.card{background:var(--md-surface-container-lowest);border:1px solid var(--md-outline-variant);border-radius:var(--radius-lg);padding:var(--space-xl);box-shadow:var(--shadow-1)}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:var(--space-lg)}
.card-title{margin:0;font-size:16px;font-weight:650;color:var(--md-on-surface)}
.section-label{margin:20px 0 10px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--md-on-surface-variant)}

.chip{height:24px;padding:0 10px;border-radius:999px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container);flex-shrink:0;text-transform:capitalize}
.chip.muted{background:var(--md-surface-container-high);color:var(--md-on-surface-variant);font-weight:500}
.chip-ok{background:var(--md-success-container);color:#0D3B1E}
.chip-warn{background:#FFF1DC;color:#7A4400}

.input{width:100%;height:40px;padding:0 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);font:400 14px/1 inherit;outline:none;transition:border-color .15s,box-shadow .15s}
.input:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 12%,transparent)}
.input::placeholder{color:var(--md-on-surface-variant);opacity:.8}
.input.area{height:auto;padding:10px 14px;line-height:1.6;resize:vertical;min-height:64px}

.agenda-form{display:grid;grid-template-columns:1fr 240px auto;gap:10px}
.agenda-form .area{grid-column:1/-1}
.stack-form{display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.stack-form .btn{margin-top:2px}

.item-list,.rel-list,.feed,.timeline{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.item{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low);transition:border-color .15s,background .15s}
.item:hover{border-color:color-mix(in srgb,var(--md-primary) 35%,var(--md-outline-variant));background:var(--md-surface-container-lowest)}
.item-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.item-main strong{font-size:14px;font-weight:600;color:var(--md-on-surface)}
.item-main strong.done{text-decoration:line-through;color:var(--md-on-surface-variant)}
.item-meta{font-size:12px;color:var(--md-on-surface-variant);line-height:1.5;overflow-wrap:anywhere}
.item-actions{display:flex;gap:6px;flex-shrink:0}
.list-empty{padding:14px;text-align:center;font-size:13px;color:var(--md-on-surface-variant);background:var(--md-surface-container);border-radius:12px;border:1px dashed var(--md-outline-variant)}
.list-empty.plain{background:transparent;border:0}
.check-label{display:flex;align-items:center}
.check-label input{width:17px;height:17px;accent-color:var(--md-primary);cursor:pointer}
.trait-item .chip{max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.rel{display:flex;gap:12px;padding:14px;border:1px solid var(--md-outline-variant);border-radius:12px;background:var(--md-surface-container-low)}
.avatar{width:38px;height:38px;border-radius:999px;background:var(--md-primary-container);color:var(--md-on-primary-container);display:grid;place-items:center;font-weight:700;font-size:15px;flex-shrink:0}
.rel-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.rel-top{display:flex;align-items:center;gap:8px}
.rel-top strong{font-size:14px}
.rel-meter{display:flex;align-items:center;gap:8px}
.meter-bar{flex:1;height:6px;border-radius:999px;background:var(--md-surface-container-high);overflow:hidden}
.meter-bar i{display:block;height:100%;border-radius:999px;background:var(--md-primary);transition:width .3s}
.rel-meter b{font-size:12px;color:var(--md-on-surface)}

.feed li{padding:12px 14px;border-left:3px solid var(--md-primary);background:var(--md-surface-container-low);border-radius:0 12px 12px 0}
.feed time,.timeline time{font-size:11px;color:var(--md-on-surface-variant);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.feed p{margin:5px 0 0;font-size:13.5px;line-height:1.65;white-space:pre-wrap;color:var(--md-on-surface)}

.audit-card{margin-bottom:var(--space-lg)}
.timeline{position:relative}
.timeline li{display:flex;gap:14px;position:relative;padding-bottom:4px}
.timeline li:not(:last-child)::before{content:'';position:absolute;left:5px;top:16px;bottom:-8px;width:1.5px;background:var(--md-outline-variant)}
.dot{width:11px;height:11px;border-radius:50%;margin-top:5px;flex-shrink:0;background:var(--md-outline);box-shadow:0 0 0 3px var(--md-surface-container-high)}
.dot.ok{background:var(--md-success);box-shadow:0 0 0 3px var(--md-success-container)}
.dot.warn{background:#E08700;box-shadow:0 0 0 3px #FFF1DC}
.tl-body{flex:1;min-width:0;padding-bottom:14px}
.tl-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.tl-head strong{font-size:13.5px;font-weight:650}
.tl-detail{margin:4px 0 0;font-size:12.5px;color:var(--md-on-surface);background:var(--md-surface-container);padding:7px 10px;border-radius:8px;overflow-wrap:anywhere;white-space:pre-wrap;max-height:120px;overflow:auto}

@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.agenda-form{grid-template-columns:1fr}}
@media(max-width:640px){.page{padding:var(--space-lg)}.header-actions{padding-top:0}}
</style>
