package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.data.ServerConfig
import com.razuresoft.okayapp.data.normalizeBase
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.bool
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.Routes
import com.razuresoft.okayapp.ui.components.AppTextField
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var url by remember { mutableStateOf("http://192.168.1.15:8080") }
    var token by remember { mutableStateOf("") }
    var pin by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        val c = repo.store.current()
        if (c.baseUrl.isNotBlank()) url = c.baseUrl
        token = c.token
        pin = c.pin
    }

    Column(
        Modifier
            .padding(20.dp)
            .fillMaxWidth()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(40.dp))
        Text("0KAY", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Black)
        Text("连接你自托管的 AI 伙伴", color = TextDim)
        Spacer(Modifier.height(28.dp))

        TonalButton("扫描二维码连接", onClick = { nav.navigate(Routes.Scan) })
        Spacer(Modifier.height(18.dp))

        AppTextField(url, { url = it }, label = "服务器地址", placeholder = "http://192.168.1.15:8080")
        Spacer(Modifier.height(10.dp))
        AppTextField(token, { token = it }, label = "API Token（可选）", password = true)
        Spacer(Modifier.height(10.dp))
        AppTextField(pin, { pin = it }, label = "访问 PIN（可选）", password = true, numeric = true)
        Spacer(Modifier.height(16.dp))
        ErrorBox(error)
        PrimaryButton("连接", onClick = {
            scope.launch {
                error = null
                busy = true
                try {
                    val base = normalizeBase(url)
                    if (base.isBlank()) throw IllegalStateException("请输入服务器地址")
                    val cfg = ServerConfig(base, token.trim(), pin.trim())
                    repo.store.save(cfg.baseUrl, cfg.token, cfg.pin)
                    repo.api.config = cfg
                    val session = repo.api.get("/api/auth/session").asObject()
                    if (session.bool("requires_auth") && !session.bool("authenticated") && cfg.token.isBlank() && cfg.pin.isBlank()) {
                        throw IllegalStateException("该服务器需要凭证，请填写 Token 或 PIN")
                    }
                    repo.api.get("/health")
                    nav.navigate(Routes.Chat) { popUpTo(0) }
                } catch (e: Exception) {
                    error = e.message
                } finally {
                    busy = false
                }
            }
        }, loading = busy, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(20.dp))
        Text(
            "提示：手机需与 Core 在同一局域网。Core 需监听局域网（CORE_BIND_HOST=0.0.0.0），或把本机网段加入 CORE_TRUSTED_NETWORKS。",
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            style = MaterialTheme.typography.labelSmall,
        )
    }
}
