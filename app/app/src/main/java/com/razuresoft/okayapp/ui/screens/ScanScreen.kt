package com.razuresoft.okayapp.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanOptions
import com.razuresoft.okayapp.data.parsePairing
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.Routes
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.Loading
import com.razuresoft.okayapp.ui.components.ScreenScaffold
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch
import androidx.compose.material3.Text

@Composable
fun ScanScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var status by remember { mutableStateOf("正在打开相机…") }
    var error by remember { mutableStateOf<String?>(null) }

    val launcher = rememberLauncherForActivityResult(ScanContract()) { result ->
        val contents = result.contents
        if (contents.isNullOrBlank()) {
            status = "已取消，可返回手动输入"
            return@rememberLauncherForActivityResult
        }
        val cfg = parsePairing(contents)
        if (cfg == null) {
            error = "无法识别的二维码"
            return@rememberLauncherForActivityResult
        }
        scope.launch {
            status = "正在连接并保存…"
            error = null
            try {
                repo.store.save(cfg.baseUrl, cfg.token, cfg.pin)
                repo.api.config = cfg
                repo.api.get("/health")
                status = "连接成功，已记住该服务器"
                nav.navigate(Routes.Chat) { popUpTo(0) }
            } catch (e: Exception) {
                error = e.message
                status = "连接失败"
            }
        }
    }

    LaunchedEffect(Unit) {
        launcher.launch(
            ScanOptions().apply {
                setDesiredBarcodeFormats(ScanOptions.QR_CODE)
                setPrompt("扫描 0KAY 连接二维码")
                setBeepEnabled(false)
                setOrientationLocked(false)
                setBarcodeImageEnabled(false)
            },
        )
    }

    ScreenScaffold(title = "扫码连接", subtitle = "对准电脑 WebUI 的「连接」二维码", onBack = { nav.popBackStack() }) { padding ->
        Column(Modifier.padding(padding).padding(20.dp)) {
            Loading(status)
            Spacer(Modifier.height(10.dp))
            ErrorBox(error)
            Spacer(Modifier.height(10.dp))
            Text("扫描后会自动保存连接信息，下次打开直接使用。", color = TextDim)
        }
    }
}
