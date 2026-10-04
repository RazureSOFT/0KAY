package com.razuresoft.okayapp.data

import android.net.Uri
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

/**
 * Parse a scanned pairing payload:
 *  - 0kay://pair?url=...&token=...&pin=...&core_id=...&name=...
 *  - JSON: {"url": "...", "token": "..."}
 *  - a bare http(s) URL
 */
fun parsePairing(text: String): ServerConfig? {
    val trimmed = text.trim()
    if (trimmed.isEmpty()) return null

    if (trimmed.startsWith("0kay://", ignoreCase = true)) {
        val uri = Uri.parse(trimmed)
        val url = uri.getQueryParameter("url") ?: return null
        return ServerConfig(
            baseUrl = normalizeBase(url),
            token = uri.getQueryParameter("token").orEmpty(),
            pin = uri.getQueryParameter("pin").orEmpty(),
        )
    }

    if (trimmed.startsWith("{")) {
        val jo = runCatching { okayJson.parseToJsonElement(trimmed) as? JsonObject }.getOrNull()
        if (jo != null) {
            val url = (jo["url"] ?: jo["baseUrl"]) as? JsonPrimitive ?: return null
            return ServerConfig(
                baseUrl = normalizeBase(url.content),
                token = (jo["token"] as? JsonPrimitive)?.content.orEmpty(),
                pin = (jo["pin"] as? JsonPrimitive)?.content.orEmpty(),
            )
        }
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return ServerConfig(baseUrl = normalizeBase(trimmed))
    }
    return null
}
