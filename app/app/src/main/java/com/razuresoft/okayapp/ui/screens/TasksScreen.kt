package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.jsBool
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.str
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.CardBox
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.Danger
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextMain
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject

/** 任务与 Agent 收件箱：审批请求、提问、进行中任务。 */
@Composable
fun TasksScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var inbox by remember { mutableStateOf<JsonObject>(JsonObject(emptyMap())) }
    var tasks by remember { mutableStateOf<List<JsonObject>>(emptyList()) }

    suspend fun refresh() {
        runCatching { inbox = repo.api.get("/api/agent/inbox").asObject() }
        runCatching {
            tasks = repo.api.get("/api/tasks").asObject().arr("tasks").map { it.asObject() }
                .filter { it.str("state") == "running" || it.str("state").isEmpty() }
        }
    }

    LaunchedEffect(Unit) {
        while (isActive) {
            refresh()
            delay(3000)
        }
    }

    fun resolveInbox(kind: String, item: JsonObject, payload: JsonObject) {
        scope.launch {
            runCatching {
                repo.api.post(
                    if (kind == "questions") "/api/agent/questions" else "/api/agent/approvals",
                    jsonOf(
                        "id" to jsStr(item.str("id")),
                        "executor_id" to jsStr(item.str("executor_id")),
                    ) + payload,
                )
            }
            refresh()
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        val approvals = inbox.arr("approvals")
        val questions = inbox.arr("questions")

        SectionTitle("待审批 (${approvals.size})")
        if (approvals.isEmpty()) Text("暂无审批请求", color = TextDim, modifier = Modifier.padding(horizontal = 18.dp))
        approvals.forEach { raw ->
            val a = raw.asObject()
            CardBox {
                Text(a.str("tool").ifEmpty { "工具调用" }, fontWeight = FontWeight.Bold, color = TextMain)
                Text("主机: ${a.str("executor_id").ifEmpty { "未知" }}  ·  ${a.str("cwd")}", color = TextDim, style = MaterialTheme.typography.labelSmall)
                Text(a.obj("args").toString().take(400), color = TextDim, style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    PrimaryButton("允许", { resolveInbox("approvals", a, jsonOf("allow" to jsBool(true))) })
                    TonalButton("拒绝", { resolveInbox("approvals", a, jsonOf("allow" to jsBool(false))) })
                }
            }
        }

        SectionTitle("Agent 提问 (${questions.size})")
        if (questions.isEmpty()) Text("暂无提问", color = TextDim, modifier = Modifier.padding(horizontal = 18.dp))
        questions.forEach { raw ->
            val q = raw.asObject()
            var answer by remember(q.str("id")) { mutableStateOf("") }
            CardBox {
                Text(q.str("question"), color = TextMain, fontWeight = FontWeight.SemiBold)
                val options = q.arr("options").map { it.asObject().str("label").ifEmpty { it.toString().trim('"') } }
                if (options.isNotEmpty()) {
                    Spacer(Modifier.height(6.dp))
                    options.forEach { opt ->
                        TonalButton(opt, { resolveInbox("questions", q, jsonOf("answer" to jsStr(opt))) }, Modifier.padding(vertical = 2.dp))
                    }
                }
                Spacer(Modifier.height(6.dp))
                com.razuresoft.okayapp.ui.components.AppTextField(answer, { answer = it }, label = "自由回答")
                Spacer(Modifier.height(6.dp))
                PrimaryButton("发送回答", {
                    resolveInbox("questions", q, jsonOf("answer" to jsStr(answer)))
                    answer = ""
                })
            }
        }

        SectionTitle("进行中任务 (${tasks.size})")
        if (tasks.isEmpty()) Text("暂无进行中任务", color = TextDim, modifier = Modifier.padding(horizontal = 18.dp))
        tasks.forEach { t ->
            CardBox {
                Text(t.str("prompt").ifEmpty { t.str("task_id") }, color = TextMain, style = MaterialTheme.typography.bodyMedium)
                Text("状态: ${t.str("state")} · ${t.str("task_id").take(18)}", color = TextDim, style = MaterialTheme.typography.labelSmall)
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    TonalButton("取消", {
                        scope.launch {
                            runCatching { repo.api.post("/api/tasks/cancel", jsonOf("task_id" to jsStr(t.str("task_id")))) }
                            refresh()
                        }
                    })
                }
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}

private operator fun JsonObject.plus(other: JsonObject): JsonObject = JsonObject(this + other)
