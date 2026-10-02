// DeepSeek 网页版 · 自定义设置面板（Core 以 stdio 承载的 provider 插件）
// 分标签：账号 / 模型 / 防风控 / 传输层 / 上下文 / 关于（一次只显示一页）。
// 由 PluginModulePane 作为设置 tab 的模块加载；通过 importmap 使用宿主 Vue。
import { defineComponent, h, reactive, ref, onMounted } from 'vue'

const SECTION = 'deepseek-web'
const PROBE_URL = '/api/stdio-provider/deepseek-web/v1/probe'
const TABS = ['账号', '模型', '防风控', '传输层', '上下文', '关于']

const DEFAULTS = {
  token: '',
  auth_file: '',
  default_model: 'deepseek-web-chat',
  max_prompt_chars: 400000,
  min_request_interval_ms: 2000,
  max_request_interval_ms: 4000,
  allow_concurrent: false,
  idle_timeout_ms: 120000,
  auto_continue: true,
  max_continuations: 2,
  session_cleanup: 'deferred',
  probe_interval_ms: 1800000,
  max_ref_images: 24,
  context_mode: 'full',
  accounts: '[]',
  active_account: '',
}

export default defineComponent({
  name: 'DeepSeekWebSettings',
  setup() {
    const tab = ref(TABS[0])
    const values = reactive({ ...DEFAULTS })
    const loading = ref(true)
    const saving = ref(false)
    const saved = ref(false)
    const error = ref('')
    const status = reactive({ checked: false, ok: false, account: '', error: '', at: '' })

    async function load() {
      loading.value = true
      error.value = ''
      try {
        const res = await fetch(`/api/settings/${SECTION}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        Object.assign(values, DEFAULTS, (await res.json()).values || {})
      } catch (e) {
        error.value = e?.message || String(e)
      } finally {
        loading.value = false
      }
    }

    async function save() {
      saving.value = true
      error.value = ''
      saved.value = false
      try {
        const body = {}
        for (const key of Object.keys(DEFAULTS)) body[key] = values[key]
        const res = await fetch(`/api/settings/${SECTION}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: body }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        saved.value = true
        setTimeout(() => { saved.value = false }, 2000)
      } catch (e) {
        error.value = e?.message || String(e)
      } finally {
        saving.value = false
      }
    }

    async function probeNow() {
      status.checked = false
      status.error = ''
      try {
        const res = await fetch(PROBE_URL, { method: 'POST' })
        const data = await res.json()
        status.ok = !!data.ok
        status.account = data.account || ''
        status.error = data.error || ''
      } catch (e) {
        status.ok = false
        status.error = e?.message || String(e)
      } finally {
        status.checked = true
        status.at = new Date().toLocaleString()
      }
    }

    const accountProbe = ref({})
    const accountsList = () => {
      try {
        const arr = JSON.parse(values.accounts || '[]')
        return Array.isArray(arr) ? arr : []
      } catch {
        return []
      }
    }
    const setAccounts = (list) => { values.accounts = JSON.stringify(list) }
    const mask = (token) => {
      const t = String(token || '').replace(/^Bearer\s+/i, '')
      return t ? (t.length > 8 ? `${t.slice(0, 4)}****${t.slice(-4)}` : '****') : ''
    }
    async function switchAccount(id) {
      values.active_account = id
      await save()
      await probeNow()
    }
    async function addAccount() {
      const label = window.prompt('账号备注（可空）', '')
      if (label === null) return
      const token = window.prompt('粘贴 Bearer Token')
      if (!token || !token.trim()) return
      const id = `acc_${Date.now().toString(36)}`
      const list = accountsList()
      list.push({ id, label: (label || '').trim() || mask(token), token: token.replace(/^Bearer\s+/i, '').trim() })
      setAccounts(list)
      if (!values.active_account) values.active_account = id
      await save()
    }
    async function removeAccount(id) {
      const list = accountsList().filter((account) => account.id !== id)
      setAccounts(list)
      if (values.active_account === id) values.active_account = list[0]?.id || ''
      await save()
    }
    async function probeAll() {
      const results = {}
      for (const account of accountsList()) {
        try {
          const res = await fetch(PROBE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: account.token }) })
          const data = await res.json()
          results[account.id] = data.ok ? `✅ ${data.account || 'ok'}` : `❌ ${data.error || ''}`
        } catch (e) {
          results[account.id] = `❌ ${e?.message || e}`
        }
      }
      accountProbe.value = results
    }

    onMounted(async () => {
      await load()
      await probeNow()
    })

    // ---- render helpers -------------------------------------------------
    const field = (key, label, help, type = 'text') => h('label', { class: 'dw-field' }, [
      h('span', { class: 'dw-label' }, label),
      h('input', { class: 'dw-input', type, value: values[key], onInput: (e) => { values[key] = type === 'number' ? Number(e.target.value) : e.target.value } }),
      help ? h('span', { class: 'dw-help' }, help) : null,
    ])
    const number = (key, label, help) => field(key, label, help, 'number')
    const select = (key, label, options, help) => h('label', { class: 'dw-field' }, [
      h('span', { class: 'dw-label' }, label),
      h('select', { class: 'dw-input', value: values[key], onChange: (e) => { values[key] = e.target.value } }, options.map((o) => h('option', { value: o }, o))),
      help ? h('span', { class: 'dw-help' }, help) : null,
    ])
    const toggle = (key, label, help) => h('label', { class: 'dw-toggle' }, [
      h('input', { type: 'checkbox', checked: !!values[key], onChange: (e) => { values[key] = e.target.checked } }),
      h('span', { class: 'dw-toggle-label' }, label),
      help ? h('span', { class: 'dw-help' }, help) : null,
    ])
    const row = (...children) => h('div', { class: 'dw-row' }, children)
    const card = (title, children) => h('section', { class: 'dw-card' }, [
      title ? h('h3', {}, title) : null,
      h('div', { class: 'dw-card-body' }, children),
    ])
    const kv = (label, value, tone) => h('div', { class: 'dw-kv' }, [
      h('span', { class: 'dw-kv-k' }, label),
      h('span', { class: ['dw-kv-v', tone || ''] }, value),
    ])
    const note = (text) => h('p', { class: 'dw-note' }, text)

    const accountTab = () => [
      card('登录状态', [
        kv('状态', status.checked ? (status.ok ? '✅ 已登录' : '❌ 未登录') : '检测中…', status.checked ? (status.ok ? 'ok' : 'bad') : ''),
        kv('账号', status.ok && status.account ? status.account : '—'),
        kv('适配器注册', '✅ deepseek-web 已注册（Core 托管）'),
        kv('token 长度', values.token ? `${values.token.replace(/^Bearer\s+/i, '').trim().length} 字符` : '未配置（用凭据文件）'),
        kv('凭证来源', values.token ? '手动 Token' : (values.auth_file ? `凭据文件：${values.auth_file}` : '默认凭据文件 ~/.dsh/web-login/deepseek-auth.json')),
        kv('服务端校验', status.checked ? (status.ok ? '通过' : `失败：${status.error}`) : '检测中…', status.checked ? (status.ok ? 'ok' : 'bad') : ''),
        kv('登录态探活', values.probe_interval_ms > 0 ? `后台每 ${Math.round(values.probe_interval_ms / 60000)} 分钟校验（零额度）` : '已关闭'),
        kv('请求节流', `${values.allow_concurrent ? '允许并发' : '串行（一次只发一条）'} · 间隔 ${values.min_request_interval_ms}–${values.max_request_interval_ms}ms`),
      ]),
      card('手动 Token', [
        field('token', 'Bearer Token', 'F12 从 chat.deepseek.com 请求里取 Authorization；留空则用凭据文件。'),
        field('auth_file', '凭据文件', '留空默认 ~/.dsh/web-login/deepseek-auth.json。'),
        h('div', { class: 'dw-actions' }, [h('button', { class: 'dw-btn tonal', onClick: probeNow }, '刷新状态 / 连通性测试')]),
      ]),
      card('账号库', [
        note('多账号并存与一键切换；当前账号用于所有请求。token 存在 Core 本地 settings.json。'),
        ...accountsList().map((account) => h('div', { class: ['dw-acc', { active: account.id === values.active_account }] }, [
          h('div', { class: 'dw-acc-info' }, [
            h('span', { class: 'dw-acc-label' }, account.label || mask(account.token)),
            h('span', { class: 'dw-acc-token' }, mask(account.token)),
          ]),
          h('span', { class: 'dw-acc-state' }, account.id === values.active_account ? '当前' : ''),
          accountProbe.value[account.id] ? h('span', { class: 'dw-acc-probe' }, accountProbe.value[account.id]) : null,
          account.id !== values.active_account ? h('button', { class: 'dw-btn small tonal', onClick: () => switchAccount(account.id) }, '切换') : null,
          h('button', { class: 'dw-btn small danger', onClick: () => removeAccount(account.id) }, '移除'),
        ])),
        accountsList().length === 0 ? note('还没有账号：点「添加账号」粘 token，或直接用下面的「手动 Token」。') : null,
        h('div', { class: 'dw-actions' }, [
          h('button', { class: 'dw-btn tonal', onClick: addAccount }, '添加账号'),
          h('button', { class: 'dw-btn tonal', onClick: probeAll }, '探活全部'),
        ]),
      ]),
      note('本插件由 Core 以 stdio 子进程承载，没有 Electron 登录窗：账号请用「手动 Token / 账号库」或复用 DSH 捕获的凭据文件。（「浏览器登录 / 从已登录窗口恢复」属于 DSH 桌面插件的窗口能力，这里不适用。）'),
    ]

    const modelTab = () => [
      card('模型', [
        select('default_model', '默认模型', ['deepseek-web-chat', 'deepseek-web-reasoner'], '未指定模型时使用；chat=不推理，reasoner=thinking。'),
        note('两者是同一个「快速模式」的 thinking 开关两档：deepseek-web-chat（关）/ deepseek-web-reasoner（开，推理流走 reasoning_content）。'),
      ]),
    ]

    const throttleTab = () => [
      card('请求节流', [
        row(number('min_request_interval_ms', '间隔下限 (ms)', null), number('max_request_interval_ms', '间隔上限 (ms)', null)),
        note('从上次调用结束时刻算起，在区间内随机取值；固定值方差≈0 更像脚本，所以用区间。'),
        toggle('allow_concurrent', '允许并发', '不建议：同一账号并发会触发网页端临时封禁。'),
      ]),
      card('会话清理', [
        select('session_cleanup', '临时会话清理', ['deferred', 'immediate', 'keep'], 'keep=不删（网页端会留临时会话）；其余=调用后删除。'),
      ]),
      card('登录态探活', [ number('probe_interval_ms', '探活间隔 (ms)', '只读 users/current，零额度；0=关闭。') ]),
    ]

    const transportTab = () => [
      card('传输层', [
        note('不适用：本插件在 Node（Core 的 stdio 子进程）里直连 chat.deepseek.com，没有 Electron/Chromium 网络栈可切换指纹；原版 DSH 插件的「传输层（指纹）」只存在于桌面环境。'),
      ]),
    ]

    const contextTab = () => [
      card('上下文投喂', [
        select('context_mode', '上下文投喂', ['full', 'chained'], 'full=每轮回发全量 prompt；chained=只发增量 + 上一条回答当父消息（需请求带 user/session_id；不确定时自动退回全量）。'),
        number('max_prompt_chars', 'Prompt 字符上限', '超出走中段截断；调高会明显提高被限流风险。'),
        number('max_ref_images', '最多引用图片数', '一次请求随附的图片上限（上传后以 ref_file_ids 引用）。'),
      ]),
      card('流与续写', [
        number('idle_timeout_ms', '流空闲超时 (ms)', 'SSE 多久没有事件即判定卡住。'),
        row(toggle('auto_continue', '自动续写', null), number('max_continuations', '最大续写轮数', null)),
        note('回答在句中被截断（以，、；：等结尾）时自动再发一次请求续写并拼进同一条回答。'),
      ]),
    ]

    const aboutTab = () => [
      card('关于', [
        kv('插件', '@razureink/0kay-deepseek-web'),
        kv('版本', '0.3.0'),
        kv('provider', 'deepseek-web（OpenAI 兼容，Core stdio 承载，无端口）'),
        kv('上游', 'cv-superding/dsh-deepseek-web-login（Apache-2.0，见 NOTICE）'),
        kv('凭据位置', values.auth_file || '~/.dsh/web-login/deepseek-auth.json'),
      ]),
      note('非官方软件：以网页端登录态驱动模型，请自行评估风险并遵守服务条款。'),
    ]

    const body = () => {
      if (loading.value) return h('p', { class: 'dw-hint' }, '加载中…')
      switch (tab.value) {
        case '模型': return modelTab()
        case '防风控': return throttleTab()
        case '传输层': return transportTab()
        case '上下文': return contextTab()
        case '关于': return aboutTab()
        default: return accountTab()
      }
    }

    return () => h('div', { class: 'deepseek-web-panel' }, [
      h('header', { class: 'dw-head' }, [
        h('div', {}, [
          h('h2', {}, 'DeepSeek 网页登录（免费模型）'),
          h('p', { class: 'dw-sub' }, '用 chat.deepseek.com 的登录态驱动 0KAY，不需要 API Key（provider：deepseek-web）。'),
        ]),
      ]),
      error.value ? h('div', { class: 'dw-error' }, error.value) : null,
      saved.value ? h('div', { class: 'dw-ok' }, '已保存') : null,
      h('nav', { class: 'dw-tabs' }, TABS.map((name) => h('button', {
        class: ['dw-tab', { active: tab.value === name }],
        onClick: () => { tab.value = name },
      }, name))),
      h('div', { class: 'dw-panel-body' }, body()),
      h('footer', { class: 'dw-foot' }, [
        h('button', { class: 'dw-btn primary', disabled: saving.value, onClick: save }, saving.value ? '保存中…' : '保存'),
      ]),
    ])
  },
})

;(() => {
  if (typeof document === 'undefined' || document.getElementById('deepseek-web-panel-style')) return
  const style = document.createElement('style')
  style.id = 'deepseek-web-panel-style'
  style.textContent = `
.deepseek-web-panel{max-width:900px;color:var(--md-on-surface)}
.deepseek-web-panel .dw-head{margin-bottom:16px}
.deepseek-web-panel h2{margin:0;font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-.02em}
.deepseek-web-panel .dw-sub{margin:6px 0 0;color:var(--md-on-surface-variant);font-size:14px;line-height:1.6;max-width:70ch}
.deepseek-web-panel .dw-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 18px;border-bottom:1px solid var(--md-outline-variant);padding-bottom:10px}
.deepseek-web-panel .dw-tab{height:36px;padding:0 16px;border:0;border-radius:999px;background:transparent;color:var(--md-on-surface-variant);font:600 13.5px/1 inherit;cursor:pointer}
.deepseek-web-panel .dw-tab:hover{background:var(--md-surface-container-high)}
.deepseek-web-panel .dw-tab.active{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.deepseek-web-panel .dw-panel-body{display:flex;flex-direction:column;gap:16px;min-height:260px}
.deepseek-web-panel .dw-card{border-radius:20px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-low);padding:18px}
.deepseek-web-panel .dw-card h3{margin:0 0 12px;font-size:15px;font-weight:750}
.deepseek-web-panel .dw-card-body{display:flex;flex-direction:column;gap:12px}
.deepseek-web-panel .dw-kv{display:flex;justify-content:space-between;gap:16px;font-size:13.5px;padding:6px 0;border-bottom:1px dashed color-mix(in srgb,var(--md-outline-variant) 60%,transparent)}
.deepseek-web-panel .dw-kv:last-child{border-bottom:0}
.deepseek-web-panel .dw-kv-k{color:var(--md-on-surface-variant);flex-shrink:0}
.deepseek-web-panel .dw-kv-v{text-align:right;overflow-wrap:anywhere;font-family:ui-monospace,monospace}
.deepseek-web-panel .dw-kv-v.ok{color:#0d7a3e}
.deepseek-web-panel .dw-kv-v.bad{color:var(--md-error)}
.deepseek-web-panel .dw-row{display:flex;gap:12px;flex-wrap:wrap}
.deepseek-web-panel .dw-row>*{flex:1;min-width:130px}
.deepseek-web-panel .dw-field{display:flex;flex-direction:column;gap:6px}
.deepseek-web-panel .dw-label{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--md-on-surface-variant)}
.deepseek-web-panel .dw-input{font:inherit;min-height:38px;padding:0 12px;border-radius:10px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high);color:var(--md-on-surface);outline:none}
.deepseek-web-panel .dw-input:focus{border-color:var(--md-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--md-primary) 14%,transparent)}
.deepseek-web-panel .dw-help{font-size:11.5px;color:var(--md-on-surface-variant);line-height:1.5}
.deepseek-web-panel .dw-toggle{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;color:var(--md-on-surface);flex-wrap:wrap}
.deepseek-web-panel .dw-toggle input{width:18px;height:18px;accent-color:var(--md-primary)}
.deepseek-web-panel .dw-toggle .dw-help{flex-basis:100%;font-weight:400}
.deepseek-web-panel .dw-actions{display:flex;gap:10px;margin-top:4px;flex-wrap:wrap}
.deepseek-web-panel .dw-acc{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container-high)}
.deepseek-web-panel .dw-acc.active{border-color:var(--md-primary)}
.deepseek-web-panel .dw-acc-info{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.deepseek-web-panel .dw-acc-label{font-size:13.5px;font-weight:650;overflow-wrap:anywhere}
.deepseek-web-panel .dw-acc-token{font-size:11.5px;color:var(--md-on-surface-variant);font-family:ui-monospace,monospace}
.deepseek-web-panel .dw-acc-state{font-size:11.5px;font-weight:700;color:var(--md-primary);flex-shrink:0}
.deepseek-web-panel .dw-acc-probe{font-size:12px;flex-shrink:0}
.deepseek-web-panel .dw-btn.small{height:32px;padding:0 14px;font-size:13px}
.deepseek-web-panel .dw-btn.danger{background:var(--md-error-container);color:#410e0b}
.deepseek-web-panel .dw-note{margin:0;font-size:12.5px;line-height:1.6;color:var(--md-on-surface-variant)}
.deepseek-web-panel .dw-btn{height:42px;padding:0 20px;border:1px solid transparent;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer;background:var(--md-surface-container-high);color:var(--md-on-surface)}
.deepseek-web-panel .dw-btn.tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.deepseek-web-panel .dw-btn.primary{background:var(--md-primary);color:var(--md-on-primary)}
.deepseek-web-panel .dw-btn:disabled{opacity:.6;cursor:not-allowed}
.deepseek-web-panel .dw-foot{display:flex;justify-content:flex-end;margin-top:18px}
.deepseek-web-panel .dw-ok{margin:0 0 14px;padding:12px 16px;border-radius:14px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);font-size:13.5px}
.deepseek-web-panel .dw-error{margin:0 0 14px;padding:12px 16px;border-radius:14px;background:var(--md-error-container);color:#410e0b;font-size:13.5px}
.deepseek-web-panel .dw-hint{color:var(--md-on-surface-variant)}
`
  document.head.appendChild(style)
})()
