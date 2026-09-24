<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

const form = reactive<Record<string, any>>({
  screen_watch: false, computer_use: false, report_agent_host: '',
  mail_mailbox_path: '', mail_imap_host: '', mail_imap_port: 993, mail_imap_user: '', mail_imap_password: '',
  mcp_enabled: true, onebot_enabled: false, onebot_ws_url: 'ws://127.0.0.1:6700', onebot_http_url: 'http://127.0.0.1:6700', onebot_access_token: '', onebot_trigger_keywords: '',
  onebot_observe_group: true, proactive_daily_limit: 3, proactive_target_limit: 1,
  think_model: '', output_model: '',
})
const state = ref('')
const saving = ref(false)
const models = ref<string[]>([])
const modelSource = ref('')
const modelCards = ref<Array<{ id: string; provider: string; supports_thinking?: boolean }>>([])
async function load() {
  try {
    const [settings, catalog] = await Promise.all([fetch('/api/settings/life'), fetch('/api/models')])
    if (settings.ok) Object.assign(form, (await settings.json()).values || {})
    if (catalog.ok) {
      const body = await catalog.json()
      modelCards.value = Array.isArray(body.models) ? body.models.map((model: any) => ({ id: model.id, provider: model.provider || 'custom', supports_thinking: model.supports_thinking })).filter((model: any) => model.id) : []
      models.value = modelCards.value.map((model) => model.id)
      modelSource.value = 'mocr 当前模型目录（由 Core 同步）'
    }
  } catch { state.value = '无法读取 LIFE 设置或模型目录' }
}
async function save() {
  saving.value = true; state.value = ''
  try {
    const response = await fetch('/api/settings/life', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values: form }) })
    if (!response.ok) throw new Error(String(response.status))
    await fetch('/api/life/permissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ screen_watch: form.screen_watch, computer_use: form.computer_use, report_agent_host: form.report_agent_host }) })
    state.value = '已保存，LIFE 会在下一次设置轮询时应用。'
  } catch { state.value = '保存失败' } finally { saving.value = false }
}
onMounted(load)
</script>

<template>
  <section class="life-settings">
    <header><p>L.I.F.E / INTEGRATIONS</p><h2>L.I.F.E 专属设置</h2><span>敏感功能默认关闭，凭据仅保存在本机 Core settings 文件。</span></header>
    <div class="grid">
      <fieldset><legend>Agent 主机权限</legend><label><input v-model="form.screen_watch" type="checkbox" /> 允许屏幕观察</label><label><input v-model="form.computer_use" type="checkbox" /> 允许 Agent 主机计算机操作</label><input v-model="form.report_agent_host" placeholder="指定 Agent 主机（可选）" /></fieldset>
      <fieldset class="models-field"><legend>THINK / OUTPUT 模型</legend><small>{{ modelSource || '正在读取 mocr 模型目录…' }}</small><label>THINK：内部思考、记忆和工具规划</label><div class="model-cards"><button v-for="model in modelCards" :key="'think-'+model.id" type="button" class="model-card" :class="{selected: form.think_model === model.id}" @click="form.think_model = model.id"><strong>{{ model.id }}</strong><span>{{ model.provider }} · {{ model.supports_thinking ? 'thinking' : 'standard' }}</span></button></div><label>OUTPUT：最终人格化回复</label><div class="model-cards"><button v-for="model in modelCards" :key="'output-'+model.id" type="button" class="model-card" :class="{selected: form.output_model === model.id}" @click="form.output_model = model.id"><strong>{{ model.id }}</strong><span>{{ model.provider }} · output</span></button></div></fieldset>
      <fieldset><legend>邮件 / IMAP</legend><input v-model="form.mail_mailbox_path" placeholder="离线邮箱 JSON 文件（可选）" /><input v-model="form.mail_imap_host" placeholder="IMAP 主机" /><div class="row"><input v-model.number="form.mail_imap_port" type="number" placeholder="端口" /><input v-model="form.mail_imap_user" placeholder="用户名" /></div><input v-model="form.mail_imap_password" type="password" placeholder="应用专用密码" /></fieldset>
      <fieldset><legend>0kay-mcp</legend><label><input v-model="form.mcp_enabled" type="checkbox" /> 允许 LIFE 调用 Agent 主机 MCP 工具</label><small>MCP 服务清单由 Agent 设置中的 MCP 服务 JSON 管理。</small></fieldset>
      <fieldset><legend>OneBot v11 与主动行为</legend><label><input v-model="form.onebot_enabled" type="checkbox" /> 启用 OneBot</label><label><input v-model="form.onebot_observe_group" type="checkbox" /> 仅观察群聊（未触发时不回复）</label><input v-model="form.onebot_ws_url" placeholder="WebSocket 地址" /><input v-model="form.onebot_http_url" placeholder="HTTP API 地址" /><input v-model="form.onebot_access_token" type="password" placeholder="Access Token" /><input v-model="form.onebot_trigger_keywords" placeholder="触发关键词，逗号分隔；留空回复全部" /><div class="row"><input v-model.number="form.proactive_daily_limit" type="number" min="0" placeholder="每日主动上限" /><input v-model.number="form.proactive_target_limit" type="number" min="0" placeholder="单目标上限" /></div></fieldset>
    </div>
    <p v-if="state" class="state">{{ state }}</p><button :disabled="saving" @click="save">{{ saving ? '保存中…' : '保存 LIFE 设置' }}</button>
  </section>
</template>

<style scoped>
.life-settings{padding:4px}.life-settings header p{margin:0;color:var(--md-primary);font:700 12px monospace;letter-spacing:.1em}.life-settings h2{margin:8px 0}.life-settings header span,small{color:var(--md-on-surface-variant)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:24px 0}fieldset{border:1px solid var(--md-outline-variant);border-radius:14px;padding:16px;display:flex;gap:12px;flex-direction:column}legend{padding:0 6px;font-weight:600}label{display:flex;gap:8px;align-items:center}input,select{box-sizing:border-box;width:100%;padding:10px;border:1px solid var(--md-outline-variant);border-radius:8px;background:var(--md-surface-container-lowest);color:var(--md-on-surface)}input[type=checkbox]{width:auto}.row{display:grid;grid-template-columns:110px 1fr;gap:8px}button{border:0;border-radius:999px;padding:11px 18px;background:var(--md-primary);color:var(--md-on-primary);cursor:pointer}.state{color:var(--md-primary)}@media(max-width:760px){.grid{grid-template-columns:1fr}}
.model-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.model-card{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;border:1px solid var(--md-outline-variant);border-radius:10px;background:var(--md-surface-container-lowest);color:var(--md-on-surface);padding:10px;cursor:pointer}.model-card.selected{border-color:var(--md-primary);background:var(--md-primary-container)}.model-card strong{font-size:12px;word-break:break-all}.model-card span{font-size:11px;color:var(--md-on-surface-variant)}@media(max-width:760px){.grid{grid-template-columns:1fr}.model-cards{grid-template-columns:1fr}}
</style>
