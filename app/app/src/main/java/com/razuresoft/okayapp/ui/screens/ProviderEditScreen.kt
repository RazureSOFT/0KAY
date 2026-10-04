package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.AppTextField
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonArray
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asArray
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.bool
import com.razuresoft.okayapp.data.jsBool
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.str

@Composable
fun ProviderEditScreen(nav: NavHostController, id: String) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    val isNew = id == "__new__"
    var pid by remember { mutableStateOf(if (isNew) "" else id) }
    var name by remember { mutableStateOf("") }
    var provider by remember { mutableStateOf("openai") }
    var baseUrl by remember { mutableStateOf("") }
    var apiKey by remember { mutableStateOf("") }
    var defaultModel by remember { mutableStateOf("") }
    var models by remember { mutableStateOf("") }
    var enabled by remember { mutableStateOf(true) }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var ok by remember { mutableStateOf(false) }

    LaunchedEffect(id) {
        if (isNew) return@LaunchedEffect
        runCatching {
            val d = repo.api.get("/api/providers").asObject()
            d.arr("providers").map { it.asObject() }.firstOrNull { it.str("id") == id }?.let { p ->
                pid = p.str("id"); name = p.str("name"); provider = p.str("provider")
                baseUrl = p.str("base_url"); defaultModel = p.str("default_model")
                enabled = p.bool("enabled")
                models = p.arr("models").joinToString("\n") { it.toString().trim('"') }
                apiKey = p.str("api_key_masked").ifEmpty { p.str("api_key") }
            }
        }.onFailure { error = it.message }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(14.dp)) {
        AppTextField(pid, { pid = it }, label = "ID（唯一标识）", enabled = isNew)
        Spacer(Modifier.height(8.dp))
        AppTextField(name, { name = it }, label = "名称")
        Spacer(Modifier.height(8.dp))
        AppTextField(provider, { provider = it }, label = "类型（openai / anthropic / deepseek / kimi / xai / custom）")
        Spacer(Modifier.height(8.dp))
        AppTextField(baseUrl, { baseUrl = it }, label = "Base URL")
        Spacer(Modifier.height(8.dp))
        AppTextField(apiKey, { apiKey = it }, label = "API Key", password = true)
        Spacer(Modifier.height(8.dp))
        AppTextField(models, { models = it }, label = "模型（每行一个）", singleLine = false)
        Spacer(Modifier.height(8.dp))
        AppTextField(defaultModel, { defaultModel = it }, label = "默认模型")
        Spacer(Modifier.height(8.dp))
        RowItem("启用", trailing = { Switch(enabled, { enabled = it }) })

        ErrorBox(error)
        if (ok) Text("已保存 ✓", color = com.razuresoft.okayapp.ui.theme.Success, style = MaterialTheme.typography.labelMedium)

        Row(Modifier.padding(vertical = 10.dp)) {
            PrimaryButton("保存", {
                scope.launch {
                    busy = true; error = null; ok = false
                    try {
                        val p = jsonOf(
                            "id" to jsStr(pid.trim()),
                            "provider" to jsStr(provider.trim().ifEmpty { "openai" }),
                            "name" to jsStr(name.trim()),
                            "api_key" to jsStr(apiKey),
                            "base_url" to jsStr(baseUrl.trim()),
                            "default_model" to jsStr(defaultModel.trim()),
                            "enabled" to jsBool(enabled),
                            "models" to JsonArray(models.lines().map { jsStr(it.trim()) }.filter { it.toString() != "\"\"" }),
                        )
                        repo.api.post("/api/providers", jsonOf("provider" to p))
                        if (defaultModel.isNotBlank()) {
                            runCatching {
                                repo.api.post("/api/providers/defaults", jsonOf("default_provider_id" to jsStr(pid.trim()), "default_model" to jsStr(defaultModel.trim())))
                            }
                        }
                        ok = true
                    } catch (e: Exception) {
                        error = e.message
                    } finally {
                        busy = false
                    }
                }
            }, loading = busy)
            Spacer(Modifier.padding(6.dp))
            TonalButton("探测模型", {
                scope.launch {
                    busy = true; error = null
                    try {
                        val r = repo.api.post(
                            "/api/models/fetch",
                            jsonOf("id" to jsStr(pid), "provider" to jsStr(provider), "base_url" to jsStr(baseUrl), "api_key" to jsStr(apiKey)),
                        ).asObject()
                        val found = r.asArray()?.map { it.toString().trim('"') } ?: emptyList()
                        val list = r.arr("models").map { it.toString().trim('"') }.ifEmpty { found }
                        if (list.isNotEmpty()) {
                            models = list.joinToString("\n")
                            if (defaultModel.isBlank()) defaultModel = list.first()
                        } else if (r.str("error").isNotEmpty()) error = r.str("error")
                    } catch (e: Exception) {
                        error = e.message
                    } finally {
                        busy = false
                    }
                }
            })
        }
        Text(
            "提示：探测会请求服务器的 /api/models/fetch 验证连通性并列出可用模型。",
            color = TextDim,
            style = MaterialTheme.typography.labelSmall,
        )
    }
}
