// Keys for the two settings sections that Core and mocr register over gRPC.
//
// Run: node scripts/add-core-section-keys.mjs
//
// These sections carry literal labels because the protobuf SettingsSection has
// no key fields. Rather than change the wire format, the WebUI resolves them by
// id (settings.tabs.<id>, settings.sections.<id>.desc,
// settings.fields.<id>.<key>.{label,help}), falling back to the server's literal
// when a key is absent. The server keeps owning the section; the WebUI owns how
// it is worded, which is what makes it translatable.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { parseStringsXml, renderStringsXml } from './i18n.mjs'

const ADD = {
  en: {
    'settings.tabs.search': 'Search',
    'settings.tabs.mocr': 'Models',
    'settings.sections.mocr.desc': "mocr's model-selection strategy and runtime knobs. Provider credentials and the model catalog live under Provider.",
    'settings.fields.search.engine.label': 'Search engine',
    'settings.fields.search.engine.help': 'Default cnbing (China Bing); bing / 360 / duckduckgo can be selected.',
    'settings.fields.mocr.model_strategy.label': 'Model selection strategy',
    'settings.fields.mocr.model_strategy.help': 'auto = pick by difficulty and cost; quality = prefer thinking models; cost = cheapest usable; pinned = always the default model above (requires one).',
    'settings.fields.mocr.default_model.label': 'Default model',
    'settings.fields.mocr.default_model.help': 'Empty = choose with the strategy above. Once set, this model is always used.',
    'settings.fields.mocr.max_retries.label': 'Max retries',
    'settings.fields.mocr.max_retries.help': 'Retries of the same model on a transient provider error (429 / 5xx / timeout), 0-5. The model is only switched after those are exhausted.',
    'settings.fields.mocr.stream_idle_timeout_sec.label': 'SSE idle timeout (s)',
    'settings.fields.mocr.stream_idle_timeout_sec.help': 'Close the stream after N seconds with no data.',
    'settings.fields.mocr.auto_switch_model.label': 'Switch model on failure or empty reply',
    'settings.fields.mocr.auto_switch_model.help': 'Try another model when the provider errors or returns an empty reply. Never retried once content has been sent.',
    'settings.fields.mocr.switch_max_attempts.label': 'Max model switches',
    'settings.fields.mocr.switch_max_attempts.help': 'How many candidate models one generation may switch through, 0-5.',
    'settings.fields.mocr.fallback_models.label': 'Fallback models',
    'settings.fields.mocr.fallback_models.help': "Pick from the model catalog; empty = try the provider's catalog order.",
    'settings.fields.mocr.model_prices.label': 'Model price overrides',
    'settings.fields.mocr.model_prices.help': 'You supply the prices; there is no built-in price list. JSON: {"model-fragment":{"in":in-price,"out":out-price,"per_call":per-call}} in USD per million tokens (per_call = a flat per-request price). Models left out are estimated from the name.',
  },
  zh: {
    'settings.tabs.search': '搜索',
    'settings.tabs.mocr': '模型',
    'settings.sections.mocr.desc': 'mocr 的模型选择策略与运行参数（供应商凭证与模型目录在「供应商」标签）',
    'settings.fields.search.engine.label': '搜索引擎',
    'settings.fields.search.engine.help': '默认 cnbing（中国区 Bing）；可切换 bing / 360 搜索 / duckduckgo',
    'settings.fields.mocr.model_strategy.label': '模型选择策略',
    'settings.fields.mocr.model_strategy.help': 'auto=按难度与成本自动选型；quality=质量优先（倾向 thinking 模型）；cost=成本优先（用最便宜可用模型）；pinned=只用上面的默认模型（需填默认模型）',
    'settings.fields.mocr.default_model.label': '默认模型',
    'settings.fields.mocr.default_model.help': '留空 = 按上面的模型选择策略智能选型；选择后固定使用该模型',
    'settings.fields.mocr.max_retries.label': '最大重试次数',
    'settings.fields.mocr.max_retries.help': '供应商瞬时错误（429 / 5xx / 超时）时的同模型重试次数（0-5），失败后才会切换模型',
    'settings.fields.mocr.stream_idle_timeout_sec.label': 'SSE 空闲超时（秒）',
    'settings.fields.mocr.stream_idle_timeout_sec.help': '超过 N 秒无数据则关闭流',
    'settings.fields.mocr.auto_switch_model.label': '失败/不回复时自动切换模型',
    'settings.fields.mocr.auto_switch_model.help': '供应商报错或返回空回复时自动换一个模型重试（已发出内容则不重试）',
    'settings.fields.mocr.switch_max_attempts.label': '最大切换次数',
    'settings.fields.mocr.switch_max_attempts.help': '单次生成最多允许切换几个候选模型（0-5）',
    'settings.fields.mocr.fallback_models.label': '备选模型',
    'settings.fields.mocr.fallback_models.help': '从模型目录中选择；留空 = 按供应商目录顺序依次尝试',
    'settings.fields.mocr.model_prices.label': '模型价格覆盖',
    'settings.fields.mocr.model_prices.help': '价格由你自己填写，无内置价表。JSON：{"模型片段":{"in":输入价,"out":输出价,"per_call":单次价}}，单位 USD/百万 token（per_call = 每次请求固定价）。未填写的模型按模型名粗略估算。',
  },
  ja: {
    'settings.tabs.search': '検索',
    'settings.tabs.mocr': 'モデル',
    'settings.sections.mocr.desc': 'mocr のモデル選択戦略と実行パラメーター（プロバイダー認証情報とモデル一覧は「プロバイダー」タブにあります）。',
    'settings.fields.search.engine.label': '検索エンジン',
    'settings.fields.search.engine.help': '既定は cnbing（中国向け Bing）。bing / 360 / duckduckgo に切り替えられます。',
    'settings.fields.mocr.model_strategy.label': 'モデル選択戦略',
    'settings.fields.mocr.model_strategy.help': 'auto＝難易度とコストで自動選択；quality＝thinking モデル優先；cost＝最安の利用可能モデル；pinned＝上の既定モデルのみ使用（要設定）。',
    'settings.fields.mocr.default_model.label': '既定モデル',
    'settings.fields.mocr.default_model.help': '空欄＝上の戦略で選択。設定すると常にそのモデルを使用します。',
    'settings.fields.mocr.max_retries.label': '最大リトライ回数',
    'settings.fields.mocr.max_retries.help': 'プロバイダーの一時的エラー（429 / 5xx / タイムアウト）時の同一モデル再試行回数（0-5）。使い切ってからモデルを切り替えます。',
    'settings.fields.mocr.stream_idle_timeout_sec.label': 'SSE アイドルタイムアウト（秒）',
    'settings.fields.mocr.stream_idle_timeout_sec.help': 'N 秒間データがなければストリームを閉じます。',
    'settings.fields.mocr.auto_switch_model.label': '失敗・無応答時にモデルを自動切替',
    'settings.fields.mocr.auto_switch_model.help': 'プロバイダーがエラーを返すか空応答のとき別モデルで再試行します（内容を送出済みなら再試行しません）。',
    'settings.fields.mocr.switch_max_attempts.label': '最大切替回数',
    'settings.fields.mocr.switch_max_attempts.help': '1 回の生成で切り替えられる候補モデル数（0-5）。',
    'settings.fields.mocr.fallback_models.label': '代替モデル',
    'settings.fields.mocr.fallback_models.help': 'モデル一覧から選択。空欄＝プロバイダーの一覧順に試行。',
    'settings.fields.mocr.model_prices.label': 'モデル価格の上書き',
    'settings.fields.mocr.model_prices.help': '価格は自分で入力します（内蔵の価格表はありません）。JSON：{"モデル断片":{"in":入力,"out":出力,"per_call":1回あたり}}、単位は USD/百万トークン。未入力のモデルは名前から概算します。',
  },
  'zh-Hant': {
    'settings.tabs.search': '搜尋',
    'settings.tabs.mocr': '模型',
    'settings.sections.mocr.desc': 'mocr 的模型選擇策略與執行參數（供應商憑證與模型目錄在「供應商」頁籤）。',
    'settings.fields.search.engine.label': '搜尋引擎',
    'settings.fields.search.engine.help': '預設 cnbing（中國區 Bing）；可切換 bing / 360 搜尋 / duckduckgo',
    'settings.fields.mocr.model_strategy.label': '模型選擇策略',
    'settings.fields.mocr.model_strategy.help': 'auto＝依難度與成本自動選型；quality＝品質優先（傾向 thinking 模型）；cost＝成本優先（使用最便宜的可用模型）；pinned＝只用上面的預設模型（需填預設模型）',
    'settings.fields.mocr.default_model.label': '預設模型',
    'settings.fields.mocr.default_model.help': '留空＝依上面的模型選擇策略智慧選型；選擇後固定使用該模型',
    'settings.fields.mocr.max_retries.label': '最大重試次數',
    'settings.fields.mocr.max_retries.help': '供應商瞬時錯誤（429 / 5xx / 逾時）時的同模型重試次數（0-5），用盡後才會切換模型',
    'settings.fields.mocr.stream_idle_timeout_sec.label': 'SSE 閒置逾時（秒）',
    'settings.fields.mocr.stream_idle_timeout_sec.help': '超過 N 秒無資料則關閉串流',
    'settings.fields.mocr.auto_switch_model.label': '失敗／不回覆時自動切換模型',
    'settings.fields.mocr.auto_switch_model.help': '供應商報錯或回傳空回覆時自動換一個模型重試（已發出內容則不重試）',
    'settings.fields.mocr.switch_max_attempts.label': '最大切換次數',
    'settings.fields.mocr.switch_max_attempts.help': '單次生成最多允許切換幾個候選模型（0-5）',
    'settings.fields.mocr.fallback_models.label': '備選模型',
    'settings.fields.mocr.fallback_models.help': '從模型目錄中選擇；留空＝依供應商目錄順序依次嘗試',
    'settings.fields.mocr.model_prices.label': '模型價格覆寫',
    'settings.fields.mocr.model_prices.help': '價格由你自己填寫，無內建價表。JSON：{"模型片段":{"in":輸入價,"out":輸出價,"per_call":單次價}}，單位 USD／百萬 token。未填寫的模型依模型名粗略估算。',
  },
}

const DIRS = { en: 'values', zh: 'values-zh', ja: 'values-ja', 'zh-Hant': 'values-b+zh+Hant' }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'strings')

for (const [locale, additions] of Object.entries(ADD)) {
  const file = path.join(root, DIRS[locale], 'strings.xml')
  const flat = parseStringsXml(await readFile(file, 'utf8'))
  let added = 0
  for (const [key, value] of Object.entries(additions)) {
    if (key in flat) continue
    flat[key] = value
    added++
  }
  await writeFile(file, renderStringsXml(flat), 'utf8')
  console.log(`${locale}: +${added} (${Object.keys(flat).length} total)`)
}
