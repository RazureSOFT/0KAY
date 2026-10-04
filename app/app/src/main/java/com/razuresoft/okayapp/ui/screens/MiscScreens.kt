package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.AppTextField
import com.razuresoft.okayapp.ui.components.Badge
import com.razuresoft.okayapp.ui.components.CardBox
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextMain
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.jsBool
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.obj
import com.razuresoft.okayapp.data.str

/** Agent 收件箱：审批 + 提问的完整视图。 */
@Composable
fun InboxScreen(nav: NavHostController) {
    TasksScreen(nav)
}

@Composable
fun NotificationsScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var notifications by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        while (isActive) {
            runCatching {
                notifications = repo.api.get("/api/life/notifications").asObject()
                    .arr("notifications").map { it.asObject() }
            }.onFailure { error = it.message }
            delay(5000)
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        SectionTitle("主动消息 (${notifications.size})")
        if (notifications.isEmpty()) EmptyBox("暂无通知")
        notifications.forEach { n ->
            CardBox {
                Text(n.str("text"), color = TextMain)
                Text(n.str("created_at"), color = TextDim, style = MaterialTheme.typography.labelSmall)
                TonalButton("已读", {
                    scope.launch {
                        runCatching {
                            repo.api.post(
                                "/api/life/notifications",
                                jsonOf("session_id" to jsStr("app:${repo.chat.sessionId}"), "ids" to kotlinx.serialization.json.JsonArray(listOf(jsStr(n.str("id"))))),
                            )
                        }
                    }
                })
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

/** Agent 会话详情：消息列表（/api/agent/messages?session_id=）。 */
@Composable
fun SessionScreen(nav: NavHostController, id: String) {
    val repo = LocalRepo.current
    var messages by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(id) {
        runCatching {
            messages = repo.api.get("/api/agent/messages", listOf("session_id" to id))
                .asObject().arr("messages").map { it.asObject() }
                .ifEmpty { repo.api.get("/api/agent/messages", listOf("session_id" to id)).asObject().arr("messages").map { it.asObject() } }
        }.onFailure { error = it.message }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        if (messages.isEmpty() && error == null) EmptyBox("会话为空")
        messages.forEach { m ->
            val role = m.str("role")
            CardBox {
                Text(role.uppercase(), color = TextDim, style = MaterialTheme.typography.labelSmall)
                Text(m.str("content").ifEmpty { m.obj("message").str("content") }, color = TextMain)
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
fun AboutScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    var health by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        runCatching {
            repo.api.get("/health")
            health = "已连接 ✓"
        }.onFailure { health = "连接失败: ${it.message}" }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("关于")
        Column {
            RowItem("应用", "0KAY for Android")
            RowItem("版本", "0.2.0（原生 Compose）")
            RowItem("服务器", repo.api.config.baseUrl)
            RowItem("健康检查", health ?: "检测中…")
        }
        SectionTitle("连接")
        Column {
            RowItem("WebUI", "浏览器打开服务器地址即可访问完整 WebUI")
        }
        Spacer(Modifier.height(24.dp))
    }
}
