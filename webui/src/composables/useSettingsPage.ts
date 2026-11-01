// State and behaviour for the settings page.
//
// The page is a 200-line template that composes one panel per tab; everything it
// needs to drive them — the nav, the drafts, the per-section saves — lives here so
// the template is readable and this logic is testable without mounting a page.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from '../stores/wizard'
import { useSettingsSectionsStore } from '../stores/settingsSections'
import { useUIPatchesStore } from '../stores/uiPatches'
import { useConfirm } from '../composables/confirm'
import { useSettingsMeta } from '../composables/settingsMeta'
import { toast } from '../composables/toast'

export function useSettingsPage() {

  const { t } = useI18n()
  const { confirm } = useConfirm()
  const wizard = useWizardStore()
  const sectionsStore = useSettingsSectionsStore()
  const uiPatches = useUIPatchesStore()
  const route = useRoute()
  const router = useRouter()

  const tabs = computed<Array<{ id: string; icon: string }>>(() => uiPatches.settingsTabs.map(t => ({
    id: t.id,
    icon: t.icon || 'chip',
  })))

  const pluginOnlyTabs = computed(() => {
    const seen = new Set(uiPatches.settingsTabs.map(t => t.id))
    const removed = new Set(uiPatches.removedSettingsIds)
    return sectionsStore.sections
      .filter(s => s.id !== 'permissions' && !seen.has(s.id) && !removed.has(s.id))
      .map(s => ({ id: s.id, icon: s.icon || 'lock' }))
  })

  const allTabs = computed(() => [...tabs.value, ...pluginOnlyTabs.value])

  // Two groups, because "which model am I on" and "what does this plugin do"
  // are not the same kind of question. Builtin tabs first; anything a plugin
  // registered after them, under its own heading.
  const navGroups = computed(() => [
    { id: 'core', label: t('settings.groupCore'), tabs: tabs.value },
    { id: 'plugins', label: t('settings.groupPlugins'), tabs: pluginOnlyTabs.value },
  ].filter(group => group.tabs.length))

  // Seeded from the query BEFORE first paint: initializing to 'general' and
  // switching in onMounted is what made the page flash the general tab.
  const activeTab = ref<string>((route.query.tab as string | undefined) || 'general')
  const saved = ref(false)

  const uploadedModels = ref<{ id: string; label: string; url: string }[]>([])
  const uploadMsg = ref('')

  const sectionDrafts = ref<Record<string, Record<string, unknown>>>({})
  const sectionMsg = ref('')
  const sectionMsgKind = ref<'ok' | 'error'>('ok')
  const sectionSaving = ref(false)
  /** Desktop shell present? Its own preferences only make sense there. */
  const isDesktop = typeof window !== 'undefined' && !!(window as any).okayDesktop?.isDesktop

  /**
   * Open the shell's preferences window.
   *
   * Run from Settings because that is where settings belong; the tray entry stays
   * as a shortcut for people who already know it is there.
   */
  async function openDesktopSettings() {
    try {
      await (window as any).okayDesktop?.openSettings?.()
    } catch { /* a browser build simply has nothing to open */ }
  }

  const sectionTesting = ref(false)
  /**
   * Self-improvement, fired from Settings > Experiments.
   *
   * It asks before doing anything: rewriting its own source is the one action a
   * misclick must not trigger. The confirmation names the three boundaries the
   * run keeps — separate worktree, main untouched, tests before any PR.
   */
  const evolveDialog = ref(false)
  const evolveBusy = ref(false)
  const evolveMsg = ref('')

  function openEvolveDialog() {
    evolveMsg.value = ''
    evolveDialog.value = true
  }

  function closeEvolveDialog() {
    if (evolveBusy.value) return
    evolveDialog.value = false
  }

  async function confirmEvolve() {
    if (evolveBusy.value) return
    evolveBusy.value = true
    evolveMsg.value = ''
    try {
      // A fresh session keeps the proposal readable on its own instead of burying
      // it in whatever conversation happened to be open.
      const created = await fetch('/api/agent/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t('settings.evolveSessionTitle') }),
      })
      if (!created.ok) throw new Error(`HTTP ${created.status}`)
      const session = await created.json()
      const sessionId = session?.session_id || session?.id
      if (!sessionId) throw new Error(t('settings.evolveNoSession'))

      const sent = await fetch('/api/agent/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          prompt: t('settings.evolvePrompt'),
          agent_type: 'general',
        }),
      })
      if (!sent.ok) throw new Error(`HTTP ${sent.status}`)
      evolveDialog.value = false
      evolveMsg.value = t('settings.evolveStarted')
    } catch (error: unknown) {
      evolveMsg.value = error instanceof Error ? error.message : String(error)
    } finally {
      evolveBusy.value = false
    }
  }

  const sectionTestMsg = ref('')
  const live2dSaving = ref(false)

  const availableModels = ref<string[]>([])
  const modelAutoLabel = computed(() => t('settings.modelAuto'))
  const modelOptions = computed(() => [
    { value: '', label: modelAutoLabel.value },
    ...availableModels.value.map((id) => ({ value: id, label: id })),
  ])
  async function loadAvailableModels() {
    try {
      const res = await fetch('/api/models')
      if (!res.ok) return
      const body: { models?: Array<{ id?: string }> } = await res.json()
      availableModels.value = Array.from(new Set((body.models || []).map((model) => String(model.id || '')).filter(Boolean)))
    } catch { }
  }

  async function testPluginSection(id: string) {
    sectionTesting.value = true
    sectionTestMsg.value = ''
    try {
      const res = await fetch(`/api/settings/${id}/test`, { method: 'POST' })
      const contentType = res.headers.get('content-type') || ''
      if (res.ok && contentType.startsWith('audio')) {
        const url = URL.createObjectURL(await res.blob())
        try { await new Audio(url).play() } catch { }
        window.dispatchEvent(new CustomEvent('live2d-speak', { detail: { url } }))
        sectionTestMsg.value = t('settings.testSuccess')
      } else {
        const data: { error?: string } = await res.json().catch(() => ({}))
        sectionTestMsg.value = data.error || `HTTP ${res.status}`
      }
    } catch (error: unknown) {
      sectionTestMsg.value = error instanceof Error ? error.message : String(error)
    } finally {
      sectionTesting.value = false
    }
  }

  const { tabMeta, isBuiltinTab, isPluginSection, tabLabel, fieldLabel, fieldHelp, pluginSection } = useSettingsMeta()

  const pickerField = ref('')
  const pickerOpen = computed({
    get: () => pickerField.value !== '',
    set: (open: boolean) => { if (!open) pickerField.value = '' },
  })
  const pickerTitle = computed(() => {
    const field = pluginSection(activeTab.value)?.fields.find((f) => f.key === pickerField.value)
    return field?.label || ''
  })
  const pickerInitial = computed(() => String(sectionDrafts.value[activeTab.value]?.[pickerField.value] ?? ''))

  function applyPickedPath(path: string) {
    const key = pickerField.value
    if (!key) return
    sectionDrafts.value = {
      ...sectionDrafts.value,
      [activeTab.value]: { ...sectionDrafts.value[activeTab.value], [key]: path },
    }
  }

  const moduleTab = computed(() => {
    if (isBuiltinTab(activeTab.value)) return null
    return tabMeta(activeTab.value)?.module || null
  })


  function loadSectionDraft(id: string) {
    const meta = tabMeta(id)
    if (meta?.fields?.length && !isBuiltinTab(id)) {
      void loadPatchFields(id)
      return
    }
    const sec = pluginSection(id)
    if (!sec) return
    const base: Record<string, unknown> = {}
    for (const f of sec.fields) {
      if (f.type === 'note') continue
      if (f.type === 'bool') base[f.key] = f.default_value === 'true' || f.default_value === '1'
      else if (f.type === 'number') base[f.key] = Number(f.default_value || 0)
      else base[f.key] = f.default_value || ''
    }
    const saved = sectionsStore.values[id] || {}
    const merged: Record<string, unknown> = { ...base }
    for (const f of sec.fields) {
      if (!(f.key in saved)) continue
      const v = saved[f.key]
      if (f.type === 'bool') {
        merged[f.key] = v === true || v === 'true' || v === 1 || v === '1'
      } else {
        merged[f.key] = v
      }
    }
    sectionDrafts.value = {
      ...sectionDrafts.value,
      [id]: merged,
    }
  }

  async function loadPatchFields(id: string) {
    const meta = tabMeta(id)
    if (!meta?.fields?.length) return
    const base: Record<string, unknown> = {}
    for (const f of meta.fields) {
      if (f.type === 'bool') base[f.key] = f.default_value === 'true' || f.default_value === '1'
      else if (f.type === 'number') base[f.key] = Number(f.default_value || 0)
      else base[f.key] = f.default_value || ''
    }
    if (meta.loadApi) {
      try {
        const res = await fetch(meta.loadApi)
        if (res.ok) {
          const data = await res.json()
          for (const f of meta.fields) {
            if (!(f.key in data)) continue
            const v = data[f.key]
            if (f.type === 'bool') base[f.key] = v === true || v === 'true' || v === 1 || v === '1'
            else base[f.key] = v
          }
        }
      } catch { }
    }
    sectionDrafts.value = { ...sectionDrafts.value, [id]: base }
  }

  async function savePatchFields(id: string) {
    const meta = tabMeta(id)
    if (sectionSaving.value) return
    sectionSaving.value = true
    sectionMsg.value = ''
    try {
      const body = sectionDrafts.value[id] || {}
      if (meta?.saveApi) {
        const res = await fetch(meta.saveApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error(String(res.status))
      }
      sectionMsg.value = t('settings.saved')
      sectionMsgKind.value = 'ok'
      setTimeout(() => { sectionMsg.value = '' }, 3000)
    } catch {
      sectionMsg.value = t('settings.permFailed')
      sectionMsgKind.value = 'error'
    } finally {
      sectionSaving.value = false
    }
  }

  async function saveSection(id: string) {
    if (sectionSaving.value) return
    sectionSaving.value = true
    sectionMsg.value = ''
    try {
      const notes = new Set((pluginSection(id)?.fields || []).filter((f) => f.type === 'note').map((f) => f.key))
      const payload = Object.fromEntries(
        Object.entries(sectionDrafts.value[id] || {}).filter(([key]) => !notes.has(key)),
      )
      await sectionsStore.saveValues(id, payload)
      sectionMsg.value = t('settings.saved')
      sectionMsgKind.value = 'ok'
      setTimeout(() => { sectionMsg.value = '' }, 3000)
    } catch {
      sectionMsg.value = t('settings.permFailed')
      sectionMsgKind.value = 'error'
    } finally {
      sectionSaving.value = false
    }
  }

  async function loadUploadedModels() {
    try {
      const res = await fetch('/api/live2d')
      if (res.ok) {
        const data = await res.json()
        uploadedModels.value = data.models || []
      }
    } catch {
      uploadedModels.value = []
    }
  }
  async function deleteModel(model: {id:string;url:string;label:string}) {
    const ok = await confirm({
      title: t('settings.live2d'),
      message: t('settings.deleteModelConfirm', { label: model.label }),
      confirmLabel: t('common.delete'),
      danger: true,
    })
    if (!ok) return
    try {
      const response=await fetch(`/api/live2d/${encodeURIComponent(model.id)}`,{method:'DELETE'})
      if(!response.ok)throw new Error(await response.text())
      const body=await response.json();uploadedModels.value=body.models || []
      const folder=model.url.slice(0,model.url.indexOf('/', '/live2d/models/'.length)+1)
      if(wizard.live2d.modelUrl.startsWith(folder)) {wizard.live2d.modelUrl='';wizard.live2d.enabled=false;wizard.saveToStorage()}
      await saveLive2D();uploadMsg.value=t('settings.modelDeleted')
      window.dispatchEvent(new Event('live2d-models-changed'))
    }catch(error:any){uploadMsg.value=error.message}
  }
  async function saveLive2D() {
    wizard.saveToStorage()
    const response=await fetch('/api/settings/live2d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({values:{enabled:wizard.live2d.enabled,model_url:wizard.live2d.modelUrl}})})
    if(!response.ok)throw new Error(await response.text())
  }

  async function saveLive2DNow() {
    if (live2dSaving.value) return
    live2dSaving.value = true
    uploadMsg.value = ''
    try {
      await saveLive2D()
      uploadMsg.value = t('settings.saved')
      setTimeout(() => { if (uploadMsg.value === t('settings.saved')) uploadMsg.value = '' }, 3000)
    } catch (error: any) {
      uploadMsg.value = error.message
      toast(t('settings.permFailed'), 'error')
    } finally {
      live2dSaving.value = false
    }
  }

  async function onFolderSelected(files: FileList) {
    if (!files || files.length === 0) return
    uploadMsg.value = ''
    try {
      const fd = new FormData()
      const paths: string[] = []
      for (const f of Array.from(files)) {
        const rel = (f as any).webkitRelativePath || f.name
        paths.push(rel)
        fd.append('files', f, f.name)
      }
      fd.append('paths', JSON.stringify(paths))
      const res = await fetch('/api/live2d', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      uploadMsg.value = t('settings.uploadOk')
      if (data?.models) uploadedModels.value = data.models
      else await loadUploadedModels()
      if (data?.model_url) {
        wizard.live2d.modelUrl = data.model_url
        wizard.live2d.enabled = true
        wizard.saveToStorage()
        await saveLive2D()
        window.dispatchEvent(new Event('live2d-models-changed'))
      }
    } catch (error:any) {
      uploadMsg.value = `${t('settings.uploadFail')}：${error.message}`
    }
  }

  onMounted(async () => {
    wizard.loadFromStorage()
    loadUploadedModels()
    void loadAvailableModels()
    await sectionsStore.fetchSections()
    for (const sec of sectionsStore.sections) loadSectionDraft(sec.id)
    // A tab from the query stays selected even before the plugin tabs resolve;
    // only a tab that is still unknown AFTER the sections load falls back.
    if (sectionsStore.sections.length && !allTabs.value.some((tab) => tab.id === activeTab.value) && !isBuiltinTab(activeTab.value)) {
      activeTab.value = 'general'
    }
  })

  function selectTab(id: string) {
    activeTab.value = id
    if (!isBuiltinTab(id)) loadSectionDraft(id)
    router.replace({ query: { tab: id } })
  }

  function save() {
    wizard.saveToStorage()
    if (activeTab.value === 'live2d') {
      saveLive2D()
        .then(() => {
          saved.value = true
          setTimeout(() => { saved.value = false }, 1500)
        })
        .catch((error: any) => {
          uploadMsg.value = error.message
          toast(t('settings.permFailed'), 'error')
        })
      return
    }
    saved.value = true
    setTimeout(() => { saved.value = false }, 1500)
  }

  return {
    wizard,
    sectionsStore,
    uiPatches,
    route,
    router,
    tabs,
    pluginOnlyTabs,
    allTabs,
    navGroups,
    activeTab,
    saved,
    uploadedModels,
    uploadMsg,
    sectionDrafts,
    sectionMsg,
    sectionMsgKind,
    sectionSaving,
    sectionTesting,
    isDesktop,
    openDesktopSettings,
    evolveDialog,
    evolveBusy,
    evolveMsg,
    openEvolveDialog,
    closeEvolveDialog,
    confirmEvolve,
    sectionTestMsg,
    live2dSaving,
    availableModels,
    modelAutoLabel,
    modelOptions,
    loadAvailableModels,
    testPluginSection,
    pickerField,
    pickerOpen,
    pickerTitle,
    pickerInitial,
    applyPickedPath,
    moduleTab,
    loadSectionDraft,
    loadPatchFields,
    savePatchFields,
    saveSection,
    loadUploadedModels,
    deleteModel,
    saveLive2D,
    saveLive2DNow,
    onFolderSelected,
    selectTab,
    save,
    t,
    confirm,
    tabMeta,
    isBuiltinTab,
    isPluginSection,
    tabLabel,
    fieldLabel,
    fieldHelp,
    pluginSection,
  }
}
