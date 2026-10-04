package com.razuresoft.okayapp.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.sse.EventSource
import okhttp3.sse.EventSourceListener
import okhttp3.sse.EventSources
import java.util.concurrent.TimeUnit

class ApiException(val status: Int, val apiCode: String?, message: String) : Exception(message)

class OkayApi {
    @Volatile
    var config: ServerConfig = ServerConfig()

    val client: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .build()

    private val sseFactory = EventSources.createFactory(client)

    private fun buildUrl(path: String, params: List<Pair<String, Any?>> = emptyList()): HttpUrl {
        val base = config.baseUrl.trimEnd('/')
        val full = base + if (path.startsWith("/")) path else "/$path"
        val builder = (full.toHttpUrlOrNull() ?: throw IllegalStateException("无效地址：$full")).newBuilder()
        params.forEach { (k, v) -> if (v != null && v.toString().isNotEmpty()) builder.addQueryParameter(k, v.toString()) }
        return builder.build()
    }

    /** Absolute URL for a Core-relative asset path (image/file). */
    fun absoluteUrl(path: String): String =
        if (path.startsWith("http")) path else config.baseUrl.trimEnd('/') + if (path.startsWith("/")) path else "/$path"

    private fun Request.Builder.auth(): Request.Builder {
        if (config.token.isNotEmpty()) header("Authorization", "Bearer ${config.token}")
        if (config.pin.isNotEmpty()) header("X-0kay-Pin", config.pin)
        return this
    }

    private suspend fun execute(
        method: String,
        path: String,
        params: List<Pair<String, Any?>>,
        body: JsonElement?,
    ): JsonElement = withContext(Dispatchers.IO) {
        val rb = Request.Builder().url(buildUrl(path, params)).auth()
        val reqBody = body?.let { okayJson.encodeToString(JsonElement.serializer(), it).toRequestBody(JSON) }
        rb.method(method, reqBody)
        client.newCall(rb.build()).execute().use { parse(it) }
    }

    private fun parse(resp: Response): JsonElement {
        val text = resp.body?.string().orEmpty()
        if (!resp.isSuccessful) {
            val jo = runCatching { okayJson.parseToJsonElement(text) as? JsonObject }.getOrNull()
            val msg = jo?.str("error")?.ifEmpty { null } ?: text.ifEmpty { "HTTP ${resp.code}" }
            throw ApiException(resp.code, jo?.str("code"), msg)
        }
        if (text.isEmpty()) return JsonNull
        return runCatching { okayJson.parseToJsonElement(text) }.getOrElse { JsonNull }
    }

    suspend fun get(path: String, params: List<Pair<String, Any?>> = emptyList()): JsonElement =
        execute("GET", path, params, null)

    suspend fun post(path: String, body: JsonElement? = null): JsonElement = execute("POST", path, emptyList(), body)
    suspend fun put(path: String, body: JsonElement? = null): JsonElement = execute("PUT", path, emptyList(), body)
    suspend fun patch(path: String, body: JsonElement? = null): JsonElement = execute("PATCH", path, emptyList(), body)
    suspend fun delete(path: String, body: JsonElement? = null): JsonElement = execute("DELETE", path, emptyList(), body)

    suspend fun upload(path: String, field: String, bytes: ByteArray, name: String, mime: String): JsonElement =
        withContext(Dispatchers.IO) {
            val part = bytes.toRequestBody((mime.ifEmpty { "application/octet-stream" }).toMediaType())
            val form = MultipartBody.Builder().setType(MultipartBody.FORM).addFormDataPart(field, name, part).build()
            val rb = Request.Builder().url(buildUrl(path)).auth().post(form)
            client.newCall(rb.build()).execute().use { parse(it) }
        }

    suspend fun getBytes(urlOrPath: String): ByteArray = withContext(Dispatchers.IO) {
        val rb = Request.Builder().url(absoluteUrl(urlOrPath)).auth().build()
        client.newCall(rb.build()).execute().use { resp ->
            if (!resp.isSuccessful) throw ApiException(resp.code, null, "HTTP ${resp.code}")
            resp.body?.bytes() ?: ByteArray(0)
        }
    }

    /** Raw POST returning bytes (TTS audio, converted files). */
    suspend fun rawPost(path: String, body: JsonElement = JsonPrimitive("")): ByteArray = withContext(Dispatchers.IO) {
        val reqBody = okayJson.encodeToString(JsonElement.serializer(), body).toRequestBody(JSON)
        val rb = Request.Builder().url(buildUrl(path)).auth().post(reqBody)
        client.newCall(rb.build()).execute().use { resp ->
            if (!resp.isSuccessful) throw ApiException(resp.code, null, "HTTP ${resp.code}")
            resp.body?.bytes() ?: ByteArray(0)
        }
    }

    fun sse(path: String, body: JsonElement, listener: EventSourceListener): EventSource {
        val reqBody = okayJson.encodeToString(JsonElement.serializer(), body).toRequestBody(JSON)
        val rb = Request.Builder().url(buildUrl(path)).auth().header("Accept", "text/event-stream").post(reqBody)
        return sseFactory.newEventSource(rb.build(), listener)
    }

    /** Send a pre-built request (multipart Live2D upload) and parse the JSON reply. */
    suspend fun rawRequest(rb: Request.Builder): JsonElement = withContext(Dispatchers.IO) {
        client.newCall(rb.auth().build()).execute().use { parse(it) }
    }

    companion object {
        private val JSON = "application/json; charset=utf-8".toMediaType()
    }
}
