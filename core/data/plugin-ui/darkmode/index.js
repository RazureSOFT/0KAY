// 0KAY dark mode plugin — appearance pane (scheme C, native Vue ESM).
//
// Served by Core at `/api/plugins/darkmode/ui/index.js` and loaded inline by the
// `darkmode.patch` **settings** op (Settings → 外观). Bare `vue` comes from the
// WebUI importmap -> host bridge; the host mounts the default export without its
// own Save button, so this pane owns every control. The theme engine itself
// lives in `theme.js` (dependency-free) and is imported here for its side effect
// so the pane always installs it.
//
// Never processed by Vite: this file is fetched at runtime from Core, so the
// relative `./theme.js` specifier resolves against the Core-served URL.

import './theme.js'
import { h, ref, computed, onMounted, onBeforeUnmount } from 'vue'

const CSS = `
/* ============ Plugin pane (dm- namespace) ============
   Rendered inline inside the Settings page content column (the route was
   retired): it mirrors the host .content-card surface instead of owning a
   full-page scroll region. */
#app .dm{
  box-sizing:border-box;
  padding:clamp(22px,2.6vw,36px);
  color:var(--md-on-surface);font-family:var(--font-family);
  background:
    radial-gradient(460px 240px at 100% 0%,color-mix(in srgb,var(--md-primary) 8%,transparent),transparent 70%),
    var(--md-surface-container-low);
  border:1px solid color-mix(in srgb,var(--md-outline-variant) 52%,transparent);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow-1);
  animation:dm-in 420ms cubic-bezier(.2,0,0,1) both;
}
@keyframes dm-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
#app .dm *{box-sizing:border-box}
#app .dm h1,#app .dm h2,#app .dm p{margin:0}
#app .dm button{font-family:inherit;position:static;min-height:0;isolation:auto}

.dm-head{margin-bottom:clamp(18px,2.4vw,30px)}
.dm-eyebrow{margin:0 0 8px;color:var(--md-primary);font:800 12px/1 ui-monospace,monospace;letter-spacing:.18em}
.dm-head h1{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.02em}
.dm-sub{margin-top:8px;color:var(--md-on-surface-variant);font-size:15px;line-height:1.6;max-width:70ch}

.dm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:22px}
#app .dm .dm-card{
  position:relative;display:flex;flex-direction:column;gap:10px;min-height:0;
  padding:22px;border:2px solid var(--md-outline-variant);border-radius:24px;
  background:var(--md-surface-container-low);color:var(--md-on-surface);
  text-align:left;cursor:pointer;
  transition:border-color 220ms,background-color 220ms,transform 260ms,box-shadow 260ms;
}
#app .dm .dm-card:hover{transform:translateY(-2px);background:var(--md-surface-container);box-shadow:var(--shadow-1)}
#app .dm .dm-card.on{
  border-color:var(--md-primary);background:var(--md-primary-container);
  color:var(--md-on-primary-container);border-radius:24px 24px 24px 8px;box-shadow:var(--shadow-1);
}
.dm-card-title{font-size:16px;font-weight:750}
.dm-card-desc{font-size:13px;line-height:1.55;opacity:.82}
.dm-swatch{display:flex;gap:6px;margin-top:2px}
.dm-swatch i{width:34px;height:22px;border-radius:7px;border:1px solid color-mix(in srgb,currentColor 25%,transparent)}
.dm-check{position:absolute;top:16px;right:18px;font-size:15px;font-weight:800;opacity:0}
#app .dm .dm-card.on .dm-check{opacity:1}

.dm-note{
  margin-top:4px;padding:14px 18px;border-radius:18px;font-size:13px;line-height:1.6;
  background:var(--md-surface-container);color:var(--md-on-surface-variant);
}
.dm-note b{color:var(--md-on-surface)}

.dm-times{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:14px}
.dm-time{display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--md-on-surface-variant)}
.dm-time input{
  min-height:44px;padding:8px 12px;border-radius:12px;
  border:1px solid var(--md-outline-variant);background:var(--md-surface-container);
  color:var(--md-on-surface);font:inherit;
}
`

const STYLE_ID = '0kay-darkmode-page-style'

function mountStyle() {
  if (typeof document === 'undefined') return
  const el = document.getElementById(STYLE_ID)
  if (el && el.textContent === CSS) return
  if (el) el.remove()
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.appendChild(style)
}

const LABELS = {
  zh: {
    eyebrow: '0KAY · APPEARANCE',
    title: '外观',
    sub: '选择 0KAY 的主题。选择「跟随系统」时会实时响应操作系统的深浅色切换。',
    auto: '跟随系统',
    autoDesc: '按系统的深浅色设置自动切换',
    light: '浅色',
    lightDesc: '默认的明亮主题',
    dark: '深色',
    darkDesc: '夜间与弱光环境下更省眼',
    schedule: '按时段',
    scheduleDesc: '到点自动切换深浅色',
    darkFrom: '深色开始',
    darkUntil: '深色结束',
    current: '当前生效：',
    note: '外观偏好保存在本机浏览器（localStorage），不会上传到服务端。删掉 core/data/ui/darkmode.patch 即恢复默认浅色。',
    on: '✓',
  },
  en: {
    eyebrow: '0KAY · APPEARANCE',
    title: 'Appearance',
    sub: 'Pick a theme for 0KAY. "Follow system" reacts to OS light/dark changes live.',
    auto: 'Follow system',
    autoDesc: 'Switch with the OS light/dark setting',
    light: 'Light',
    lightDesc: 'The default bright theme',
    dark: 'Dark',
    darkDesc: 'Easier on the eyes at night',
    schedule: 'Schedule',
    scheduleDesc: 'Switch automatically at set times',
    darkFrom: 'Dark from',
    darkUntil: 'Dark until',
    current: 'Active now: ',
    note: 'The preference is stored in this browser (localStorage) and never sent to the server. Remove core/data/ui/darkmode.patch to go back to light.',
    on: '✓',
  },
  ja: {
    eyebrow: '0KAY · APPEARANCE',
    title: '外観',
    sub: '0KAY のテーマを選択します。「システムに従う」は OS の設定変更に追従します。',
    auto: 'システムに従う',
    autoDesc: 'OS のライト/ダーク設定に合わせて切替',
    light: 'ライト',
    lightDesc: '既定の明るいテーマ',
    dark: 'ダーク',
    darkDesc: '夜間でも目に優しい表示',
    schedule: '時間帯',
    scheduleDesc: '設定した時刻で自動切替',
    darkFrom: 'ダーク開始',
    darkUntil: 'ダーク終了',
    current: '現在の適用: ',
    note: '設定はこのブラウザ（localStorage）に保存され、サーバーへ送信されません。core/data/ui/darkmode.patch を削除すると既定のライトに戻ります。',
    on: '✓',
  },
}

function strings() {
  let lang = 'en'
  try {
    lang = localStorage.getItem('0kay_lang') || navigator.language || 'en'
  } catch { /* ignore */ }
  const l = String(lang).toLowerCase()
  if (l.startsWith('ja')) return LABELS.ja
  if (l.startsWith('zh')) return LABELS.zh
  return LABELS.en
}

const SWATCH = {
  auto: ['#f8f9fb', '#1e212a'],
  light: ['#ffffff', '#f1f3f6', '#e8ecf7'],
  dark: ['#14161d', '#282c36', '#2c3760'],
  schedule: ['#f8f9fb', '#2c3760', '#14161d'],
}

export default {
  name: 'DarkModePage',
  setup() {
    mountStyle()

    const t = strings()
    const theme = (typeof window !== 'undefined' && window.__0KAY_THEME__) || null
    const mode = ref(theme ? theme.getMode() : 'auto')
    const active = ref(theme ? theme.resolved() : 'light')
    const sched = ref(theme && theme.getSchedule ? theme.getSchedule() : { darkFrom: '19:00', darkUntil: '07:00' })

    function choose(next) {
      mode.value = next
      active.value = theme ? theme.setMode(next) : next
      if (next === 'schedule' && theme && theme.setSchedule) {
        theme.setSchedule({ darkFrom: sched.value.darkFrom, darkUntil: sched.value.darkUntil })
        active.value = theme.resolved()
      }
    }

    function onScheduleChange() {
      if (!theme || !theme.setSchedule) return
      theme.setSchedule({ darkFrom: sched.value.darkFrom, darkUntil: sched.value.darkUntil })
      active.value = theme.resolved()
    }

    const onSystemChange = () => {
      if (theme && mode.value === 'auto') active.value = theme.resolved()
    }

    let m = null
    onMounted(() => {
      if (!theme) return
      theme.install()
      active.value = theme.resolved()
      mode.value = theme.getMode()
      m = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
      if (m && typeof m.addEventListener === 'function') m.addEventListener('change', onSystemChange)
    })
    onBeforeUnmount(() => {
      if (m && typeof m.removeEventListener === 'function') m.removeEventListener('change', onSystemChange)
    })

    const options = computed(() => [
      { id: 'auto', title: t.auto, desc: t.autoDesc },
      { id: 'light', title: t.light, desc: t.lightDesc },
      { id: 'dark', title: t.dark, desc: t.darkDesc },
      { id: 'schedule', title: t.schedule, desc: t.scheduleDesc },
    ])

    return () =>
      h('div', { class: 'dm' }, [
        h('header', { class: 'dm-head' }, [
          h('p', { class: 'dm-eyebrow' }, t.eyebrow),
          h('h1', {}, t.title),
          h('p', { class: 'dm-sub' }, t.sub),
        ]),

        h('div', { class: 'dm-grid' }, options.value.map((o) =>
          h('button', {
            key: o.id,
            type: 'button',
            class: 'dm-card' + (mode.value === o.id ? ' on' : ''),
            'aria-pressed': mode.value === o.id,
            onClick: () => choose(o.id),
          }, [
            h('span', { class: 'dm-check' }, t.on),
            h('span', { class: 'dm-card-title' }, o.title),
            h('span', { class: 'dm-card-desc' }, o.desc),
            h('span', { class: 'dm-swatch' }, SWATCH[o.id].map((c, i) =>
              h('i', { key: i, style: 'background:' + c }),
            )),
          ]),
        )),

        mode.value === 'schedule'
          ? h('div', { class: 'dm-times' }, [
              h('label', { class: 'dm-time' }, [
                h('span', {}, t.darkFrom),
                h('input', {
                  type: 'time',
                  value: sched.value.darkFrom,
                  onInput: (e) => { sched.value.darkFrom = e.target.value; onScheduleChange() },
                }),
              ]),
              h('label', { class: 'dm-time' }, [
                h('span', {}, t.darkUntil),
                h('input', {
                  type: 'time',
                  value: sched.value.darkUntil,
                  onInput: (e) => { sched.value.darkUntil = e.target.value; onScheduleChange() },
                }),
              ]),
            ])
          : null,

        h('p', { class: 'dm-note' }, [
          h('b', {}, t.current),
          active.value === 'dark' ? t.dark : t.light,
          ' · ',
          mode.value === 'auto' ? t.auto : (mode.value === 'schedule' ? t.schedule : '—'),
        ]),
        h('p', { class: 'dm-note' }, t.note),
      ])
  },
}
