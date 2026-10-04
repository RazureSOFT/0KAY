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
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.CardBox
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.theme.Danger
import com.razuresoft.okayapp.ui.theme.Primary
import com.razuresoft.okayapp.ui.theme.Success
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextFaint
import com.razuresoft.okayapp.ui.theme.TextMain
import com.razuresoft.okayapp.ui.theme.Warn
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.serialization.json.JsonObject
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.dbl
import com.razuresoft.okayapp.data.int
import com.razuresoft.okayapp.data.obj
import com.razuresoft.okayapp.data.str

@Composable
fun StatusScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    var state by remember { mutableStateOf<JsonObject?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        while (isActive) {
            try {
                state = runCatching { repo.api.get("/api/state").asObject() }
                    .getOrElse { repo.api.get("/api/life/state").asObject() }
                error = null
            } catch (e: Exception) {
                error = e.message
            }
            delay(5000)
        }
    }

    val s = state
    if (s == null) {
        ErrorBox(error)
        if (error == null) EmptyBox("等待状态…")
        return
    }

    val emo = s.obj("emotion")
    val valence = emo.dbl("valence")
    val arousal = emo.dbl("arousal")
    val connection = emo.dbl("connection")
    val irritation = emo.dbl("irritation")
    val energy = s.dbl("mentalEnergy").coerceIn(0.0, 1.0)
    val sleeping = s.str("isSleeping").toBooleanStrictOrNull() ?: (s.dbl("isSleeping") > 0.0)

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("情绪")
        CardBox {
            EmotionBar("愉悦 valence", valence, if (valence >= 0) Success else Warn)
            EmotionBar("唤醒 arousal", arousal, Primary)
            EmotionBar("联结 connection", connection, Success)
            EmotionBar("烦躁 irritation", irritation, if (irritation > 0.7) Danger else TextDim)
            Spacer(Modifier.height(8.dp))
            Text(
                when {
                    sleeping -> "😴 睡眠中"
                    irritation > 0.7 -> "😠 烦躁"
                    valence > 0.5 -> "😊 开心"
                    valence < -0.3 -> "😢 低落"
                    else -> "🙂 平静"
                },
                fontWeight = FontWeight.SemiBold,
            )
        }

        SectionTitle("精力")
        CardBox {
            LinearProgressIndicator(
                progress = { energy.toFloat() },
                modifier = Modifier.fillMaxWidth().height(8.dp),
                color = if (energy < 0.2) Danger else Primary,
            )
            Spacer(Modifier.height(6.dp))
            Text("心理能量 ${(energy * 100).toInt()}%", color = TextDim, style = MaterialTheme.typography.labelMedium)
        }

        SectionTitle("系统")
        CardBox {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                StatCell("在线 Agent", s.int("onlineAgents").toString())
                StatCell("总 Agent", s.int("totalAgents").toString())
                StatCell("插件", s.int("pluginCount").toString())
                StatCell("健康插件", s.int("healthyPlugins").toString())
            }
            val tasks = s.arr("activeTasks")
            if (tasks.isNotEmpty()) {
                Spacer(Modifier.height(8.dp))
                Text("进行中任务 ${tasks.size}", color = TextMain, fontWeight = FontWeight.SemiBold)
                tasks.forEach { Text("• ${it.asObject().str("prompt").ifEmpty { it.toString().take(60) }}", color = TextDim, style = MaterialTheme.typography.bodySmall) }
            }
        }
        Spacer(Modifier.height(20.dp))
    }
}

@Composable
private fun EmotionBar(label: String, value: Double, color: Color) {
    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(label, color = TextDim, style = MaterialTheme.typography.labelMedium, modifier = Modifier.fillMaxWidth(0.38f))
        LinearProgressIndicator(
            progress = { ((value + 1.0) / 2.0).coerceIn(0.0, 1.0).toFloat() },
            modifier = Modifier.weight(1f).height(6.dp),
            color = color,
        )
        Text("%.2f".format(value), color = TextMain, style = MaterialTheme.typography.labelSmall, modifier = Modifier.padding(start = 8.dp))
    }
}

@Composable
private fun StatCell(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold, color = TextMain)
        Text(label, color = TextFaint, style = MaterialTheme.typography.labelSmall)
    }
}
