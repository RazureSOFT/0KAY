package com.razuresoft.okayapp.data

import android.content.Context
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import okhttp3.sse.EventSource
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

data class FileRef(val name: String, val url: String, val mime: String = "", val size: Long = 0)

class ChatMessage(
    val id: String,
    val role: String,
    var content: String,
    val images: List<String> = emptyList(),
    val files: List<FileRef> = emptyList(),
    var thinkSummary: String? = null,
    var emotion: JsonObject? = null,
    val timestamp: Long = System.currentTimeMillis(),
)

/** Live2D driving channels shared between the chat screen and the stage. */
class Live2DBus {
    val speakText = mutableStateOf<String?>(null)
    val motion = mutableStateOf<String?>(null)   // "group:index" or ":index"
    val expression = mutableStateOf<Int?>(null)
}

/**
 * Chat session: messages, SSE streaming against /api/life/chat, proactive
 * notification polling and the [[motion:..]] / [[expression:..]] markers.
 */
class ChatStore(context: Context, val api: OkayApi) {
    companion object {
        private const val PREFS = "okay_chat"
        private const val KEY_SESSION = "session_id"
        private val MOTION_RE = Regex("\\[\\[(?:motion|emote):([^\\]]*)\\]\\]")
        private val EXPR_RE = Regex("\\[\\[(?:expression|emote):exp_(\\d+)\\]\\]")
    }

    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    val live2d = Live2DBus()
    val messages = mutableStateListOf<ChatMessage>()
    val isTyping = mutableStateOf(false)
    val error = mutableStateOf<String?>(null)
    val voiceEnabled = mutableStateOf(false)
    var currentTaskId: String? = null
        private set

    val sessionId: String get() = prefs.getString(KEY_SESSION, null) ?: UUID.randomUUID().toString().also {
        prefs.edit().putString(KEY_SESSION, it).apply()
    }

    fun resetSession() {
        prefs.edit().putString(KEY_SESSION, UUID.randomUUID().toString()).apply()
        messages.clear()
    }

    private var sse: EventSource? = null

    fun sendMessage(prompt: String, images: List<String>, files: List<FileRef>, onError: (String) -> Unit) {
        if (isTyping.value) return
        val userMsg = ChatMessage("m_${System.currentTimeMillis()}", "user", prompt, images, files)
        messages.add(userMsg)

        val history = messages.takeLast(21).dropLast(1).map { m ->
            var content = m.content
            m.images.forEach { content += "\n[image: ${api.absoluteUrl(it)}]" }
            m.files.forEach { content += "\n[file: ${it.name} ${api.absoluteUrl(it.url)}]" }
            jsonOf("role" to jsStr(m.role), "content" to jsStr(content))
        }

        val requestId = "req_${System.currentTimeMillis()}"
        var acc = ""
        var think: String? = null
        var emo: JsonObject? = null
        val replyId = "m_${System.currentTimeMillis() + 1}"
        isTyping.value = true
        error.value = null

        val body = jsonOf(
            "request_id" to jsStr(requestId),
            "prompt" to jsStr(prompt),
            "stream" to jsBool(true),
            "session_id" to jsStr("app:${sessionId}"),
            "user_id" to jsStr("app"),
            "attachments" to JsonArray(
                images.map { jsonOf("name" to jsStr(it.substringAfterLast('/')), "url" to jsStr(api.absoluteUrl(it)), "mime" to jsStr("image/*")) } +
                    files.map { jsonOf("name" to jsStr(it.name), "url" to jsStr(api.absoluteUrl(it.url)), "mime" to jsStr(it.mime), "size" to jsNum(it.size)) }
            ),
            "history" to JsonArray(history),
        )

        fun pushChunk() {
            val existing = messages.firstOrNull { it.id == replyId }
            if (existing != null) {
                existing.content = acc
                existing.thinkSummary = think
                existing.emotion = emo
            } else {
                messages.add(ChatMessage(replyId, "assistant", acc, thinkSummary = think, emotion = emo))
            }
        }

        sse = api.sse("/api/life/chat", body, object : okhttp3.sse.EventSourceListener() {
            override fun onEvent(es: EventSource, id: String?, event: String?, data: String) {
                scope.launch {
                    val jo = runCatching { okayJson.parseToJsonElement(data).asObject() }.getOrNull()
                    if (event == "error" || jo?.str("error")?.isNotEmpty() == true) {
                        error.value = jo?.str("error")?.ifEmpty { data } ?: data
                        isTyping.value = false
                        return@launch
                    }
                    if (event == "done" || jo?.bool("done") == true) {
                        if (acc.isNotEmpty()) pushChunk()
                        isTyping.value = false
                        return@launch
                    }
                    when (event) {
                        "chunk" -> {
                            jo?.str("chunk")?.let { acc += it }
                            jo?.str("think_summary")?.takeIf { it.isNotEmpty() }?.let { think = it }
                            jo?.obj("emotion")?.takeIf { it.isNotEmpty() }?.let { emo = it }
                            jo?.str("task_id")?.takeIf { it.isNotEmpty() }?.let { currentTaskId = it }
                            if (acc.isNotEmpty()) pushChunk()
                        }
                        "done" -> { isTyping.value = false }
                    }
                }
            }

            override fun onFailure(es: EventSource, t: Throwable?, resp: okhttp3.Response?) {
                scope.launch {
                    isTyping.value = false
                    if (acc.isEmpty()) {
                        error.value = t?.message ?: "连接中断 (HTTP ${resp?.code})"
                    } else {
                        pushChunk()
                    }
                }
            }
        })
    }

    fun cancelStream() {
        sse?.cancel()
        sse = null
        isTyping.value = false
    }

    /** Parse [[motion:..]] / [[expression:..]] markers out of a reply and dispatch them. */
    fun dispatchMarkers(raw: String) {
        MOTION_RE.findAll(raw).forEach { m ->
            val parts = m.groupValues[1].split(":")
            live2d.motion.value = if (parts.size >= 2) "${parts[0]}:${parts[1]}" else ":${parts[0]}"
        }
        EXPR_RE.findAll(raw).forEach { m ->
            live2d.expression.value = m.groupValues[1].toIntOrNull() ?: 0
        }
    }

    fun speak(text: String) {
        if (voiceEnabled.value && text.isNotBlank()) live2d.speakText.value = text
    }

    /** Maps valence/arousal/irritation to an expression index, mirroring the WebUI. */
    fun expressionFor(emo: JsonObject?): Int? {
        emo ?: return null
        val v = emo.dbl("valence")
        val irr = emo.dbl("irritation")
        return when {
            irr > 0.7 -> 6
            v > 0.5 -> 2
            v < -0.3 -> 4
            else -> 0
        }
    }

    suspend fun fetchNotifications(): List<Triple<String, String, String>> {
        return try {
            val resp = api.get("/api/life/notifications").asObject()
            val current = "app:$sessionId"
            resp.arr("notifications").mapNotNull { n ->
                val o = n.asObject()
                val sid = o.str("session_id")
                if (sid.isNotEmpty() && sid.startsWith("webui:")) return@mapNotNull null
                Triple(o.str("id"), o.str("text"), sid)
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun acknowledgeNotifications(ids: List<String>) {
        runCatching { api.post("/api/life/notifications", jsonOf("session_id" to jsStr("app:$sessionId"), "ids" to kotlinx.serialization.json.JsonArray(ids.map { jsStr(it) }))) }
    }
}

fun formatTime(ts: Long): String = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(ts))
