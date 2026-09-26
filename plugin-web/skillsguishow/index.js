// Plugin-native Skills GUI (scheme C) → core/data/plugin-ui/skillsguishow/.
// Material 3 Expressive management page. Bare `vue` import comes from the
// WebUI importmap → host bridge.
import { h, ref, onMounted, computed } from 'vue'

const CSS = `
/* Skills GUI — Material 3 Expressive. #app prefixes out-rank the host layer. */
#app .skills-page{
  height:100%;overflow-y:auto;padding:clamp(22px,3vw,44px);color:var(--md-on-surface);font-family:var(--font-family);
  background:radial-gradient(1100px 560px at 105% -12%,color-mix(in srgb,var(--md-primary) 10%,transparent),transparent 62%),var(--md-surface);
}
#app .skills-page *{box-sizing:border-box}
#app .skills-page .page-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-lg);margin-bottom:clamp(18px,2.4vw,28px);flex-wrap:wrap}
#app .skills-page .eyebrow{margin:0 0 8px;color:var(--md-primary);font:800 11px/1 ui-monospace,monospace;letter-spacing:.18em}
#app .skills-page .page-header h1{margin:0;font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em}
#app .skills-page .subtitle{color:var(--md-on-surface-variant);font-size:14.5px;margin:8px 0 0;line-height:1.6;max-width:680px}
#app .skills-page .header-actions{display:flex;gap:10px;flex-wrap:wrap}
#app .skills-page .btn{
  height:46px;min-height:46px;padding:0 22px;border:1px solid transparent;border-radius:999px;
  font:700 13.5px/1 inherit;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;
  color:var(--md-on-surface);background:var(--md-surface-container-high);
  transition:transform 240ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),background-color 180ms,box-shadow 200ms;
}
#app .skills-page .btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:var(--shadow-1)}
#app .skills-page .btn:disabled{opacity:.5;cursor:not-allowed}
#app .skills-page .btn.btn-primary{background:var(--md-primary);color:var(--md-on-primary);box-shadow:0 6px 16px color-mix(in srgb,var(--md-primary) 30%,transparent)}
#app .skills-page .btn.btn-tonal{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .btn.btn-danger{background:var(--md-error-container);color:var(--md-on-error-container,#410e0b)}
#app .skills-page .btn.sm{height:34px;min-height:34px;padding:0 15px;font-size:12.5px}
#app .skills-page .error-banner{padding:13px 18px;margin-bottom:var(--space-md);background:var(--md-error-container);color:var(--md-on-error-container,#410e0b);border-radius:18px;font-size:13px}
#app .skills-page .flash-banner{padding:13px 18px;margin-bottom:var(--space-md);background:var(--md-success-container);color:#0d3b1e;border-radius:18px;font-size:13px;font-weight:600}
#app .skills-page .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:var(--space-lg);margin-bottom:var(--space-xl)}
#app .skills-page .stat-card{
  padding:20px;border-radius:24px;border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  display:flex;flex-direction:column;gap:6px;box-shadow:var(--shadow-1);
  animation:skills-card-in 520ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both;
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms;
}
#app .skills-page .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-2)}
#app .skills-page .stat-card:nth-child(3n+1){background:var(--md-primary-container);color:var(--md-on-primary-container)}
#app .skills-page .stat-card:nth-child(3n+2){background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .stat-card:nth-child(3n){background:var(--md-tertiary-container);color:var(--md-on-tertiary-container,#421326)}
@keyframes skills-card-in{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
#app .skills-page .stat-label{font-size:11.5px;opacity:.75;color:inherit;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
#app .skills-page .stat-value{font-size:32px;font-weight:800;letter-spacing:-.02em;color:inherit;line-height:1.1}
#app .skills-page .stat-dir{font:12px/1.5 ui-monospace,monospace;word-break:break-all;color:inherit;opacity:.85}
#app .skills-page .upload-panel{
  padding:22px;border-radius:28px;margin-bottom:var(--space-xl);display:flex;flex-direction:column;gap:12px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);box-shadow:var(--shadow-1);
}
#app .skills-page .upload-panel h2{margin:0;font-size:17px;font-weight:750}
#app .skills-page .upload-panel .hint{margin:0;font-size:13px;color:var(--md-on-surface-variant);line-height:1.55}
#app .skills-page .upload-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
#app .skills-page .upload-row input[type=text]{flex:1;min-width:200px}
#app .skills-page .file-pick{font-size:13px;color:var(--md-on-surface-variant);display:inline-flex;align-items:center;gap:8px;cursor:pointer}
#app .skills-page .upload-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}
#app .skills-page .folder-bar{
  display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:16px 18px;border-radius:20px;background:var(--md-secondary-container);color:var(--md-on-secondary-container);
}
#app .skills-page .folder-bar b{font-size:14px;font-weight:750}
#app .skills-page .folder-bar span{font-size:12.5px;opacity:.85;flex:1;min-width:160px}
#app .skills-page .toolbar{display:flex;gap:12px;align-items:center;margin-bottom:var(--space-lg)}
#app .skills-page .toolbar-count{font-size:13px;color:var(--md-on-surface-variant);white-space:nowrap;padding:0 6px;font-weight:600}
#app .skills-page .skill-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-lg);padding-bottom:var(--space-lg)}
#app .skills-page .skill-card{
  padding:22px;display:flex;flex-direction:column;gap:14px;border-radius:28px;
  background:var(--md-surface-container-low);border:1px solid color-mix(in srgb,var(--md-outline-variant) 50%,transparent);
  box-shadow:var(--shadow-1);animation:skills-card-in 520ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)) both;
  transition:transform 280ms var(--ease-spring,cubic-bezier(.22,1.3,.36,1)),box-shadow 280ms,border-color 280ms;
}
#app .skills-page .skill-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-2);border-color:color-mix(in srgb,var(--md-primary) 30%,var(--md-outline-variant))}
#app .skills-page .card-top{display:flex;justify-content:space-between;align-items:center;gap:10px}
#app .skills-page .card-top code{font:700 13px/1.2 ui-monospace,monospace;color:var(--md-on-primary-container);background:var(--md-primary-container);padding:6px 12px;border-radius:999px}
#app .skills-page .status-chip{
  height:30px;padding:0 12px;display:inline-flex;align-items:center;font-size:12px;font-weight:700;
  border-radius:999px;background:var(--md-surface-container-high);color:var(--md-on-surface-variant);border:1px solid transparent;white-space:nowrap;
}
#app .skills-page .status-chip.builtin{background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .card-desc{margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;color:var(--md-on-surface);flex:1}
#app .skills-page .tags{display:flex;gap:6px;flex-wrap:wrap}
#app .skills-page .chip{height:26px;padding:0 11px;font-size:12px;font-weight:600;border-radius:999px;display:inline-flex;align-items:center;background:var(--md-secondary-container);color:var(--md-on-secondary-container)}
#app .skills-page .card-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
#app .skills-page .slash{font:11px/1.3 ui-monospace,monospace;color:var(--md-on-surface-variant)}
#app .skills-page .empty-state{padding:var(--space-xxl);text-align:center;background:var(--md-surface-container);color:var(--md-on-surface-variant);border-radius:32px;margin-bottom:var(--space-lg)}
#app .skills-page .empty-state p{margin:0;font-size:15px;font-weight:600;color:var(--md-on-surface)}
#app .skills-page .empty-state .hint{margin-top:6px;font-size:13px;font-weight:400;opacity:.85}
@media(max-width:860px){
  #app .skills-page{padding:var(--space-lg)}
  #app .skills-page .page-header{display:block}
  #app .skills-page .header-actions{margin-top:14px}
  #app .skills-page .skill-grid{grid-template-columns:1fr}
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

function skillName(filename) {
  return String(filename || '')
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
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
    const folderProgress = ref('')
    const folderInput = ref(null)

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
        if (!newName.value) newName.value = skillName(file.name)
      }
      reader.readAsText(file)
      ev.target.value = ''
    }

    async function uploadFolder(ev) {
      const files = Array.from(ev.target.files || [])
      ev.target.value = ''
      const mdFiles = files.filter(
        (f) => /\.md$/i.test(f.name) || f.type === 'text/markdown' || f.type === 'text/plain',
      )
      if (!mdFiles.length) {
        error.value = '所选文件夹里没有找到 .md 文件'
        return
      }
      busy.value = true
      error.value = ''
      flash.value = ''
      let ok = 0
      let failed = 0
      for (let i = 0; i < mdFiles.length; i++) {
        const file = mdFiles[i]
        const name = skillName(file.name)
        folderProgress.value = `${i + 1}/${mdFiles.length} · ${name || file.name}`
        if (!name) { failed++; continue }
        try {
          const content = await file.text()
          await api('POST', '/api/skills', { name, content })
          ok++
        } catch {
          failed++
        }
      }
      folderProgress.value = ''
      flash.value = `文件夹上传完成：成功 ${ok} 个${failed ? ` · 失败 ${failed} 个` : ''}`
      showUpload.value = false
      await refresh()
      busy.value = false
    }

    onMounted(refresh)

    const stat = (label, value, hint) =>
      h('div', { class: 'stat-card' }, [
        h('span', { class: 'stat-label' }, label),
        h('span', { class: 'stat-value' }, value),
        hint ? h('span', { class: 'stat-label', style: 'text-transform:none;letter-spacing:0;opacity:.7' }, hint) : null,
      ])

    return () =>
      h('div', { class: 'skills-page' }, [
        h('input', {
          ref: folderInput,
          type: 'file',
          webkitdirectory: '',
          directory: '',
          multiple: true,
          style: 'display:none',
          onChange: uploadFolder,
        }),
        h('header', { class: 'page-header' }, [
          h('div', {}, [
            h('p', { class: 'eyebrow' }, 'AGENT · SKILLS'),
            h('h1', {}, '技能管理'),
            h('p', { class: 'subtitle' }, '浏览、上传、删除 Agent 技能。技能由 Agent 插件加载；在对话框输入 /技能名 可强制套用该技能。'),
          ]),
          h('div', { class: 'header-actions' }, [
            h('button', { class: 'btn btn-tonal', disabled: busy.value, onClick: refresh }, busy.value ? '刷新中…' : '刷新'),
            h('button', {
              class: 'btn btn-tonal',
              disabled: busy.value,
              onClick: () => folderInput.value?.click(),
            }, '上传文件夹'),
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
          ? h('section', { class: 'upload-panel' }, [
              h('h2', {}, '上传 / 覆盖技能'),
              h('p', { class: 'hint' }, '单个 Markdown 文件或直接粘贴内容。名称仅限英文、数字、-、_，将成为 /斜杠调用名。'),
              h('div', { class: 'upload-row' }, [
                h('input', {
                  type: 'text',
                  placeholder: '技能名，例如 code-review',
                  value: newName.value,
                  onInput: (e) => (newName.value = e.target.value),
                }),
                h('label', { class: 'file-pick' }, [
                  '选择 .md 文件',
                  h('input', { type: 'file', accept: '.md,text/markdown,text/plain', onChange: pickFile }),
                ]),
              ]),
              h('textarea', {
                placeholder: '# 技能名\n\n一句话描述。\n\n1. 步骤…',
                value: newContent.value,
                onInput: (e) => (newContent.value = e.target.value),
              }),
              h('div', { class: 'folder-bar' }, [
                h('b', {}, '批量导入'),
                h('span', {}, `选择包含多个 .md 的整个文件夹，将逐个创建/覆盖技能（文件名即技能名）。${folderProgress.value ? ' ' + folderProgress.value : ''}`),
                h('button', {
                  class: 'btn sm btn-tonal',
                  disabled: busy.value,
                  onClick: () => folderInput.value?.click(),
                }, folderProgress.value ? '上传中…' : '选择文件夹'),
              ]),
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
              h('p', { class: 'hint' }, error.value ? '' : '点击右上角「上传技能」或「上传文件夹」创建。'),
            ])
          : h(
              'section',
              { class: 'skill-grid' },
              visible.value.map((s, i) =>
                h('article', { class: 'skill-card', key: s.name, style: `animation-delay:${Math.min(i, 12) * 40}ms` }, [
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
