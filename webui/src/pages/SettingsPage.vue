<script setup lang="ts">
import Live2DPanel from '../components/settings/Live2DPanel.vue'
import LifeSettingsPanel from '../components/LifeSettingsPanel.vue'
import AboutPanel from '../components/AboutPanel.vue'
import UpdatesPanel from '../components/UpdatesPanel.vue'
import ProviderPanel from '../components/ProviderPanel.vue'
import GeneralPanel from '../components/GeneralPanel.vue'
import NavIcon from '../components/NavIcon.vue'
import SettingsField from '../components/SettingsField.vue'
import ConnectionPanel from '../components/ConnectionPanel.vue'
import PersonaPanel from '../components/PersonaPanel.vue'
import PermissionsPanel from '../components/PermissionsPanel.vue'
import SecurityPanel from '../components/SecurityPanel.vue'
import McpPanel from '../components/McpPanel.vue'
import DangerPanel from '../components/DangerPanel.vue'
import PluginModulePane from '../components/PluginModulePane.vue'
import PathPicker from '../components/PathPicker.vue'
import { useSettingsPage } from '../composables/useSettingsPage'

const {
  wizard,
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
  sectionTestMsg,
  live2dSaving,
  availableModels,
  modelOptions,
  testPluginSection,
  evolveDialog,
  evolveBusy,
  evolveMsg,
  openEvolveDialog,
  closeEvolveDialog,
  confirmEvolve,
  pickerField,
  pickerOpen,
  pickerTitle,
  pickerInitial,
  applyPickedPath,
  moduleTab,
  savePatchFields,
  saveSection,
  deleteModel,
  saveLive2DNow,
  onFolderSelected,
  selectTab,
  save,
  t,
  tabMeta,
  isBuiltinTab,
  isPluginSection,
  tabLabel,
  fieldLabel,
  fieldHelp,
  pluginSection,
} = useSettingsPage()

</script>

<template>
  <div class="settings-page">
    <header class="page-header">
      <div>
        <h1>{{ t('settings.title') }}</h1>
        <p class="subtitle">{{ t('settings.pageDesc') }}</p>
      </div>
      <!-- Only the tabs whose state lives in the wizard store are saved here.
           The other panels save themselves (provider/mcp have their own buttons,
           security/permissions/connection apply immediately); a global button
           here used to flash "已保存" without persisting anything. -->
      <button
        v-if="activeTab === 'persona' || activeTab === 'live2d'"
        class="btn btn-primary"
        @click="save"
      >
        <span v-if="saved">{{ t('settings.saved') }}</span>
        <span v-else>{{ t('settings.save') }}</span>
      </button>
    </header>

    <div class="settings-layout">
      <nav class="settings-nav" aria-label="settings categories">
        <template v-for="group in navGroups" :key="group.id">
        <p class="nav-group">{{ group.label }}</p>
        <button
          v-for="tab in group.tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          :aria-current="activeTab === tab.id ? 'true' : undefined"
          :data-tab-id="tab.id"
          :title="tabLabel(tab.id)"
          :aria-label="tabLabel(tab.id)"
          @click="selectTab(tab.id)"
        >
          <span class="nav-indicator"></span>
          <span class="nav-icon" aria-hidden="true">
            <NavIcon :name="tab.icon || 'chip'" :size="20" />
          </span>
          <span class="nav-label">{{ tabLabel(tab.id) }}</span>
        </button>
        </template>
      </nav>

      <section class="settings-content">
        <Transition name="tab" mode="out-in">
                <GeneralPanel v-if="activeTab === 'general'" key="general" />

                <ConnectionPanel v-else-if="activeTab === 'connection'" key="connection" />

                <!-- One element, not a template with two children: <Transition> rejects
                     a fragment, and a dev-server compile of the old shape failed with
                     "expects exactly one child element or component". -->
                <div v-else-if="activeTab === 'provider'" key="provider" class="tab-stack">
          <ProviderPanel />

                    <div
            v-if="pluginSection('provider')?.fields?.length"
            class="content-card provider-runtime"
          >
            <h3>{{ pluginSection('provider')!.label }}</h3>
            <p v-if="pluginSection('provider')!.description" class="helper-text">
              {{ pluginSection('provider')!.description }}
            </p>
            <SettingsField
              v-for="f in pluginSection('provider')!.fields"
              :key="f.key"
              :field="f"
              :label="f.label"
              :help="f.help"
              :model-value="sectionDrafts.provider?.[f.key]"
              :section-id="'provider'"
              :model-options="modelOptions"
              :available-models="availableModels"
              @update:model-value="sectionDrafts = { ...sectionDrafts, provider: { ...sectionDrafts.provider, [f.key]: $event } }"
              @browse="pickerField = f.key"
            />
            <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
            <div class="actions-row">
              <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="saveSection('provider')">
                {{ t('settings.save') }}
              </button>
            </div>
          </div>
        </div>

                <PersonaPanel v-else-if="activeTab === 'persona'" />

                <Live2DPanel
                  v-else-if="activeTab === 'live2d'" key="live2d"
                  :enabled="wizard.live2d.enabled" :model-url="wizard.live2d.modelUrl"
                  :uploaded="uploadedModels" :msg="uploadMsg" :saving="live2dSaving"
                  @update:enabled="wizard.live2d.enabled = $event"
                  @update:model-url="wizard.live2d.modelUrl = $event"
                  @save="saveLive2DNow" @upload="onFolderSelected" @delete="deleteModel"
                />

                <SecurityPanel v-else-if="activeTab === 'security'" />

                  <PermissionsPanel v-else-if="activeTab === 'permissions'" />
          <McpPanel v-else-if="activeTab === 'mcp'" />

                <LifeSettingsPanel v-else-if="activeTab === 'life_settings'" />

                <div
          v-else-if="isPluginSection(activeTab) && pluginSection(activeTab)"
          :key="`section-${activeTab}`"
          class="content-card"
        >
          <h2>{{ pluginSection(activeTab)!.label }}</h2>
          <p v-if="pluginSection(activeTab)!.description" class="card-desc">
            {{ pluginSection(activeTab)!.description }}
          </p>
                    <p
            v-if="pluginSection(activeTab)!.plugin_name && pluginSection(activeTab)!.plugin_name !== activeTab"
            class="helper-text"
          >
            {{ t('settings.pluginProvidedBy', { name: pluginSection(activeTab)!.plugin_name }) }}
          </p>

          <SettingsField
            v-for="f in pluginSection(activeTab)!.fields.filter(x => x.type !== 'test')"
            :key="f.key"
            :field="f"
            :label="f.label"
            :help="f.help"
            :model-value="sectionDrafts[activeTab]?.[f.key]"
            :section-id="activeTab"
            :model-options="modelOptions"
            :available-models="availableModels"
            @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }"
            @browse="pickerField = f.key"
          />
          <div
            v-for="f in pluginSection(activeTab)!.fields.filter(x => x.type === 'test')"
            :key="f.key"
            class="field"
          >
            <label>{{ f.label }}</label>
            <div class="actions-row">
              <button class="btn btn-tonal" type="button" :disabled="sectionTesting" @click="testPluginSection(activeTab)">
                {{ sectionTesting ? t('settings.testing') : (f.label || t('settings.test')) }}
              </button>
              <span v-if="sectionTestMsg" class="helper-text">{{ sectionTestMsg }}</span>
            </div>
            <p v-if="f.help" class="helper-text">{{ f.help }}</p>
          </div>

          <div
            v-for="f in pluginSection(activeTab)!.fields.filter(x => x.type === 'action')"
            :key="f.key"
            class="field"
          >
            <label>{{ f.label }}</label>
            <div class="actions-row">
              <button
                class="btn btn-tonal"
                type="button"
                :disabled="evolveBusy || String(sectionDrafts[activeTab]?.self_evolve_enabled) !== 'true'"
                @click="openEvolveDialog"
              >{{ f.label }}</button>
              <span v-if="evolveMsg" class="helper-text">{{ evolveMsg }}</span>
            </div>
            <p v-if="f.help" class="helper-text">{{ f.help }}</p>
          </div>

          <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="saveSection(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

                <PluginModulePane
          v-else-if="moduleTab"
          :key="moduleTab"
          :module="moduleTab || ''"
        />

                <div
          v-else-if="!isBuiltinTab(activeTab) && tabMeta(activeTab)?.fields?.length"
          :key="`patch-${activeTab}`"
          class="content-card"
        >
          <h2>{{ tabLabel(activeTab) }}</h2>
          <p v-if="tabMeta(activeTab)?.descriptionKey" class="card-desc">
            {{ t(tabMeta(activeTab)!.descriptionKey!) }}
          </p>
          <p v-else-if="tabMeta(activeTab)?.description" class="card-desc">
            {{ tabMeta(activeTab)!.description }}
          </p>

          <SettingsField
            v-for="f in tabMeta(activeTab)!.fields"
            :key="f.key"
            :field="f"
            :label="fieldLabel(tabMeta(activeTab), f.key, `settings.${f.key}`)"
            :help="fieldHelp(tabMeta(activeTab), f.key, `settings.${f.key}Desc`)"
            :model-value="sectionDrafts[activeTab]?.[f.key]"
            :section-id="activeTab"
            :model-options="modelOptions"
            :available-models="availableModels"
            @update:model-value="sectionDrafts[activeTab] = { ...sectionDrafts[activeTab], [f.key]: $event }"
            @browse="pickerField = f.key"
          />

          <div v-if="sectionMsg" class="helper-text" :class="sectionMsgKind === 'error' ? 'msg-error' : 'msg-success'" role="status">{{ sectionMsg }}</div>
          <div class="actions-row">
            <button class="btn btn-primary" type="button" :disabled="sectionSaving" @click="savePatchFields(activeTab)">
              {{ t('settings.save') }}
            </button>
          </div>
        </div>

        <AboutPanel v-else-if="activeTab === 'about'" key="about" />
        <UpdatesPanel v-else-if="activeTab === 'updates'" key="updates" />

                <DangerPanel v-else-if="activeTab === 'danger'" key="danger" />

                <div v-else key="unknown" class="content-card tab-unknown">
          <p>{{ t('settings.tabNotFound') }}</p>
        </div>
        </Transition>
      </section>
    </div>

        <PathPicker
      v-model:open="pickerOpen"
      :initial="pickerInitial"
      :title="pickerTitle"
      @pick="applyPickedPath"
    />

    <div v-if="evolveDialog" class="dialog-veil" role="dialog" aria-modal="true" :aria-label="t('settings.evolveConfirmTitle')">
      <div class="dialog-card">
        <h2>{{ t('settings.evolveConfirmTitle') }}</h2>
        <p class="helper-text">{{ t('settings.evolveConfirmBody') }}</p>
        <ul class="helper-text">
          <li>{{ t('settings.evolveBoundaryWorktree') }}</li>
          <li>{{ t('settings.evolveBoundaryMain') }}</li>
          <li>{{ t('settings.evolveBoundaryTests') }}</li>
        </ul>
        <p v-if="evolveMsg" class="helper-text msg-error">{{ evolveMsg }}</p>
        <div class="actions-row">
          <button class="btn btn-tonal" type="button" :disabled="evolveBusy" @click="closeEvolveDialog">{{ t('settings.cancel') }}</button>
          <button class="btn btn-primary" type="button" :disabled="evolveBusy" @click="confirmEvolve">
            {{ evolveBusy ? t('settings.evolveStarting') : t('settings.evolveConfirmAction') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

