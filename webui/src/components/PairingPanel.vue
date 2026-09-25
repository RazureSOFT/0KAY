<script setup lang="ts">
import {ref,onMounted,onUnmounted} from 'vue'
const requests=ref<Array<{id:string;name:string;code:string;expires:string;approved:boolean}>>([])
const error=ref('');let timer:ReturnType<typeof setInterval>|undefined
async function refresh(){try{const response=await fetch('/api/pairing/pending');if(!response.ok)throw new Error(await response.text());requests.value=(await response.json()).requests||[]}catch(e:any){error.value=e.message}}
async function decide(request:{id:string;code:string},allow:boolean){try{const response=await fetch('/api/pairing/approve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...request,allow})});if(!response.ok)throw new Error(await response.text());await refresh()}catch(e:any){error.value=e.message}}
onMounted(()=>{refresh();timer=setInterval(refresh,3000)});onUnmounted(()=>clearInterval(timer))
</script>
<template><section class="pairing-panel"><h3>设备配对</h3><p>在 Core 所在电脑核对安装终端显示的 6 位代码，再允许连接。局域网发现需启用 CORE_LAN_ENABLED=1。</p><p v-if="error">{{ error }}</p><p v-if="!requests.length">暂无待配对设备</p><article v-for="request in requests" :key="request.id"><strong>{{ request.name }}</strong><code>{{ request.code }}</code><span v-if="request.approved">已允许，等待客户端领取</span><template v-else><button @click="decide(request,false)">拒绝</button><button @click="decide(request,true)">核对代码并允许配对</button></template></article></section></template>
<style scoped>.pairing-panel{margin:24px 0;padding:20px;background:var(--md-surface-container-low);border-radius:12px}.pairing-panel p{margin:12px 0;color:var(--md-on-surface-variant)}article{display:flex;align-items:center;gap:14px;padding:14px 0;flex-wrap:wrap}code{font-size:24px;letter-spacing:4px}button{padding:8px 12px}</style>
