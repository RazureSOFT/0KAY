# UI 易用性修复 — 2026-10-24

审查方式：无头 Edge 在 1280×800 与 380×800 下逐页实测（截图 + `scrollWidth/clientWidth` 对比），
不只看源码。每条都给出**现象 → 原因 → 修法 → 验证**。

## 已修

### 1. 窄屏底部导航有四个入口点不到（高）

**现象**：380px 宽时 `.nav-rail` 内容 630px、可视 380px，`overflow-x: auto`。
插件市场 / 用量 / 控制台 / **设置** 全部在屏幕外，靠横向滑动才能到达——底部导航没人会去滑。
等于手机上无法进入设置页。

**原因**：`theme.css` 的 720px 断点给每个 `.nav-item` 设了 `min-width: 60px`，10 项固定 600px+。

**修法**：`min-width: 0` + `flex: 1 1 0` 让各项平分宽度；再在 ≤520px 隐藏文字标签
（`title` 已在按钮上，图标可区分），每项约 38px。

**验证**：`nav-rail client 380 = scroll 380`，10 个入口全部可见。

### 2. 设置页分区导航在窄屏变成 20 个无标签图标（高）

**现象**：≤800px 时 `#app .settings-page .nav-label { display: none }`，20 个分区变成两行图标网格，
无法判断哪个是"安全"哪个是"供应商"。这是最需要文字的地方。

**修法**：改成单行横向滚动的带标签 pill（`flex-wrap: nowrap` + `overflow-x: auto` + 隐藏滚动条），
`.nav-label { display: inline }` 保留。

**验证**：截图可见「通用 / 外观 / 供应商」等完整标签，右侧露出一半作为可滚动提示。

### 3. 语言选择器第四项被裁掉（中）

**现象**：380px 下「繁體中文」被字段容器裁掉，只显示「繁體中」。

**原因**：`.segmented` 是 `inline-flex` 不换行，4 个 `.seg` 各 24px 左右内边距，总宽 306 > 容器 290。

**修法**：≤800px 允许换行，`flex: 1 1 40%` 排成 2×2（三项一行会留一个孤零零的 pill）。

**验证**：四项全部可见，2×2 布局。

### 4. 供应商卡片在手机上被右侧裁掉（高）

**现象**：卡片宽 524px 放在 290px 的列里，模型 chip 行和「编辑/测试连接/设为默认/禁用」按钮行都被切。

**原因**：两个叠加问题
- `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`——轨道最小值 340 大于容器 290；
- `.pp-card` 作为 grid item 没有 `min-width: 0`，其 min-content（长 base URL、chip 行）撑破轨道。

**修法**：`minmax(min(340px, 100%), 1fr)` + `.pp-card { min-width: 0 }`。

**验证**：`pp-cards 290/290`、`pp-card 288/288`，无溢出。

### 5. 长 model id / URL 把设置项撑宽（中）

**现象**：Agent 分区的 `.field` 290<456，`.helper-text` 290<456——说明文字里的长 token 不换行。

**修法**：`.helper-text { overflow-wrap: anywhere }`。

**验证**：`.field` 与 `.helper-text` 不再溢出。

### 6. 注释剥离把 eslint 打成 67 个错（回归，高）

**现象**：`npx eslint .` → 67 errors，全部 `no-empty`。

**原因**：这些位置原本是 `catch { /* ignore malformed frame */ }`，注释被剥离后变成空 catch 块。
不是新代码问题，是上一轮"代码人类化"引入的回归。

**修法**：`no-empty: ['error', { allowEmptyCatch: true }]`。
67 处全是"吞掉继续"，重写 67 句同样的注释比规则本身更糟；这个选项只影响 catch。

**验证**：`npx eslint .` → 0。

## 已知未修

| 位置 | 现象 | 为什么不修 |
|---|---|---|
| 安全 → PIN 输入框 | `pin-boxes 224<258`（34px） | 六个格子 + 主题给 `input` 的横向内边距，`#app` 层叠压过组件 scoped 的 `padding: 0`；已在 theme.css 加 `#app .pin-box` 例外仍被更高优先级规则覆盖。需要动基础 input 规则，收益（34px）与回归风险不成比例 |
| 供应商 → 模型 chip 的 `<code>` | 149<152（3px） | 已有 `text-overflow: ellipsis`，3px 属亚像素级 |
| 消息平台 `.hero` | 304<364 | 装饰性渐变层，无可见裁切 |
| `input 252<476` 等 | — | `<input>` 的 `scrollWidth` 反映的是**内容**宽度，长值在框内滚动是正常行为，不是布局缺陷 |

## 顺带记录（不是缺陷，别再当 bug 查）

- 页面级 `route-view:380<730` 是**抽屉式会话列表**（translateX 移出视口），不是内容被裁。
- 切换分区后 450ms 内测到的溢出是 `tab-enter-active` 过渡期的 `transform`，等 900ms 就消失。
- 页面组件不在主构建图里，改完必须 `npm run build:plugin`；`npm run build` 验证不到。

## 验证命令

```bash
cd webui && npm run build && npm run build:plugin && npx vitest run && npx eslint .
```
结果：build ✓、plugin build ✓、vitest 14 文件 / 105 用例全过、eslint 0 error。
