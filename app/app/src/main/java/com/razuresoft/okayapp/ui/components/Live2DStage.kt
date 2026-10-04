package com.razuresoft.okayapp.ui.components

import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.razuresoft.okayapp.data.AppRepo
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.str
import org.json.JSONObject

/**
 * Live2D 舞台：WebView 装载 assets/live2d/live2d.html， PIXI 与 Cubism Core
 * 由 Core 静态托管（/vendor/*），模型来自 /api/settings/live2d 的 model_url。
 * Compose 通过 evaluateJavascript 驱动 speak / motion / expression。
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun Live2DStage(repo: AppRepo, modifier: Modifier = Modifier) {
    var modelUrl by remember { mutableStateOf<String?>(null) }
    var webView by remember { mutableStateOf<WebView?>(null) }

    LaunchedEffect(Unit) {
        runCatching {
            val v = repo.api.get("/api/settings/live2d").asObject()
            val url = v.str("model_url").ifEmpty { v.obj("values").str("model_url") }
            if (v.str("enabled").isNotEmpty() || url.isNotEmpty()) modelUrl = url.ifEmpty { null }
        }
    }

    // drive speak / motion / expression from the chat bus
    val bus = repo.chat.live2d
    LaunchedEffect(webView, bus.speakText.value) {
        val t = bus.speakText.value ?: return@LaunchedEffect
        webView?.evaluateJavascript("window.__0KAY_LIVE2D__ && window.__0KAY_LIVE2D__.speak(${JSONObject.quote(t)})", null)
    }
    LaunchedEffect(webView, bus.motion.value) {
        val m = bus.motion.value ?: return@LaunchedEffect
        val parts = m.split(":")
        val js = if (parts.size >= 2 && parts[0].isNotEmpty())
            "window.__0KAY_LIVE2D__ && window.__0KAY_LIVE2D__.motion(${JSONObject.quote(parts[0])}, ${JSONObject.quote(parts[1])})"
        else "window.__0KAY_LIVE2D__ && window.__0KAY_LIVE2D__.motion(null, ${JSONObject.quote(parts.last())})"
        webView?.evaluateJavascript(js, null)
    }
    LaunchedEffect(webView, bus.expression.value) {
        val e = bus.expression.value ?: return@LaunchedEffect
        webView?.evaluateJavascript("window.__0KAY_LIVE2D__ && window.__0KAY_LIVE2D__.expression($e)", null)
    }

    if (modelUrl == null) return

    AndroidView(
        modifier = modifier,
        factory = { ctx ->
            WebView(ctx).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = true
                settings.allowUniversalAccessFromFileURLs = true
                setBackgroundColor(android.graphics.Color.TRANSPARENT)
                webViewClient = WebViewClient()
                webView = this
            }
        },
        update = { wv ->
            val html = "file:///android_asset/live2d/live2d.html?base=${java.net.URLEncoder.encode(repo.api.config.baseUrl, "UTF-8")}" +
                "&model=${java.net.URLEncoder.encode(repo.api.absoluteUrl(modelUrl.orEmpty()), "UTF-8")}"
            if (wv.url != html) wv.loadUrl(html)
        },
    )

    DisposableEffect(Unit) {
        onDispose { webView?.destroy(); webView = null }
    }
}
