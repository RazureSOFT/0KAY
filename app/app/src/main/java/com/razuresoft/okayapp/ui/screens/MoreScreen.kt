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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.int
import com.razuresoft.okayapp.data.str
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.Routes
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.theme.TextFaint
import com.razuresoft.okayapp.ui.theme.TextMain
import kotlinx.coroutines.launch

@Composable
fun MoreScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var usageSummary by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        runCatching {
            val u = repo.api.get("/api/usage").asObject()
            usageSummary = "${u.int("total_tokens")} tokens · ${u.int("request_count")} 次请求"
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("服务")
        Column {
            RowItem("服务器", repo.api.config.baseUrl, onClick = { nav.navigate(Routes.Scan) })
            RowItem("用量统计", usageSummary, onClick = { nav.navigate(Routes.Usage) })
        }

        SectionTitle("伙伴")
        Column {
            RowItem("Live2D 形象", onClick = { nav.navigate(Routes.Companion) })
            RowItem("记忆", onClick = { nav.navigate(Routes.Memory) })
            RowItem("技能", onClick = { nav.navigate(Routes.Skills) })
            RowItem("通知", onClick = { nav.navigate(Routes.Notifications) })
        }

        SectionTitle("Agent")
        Column {
            RowItem("收件箱 / 审批", onClick = { nav.navigate(Routes.Inbox) })
            RowItem("权限", onClick = { nav.navigate(Routes.Permissions) })
        }

        SectionTitle("配置")
        Column {
            RowItem("设置", onClick = { nav.navigate(Routes.Settings) })
            RowItem("供应商与模型", onClick = { nav.navigate(Routes.Providers) })
            RowItem("插件", onClick = { nav.navigate(Routes.Plugins) })
            RowItem("关于", onClick = { nav.navigate(Routes.About) })
        }

        SectionTitle("会话")
        Column {
            RowItem("断开连接", subtitle = "清除本机的服务器配置", onClick = {
                scope.launch {
                    repo.chat.cancelStream()
                    repo.store.clear()
                    repo.api.config = com.razuresoft.okayapp.data.ServerConfig()
                    repo.chat.resetSession()
                    nav.navigate(Routes.Login) { popUpTo(0) }
                }
            })
        }
        Spacer(Modifier.height(20.dp))
        Text(
            "0KAY for Android · 原生 Compose",
            color = TextFaint,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(18.dp),
        )
    }
}
