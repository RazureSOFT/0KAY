package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.AppTextField
import com.razuresoft.okayapp.ui.components.Badge
import com.razuresoft.okayapp.ui.components.CardBox
import com.razuresoft.okayapp.ui.components.DangerTextButton
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.Primary
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextMain
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.bool
import com.razuresoft.okayapp.data.dbl
import com.razuresoft.okayapp.data.has
import com.razuresoft.okayapp.data.int
import com.razuresoft.okayapp.data.jsBool
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.obj
import com.razuresoft.okayapp.data.str

/** 仪表盘：状态卡 + 入口（用量/记忆/技能/权限/收件箱/通知/关于）。 */
@Composable
fun PluginsScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var runtime by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var installed by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }

    fun refresh() {
        scope.launch {
            runCatching {
                val resp = repo.api.get("/api/plugins")
                runtime = (resp as? kotlinx.serialization.json.JsonArray)?.map { it.asObject() }
                    ?: resp.asObject().arr("plugins").map { it.asObject() }
            }.onFailure { error = it.message }
            runCatching { installed = repo.api.get("/api/plugins/pm/installed").asObject().arr("installed").map { it.asObject() } }
        }
    }
    LaunchedEffect(Unit) { refresh() }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        SectionTitle("运行时插件 (${runtime.size})")
        runtime.forEach { p ->
            Column {
                RowItem(
                    title = p.str("name").ifEmpty { p.str("plugin_id") },
                    subtitle = "v${p.str("version")} · ${p.str("type")} · ${p.str("status")}",
                    trailing = {
                        Switch(
                            checked = !p.bool("disabled"),
                            onCheckedChange = {
                                scope.launch {
                                    runCatching { repo.api.patch("/api/plugins/${p.str("plugin_id")}", jsonOf("enabled" to jsBool(it))) }
                                    refresh()
                                }
                            },
                        )
                    },
                )
                p.arr("capabilities").takeIf { it.isNotEmpty() }?.let {
                    Text(
                        it.joinToString(" · ") { c -> c.toString().trim('"') },
                        color = TextDim,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(start = 18.dp, bottom = 6.dp),
                    )
                }
            }
        }
        SectionTitle("已安装包 (${installed.size})")
        installed.forEach { p ->
            RowItem(
                title = p.str("name"),
                subtitle = p.str("source"),
                trailing = {
                    DangerTextButton("卸载", {
                        scope.launch {
                            runCatching { repo.api.post("/api/plugins/pm/uninstall", jsonOf("package" to jsStr(p.str("name")))) }
                            refresh()
                        }
                    })
                },
            )
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun UsageScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var usage by remember { mutableStateOf<JsonObject?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        runCatching { usage = repo.api.get("/api/usage").asObject() }.onFailure { error = it.message }
    }

    val u = usage ?: run { ErrorBox(error); EmptyBox("加载中…"); return }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("总量")
        CardBox {
            Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                MiniStat("总 tokens", u.int("total_tokens").toString())
                MiniStat("请求", u.int("request_count").toString())
                MiniStat("会话", u.int("session_count").toString())
            }
        }
        SectionTitle("按模型")
        u.obj("by_model").forEach { (model, m) ->
            val o = m.asObject()
            Column {
                RowItem(
                    title = model,
                    value = "${o.int("total")} tok · ${o.int("count")} 次",
                    onClick = null,
                )
                LinearProgressIndicator(
                    progress = {
                        (o.int("total").toDouble() / u.int("total_tokens").coerceAtLeast(1)).toFloat()
                    },
                    modifier = Modifier.padding(start = 14.dp, bottom = 6.dp).fillMaxWidth(0.9f).height(4.dp),
                    color = Primary,
                )
            }
        }
        SectionTitle("按天")
        u.obj("by_day").toSortedMap().entries.takeLast(14).forEach { (day, m) ->
            val o = m.asObject()
            RowItem(title = day, value = "${o.int("total")} tok")
        }
        Column(Modifier.padding(14.dp)) {
            DangerTextButton("清零用量", {
                scope.launch {
                    runCatching { repo.api.delete("/api/usage") }
                    runCatching { usage = repo.api.get("/api/usage").asObject() }
                }
            })
        }
    }
}

@Composable
private fun MiniStat(label: String, value: String) {
    Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold)
        Text(label, color = TextDim, style = MaterialTheme.typography.labelSmall)
    }
}

@Composable
fun MemoryScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    var data by remember { mutableStateOf<JsonObject?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        runCatching { data = repo.api.get("/api/life/memories").asObject() }.onFailure { error = it.message }
    }
    val d = data ?: run { ErrorBox(error); EmptyBox("加载中…"); return }
    val stats = d.obj("stats")

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("记忆统计")
        CardBox {
            Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                MiniStat("工作记忆", stats.int("working").toString())
                MiniStat("短期", stats.int("shortTerm").toString())
                MiniStat("长期", stats.int("longTerm").toString())
                MiniStat("平均强度", "%.2f".format(stats.dbl("avgStrength")))
            }
        }
        SectionTitle("记忆条目 (${d.arr("memories").size})")
        d.arr("memories").forEach { raw ->
            val m = raw.asObject()
            RowItem(
                title = m.str("content"),
                subtitle = "强度 %.2f".format(m.dbl("strength")),
            )
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun SkillsScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    var skills by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        runCatching { skills = repo.api.get("/api/skills").asObject().arr("skills").map { it.asObject() } }
            .onFailure { error = it.message }
    }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        if (skills.isEmpty() && error == null) EmptyBox("没有已加载的技能")
        skills.forEach { s ->
            RowItem(
                title = s.str("name").ifEmpty { s.str("id") },
                subtitle = s.str("description").ifEmpty { null },
            )
        }
    }
}

@Composable
fun PermissionsScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var screenWatch by remember { mutableStateOf(false) }
    var computerUse by remember { mutableStateOf(false) }
    var agentHost by remember { mutableStateOf("") }
    var loaded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        runCatching {
            val v = repo.api.get("/api/life/permissions").asObject()
            val o = if (v.has("screen_watch")) v else v.obj("values")
            screenWatch = o.bool("screen_watch")
            computerUse = o.bool("computer_use")
            agentHost = o.str("report_agent_host")
            loaded = true
        }
    }

    Column(Modifier.fillMaxSize()) {
        if (!loaded) { EmptyBox("加载中…"); return@Column }
        SectionTitle("Agent 主机权限")
        RowItem("屏幕观察", subtitle = "允许读取屏幕内容辅助对话", trailing = {
            Switch(screenWatch, { screenWatch = it; scope.launch { save(repo, screenWatch, computerUse, agentHost) } })
        })
        RowItem("Computer Use", subtitle = "允许在主机上执行操作", trailing = {
            Switch(computerUse, { computerUse = it; scope.launch { save(repo, screenWatch, computerUse, agentHost) } })
        })
        Column(Modifier.padding(14.dp)) {
            AppTextField(agentHost, { agentHost = it }, label = "Agent 主机地址")
            TonalButton("保存主机地址", { scope.launch { save(repo, screenWatch, computerUse, agentHost) } })
        }
    }
}

private suspend fun save(repo: com.razuresoft.okayapp.data.AppRepo, sw: Boolean, cu: Boolean, host: String) {
    runCatching {
        repo.api.post(
            "/api/life/permissions",
            jsonOf("screen_watch" to jsBool(sw), "computer_use" to jsBool(cu), "report_agent_host" to jsStr(host)),
        )
    }
}
