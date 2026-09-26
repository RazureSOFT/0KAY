<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

const form = reactive<Record<string, any>>({
  screen_watch: false, computer_use: false, report_agent_host: '',
  mail_mailbox_path: '', mail_imap_host: '', mail_imap_port: 993, mail_imap_user: '', mail_imap_password: '',
  mail_smtp_host: '', mail_smtp_port: 465, mail_smtp_user: '', mail_smtp_password: '', mail_from: '', mail_require_approval: true,
  mcp_enabled: true, onebot_enabled: false, onebot_ws_url: 'ws://127.0.0.1:6700', onebot_http_url: 'http://127.0.0.1:6700', onebot_access_token: '', onebot_trigger_keywords: '',
  onebot_observe_group: true, proactive_daily_limit: 3, proactive_target_limit: 1,
  think_model: '', output_model: '',
})
const state = ref('')
const saving = ref(false)
const models = ref<string[]>([])
const modelSource = ref('')
const modelCards = ref<Array<{ id: string; provider: string; supports_thinking?: boolean }>>([])
const mailTesting = ref(false)
const mailResult = ref('')
const mailOk = ref<boolean | null>(null)
function mailConfigPayload() {
  return {
    mail_imap_host: form.mail_imap_host, mail_imap_port: form.mail_imap_port,
    mail_imap_user: form.mail_imap_user, mail_imap_password: form.mail_imap_password,
    mail_smtp_host: form.mail_smtp_host, mail_smtp_port: form.mail_smtp_port,
    mail_smtp_user: form.mail_smtp_user, mail_smtp_password: form.mail_smtp_password,
    mail_from: form.mail_from,
  }
}
async function testMail(send = false) {
  mailTesting.value = true; mailResult.value = ''; mailOk.value = null
  try {
    const response = await fetch('/api/life/companion', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mail_test', payload: { to: send ? (form.mail_from || form.mail_imap_user) : '', config: mailConfigPayload() } }),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`)
    const imap = body.imap || {}
    const smtp = body.smtp || {}
    const sent = body.sent
    mailOk.value = !!imap.ok && !!smtp.ok && (!sent || sent.ok)
    const parts = [
      `收信 IMAP：${imap.ok ? `✓ 登录成功${imap.messages != null ? ` · 收件箱 ${imap.messages} 封` : ''}` : `✗ ${imap.error || '失败'}`}`,
      `发信 SMTP：${smtp.ok ? '✓ 登录成功' : `✗ ${smtp.error || '失败'}`}`,
    ]
    if (sent) parts.push(`测试邮件：${sent.ok ? `✓ 已发送至 ${sent.to}` : `✗ ${sent.error || '发送失败'}`}`)
    mailResult.value = parts.join('　·　')
  } catch (e: any) {
    mailOk.value = false
    mailResult.value = e?.message || '测试失败'
  } finally { mailTesting.value = false }
}
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
    <header class="ls-hero">
      <div class="ls-hero-main">
        <span class="ls-eyebrow">L.I.F.E · INTEGRATIONS</span>
        <h2>L.I.F.E 专属设置</h2>
        <p class="ls-sub">敏感功能默认关闭；凭据仅保存在本机 Core settings 文件。</p>
      </div>
      <button class="ls-save" :disabled="saving" @click="save">
        <span class="ls-save-ic" aria-hidden="true">✓</span>{{ saving ? '保存中…' : '保存' }}
      </button>
    </header>

    <div class="ls-grid">
      <article class="ls-card">
        <div class="ls-card-head"><span class="ls-ic tone-1">◉</span><h3>Agent 主机权限</h3></div>
        <label class="ls-switch"><input v-model="form.screen_watch" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>允许屏幕观察</b><small>读取当前屏幕内容</small></span></label>
        <label class="ls-switch"><input v-model="form.computer_use" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>允许计算机操作</b><small>执行鼠标/键盘操作</small></span></label>
        <label class="ls-field"><span>指定 Agent 主机（可选）</span><input v-model="form.report_agent_host" placeholder="hostname 或地址" /></label>
      </article>

      <article class="ls-card">
        <div class="ls-card-head"><span class="ls-ic tone-2">✦</span><h3>THINK / OUTPUT 模型</h3></div>
        <p class="ls-note">{{ modelSource || '正在读取 mocr 模型目录…' }}</p>
        <p class="ls-label">THINK · 内部思考、记忆与工具规划</p>
        <div class="ls-models">
          <button v-for="model in modelCards" :key="'think-' + model.id" type="button" class="ls-model" :class="{ selected: form.think_model === model.id }" @click="form.think_model = model.id">
            <b>{{ model.id }}</b><span>{{ model.provider }} · {{ model.supports_thinking ? 'thinking' : 'standard' }}</span>
          </button>
          <span v-if="!modelCards.length" class="ls-empty">暂无模型</span>
        </div>
        <p class="ls-label">OUTPUT · 最终人格化回复</p>
        <div class="ls-models">
          <button v-for="model in modelCards" :key="'output-' + model.id" type="button" class="ls-model" :class="{ selected: form.output_model === model.id }" @click="form.output_model = model.id">
            <b>{{ model.id }}</b><span>{{ model.provider }} · output</span>
          </button>
          <span v-if="!modelCards.length" class="ls-empty">暂无模型</span>
        </div>
      </article>

      <article class="ls-card">
        <div class="ls-card-head"><span class="ls-ic tone-3">✉</span><h3>邮件收发</h3></div>
        <p class="ls-note">收信走 IMAP，发信走 SMTP；密码仅保存在本机 Core settings 文件。可填 <code>mailbox.json</code> 做离线收信。</p>
        <p class="ls-label">收信 · IMAP</p>
        <div class="ls-row">
          <label class="ls-field"><span>IMAP 主机</span><input v-model="form.mail_imap_host" placeholder="imap.example.com" /></label>
          <label class="ls-field"><span>端口</span><input v-model.number="form.mail_imap_port" type="number" placeholder="993" /></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>用户名</span><input v-model="form.mail_imap_user" placeholder="user@example.com" /></label>
          <label class="ls-field"><span>密码 / 应用专用密码</span><input v-model="form.mail_imap_password" type="password" placeholder="••••••••" /></label>
        </div>
        <p class="ls-label">发信 · SMTP</p>
        <div class="ls-row">
          <label class="ls-field"><span>SMTP 主机</span><input v-model="form.mail_smtp_host" placeholder="smtp.example.com" /></label>
          <label class="ls-field"><span>端口</span><input v-model.number="form.mail_smtp_port" type="number" placeholder="465" /></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>用户名</span><input v-model="form.mail_smtp_user" placeholder="user@example.com" /></label>
          <label class="ls-field"><span>密码 / 应用专用密码</span><input v-model="form.mail_smtp_password" type="password" placeholder="••••••••" /></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>发件人地址（可选）</span><input v-model="form.mail_from" placeholder="留空用 SMTP 用户名" /></label>
          <label class="ls-field"><span>离线邮箱 JSON（可选）</span><input v-model="form.mail_mailbox_path" placeholder="mailbox.json" /></label>
        </div>
        <label class="ls-switch"><input v-model="form.mail_require_approval" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>邮件操作需弹窗确认</b><small>读取 / 发送邮件前先在 WebUI 询问你</small></span></label>
        <div class="ls-mail-actions">
          <button type="button" class="ls-test" :disabled="mailTesting" @click="testMail(false)">{{ mailTesting ? '测试中…' : '测试连接' }}</button>
          <button type="button" class="ls-test" :disabled="mailTesting" @click="testMail(true)">发送测试邮件</button>
        </div>
        <p v-if="mailResult" class="ls-mail-result" :class="mailOk ? 'ok' : 'bad'">{{ mailResult }}</p>
      </article>

      <article class="ls-card">
        <div class="ls-card-head"><span class="ls-ic tone-4">⌘</span><h3>0kay-mcp</h3></div>
        <label class="ls-switch"><input v-model="form.mcp_enabled" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>允许调用 MCP 工具</b><small>服务清单在 Agent 设置中维护</small></span></label>
      </article>

      <article class="ls-card ls-card-wide">
        <div class="ls-card-head"><span class="ls-ic tone-5">☷</span><h3>OneBot v11 与主动行为</h3></div>
        <div class="ls-row">
          <label class="ls-switch"><input v-model="form.onebot_enabled" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>启用 OneBot</b></span></label>
          <label class="ls-switch"><input v-model="form.onebot_observe_group" type="checkbox" /><span class="ls-track"></span><span class="ls-switch-text"><b>仅观察群聊</b><small>未触发时不回复</small></span></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>WebSocket 地址</span><input v-model="form.onebot_ws_url" placeholder="ws://127.0.0.1:6700" /></label>
          <label class="ls-field"><span>HTTP API 地址</span><input v-model="form.onebot_http_url" placeholder="http://127.0.0.1:6700" /></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>Access Token</span><input v-model="form.onebot_access_token" type="password" placeholder="••••••••" /></label>
          <label class="ls-field"><span>触发关键词（逗号分隔，留空=全部）</span><input v-model="form.onebot_trigger_keywords" placeholder="bot,在吗" /></label>
        </div>
        <div class="ls-row">
          <label class="ls-field"><span>每日主动上限</span><input v-model.number="form.proactive_daily_limit" type="number" min="0" placeholder="3" /></label>
          <label class="ls-field"><span>单目标上限</span><input v-model.number="form.proactive_target_limit" type="number" min="0" placeholder="1" /></label>
        </div>
      </article>
    </div>

    <p v-if="state" class="ls-state">{{ state }}</p>
  </section>
</template>

<style scoped>
.life-settings { --ls-spring: cubic-bezier(.22, 1.3, .36, 1); padding: 4px; }

/* ---------- Expressive hero ---------- */
.ls-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 22px;
  padding: clamp(22px, 2.4vw, 32px);
  border-radius: 32px;
  background:
    radial-gradient(520px 260px at 100% 0%, color-mix(in srgb, var(--md-tertiary) 16%, transparent), transparent 70%),
    linear-gradient(135deg, var(--md-primary-container), color-mix(in srgb, var(--md-primary-container) 45%, var(--md-surface-container-low)));
  color: var(--md-on-primary-container);
  box-shadow: var(--shadow-1);
  animation: ls-rise 520ms var(--ls-spring) both;
}
.ls-hero-main { min-width: 0; }
.ls-eyebrow {
  display: inline-block;
  margin: 0 0 10px;
  padding: 4px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--md-on-primary-container) 10%, transparent);
  font: 800 12px/1 ui-monospace, monospace;
  letter-spacing: .16em;
}
.ls-hero h2 { margin: 0; font-size: clamp(22px, 2.4vw, 30px); font-weight: 800; letter-spacing: -.02em; }
.ls-sub { margin: 10px 0 0; font-size: 14px; line-height: 1.6; opacity: .82; max-width: 60ch; }

#app .ls-save {
  min-height: 52px;
  padding: 0 26px;
  border: 0;
  border-radius: 999px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font: 700 15px/1 inherit;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--md-primary) 30%, transparent);
  transition: transform 300ms var(--ls-spring), box-shadow 300ms var(--ls-spring);
}
#app .ls-save:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); }
#app .ls-save:disabled { opacity: .55; cursor: not-allowed; }
.ls-save-ic { font-size: 16px; }

/* ---------- Cards ---------- */
.ls-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.ls-card {
  position: relative;
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 52%, transparent);
  border-radius: 28px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--shadow-1);
  transition: transform 300ms var(--ls-spring), box-shadow 300ms var(--ls-spring), border-color 300ms;
  animation: ls-card-in 520ms var(--ls-spring) both;
}
.ls-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); border-color: color-mix(in srgb, var(--md-primary) 26%, var(--md-outline-variant)); }
.ls-grid > .ls-card:nth-child(1) { animation-delay: 40ms; }
.ls-grid > .ls-card:nth-child(2) { animation-delay: 90ms; }
.ls-grid > .ls-card:nth-child(3) { animation-delay: 140ms; }
.ls-grid > .ls-card:nth-child(4) { animation-delay: 190ms; }
.ls-grid > .ls-card:nth-child(5) { animation-delay: 240ms; }
.ls-card-wide { grid-column: 1 / -1; }
.ls-card-head { display: flex; align-items: center; gap: 12px; }
.ls-card-head h3 { margin: 0; font-size: 16px; font-weight: 800; letter-spacing: -.01em; }
.ls-ic {
  width: 38px; height: 38px;
  border-radius: 16px 16px 16px 6px;
  display: grid; place-items: center;
  font-size: 16px; flex-shrink: 0;
}
.tone-1 { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.tone-2 { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.tone-3 { background: var(--md-tertiary-container, #FFD8E4); color: var(--md-on-tertiary-container, #31111D); }
.tone-4 { background: var(--md-success-container, #B7F3C0); color: #0D3B1E; }
.tone-5 { background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }

.ls-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ls-note { margin: -4px 0 0; font-size: 12px; color: var(--md-on-surface-variant); }
.ls-label { margin: 4px 0 -4px; font-size: 12px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--md-on-surface-variant); }
.ls-empty { font-size: 13px; color: var(--md-on-surface-variant); padding: 8px 2px; }

/* ---------- Filled fields ---------- */
.ls-field { display: flex; flex-direction: column; gap: 6px; }
.ls-field > span { font-size: 12px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: var(--md-on-surface-variant); }
#app .ls-field input {
  width: 100%; min-height: 52px; padding: 0 17px;
  border: 1px solid transparent; border-radius: 16px;
  background-color: var(--md-surface-container-high); color: var(--md-on-surface);
  font: 400 15px/1.4 inherit; outline: none;
  transition: background-color 180ms, border-color 180ms, box-shadow 200ms, border-radius 340ms var(--ls-spring);
}
#app .ls-field input:hover { background-color: var(--md-surface-container-highest); }
#app .ls-field input:focus {
  border-color: var(--md-primary);
  background-color: var(--md-surface-container-lowest);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--md-primary) 16%, transparent);
}

/* ---------- Switches (check-in-thumb) ---------- */
#app .ls-switch {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent);
  border-radius: 20px;
  background: var(--md-surface-container-lowest);
  cursor: pointer;
  transition: background-color 200ms, border-color 200ms, box-shadow 220ms, transform 260ms var(--ls-spring);
}
#app .ls-switch:hover {
  background: var(--md-surface-container);
  border-color: color-mix(in srgb, var(--md-primary) 30%, var(--md-outline-variant));
  box-shadow: var(--shadow-1);
}
.ls-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.ls-switch-text { display: flex; flex-direction: column; gap: 2px; }
.ls-switch-text b { font-size: 14px; font-weight: 700; }
.ls-switch-text small { font-size: 12px; color: var(--md-on-surface-variant); }
.ls-track {
  position: relative;
  width: 54px; height: 32px; flex-shrink: 0; border-radius: 999px;
  background: var(--md-surface-container-highest);
  border: 2px solid var(--md-outline);
  transition: background-color 320ms var(--ls-spring), border-color 320ms var(--ls-spring);
}
.ls-track::after {
  content: '✓';
  display: grid; place-items: center;
  position: absolute; top: 50%; left: 5px; width: 18px; height: 18px;
  border-radius: 50%; background: var(--md-outline); color: transparent;
  font-size: 12px; font-weight: 900; line-height: 1;
  transform: translateY(-50%);
  transition: left 340ms var(--ls-spring), width 340ms var(--ls-spring), height 340ms var(--ls-spring), background-color 300ms var(--ls-spring), color 300ms;
}
.ls-switch input:checked + .ls-track { background: var(--md-primary); border-color: var(--md-primary); }
.ls-switch input:checked + .ls-track::after { left: 25px; width: 22px; height: 22px; background: var(--md-on-primary); color: var(--md-primary); }

/* ---------- Model pickers ---------- */
.ls-models { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.ls-model {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left;
  padding: 13px 15px;
  border: 2px solid var(--md-outline-variant); border-radius: 20px;
  background: var(--md-surface-container-lowest); color: var(--md-on-surface); cursor: pointer;
  transition: border-color 240ms var(--ls-spring), background-color 240ms var(--ls-spring), transform 260ms var(--ls-spring), border-radius 360ms var(--ls-spring);
}
.ls-model:hover { transform: translateY(-2px); background: var(--md-surface-container); }
.ls-model.selected {
  border-color: var(--md-primary);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-radius: 20px 20px 20px 8px;
}
.ls-model.selected::after {
  content: '✓';
  position: absolute; top: 10px; right: 12px;
  width: 20px; height: 20px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--md-primary); color: var(--md-on-primary);
  font-size: 12px; font-weight: 900;
}
.ls-model b { font-size: 13px; word-break: break-all; }
.ls-model span { font-size: 12px; color: var(--md-on-surface-variant); }

.ls-state {
  margin: 18px 0 0;
  padding: 14px 18px;
  border-radius: 18px;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
  font-size: 13px;
  font-weight: 650;
  animation: ls-rise 320ms var(--ls-spring) both;
}

.ls-mail-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
#app .ls-mail-actions .ls-test {
  height: 42px; padding: 0 20px; border: 0; border-radius: 999px; cursor: pointer;
  font: 700 13px/1 inherit; background: var(--md-secondary-container); color: var(--md-on-secondary-container);
  transition: transform 240ms var(--ls-spring), box-shadow 200ms;
}
#app .ls-mail-actions .ls-test:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-1); }
#app .ls-mail-actions .ls-test:disabled { opacity: .55; cursor: not-allowed; }
.ls-mail-result {
  margin: 4px 0 0; padding: 12px 15px; border-radius: 16px; font-size: 12.5px; line-height: 1.55; font-weight: 600;
}
.ls-mail-result.ok { background: var(--md-success-container); color: #0d3b1e; }
.ls-mail-result.bad { background: var(--md-error-container); color: var(--md-on-error-container, #410e0b); }

@keyframes ls-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes ls-card-in { from { opacity: 0; transform: translateY(16px) scale(.985); } to { opacity: 1; transform: none; } }

@media (max-width: 760px) {
  .ls-grid { grid-template-columns: 1fr; }
  .ls-row { grid-template-columns: 1fr; }
  .ls-models { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .ls-hero, .ls-card, .ls-state { animation: none; }
}
</style>
