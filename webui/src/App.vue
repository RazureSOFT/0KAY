<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWizardStore } from './stores/wizard'
import { useLifeStore } from './stores/life'
import { useChatStore } from './stores/chat'
import { useUIPatchesStore } from './stores/uiPatches'
import SetupWizard from './components/SetupWizard.vue'
import GlobalAgentInbox from './components/GlobalAgentInbox.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import AppSelect from './components/AppSelect.vue'
import LifeApprovalDialog from './components/LifeApprovalDialog.vue'
import { setLanguage, getLanguage, LOCALES } from './i18n'

const { t } = useI18n()
const wizard = useWizardStore()
const life = useLifeStore()
const chat = useChatStore()
const ui = useUIPatchesStore()
const route = useRoute()
const router = useRouter()
const lang = computed(() => getLanguage())

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined
  if (key) return t(key)
  const p = ui.routerPatches.find((r) => r.path === route.path || r.name === route.name)
  if (p) {
    if (p.titleKey) {
      const s = t(p.titleKey)
      if (s && s !== p.titleKey) return s
    }
    return p.title || t('app.title')
  }
  return t('app.title')
})

function navLabel(item: { labelKey?: string; label?: string; id: string }) {
  if (item.labelKey) {
    const s = t(item.labelKey)
    if (s && s !== item.labelKey) return s
  }
  return item.label || item.id
}

/** Resolve badgeFrom e.g. "life.onlineAgents" */
function navBadge(item: { badgeFrom?: string; badge?: number | string | null; id: string }): number | string | null {
  if (item.badgeFrom?.startsWith('life.')) {
    const key = item.badgeFrom.slice(5) as keyof typeof life
    const v = (life as any)[key]
    if (v !== undefined && v !== null && v !== '' && v !== 0) return v as number | string
  }
  if (item.badgeFrom?.startsWith('chat.')) {
    const key = item.badgeFrom.slice(5) as keyof typeof chat
    const v = (chat as any)[key]
    if (v !== undefined && v !== null && v !== '' && v !== 0) return v as number | string
  }
  if (item.badge != null && item.badge !== '') return item.badge
  return null
}

function onNav(item: { to?: string; href?: string; external?: boolean }) {
  if (item.href || item.external) {
    if (item.href) window.open(item.href, '_blank', 'noopener')
    return
  }
  if (item.to) router.push(item.to)
}

function isActive(item: { id: string; to?: string }) {
  // Exact path match for any nav target (including "/" for chat).
  if (item.to) {
    if (item.to === '/') return route.path === '/' || route.name === 'chat'
    return route.path === item.to || route.name === item.id
  }
  return route.name === item.id
}

onMounted(() => {
  wizard.loadFromStorage()
  ui.startPolling(15000)
  if (wizard.isCompleted) {
    if (!life.isConnected) life.connect()
    if (!chat.isConnected) chat.connect()
  }
})

onUnmounted(() => {
  ui.stopPolling()
  life.disconnect()
})

function changeLang(code: string) {
  setLanguage(code)
}

function onWizardComplete() {
  wizard.loadFromStorage()
  if (!life.isConnected) life.connect()
  if (!chat.isConnected) chat.connect()
  router.replace('/')
}
</script>

<template>
  <SetupWizard
    v-if="!wizard.isCompleted"
    @complete="onWizardComplete"
  />

  <div v-else class="app-shell">
    <GlobalAgentInbox />
    <ConfirmDialog />
    <LifeApprovalDialog />
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark">0kay</span>
        <span class="page-title">{{ pageTitle }}</span>
      </div>

      <div class="header-actions">
        <span
          class="conn-dot"
          :class="{ on: life.isConnected }"
          :title="life.isConnected ? t('status.connected') : t('status.disconnected')"
        ></span>
        <AppSelect
          class="lang-select"
          :model-value="lang"
          :options="LOCALES.map(option => ({ value: option.code, label: option.label }))"
          :aria-label="t('app.switchLang')"
          @update:model-value="changeLang"
        />
        <button
          class="icon-btn settings-btn"
          :class="{ active: route.name === 'settings' }"
          :title="t('nav.settings')"
          @click="router.push('/settings')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="app-body">
      <!-- @ui-ext:nav — items come from BUILTIN_NAV + /api/ui/patches -->
      <nav class="nav-rail" aria-label="main">
        <component
          :is="item.to && !item.external && !item.href ? 'router-link' : 'button'"
          v-for="item in ui.navItems"
          :key="item.id"
          :to="item.to && !item.external && !item.href ? item.to : undefined"
          :class="['nav-item', { active: isActive(item) }]"
          :title="navLabel(item)"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="!(item.to && !item.external && !item.href) && onNav(item)"
        >
          <span class="nav-icon">
            <!-- chat -->
            <svg v-if="item.icon === 'chat' || item.id === 'chat'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4V6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <!-- agents / life -->
            <svg v-else-if="item.icon === 'agents' || item.id === 'agents' || item.id === 'life'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="16" height="12" rx="4" stroke="currentColor" stroke-width="2"/>
              <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
              <path d="M12 7V4M8 4h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- plugins -->
            <svg v-else-if="item.icon === 'plugins' || item.id === 'plugins'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M8 3v4M16 3v4M3 10h18M7 14h4v7H7v-7zM13 14h4v4h-4v-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- usage -->
            <svg v-else-if="item.icon === 'usage' || item.id === 'usage'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="2"/>
              <path d="M8 15v-4M12 15V8M16 15v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- settings -->
            <svg v-else-if="item.icon === 'settings' || item.id === 'settings'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- search / default -->
            <svg v-else-if="item.icon === 'search' || item.id === 'search'" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M16 16l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </span>
          <span class="nav-label">{{ navLabel(item) }}</span>
          <span v-if="navBadge(item) != null" class="badge">{{ navBadge(item) }}</span>
        </component>
      </nav>

      <main class="app-main">
        <RouterView v-slot="{ Component }">
          <Transition name="route" mode="out-in">
            <div :key="route.path" class="route-view"><component :is="Component" /></div>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--md-surface);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--space-lg);
  background: var(--md-surface-container);
  border-bottom: 1px solid var(--md-outline-variant);
  z-index: 10;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  min-width: 0;
}

.brand-mark {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--md-primary), #9C4FFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.conn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--md-outline);
  margin-right: 4px;
}
.conn-dot.on {
  background: var(--md-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-success) 20%, transparent);
}

.icon-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--md-on-surface-variant);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}
.icon-btn:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}
.icon-btn.active {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.lang-select {
  width: 148px;
  flex-shrink: 0;
}
#app .lang-select :deep(.app-select-trigger) {
  min-height: 44px;
  border-radius: 18px;
  background-color: var(--md-surface-container-lowest);
  padding: 0 10px 0 14px;
  font-size: 13px;
  font-weight: 650;
}
#app .lang-select :deep(.app-select-chevron) {
  width: 22px;
  height: 22px;
}

.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.nav-rail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 88px;
  padding: var(--space-md) var(--space-sm);
  background: var(--md-surface-container-low);
  border-right: 1px solid var(--md-outline-variant);
  flex-shrink: 0;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 4px;
  border-radius: var(--radius-md);
  color: var(--md-on-surface-variant);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: background var(--transition-fast), color var(--transition-fast);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-item:hover {
  background: color-mix(in srgb, var(--md-on-surface) 6%, transparent);
}

.nav-item.active {
  color: var(--md-on-secondary-container);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--md-secondary-container);
  z-index: -1;
}

.nav-icon {
  display: flex;
  position: relative;
  z-index: 1;
}

.badge {
  position: absolute;
  top: 6px;
  right: 14px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 720px) {
  .app-body {
    flex-direction: column-reverse;
  }
  .nav-rail {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 6px var(--space-sm) calc(6px + env(safe-area-inset-bottom));
    border-right: none;
    border-top: 1px solid var(--md-outline-variant);
    overflow-x: auto;
  }
  .nav-item {
    flex: 1;
    padding: 8px 4px;
    border-radius: var(--radius-lg);
    min-width: 56px;
  }
  .nav-item.active::before {
    top: auto;
    bottom: auto;
    width: 56px;
    height: 32px;
    border-radius: var(--radius-full);
  }
  .badge { right: calc(50% - 24px); }
  .page-title { display: none; }
}
</style>
