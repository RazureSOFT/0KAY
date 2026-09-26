export interface Provider {
  id: string
  name: string
  icon: string
  logo?: string
  description: string
  baseUrl: string
  apiKeyUrl: string
  defaultModels: string[]
}

export interface ProviderConfig {
  id: string
  provider: string
  name?: string
  api_key: string
  base_url: string
  models: string[]
  disabled_models?: string[]
  default_model: string
  enabled: boolean
}

export interface PersonaConfig {
  name: string
  avatar: string
  birthDate: string
  description: string
  personality: string
  greeting: string
}

export interface Live2DConfig {
  enabled: boolean
  modelUrl: string
  modelData: File | null
}

export const DEFAULT_LIVE2D_MODELS: { id: string; label: string; url: string }[] = []

export const DEFAULT_LIVE2D_MODEL_URL = ''

export const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    logo: '/providers/openai.svg',
    description: 'GPT-4, GPT-4o, o1 models',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    defaultModels: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    logo: '/providers/anthropic.svg',
    description: 'Claude 3.5 Sonnet, Haiku, Opus',
    baseUrl: 'https://api.anthropic.com',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    defaultModels: ['claude-opus-4-1-20250805', 'claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219', 'claude-3-5-haiku-20241022'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🐋',
    logo: '/providers/deepseek.svg',
    description: 'DeepSeek Chat, DeepSeek Reasoner',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
    defaultModels: ['deepseek-flash', 'deepseek-v4-pro'],
  },
  {
    id: 'kimi',
    name: 'Moonshot AI (Kimi)',
    icon: '🌙',
    logo: '/providers/kimi.svg',
    description: 'Kimi, Moonshot models',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKeyUrl: 'https://platform.moonshot.cn/console/api-keys',
    defaultModels: ['kimi-k3', 'kimi-k2.7-code', 'kimi-k2.7-code-highspeed', 'kimi-k2.6'],
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    icon: '𝕏',
    logo: '/providers/xai.svg',
    description: 'Grok models by xAI',
    baseUrl: 'https://api.x.ai/v1',
    apiKeyUrl: 'https://console.x.ai/',
    defaultModels: ['grok-4.1', 'grok-4.1-fast', 'grok-4', 'grok-3-mini'],
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '⚙️',
    description: 'OpenAI-compatible custom endpoint',
    baseUrl: '',
    apiKeyUrl: '',
    defaultModels: [],
  },
]

export const WIZARD_STEPS = [
  { id: 1, title: 'Language', description: 'Choose your language' },
  { id: 2, title: 'Welcome', description: 'Welcome to 0kay' },
  { id: 3, title: 'Provider', description: 'Select AI provider' },
  { id: 4, title: 'API Key', description: 'Configure API key & URL' },
  { id: 5, title: 'Models', description: 'Select models' },
  { id: 6, title: 'Persona', description: 'Create your persona' },
  { id: 7, title: 'Live2D', description: 'Optional Live2D setup' },
  { id: 8, title: 'Complete', description: 'Finish setup' },
]
