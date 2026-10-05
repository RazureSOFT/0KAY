import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { emotionMoodColor, emotionMoodOf } from '../emotion'

export interface EmotionState {
  valence: number
  arousal: number
  connection: number
  irritation: number
}

export interface LifeState {
  emotion: EmotionState
  mentalEnergy: number
  isSleeping: boolean
  activeTasks: string[]
  onlineAgents?: number
  totalAgents?: number
  pluginCount?: number
  healthyPlugins?: number
}

/**
 * Platform + persona state. Sole source is Core's `/api/state`
 * (Core merges registry agents/plugins with Life emotion via gRPC).
 * Do not treat WS/life stream payloads as authoritative — they only
 * trigger a Core refresh.
 */
export const useLifeStore = defineStore('life', () => {
  const emotion = ref<EmotionState>({
    valence: 0.0,
    arousal: 0.5,
    connection: 0.5,
    irritation: 0.0,
  })

  const mentalEnergy = ref(100)
  const isSleeping = ref(false)
  const activeTasks = ref<string[]>([])
  const onlineAgents = ref(0)
  const totalAgents = ref(0)
  const pluginCount = ref(0)
  const healthyPlugins = ref(0)
  const isConnected = ref(false)
  const source = ref<'core' | 'none'>('none')
  const lastFetchedAt = ref(0)

  const emotionMood = computed(() => {
    if (isSleeping.value) return 'sleeping'
    if (mentalEnergy.value < 20) return 'exhausted'
    if (mentalEnergy.value < 50) return 'drowsy'
    return emotionMoodOf(emotion.value)
  })

  const emotionColor = computed(() => {
    switch (emotionMood.value) {
      case 'sleeping': return '#8a8886'
      case 'exhausted': return '#a19f9d'
      case 'drowsy': return '#ffb900'
      default: return emotionMoodColor(emotionMoodOf(emotion.value))
    }
  })

  const energyPercent = computed(() => Math.round(mentalEnergy.value))

  const energyColor = computed(() => {
    if (mentalEnergy.value > 70) return '#107c10'
    if (mentalEnergy.value > 40) return '#ffb900'
    return '#d13438'
  })

  let pollTimer: ReturnType<typeof setInterval> | null = null

  function connect() {
    fetchState()
    if (pollTimer) clearInterval(pollTimer)
    pollTimer = setInterval(fetchState, 5000)
  }

  function disconnect() {
    if (pollTimer) clearInterval(pollTimer)
    pollTimer = null
    isConnected.value = false
    source.value = 'none'
  }

  /** Always pull platform state from Core. */
  async function fetchState() {
    try {
      // Prefer /api/state (platform aggregate); fall back to legacy path.
      let response = await fetch('/api/state')
      if (response.status === 404) {
        response = await fetch('/api/life/state')
      }
      if (response.ok) {
        const data = await response.json()
        updateState(data)
        isConnected.value = true
        source.value = 'core'
        lastFetchedAt.value = Date.now()
      } else {
        isConnected.value = false
      }
    } catch {
      isConnected.value = false
      source.value = 'none'
    }
  }

  function updateState(data: Partial<LifeState>) {
    if (data.emotion) {
      emotion.value = data.emotion
    }
    if (data.mentalEnergy !== undefined) {
      mentalEnergy.value = data.mentalEnergy
    }
    if (data.isSleeping !== undefined) {
      isSleeping.value = data.isSleeping
    }
    if (data.activeTasks) {
      activeTasks.value = data.activeTasks
    }
    if (data.onlineAgents !== undefined) {
      onlineAgents.value = data.onlineAgents
    }
    if (data.totalAgents !== undefined) {
      totalAgents.value = data.totalAgents
    }
    if (data.pluginCount !== undefined) {
      pluginCount.value = data.pluginCount
    }
    if (data.healthyPlugins !== undefined) {
      healthyPlugins.value = data.healthyPlugins
    }
  }

  /**
   * Life/stream hint only — never write emotion into the store.
   * Always re-read from Core so state is not "life's private copy".
   */
  function updateFromMessage(_data: any) {
    void fetchState()
  }

  return {
    emotion,
    mentalEnergy,
    isSleeping,
    activeTasks,
    onlineAgents,
    totalAgents,
    pluginCount,
    healthyPlugins,
    isConnected,
    source,
    lastFetchedAt,
    emotionMood,
    emotionColor,
    energyPercent,
    energyColor,
    connect,
    disconnect,
    fetchState,
    updateState,
    updateFromMessage,
  }
})
