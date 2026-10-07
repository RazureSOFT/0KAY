# 0KAY UI 排版审查报告

> 审查时间：2026-10-06
> 范围：`webui/`（Vue3 主界面 ~13.7k 行）、`plugin-web/`（agent / life / minecraft 插件页 ~7.8k 行）、`_site/` + `docs/build.py`（文档站）
> 方法：通读全部 `.vue` / `.css` 源码 + 交叉核对宿主 `theme.css` 的 `#app` 层叠链 + 逐条验证选择器特异性
> 结论：**排版基础扎实（令牌体系、响应式、reduced-motion 都齐全），但存在一条贯穿全站的系统性缺陷，以及若干窄屏溢出/裁切问题。**

---

## 0. 根因：一条贯穿全站的层叠缺陷

`webui/src/styles/theme.css:346-359` 定义了：

```css
#app button { min-height: 36px; border-radius: 18px; ... }
```

`#app button` 特异性为 **(1,0,1)**；而组件 `<style scoped>` 编译成 `.x[data-v-hash]`，只有 **(0,2,0)**。
**因此 `#app button` 永远赢。** 任何组件给按钮写的 `height < 36px`、`min-height < 36px`、`border-radius` 全部失效。

`theme.css:393-412` 的注释其实已经承认了这个机制（"adding a rule inside App.vue's `<style scoped>` has NO effect"），但**这条 min-height 例外没有被设计进去**——`SetupWizard.vue:519` 是唯一主动用 `min-height:0` 抵消它的地方（`#app .icon-btn{ min-height:0 }`），可作为全站修复范本。

这一条派生出下面 H1 的全部实例。

---

## 1. 高危：内容不可见 / 不可用

### H1. 小尺寸图标按钮被全局 `min-height:36px` 撑高变形

| 位置 | 声明尺寸 | 实际渲染 | 后果 |
|---|---|---|---|
| `webui/src/components/ChatPanel.vue:532-548` `.remove-img` | 22×22 | **22×36** | 图片删除"×"变成竖椭圆，溢出 56px 缩略图 |
| `webui/src/components/ChatPanel.vue:503-511` `.remove-file` | 行内 | ≥36 高 | 撑高 `.pending-file` 芯片，芯片不再是胶囊 |
| `webui/src/components/ModelsField.vue:58` `.models-actions button` | 28×28 | **28×36** | 模型上/下移按钮变形 |
| `webui/src/components/ProviderPanel.vue:544` `.pp-star` | 30×30 | **30×36** | 收藏星标变形 |
| `webui/src/components/Live2DStage.vue:872-876` `.stage-reset` | 34×34 | **34×36** | 悬浮复位按钮略椭圆（`border-radius:50%` 也被覆盖成 18px） |
| `webui/src/pages/ConsolePage.vue:813-822` `.link` | 行内文本链接 | ≥36 高 | 日志行被撑高（`.row` 是 12px 行高），有 `link` 的行明显比其他行高 |

**修复**：给 `#app button` 的 min-height 加白名单，例如
`#app button { min-height: 36px } #app :is(.icon-btn, .remove-img, .remove-file, .link, button.compact) { min-height: 0 }`，
或统一改为 `#app button:not([data-compact])`。不建议逐个组件加 `#app` 前缀——那会把死代码变成"两套真相"。

### H2. 设置页声明式字段网格在窄屏横向溢出并被裁切

- `webui/src/styles/settings.css:657-662`：`.section-fields { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) }`
- 360px 手机上：视口 360 − 页面内边距 22×2 − 卡片内边距 22×2 = **可用宽仅 272px < 300px**
- `minmax(300px,1fr)` 的最小值不会收缩 → 轨道恒 300px → 溢出 28px
- 而 `settings.css:157` `.content-card { overflow: hidden }` **直接裁掉右侧**，插件设置项被切

**修复**：改为 `repeat(auto-fit, minmax(min(300px, 100%), 1fr))`（或 260px + 单列回退）。

### H3. 连接面板二维码在常见笔电宽度被裁

- `webui/src/components/ConnectionPanel.vue:218-228`：`.connection-grid { grid-template-columns: minmax(280px, 1fr) auto }`，二维码固定 264px → 最小需 ~580px
- 但媒体查询断点只到 **760px**（`:224`）；而设置侧栏要 **800px** 才收起（`settings.css:687-696`）
- 于是 **801–1100px 视口**下内容列只有 ~320–480px，网格必然溢出，`.content-card{overflow:hidden}` 把二维码裁掉 → **扫不了码**

**修复**：`minmax(0,1fr)`；二维码改 `width:100%; max-width:264px`；断点与宿主对齐到 ≥800px。

### H4. plugin-web/agent 整层响应式媒体查询失效

`plugin-web/agent/src/AgentsPage.vue` 的媒体查询规则（`:2209` `.sessions{width:214px}`、`:2252` `.transcript{padding:14px}`、`:2262` `.composer`、`:2296` `.welcome/.turn`，以及 `:2404-2405` 的 560px `.sessions{width:100%}`）编译后是 `.x[data-v]`(0,2,0)，**全部输给宿主 `#app .workspace .x`(≈1,3,0)**。
后果：**窄屏侧栏恒为 296px、内边距完全不收缩**，移动端布局等于没写。

**修复**：媒体查询内也要用 `#app .workspace .x` 前缀。

### H5. life 插件浮动窗列表不滚动，末尾内容不可达

`plugin-web/life/src/SocialWindow.vue:295` `.list-body { flex:1; overflow-y:auto }` **缺 `min-height:0`**（同文件 `:313` 的 `.thread` 有）。
`.panel`(`:286`) 是固定高 + `overflow:hidden` 的列 flex，`auto` 的 min-height 让列表保持内容高度 → 被面板裁掉 → 最后几条会话永远看不到。

**修复**：加 `min-height:0`。

### H6. life 人设多行输入框被死规则钉死在 70px

`plugin-web/life/src/CompanionPage.vue:1458` `.pfield textarea.field { height:auto; ... }` 输给 `plugin-web/life/src/kit.ts:209` 的 `#app .pcp .field { height:52px }`（ID 特异性）。
后果：人设页 `:926-929` 的 rows 2–5 多行 textarea 实际固定 70px，**长人设文本被裁**。
（`MemoryPage.vue:563` 用 `#app .pmp .pfield textarea.field{height:auto}` 写对了，可直接照搬。）

---

## 2. 中危：视觉错位 / 文字硬裁 / 反馈失效

### M1. 移动端聊天抽屉没有滑入动画（过渡是死的）
`webui/src/pages/ChatPage.vue:164` 用 `v-show="showStatus || !isMobile"`，`:163` 同时挂 `.open`。
两者由同一变量驱动 → 同一帧内 `display:none → flex` 且 `transform:100% → 0`，**`transition: transform` 永不播放**，抽屉"闪现"而非滑入。
**修复**：改用 `v-if` + `<Transition>`，或始终 `display:flex` 只切换 `.open`。

### M2. flex 容器上误用 `text-overflow: ellipsis`（省略号不生效，只硬裁）
`ellipsis` 只对块容器生效；flex 容器的文本是匿名 flex 项，省略号被忽略。

- `webui/src/components/MessageBubble.vue:171-185` `.msg-file`（`display:inline-flex`）
- `webui/src/components/ChatPanel.vue:487-501` `.pending-file`
- `webui/src/components/UpdatesPanel.vue:431` `.us-name`、`:441-449` `.us-status`
- `plugin-web/agent/src/ToolStepCard.vue:497`
- `plugin-web/agent/src/AgentsPage.vue:2147` `.attach-chip`、`:2140` `.slash-desc`（后者还缺 `min-width:0`）

**修复**：内层再包一个 `display:block; min-width:0; overflow:hidden` 的 `span` 承载文本。

### M3. UsagePage 14 天柱状图 X 轴标签互相压叠
`webui/src/pages/UsagePage.vue:371` `.axis span { flex:1; min-width:0; white-space:nowrap }`。
360px 屏：图表宽 ≈ 276 − 34(左侧刻度) = 242px ÷ 14 列 ≈ **17px/列**，而 `"10/06"` 11px 字号约 **30px** → 相邻标签重叠。
**修复**：窄屏降到 `font-size:10px` + 隔一显示，或标签旋转 45°，或改周聚合。

### M4. 设置页 ≤800px 导航变纯图标且无任何提示
`webui/src/styles/settings.css:694` `.nav-label { display: none }`（≤800px 生效）。
`webui/src/pages/SettingsPage.vue:378-386` 的 `<button>` **没有 `title` 也没有 `aria-label`**（只有 `aria-current`）。
后果：窄屏下用户只看到一排锁/齿轮/盾牌图标，**无法知道哪个是"供应商"、哪个是"危险区"**；读屏也读不出。
**修复**：加 `:title="tabLabel(tab.id)"` 和 `:aria-label`。

### M5. 文档站宽表格无横向滚动，窄屏被裁
`docs/build.py:117-121`：`table { width:100%; ... overflow:hidden }`，**没有 `display:block; overflow-x:auto`**。
API 文档（`HTTP_API.md` / `PLUGIN_API.md`）大量宽表 → 窄屏列被裁或撑破 `.article`。
对比：`webui/src/components/MarkdownContent.vue:14` 写对了（`display:block; overflow:auto`）。
**修复**：加 `display:block; overflow-x:auto; max-width:100%`。

### M6. 文档站 `<html lang="en">` 但正文是中文
`docs/build.py:252` 硬编码 `lang="en"`，而 `docs/*.md` 与生成的导航标题都是中文。
影响字体回退、CJK 断行规则、读屏发音。
**修复**：改 `lang="zh-CN"`（或按源文件判断）。

### M7. 插件页长串文本缺换行保护
- `plugin-web/life/src/AdapterSettingsPage.vue:343-350,439`：`${ws_host}:${ws_port}${ws_path}`、`HTTP {{http_url}}`、`{{ r.pattern }}` 正则，均无 `overflow-wrap` → 撑破卡片
- `plugin-web/life/src/kit.ts:181` `.meta`、`:260-267` `.lsp .rule-row code` 同样缺
- `plugin-web/life/src/MemoryPage.vue:585` `.memory-content{white-space:pre-wrap}` 缺 `overflow-wrap` → 长 URL/hash 溢出（同文件 `:618/:626` 已有正确写法）
- `plugin-web/life/src/CompanionPage.vue:1466` `.som-chan{grid-template-columns:52px 1fr 48px}` + `.som-chan-name` 无换行 → 长本地化名（如 "Cardiorespiratory"）溢出到条形图
- `plugin-web/life/src/kit.ts:175,198` `.card > h3{display:flex}` 无 `flex-wrap`，`CompanionPage.vue:1048` 在长标题后放两个 pill → 窄屏挤压溢出
- `webui/src/components/ConnectionPanel.vue:178-182` `.helper-text` 内 `<code>{{baseUrl}}</code>`、`Core:{{coreId}}` 无 `overflow-wrap`
- `webui/src/components/UpdatesPanel.vue` 表格 `minmax(0,…)` 用对了，但 `.us-repo`(`:454`) 是 `nowrap`

### M8. App.vue 的 `<style scoped>` 有约 180 行死代码，且值与实际渲染不符
`webui/src/App.vue:432-652` 的 `.app-header / .nav-rail / .nav-item / .page-title / .brand-mark / .header-actions / .app-main / .app-shell` 全部被 `theme.css:413-463` 的 `#app` 规则覆盖。
两处值互相矛盾：

| 属性 | App.vue 声明（无效） | theme.css 实际生效 |
|---|---|---|
| `.app-header` 高度 | `:436` 64px | `:414` 76px |
| `.nav-rail` 宽 | `:543` 88px | `:432` 100px |
| `.nav-item` padding / 圆角 | `:558-559` 12px 4px / radius-md | `:437-439` 9px 6px / 24px |
| `.brand-mark` 字号 | `:455` 20px | `:424` 22px |
| `.page-title` 字号 / 字重 | `:464-465` 14px / 500 | `:428` 17px / 650 |
| `.app-main` | `:615` 仅 flex | `:463` 额外 30px 圆角 + 背景 + 阴影 |

**后果**：后续维护者改 App.vue 看不到任何效果，且会误判当前设计值。
**修复**：删除 App.vue 中被覆盖的声明（保留未被覆盖的 `display/justify-content/user-select/border-bottom/z-index` 等），只留 theme.css 一处真相。

### M9. 大量组件被 `#app` 覆盖成死声明
| 文件:行 | 死声明 | 被谁覆盖 |
|---|---|---|
| `webui/src/pages/ConsolePage.vue:524,527,616,619` | `.tab/.btn` min-height 34px、radius-full | `#app button` → 36px / 18px |
| `webui/src/pages/ConsolePage.vue:590,593` | `.input` min-height 34px、radius-sm | `#app :is(input…)` → 14px |
| `webui/src/pages/PluginsPage.vue:692-697` | `.btn` 形状 | 同上 |
| `webui/src/components/AboutPanel.vue:195,198,201`、`UpdatesPanel.vue:249,257,337` | `.btn.sm/.xs` 34/30px | `settings.css:47` → **52px** |
| `webui/src/components/McpPanel.vue:323,342-352` | `.mcp-remove`/`.btn` radius、44px | `#app button` |
| `webui/src/components/PluginModuleHost.vue:217-232` | `.btn` 38px | `#app button`（`<a>` 侧不受影响 → 同排差 2px） |
| `webui/src/components/LifeSettingsPanel.vue:287,298` | `.ls-model` 20px 圆角、选中缺角形变 | `#app button` → 18px，**形变提示永不渲染** |
| `webui/src/components/PinInput.vue:136` | `@media ≤420px .pin-box{radius:11px}` | `#app :is(input…)` → 14px |
| `plugin-web/life/src/kit.ts:162,164,185,187,194` | `.btn/.field` 高度 | 同文件 `:209-214` 的 `#app` 层 |
| `plugin-web/minecraft/src/MinecraftPage.vue:474-481` | `#app .mc .url{width:238px}` | 模板里根本没有 `.url` 类 → 纯死 CSS |

**特别提示**：`AboutPanel` / `UpdatesPanel` 的紧凑按钮（`.sm/.xs`，自写 34/30px）与同排的 `.btn-tonal.sm`（只受 36px）**实际渲染高度 52px vs 36px**，按钮明显错位。

### M10. `ThinkingSlider.vue` 的 `<style>` 没加 `scoped`，类名全局泄漏
`plugin-web/agent/src/ThinkingSlider.vue:43` `<style>`（无 scoped），`.thinking-control/.thinking-popover/.thinking-stops` 变成全局类，与 `webui/src/components/ThinkingSlider.vue` 同名类**互相污染**。
**修复**：加 `scoped`（或统一加前缀）。

---

## 3. 低危：一致性 / 令牌漂移

### L1. 设计令牌被大面积绕过
`theme.css:94-99` 定义了 `--radius-xs/sm/md/lg/xl = 12/16/22/28/36px`、`--space-xs…xxl = 4/8/12/16/24/32px`。
但组件里实际写的是 **18/20/23/24/26/30/32/34px** 圆角与 **2/3/5/6/7/10/11/13/14/15/18/20/22px** 间距。
典型：`settings.css` 通篇 18/20/22/24/26px；`UsagePage.vue:302,335,350,376` 26/32px；`PluginsPage.vue:600,611` 24/28px；`App.vue:685,719` 28px。
`plugin-web/life/src/kit.ts:101` 定义了 `--r-xs…xl`，但调用点仍写 18px(`:121`)/16px(`:209`)/12px；`--r-xs` 从未被使用。
**后果**：圆角尺度实际有 3 套并存（令牌值 / 组件魔法值 / 文档站又一套 12/16/24/28），视觉上"略微不齐"却难以定位。

### L2. `text-transform: uppercase` / `letter-spacing` 对中文是空操作
`settings.css:184` `.field label`、`StatusPanel.vue:380` `.section-title`、`UsagePage.vue:314` `.donut-center span`、`PluginsPage.vue:658` `.plugin-meta dt`、`docs/build.py:123` `th`、`Live2DStage.vue:859` `text-transform: capitalize`。
对 CJK 无效，只在英文/中文混排时让基线略乱。

### L3. 应用与文档站是两套设计系统
| | WebUI | 文档站 |
|---|---|---|
| 主色 | `#5944c6`（紫） | `#4a5b8c`（蓝） |
| 圆角尺度 | 12/16/22/28/36 | 12/16/24/28 |
| 字体平滑 | **明确禁用** `-webkit-font-smoothing`（`theme.css:164-166` 有解释：Windows 上会关掉 ClearType 让字发虚） | 启用了（`docs/build.py:59`）→ 文档字比应用虚 |

### L4. 全局类名复用风险
`ConsolePage.vue:615`、`PluginsPage.vue:692` 自己定义了 `.btn`；`ConsolePage.vue:589` 定义了 `.input` —— 与 `theme.css:185,228` 的全局 `.btn` / `.input` 同名，仅靠 scoped 特异性勉强共存，任何一次去掉 `scoped` 或调整层叠都会崩。

### L5. StatusPanel 有一大片永不渲染的死分支
`webui/src/components/StatusPanel.vue:129-131` 只保留 `kind === 'mood' || 'bars'`，
但模板 `:222-313` 的 `bar / count / tasks / list / memory / connection / kv` 分支，以及 `:76-116` 的 memory 轮询逻辑（`fetchMemory` / `memoryStats` / `memories` / `scheduleMemoryPoll`）**永远不会被触发**。
约 120 行死代码 + 无用的网络轮询。

### L6. 其他
- `plugin-web/life/src/CompanionPage.vue:1424,1426,1429,1431` `z-index: var(--z-overlay)` **无兜底值**，宿主未定义时静默变 `auto`（同项目 kit 用的是 `var(--z-panel,3000)`，不一致）
- `plugin-web/life/src/SocialWindow.vue:29-35,60-62` 浮动面板从 localStorage 恢复宽高，只 clamp 了 x/y 没 clamp w/h → 宽屏设的尺寸在窗口变窄后跑出屏幕
- `plugin-web/life/src/MemoryPage.vue:541` `.stat-grid{repeat(4,1fr)}` 只有 900px 一步降 2 列，无 1 列回退；建议 `repeat(auto-fit,minmax(180px,1fr))`
- `plugin-web/life/src/kit.ts:177-178` `.grid2{1fr 1fr}` / `.grid3{repeat(3,1fr)}` 未用 `minmax(0,1fr)`
- `webui/src/components/SetupWizard.vue:644` `.form-row{1fr 1fr}` 在 ≤860px 单列布局下仍两列（PIN 行有 640px 回退，form-row 没有）→ 360px 屏每格约 148px
- `webui/src/pages/UsagePage.vue:33` 调色板硬编码 hex，不随主题令牌走
- `webui/src/pages/PluginsPage.vue:607` `.plugin-grid{minmax(312px,1fr)}` 在 320px 视口（可用 276px）会溢出
- `plugin-web/agent/src/AgentsPage.vue:2131` 输入框 `padding-right:124px` 只够 2 个 46px 悬浮按钮，`runningTasks.length>1` 时渲染第 3 个 `.stop-all`（需 154px）→ 绝对定位按钮压住正文
- `plugin-web/agent/src/FileViewer.vue:177` `.sheet-grid td{max-width:340px; text-overflow:ellipsis}` 但表格是 auto 布局 → `max-width` 对 td 不可靠，宽表横向溢出

---

## 4. 建议的修复顺序

1. **先修 H1**（`theme.css:349` 加小按钮白名单）——一条改动消掉 6 处按钮变形。
2. **再修 H2/H3/M4**（设置页三处窄屏问题）——都在 `settings.css` + `SettingsPage.vue`，改完移动端体验立刻正常。
3. **H4/H5/H6**（plugin-web 三处）——插件页目前窄屏基本不可用。
4. **M1/M2**（动画与省略号）——低成本、可感知。
5. **M8/M9/M10 + L1**（死代码与令牌收敛）——需要一次专项清理，建议先删 App.vue 的死声明并给 `theme.css` 的层叠注释补上"min-height 例外"这一条。

## 5. 做得好的地方（不要动）

- `theme.css` 的令牌体系、`--z-*` 层叠刻度、`prefers-reduced-motion` 全局降级（`:641-668`）设计完整。
- `AppSelect.vue:22-31` 的 `layout()` 正确处理了视口边界、向上翻转、maxHeight，是教科书级的自定义下拉。
- `MarkdownContent.vue:14-15` 宽表/代码块用 `display:block; overflow:auto`，是正确写法（文档站应照抄）。
- `SetupWizard.vue` 全篇用 `#app` 前缀 + 显式 `min-height:0`，是**唯一完全避开层叠陷阱的组件**，应作为全站范本。
- `ChatPanel.vue:190-202` 的"仅在接近底部时自动滚动"、`:60-67` 的 IME 回车保护，都是细节到位的实现。
- `ModalShell.vue` 统一了 5 处手写弹窗的焦点陷阱/Escape/焦点恢复，方向正确。
