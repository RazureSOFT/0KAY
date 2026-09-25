// Plugin-native Skills GUI (scheme C) → core/data/plugin-ui/skillsguishow/.
// Visual language mirrors built-in management pages (PluginsPage/UsagePage):
// page-header + subtitle, .btn/.stat-card/.plugin-card global classes, native tokens.
// Bare `vue` import is provided by WebUI importmap → host bridge.
import { h, ref, onMounted, computed } from 'vue'

const CSS = `
.skills-page{height:100%;overflow-y:auto;padding:var(--space-xl);background:var(--md-surface)}
.skills-page *{box-sizing:border-box}
.skills-page .page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap}
.skills-page .subtitle{color:var(--md-on-surface-variant);font-size:14px;margin:4px 0 0;line-height:1.6;max-width:680px}
.skills-page .header-actions{display:flex;gap:var(--space-sm);flex-wrap:wrap}
.skills-page .btn{height:36px;min-height:36px;padding:0 14px;font-size:13px}
.skills-page .btn.sm{height:28px;min-height:28px;padding:0 10px;font-size:12px}
.skills-page .error-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-error-container);color:#410E0B;border-radius:var(--radius-md);font-size:13px}
.skills-page .flash-banner{padding:12px 16px;margin-bottom:var(--space-md);background:var(--md-success-container);color:#0D1F06;border-radius:var(--radius-md);font-size:13px}
.skills-page .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-md);margin-bottom:var(--space-xl)}
.skills-page .stat-card{padding:var(--space-lg);border:1px solid var(--md-outline-variant);display:flex;flex-direction:column;gap:6px}
.skills-page .stat-label{font-size:12px;color:var(--md-on-surface-variant);text-transform:uppercase;letter-spacing:.4px}
.skills-page .stat-value{font-size:28px;font-weight:700;color:var(--md-on-surface)}
.skills-page .stat-dir{font:12px/1.5 ui-monospace,monospace;word-break:break-all;color:var(--md-on-surface-variant)}
.skills-page .upload-panel{padding:var(--space-lg);margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:var(--space-sm)}
.skills-page .upload-panel h2{margin:0;font-size:16px;font-weight:600}
.skills-page .upload-panel .hint{margin:0 0 var(--space-sm);font-size:13px;color:var(--md-on-surface-variant)}
.skills-page .upload-row{display:flex;gap:var(--space-sm);flex-wrap:wrap;align-items:center}
.skills-page .upload-row input[type=text]{flex:1;min-width:200px;height:40px;padding:0 14px}
.skills-page .file-pick{font-size:13px;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;gap:6px}
.skills-page textarea{width:100%;min-height:140px;padding:12px 14px;line-height:1.5;resize:vertical}
.skills-page .upload-actions{display:flex;justify-content:flex-end;gap:var(--space-sm);margin-top:var(--space-sm)}
.skills-page .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:var(--space-lg)}
.skills-page .toolbar input{flex:1;min-width:0;height:40px;padding:0 14px}
.skills-page .toolbar-count{font-size:13px;color:var(--md-on-surface-variant);white-space:nowrap;padding:0 4px}
.skills-page .skill-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-lg);padding-bottom:var(--space-lg)}
.skills-page .skill-card{padding:var(--space-lg);display:flex;flex-direction:column;gap:var(--space-md)}
.skills-page .card-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.skills-page .card-top code{font:600 13px/1.2 ui-monospace,monospace;color:var(--md-primary);background:var(--md-primary-container);padding:4px 10px;border-radius:var(--radius-full)}
.skills-page .status-chip{height:28px;padding:0 10px;display:inline-flex;align-items:center;font-size:12px;background:var(--md-surface-container-highest);color:var(--md-on-surface-variant);border:1px solid transparent;white-space:nowrap}
.skills-page .status-chip.builtin{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skills-page .card-desc{margin:0;font-size:14px;line-height:1.55;white-space:pre-wrap;color:var(--md-on-surface);flex:1}
.skills-page .tags{display:flex;gap:6px;flex-wrap:wrap}
.skills-page .chip{height:24px;padding:0 8px;font-size:12px;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
.skills-page .card-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
.skills-page .slash{font:11px/1.3 ui-monospace,monospace;color:var(--md-on-surface-variant)}
.skills-page .empty-state{padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);color:var(--md-on-surface-variant);border-radius:32px;margin-bottom:var(--space-lg)}
.skills-page .empty-state .hint{margin-top:6px;font-size:13px;opacity:.85}
@media(max-width:860px){
  .skills-page{padding:var(--space-lg)}
  .skills-page .page-header{display:block}
  .skills-page .header-actions{margin-top:12px}
  .skills-page .skill-grid{grid-template-columns:1fr}
}
`

let styleInstalled = false
function ensureStyle() {
  if (styleInstalled || typeof document === 'undefined') return
  if (document.getElementById('skillsguishow-style')) { styleInstalled = true; return }
  const el = document.createElement('style')
  el.id = 'skillsguishow-style'
  el.textContent = CSS
  document.head.appendChild(el)
  styleInstalled = true
}

async function api(method, url, body) {
  const init = { method, headers: { 'Content-Type': 'application/json' } }
  if (body !== undefined) init.body = JSON.stringify(body)
  const res = await fetch(url, init)
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `${method} ${url} → ${res.status}`)
  }
  return data.result !== undefined && data.result !== null ? data.result : data
}

export default {
  name: 'SkillsGuiShowPage',
  setup() {
    ensureStyle()
    const skills = ref([])
    const dir = ref('')
    const error = ref('')
    const flash = ref('')
    const busy = ref(false)
    const query = ref('')
    const showUpload = ref(false)
    const newName = ref('')
    const newContent = ref('')
    const deleting = ref('')

    const visible = computed(() => {
      const q = query.value.trim().toLowerCase()
      if (!q) return skills.value
      return skills.value.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.tags || []).some((t) => String(t).toLowerCase().includes(q)),
      )
    })
    const fileCount = computed(() => skills.value.filter((s) => s.source !== 'builtin').length)
    const builtinCount = computed(() => skills.value.filter((s) => s.source === 'builtin').length)

    async function refresh() {
      busy.value = true
      error.value = ''
      try {
        const data = await api('GET', '/api/skills')
        skills.value = Array.isArray(data?.skills) ? data.skills : []
        dir.value = data?.dir || ''
      } catch (e) {
        error.value = String(e?.message || e)
      } finally {
        busy.value = false
      }
    }

    async function save() {
      if (!newName.value.trim() || !newContent.value.trim()) return
      busy.value = true
      error.value = ''
      flash.value = ''
      try {
        await api('POST', '/api/skills', { name: newName.value, content: newContent.value })
        flash.value = `已保存 ${newName.value.trim()}`
        newName.value = ''
        newContent.value = ''
        showUpload.value = false
        await refresh()
      } catch (e) {
        error.value = String(e?.message || e)
      } finally {
        busy.value = false
      }
    }

    async function remove(name) {
      if (deleting.value !== name) {
        deleting.value = name
        return
      }
      deleting.value = ''
      busy.value = true
      error.value = ''
      flash.value = ''
      try {
        await api('DELETE', `/api/skills?name=${encodeURIComponent(name)}`)
        flash.value = `已删除 ${name}`
        await refresh()
      } catch (e) {
        error.value = String(e?.message || e)
      } finally {
        busy.value = false
      }
    }

    function pickFile(ev) {
      const file = ev.target.files && ev.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        newContent.value = String(reader.result || '')
        if (!newName.value) newName.value = file.name.replace(/\.md$/i, '')
      }
      reader.readAsText(file)
      ev.target.value = ''
    }

    onMounted(refresh)

    const stat = (label, value, hint) =>
      h('div', { class: 'stat-card' }, [
        h('span', { class: 'stat-label' }, label),
        h('span', { class: 'stat-value' }, value),
        hint ? h('span', { class: 'stat-label', style: 'text-transform:none;letter-spacing:0' }, hint) : null,
      ])

    return () =>
      h('div', { class: 'skills-page' }, [
        h('header', { class: 'page-header' }, [
          h('div', {}, [
            h('h1', {}, '技能管理'),
            h('p', { class: 'subtitle' }, '浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。'),
          ]),
          h('div', { class: 'header-actions' }, [
            h('button', { class: 'btn btn-tonal', disabled: busy.value, onClick: refresh }, busy.value ? '刷新中…' : '刷新'),
            h('button', { class: 'btn btn-primary', onClick: () => (showUpload.value = !showUpload.value) }, showUpload.value ? '收起上传' : '上传技能'),
          ]),
        ]),

        error.value ? h('div', { class: 'error-banner' }, error.value) : null,
        flash.value ? h('div', { class: 'flash-banner' }, flash.value) : null,

        h('section', { class: 'stat-grid' }, [
          stat('技能总数', String(skills.value.length), '含内置与文件技能'),
          stat('文件技能', String(fileCount.value), '可编辑、可删除'),
          stat('内置技能', String(builtinCount.value), 'code / research / general'),
          h('div', { class: 'stat-card' }, [
            h('span', { class: 'stat-label' }, '技能目录'),
            h('div', { class: 'stat-dir' }, dir.value || '—'),
          ]),
        ]),

        showUpload.value
          ? h('section', { class: 'card upload-panel' }, [
              h('h2', {}, '上传 / 覆盖技能'),
              h('p', { class: 'hint' }, 'Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。'),
              h('div', { class: 'upload-row' }, [
                h('input', {
                  type: 'text',
                  placeholder: '技能名，例如 code-review',
                  value: newName.value,
                  onInput: (e) => (newName.value = e.target.value),
                }),
                h('label', { class: 'file-pick' }, [
                  '选择 .md 文件 ',
                  h('input', { type: 'file', accept: '.md,text/markdown,text/plain', onChange: pickFile }),
                ]),
              ]),
              h('textarea', {
                placeholder: '# 技能名\n\n一句话描述。\n\n1. 步骤…',
                value: newContent.value,
                onInput: (e) => (newContent.value = e.target.value),
              }),
              h('div', { class: 'upload-actions' }, [
                h('button', { class: 'btn btn-tonal', disabled: busy.value, onClick: () => (showUpload.value = false) }, '取消'),
                h('button', { class: 'btn btn-primary', disabled: busy.value || !newName.value.trim() || !newContent.value.trim(), onClick: save }, '保存技能'),
              ]),
            ])
          : null,

        h('section', { class: 'toolbar' }, [
          h('input', {
            placeholder: '搜索技能名称、描述或标签…',
            value: query.value,
            onInput: (e) => (query.value = e.target.value),
          }),
          h('span', { class: 'toolbar-count' }, `${visible.value.length} / ${skills.value.length} 个技能`),
        ]),

        visible.value.length === 0
          ? h('div', { class: 'empty-state' }, [
              h('p', {}, error.value ? '无法读取技能列表。确认 Agent 在线后重试。' : query.value ? '没有匹配的技能。' : '暂无技能。'),
              h('p', { class: 'hint' }, error.value ? '' : '点击右上角「上传技能」创建第一个。'),
            ])
          : h(
              'section',
              { class: 'skill-grid' },
              visible.value.map((s) =>
                h('article', { class: 'plugin-card skill-card', key: s.name }, [
                  h('div', { class: 'card-top' }, [
                    h('code', {}, `/${s.name}`),
                    h('span', { class: `status-chip${s.source === 'builtin' ? ' builtin' : ''}` }, s.source === 'builtin' ? '内置' : '文件'),
                  ]),
                  h('p', { class: 'card-desc' }, s.description || '（无描述）'),
                  s.tags && s.tags.length
                    ? h('div', { class: 'tags' }, s.tags.map((t) => h('span', { class: 'chip', key: t }, `#${t}`)))
                    : null,
                  h('div', { class: 'card-actions' }, [
                    h('span', { class: 'slash' }, `对话输入 /${s.name}`),
                    h(
                      'button',
                      {
                        class: `btn sm ${deleting.value === s.name ? 'btn-danger' : 'btn-tonal'}`,
                        disabled: busy.value,
                        onClick: () => remove(s.name),
                      },
                      deleting.value === s.name ? '确认删除？' : '删除',
                    ),
                  ]),
                ]),
              ),
            ),
      ])
  },
}
