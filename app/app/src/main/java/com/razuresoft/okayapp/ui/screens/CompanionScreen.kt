package com.razuresoft.okayapp.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.bool
import com.razuresoft.okayapp.data.int
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.str
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.DangerTextButton
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject

/** Live2D 形象管理：启用开关、模型列表、上传、删除、保存选择。 */
@Composable
fun CompanionScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var enabled by remember { mutableStateOf(false) }
    var modelUrl by remember { mutableStateOf("") }
    var models by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }

    fun refresh() {
        scope.launch {
            runCatching {
                val list = repo.api.get("/api/live2d").asObject()
                models = list.arr("models").map { it.asObject() }
                if (modelUrl.isBlank()) modelUrl = list.str("model_url")
            }
            runCatching {
                val v = repo.api.get("/api/settings/live2d").asObject().obj("values")
                if (v.isNotEmpty()) {
                    enabled = v.bool("enabled")
                    if (v.str("model_url").isNotEmpty()) modelUrl = v.str("model_url")
                }
            }
        }
    }
    LaunchedEffect(Unit) { refresh() }

    fun save() {
        scope.launch {
            runCatching {
                repo.api.post("/api/settings/live2d", jsonOf("enabled" to com.razuresoft.okayapp.data.jsBool(enabled), "model_url" to jsStr(modelUrl)))
            }.onFailure { error = it.message }
        }
    }

    val pickModel = rememberLauncherForActivityResult(androidx.activity.result.contract.ActivityResultContracts.OpenMultipleDocuments()) { uris ->
        if (uris.isNotEmpty()) scope.launch {
            try {
                val paths = ArrayList<String>()
                val parts = ArrayList<Pair<String, android.util.Pair<ByteArray, String>>>()
                uris.forEach { uri ->
                    val raw = uri.lastPathSegment ?: "file"
                    val rel = relPath(raw)
                    paths.add(rel)
                    val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: return@forEach
                    parts.add("files" to android.util.Pair(bytes, rel))
                }
                val form = okhttp3.MultipartBody.Builder().setType(okhttp3.MultipartBody.FORM)
                parts.forEach { (field, p) ->
                    val mime = guessMime(p.second)
                    form.addFormDataPart(field, p.second, okhttp3.RequestBody.create(okhttp3.MediaType.parse(mime), p.first))
                }
                form.addFormDataPart("paths", JsonArray(paths.map { jsStr(it) }).toString())
                val rb = okhttp3.Request.Builder()
                    .url(repo.api.config.baseUrl.trimEnd('/') + "/api/live2d")
                    .post(form.build())
                repo.api.rawRequest(rb)
                refresh()
            } catch (e: Exception) {
                error = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        SectionTitle("形象")
        RowItem("启用 Live2D", subtitle = "在聊天页顶部展示角色", trailing = {
            Switch(enabled, { enabled = it; save() })
        })
        SectionTitle("模型 (${models.size})")
        models.forEach { m ->
            val url = m.str("url")
            RowItem(
                title = m.str("label").ifEmpty { m.str("id") },
                value = if (url == modelUrl) "当前" else null,
                onClick = { modelUrl = url; save() },
                trailing = {
                    DangerTextButton("删除", {
                        scope.launch {
                            runCatching {
                                repo.api.delete("/api/live2d/${m.str("id")}")
                                models = repo.api.get("/api/live2d").asObject().arr("models").map { it.asObject() }
                            }
                        }
                    })
                },
            )
        }
        Column(Modifier.padding(14.dp)) {
            TonalButton("上传模型文件夹（.model3.json / .model.json）", { pickModel.launch(arrayOf("*/*")) })
            Text(
                "选择模型主文件与其纹理/动作文件（多选）。上传后回到列表点选即可。",
                color = TextDim,
                style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.padding(top = 6.dp),
            )
        }
        Spacer(Modifier.padding(12.dp))
    }
}

private fun relPath(raw: String): String {
    // content://…/document/primary:live2d/xxx.model3.json -> xxx.model3.json 层级保留到最后两段
    val dec = Uri.decode(raw)
    val afterColon = dec.substringAfterLast(':')
    val segs = afterColon.split('/')
    return if (segs.size >= 2) segs.takeLast(2).joinToString("/") else afterColon
}

private fun guessMime(name: String): String = when {
    name.endsWith(".png") -> "image/png"
    name.endsWith(".json") -> "application/json"
    name.endsWith(".moc3") -> "application/octet-stream"
    name.endsWith(".mp3") -> "audio/mpeg"
    name.endsWith(".wav") -> "audio/wav"
    else -> "application/octet-stream"
}
