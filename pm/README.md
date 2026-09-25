# 0kay-pm

Node.js 22+、Git；各模块还需相应的 Go/Python 编译运行环境。

本地安装 CLI（不需要先发布 npm）：

```powershell
npm install -g ./pm
0kay-pm discover
0kay-pm install @razuresoft/0kay-agent
0kay-pm install @razuresoft/0kay-agent --proxy
0kay-pm install @razuresoft/0kay
0kay-pm start @razuresoft/0kay
```

也兼容 `0kay-pm install@razuresoft/0kay`。发布 npm 后可用
`npx @razuresoft/0kay-pm install @razuresoft/0kay-agent`，目前没有执行发布。

每次 install 前都执行 UDP 局域网扫描，更新 `~/.0kay/state.json` 的 Core 历史。
选择 Core、确认配对后，在 Core 本机「设置 → 通用 → 设备配对」核对代码。
无 Core 时仍可安装，启动 Core 后重新安装/配置连接；`--no-pair` 跳过询问但不跳过扫描。
`--advertise <LAN-IP>` 指定回调网卡；多网段广播受路由器、防火墙限制。

`--proxy` 使用 `https://gh-proxy.com/https://github.com/...`；默认直接 GitHub。
`--source <checkout>` 从本地工作树测试尚未发布的 manifest。
安装在临时目录构建，成功后原子移动，不覆盖现有目录。命令来自仓库 manifest，安装可信仓库。
manifest.schema=1；name/version 必填；install/start 为 argv 数组；modules 为子 manifest 路径；dependencies 为包名；requires 为运行时插件依赖。
可选 `ui`：`{ dir?, plugin?, dist?, build? }` — install 末尾在 `dir` 执行 `build` argv，将 `dist`（默认 `dist`）原子发布到 `${CORE_DATA_DIR||data}/plugin-ui/{plugin||包短名}/`。

主仓库与独立 Agent 仓库均须提交这些 manifest 后，GitHub 安装才能获得新版。
当前 CLI 不提供运行时自动安装 Node/Go/Python、跨网段发现、公网部署或自动升级覆盖。
