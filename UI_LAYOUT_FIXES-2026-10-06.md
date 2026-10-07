# 0KAY UI 排版修复记录

> 修复时间：2026-10-06
> 依据：`UI_LAYOUT_REVIEW-2026-10-06.md` 的全部条目
> 验证：`webui` 主构建 + 平台插件构建 + 97/97 测试 + eslint 全绿；`plugin-web/{agent,life,minecraft}` 三个插件页构建成功；`docs/build.py` 重新生成 15 个页面

---

## 一、根因修复：全局按钮 min-height（H1）

**`webui/src/styles/theme.css`** — 在 `#app button { min-height: 36px }` 之后新增例外块，用 (1,1,0)+ 的选择器把紧凑控件的盒子赢回来：

```css
#app :is(.remove-img, .remove-file, .link) { min-height: 0; }
#app .models-actions button,
#app .pp-star { min-height: 0; border-radius: 8px; }
#app .stage-reset { min-height: 0; border-radius: 50%; }
```

插件页（不同类名，白名单覆盖不到）在各自文件里用同样的模式重置：

| 文件 | 新增规则 | 修复的控件 |
|---|---|---|
| `plugin-web/agent/src/AgentsPage.vue` | `#app .workspace :is(.row-actions,.ws-actions,.browser-toolbar,.term-input) button` 等 | 22×22 / 24×24 / 28×28 图标按钮（`::before` 44px 触控区保留） |
| `plugin-web/life/src/SocialWindow.vue` | `#app .toolbar button` | 28×28 工具栏按钮 |
| `plugin-web/life/src/MemoryPage.vue` | `#app .memory-page .btn-icon` | 30×30 删除按钮 |

**顺带发现并修复的一个报告里没有的问题**：`webui/src/App.vue` 的 `.icon-btn.active { background }` 被 theme.css 的 `#app .icon-btn` 背景压掉 —— **设置齿轮按钮在设置页时从不显示选中底色**。已把该状态移到 theme.css（`#app .icon-btn.active`），App.vue 里删掉。

---

## 二、高危（内容不可见 / 不可用）

| 编号 | 文件 | 改动 |
|---|---|---|
| H2 | `webui/src/styles/settings.css` | `.section-fields` → `repeat(auto-fit, minmax(min(300px, 100%), 1fr))`，360px 手机上不再溢出被 `.content-card{overflow:hidden}` 裁掉 |
| H3 | `webui/src/components/ConnectionPanel.vue` | 网格改 `minmax(0,1fr) minmax(0,264px)`；断点 760→**1000px**（对齐宿主侧栏 800px 收起点）；SVG 加 `width:100%;max-width:264px;height:auto`；`.connection-link` max-width 280→100%；`.helper-text` 补 `overflow-wrap:anywhere` |
| H4 | `plugin-web/agent/src/AgentsPage.vue` | 800px / 560px 媒体查询内全部补 `#app .workspace` 前缀 —— 原先整层规则被宿主 (1,3,0) 压掉，窄屏侧栏恒 296px |
| H5 | `plugin-web/life/src/SocialWindow.vue` | `.list-body` 补 `min-height:0`，会话列表恢复滚动，末尾条目可达 |
| H6 | `plugin-web/life/src/CompanionPage.vue` | `.pfield textarea.field` → `#app .pcp .pfield textarea.field`，人设多行输入框恢复 `height:auto` 自增高 |

---

## 三、中危（视觉错位 / 文字硬裁 / 反馈失效）

| 编号 | 文件 | 改动 |
|---|---|---|
| M1 | `webui/src/pages/ChatPage.vue` | 移动端抽屉去掉 `v-show`（`display:none` 无法过渡），改为 `translateX(100%) + visibility:hidden`（`visibility` 延迟 220ms 切换）—— 滑入动画恢复，且关闭时仍在 Tab 序之外 |
| M2 | `MessageBubble.vue` / `ChatPanel.vue` / `UpdatesPanel.vue` / `ToolStepCard.vue` / `AgentsPage.vue` | 6 处 flex 容器上的 `text-overflow:ellipsis` 改为内层 block span（`.msg-file-name` / `.pending-file-name` / `.us-name-text` / `.us-status-text` / `.tool-open-label` / `.attach-chip-name`）；`.slash-desc` 补 `min-width:0` |
| M3 | `webui/src/pages/UsagePage.vue` | ≤560px 隐藏偶数 X 轴标签（`nth-child(2n)`）+ 字号降到 10px，14 天标签不再互相压叠 |
| M4 | `webui/src/pages/SettingsPage.vue` | 导航按钮补 `:title` 与 `:aria-label`，≤800px 纯图标模式下可辨识、读屏可读 |
| M5 | `docs/build.py` | `markdown_body()` 把 `<table>` 包进 `<div class="table-scroll">`，CSS 加 `overflow-x:auto` —— 宽 API 表改为横向滚动，不再被裁 |
| M6 | `docs/build.py` | `<html lang="en">` → `lang="zh-CN"`（正文与导航都是中文） |
| M7 | `kit.ts` / `CompanionPage` / `MemoryPage` / `AdapterSettingsPage` / `AgentsPage` | 长串换行保护：`.meta`、`.todo-text`、`.model-annotation`、`.session-card small`、`.memory-content`、`.rule-row code`、`.adapter-row strong` 补 `overflow-wrap:anywhere`；`.card > h3` 补 `flex-wrap`、`.count-pill` 补 `flex-shrink:0`；`.som-chan` 标签轨道改 `minmax(52px,88px)`；`.wm-routes` 用 `min(280px,100%)` |
| M8 | `webui/src/App.vue` | 删除约 180 行被 `#app` 覆盖的死声明（header 64px、rail 88px、page-title 14px 等与实际渲染矛盾的值），只保留 theme.css 未定义的属性；文件头加注释说明归属 |
| M9 | `ConsolePage` / `McpPanel` / `PluginModuleHost` / `LifeSettingsPanel` / `settings.css` | 用 `#app .console`、`#app .mcp-panel`、`#app .plugin-host`、`#app .ls-model` 提权重述被覆盖的形状；`.btn.sm/.xs` 在 settings.css 统一为 34/30px，删除 AboutPanel / UpdatesPanel / ProviderPanel 三份互相漂移的定义（34/30、34/30、32/28） |
| M10 | `plugin-web/agent/src/ThinkingSlider.vue` | `<style>` 加 `scoped` —— 它与 `webui/src/components/ThinkingSlider.vue` 类名完全相同，此前互相污染 |

---

## 四、低危 / 清理

- **L3** `docs/build.py`：移除 `-webkit-font-smoothing:antialiased`（theme.css 明确解释过它在 Windows 上会关掉 ClearType），改为与 WebUI 一致的 `-moz-osx-font-smoothing:grayscale`。
- **L5** `webui/src/components/StatusPanel.vue`：删除永不可达的 `bar`/`count`/`tasks`/`list`/`memory`/`connection`/kv 模板分支、`sectionValue`/`emptyText`/`listItems` 辅助函数、全部 memory 轮询机制（`memorySection`/`fetchMemory`/`scheduleMemoryPoll` + watch）、以及随之孤立的约 110 行 CSS。`visibleSections` 只产出 `mood|bars`，这些分支从来不会渲染。
- **L6** `SocialWindow.vue`：浮动面板加载时按视口重新收敛 `x/y/w/h`，并在 `resize` 时重适配（原先宽屏设的尺寸在窗口变窄后跑出屏幕，而标题栏是唯一拖拽把手）。
- **L6** `CompanionPage.vue`：`var(--z-overlay)` 补兜底值 `2000`（宿主未定义时不再静默变 `auto`）。
- **L6** `MinecraftPage.vue`：删除从未出现在模板里的 `#app .mc .url` 三条死规则（含 640px 媒体查询里的 `width:100%`）。
- **L6** `AgentsPage.vue`：删除 `#app .workspace .host-panel` 与 `.host-panel*` 死规则（模板用的是 `.host-window`，已有完整样式；直接改名会把固定定位窗口顶离内联位置）；输入框右侧预留 124→**160px**（3 个 42px 按钮 + 间隙）；触屏下 `.row-actions` 改为选中行才显示并预留首行宽度，避免常驻遮挡 `.origin`。

---

## 五、刻意未改（附理由）

| 项 | 理由 |
|---|---|
| `UsagePage.vue` 图表调色板硬编码 8 色 hex | 图表分类色需要跨主题保持身份稳定，改用主题令牌会让系列颜色随主题漂移，属有意设计而非缺陷 |
| `kit.ts` 基础层被 `#app` 层遮蔽的 `.field`/`.btn` 高度 | 这是"无 `#app` 祖先时的独立运行兜底"分层，运行时零成本；已在该块加注释说明哪一层是真相源，而不是删除 |
| `theme.css` 中 3 组 later-wins 重复声明 | 原作者已明确标注为历次设计迭代的有意保留（改它会改变视觉），保留现状 |
| 各组件的令牌魔法数值（18/20/22/24px 圆角等） | 纯一致性收益、且批量替换有视觉回归风险；本次只统一了影响布局结果的（`.btn.sm/.xs`） |

---

## 六、验证命令与结果

```
webui/  npm run build          ✅ vue-tsc + vite build 通过
webui/  npm run build:plugin   ✅ 5 个平台插件页（chat/plugins/settings/usage/console）构建通过
webui/  npx vitest run         ✅ 13 个测试文件 / 97 个用例全通过
webui/  npx eslint .           ✅ 无告警
plugin-web/agent               ✅ vite build 通过
plugin-web/life                ✅ vite build 通过
plugin-web/minecraft           ✅ vite build 通过
docs/build.py                  ✅ 重新生成 15 个页面，10 处 table-scroll 开闭配对正确
```

**过程中踩到并修掉的两个坑（供后续参考）**：

1. `plugin-web/life/src/kit.ts` 的整张样式表是 **JS 模板字符串**，注释里写反引号会直接终止字符串导致 esbuild 报错。已改为无反引号注释，并在该块注明。
2. `vue-tsc` **不会**报出 `.vue` 模板缺少闭合标签，而 webui 的页面组件不在主构建图里（由 `vite build --config vite.plugin.config.ts` 单独构建）。改页面组件后必须跑 **`npm run build:plugin`** 才算真正验证过，只跑 `npm run build` 会漏。
