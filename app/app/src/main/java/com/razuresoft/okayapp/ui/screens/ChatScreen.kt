package com.razuresoft.okayapp.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.Send
import androidx.compose.material.icons.outlined.AddPhotoAlternate
import androidx.compose.material.icons.outlined.AttachFile
import androidx.compose.material.icons.outlined.GraphicEq
import androidx.compose.material.icons.outlined.Refresh
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import coil.compose.AsyncImage
import com.razuresoft.okayapp.data.ChatMessage
import com.razuresoft.okayapp.data.FileRef
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.dbl
import com.razuresoft.okayapp.data.formatTime
import com.razuresoft.okayapp.data.str
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.DangerTextButton
import com.razuresoft.okayapp.ui.components.Live2DStage
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.Accent
import com.razuresoft.okayapp.ui.theme.CardAlt
import com.razuresoft.okayapp.ui.theme.Danger
import com.razuresoft.okayapp.ui.theme.Primary
import com.razuresoft.okayapp.ui.theme.Success
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextFaint
import com.razuresoft.okayapp.ui.theme.UserBubble
import com.razuresoft.okayapp.ui.theme.Warn
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

@Composable
fun ChatScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val chat = repo.chat
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var input by remember { mutableStateOf("") }
    var showStage by remember { mutableStateOf(true) }
    val pendingImages = remember { mutableStateListOf<String>() }
    val pendingFiles = remember { mutableStateListOf<FileRef>() }
    val listState = rememberLazyListState()

    // proactive notifications -> bubbles
    LaunchedEffect(Unit) {
        while (isActive) {
            delay(4000)
            val notes = chat.fetchNotifications()
            if (notes.isNotEmpty()) {
                notes.forEach { (id, text, _) ->
                    if (chat.messages.none { it.id == "notification_$id" }) {
                        chat.messages.add(ChatMessage("notification_$id", "assistant", text))
                    }
                }
                chat.acknowledgeNotifications(notes.map { it.first })
            }
        }
    }

    LaunchedEffect(chat.messages.size, chat.isTyping.value) {
        if (chat.messages.isNotEmpty()) listState.animateScrollToItem(chat.messages.size)
    }

    val pickImage = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) scope.launch {
            val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: return@launch
            val name = (uri.lastPathSegment ?: "image.png").substringAfterLast('/')
            try {
                val resp = repo.api.upload("/api/images", "file", bytes, name, "image/png").asObject()
                pendingImages.add(resp.str("url"))
            } catch (e: Exception) { chat.error.value = e.message }
        }
    }
    val pickFile = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) scope.launch {
            val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: return@launch
            val name = (uri.lastPathSegment ?: "file").substringAfterLast('/')
            val mime = context.contentResolver.getType(uri) ?: "application/octet-stream"
            try {
                val resp = repo.api.upload("/api/files", "file", bytes, name, mime).asObject()
                pendingFiles.add(FileRef(resp.str("name").ifEmpty { name }, resp.str("url"), mime, resp.dbl("size").toLong()))
            } catch (e: Exception) { chat.error.value = e.message }
        }
    }

    Column(Modifier.fillMaxSize().imePadding()) {
        // Live2D stage header
        if (showStage) {
            Box(Modifier.fillMaxWidth().height(240.dp)) {
                Live2DStage(repo, Modifier.fillMaxSize())
                IconButton(
                    onClick = { showStage = false },
                    modifier = Modifier.align(Alignment.TopEnd).padding(4.dp),
                ) { Icon(Icons.Outlined.VisibilityOff, "隐藏形象", tint = TextDim) }
            }
        } else {
            IconButton(onClick = { showStage = true }) {
                Icon(Icons.Outlined.Visibility, "显示形象", tint = TextDim)
            }
        }

        chat.error.value?.let {
            Text(it, color = Danger, modifier = Modifier.padding(horizontal = 14.dp))
        }

        LazyColumn(state = listState, modifier = Modifier.weight(1f), contentPadding = androidx.compose.foundation.layout.PaddingValues(vertical = 8.dp)) {
            items(chat.messages, key = { it.id }) { msg -> MessageBubble(msg) }
            if (chat.isTyping.value) {
                item {
                    Row(Modifier.padding(horizontal = 16.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(Modifier.size(16.dp), strokeWidth = 2.dp, color = Primary)
                        Spacer(Modifier.size(8.dp))
                        Text("思考中…", color = TextDim)
                    }
                }
            }
        }

        if (pendingImages.isNotEmpty() || pendingFiles.isNotEmpty()) {
            Row(Modifier.padding(horizontal = 14.dp, vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                pendingImages.forEach { Text("🖼 ${it.substringAfterLast('/')}", color = Accent, style = MaterialTheme.typography.labelSmall) }
                pendingFiles.forEach { Text("📎 ${it.name}", color = Accent, style = MaterialTheme.typography.labelSmall) }
                Text("清除", color = TextFaint, modifier = Modifier.clickable { pendingImages.clear(); pendingFiles.clear() })
            }
        }

        Row(
            Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 8.dp),
            verticalAlignment = Alignment.Bottom,
        ) {
            IconButton(onClick = { pickImage.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) }) {
                Icon(Icons.Outlined.AddPhotoAlternate, "图片", tint = TextDim)
            }
            IconButton(onClick = { pickFile.launch(arrayOf("*/*")) }) {
                Icon(Icons.Outlined.AttachFile, "附件", tint = TextDim)
            }
            IconButton(onClick = { chat.voiceEnabled.value = !chat.voiceEnabled.value }) {
                Icon(
                    Icons.Outlined.GraphicEq, "语音",
                    tint = if (chat.voiceEnabled.value) Primary else TextDim,
                )
            }
            OutlinedTextField(
                value = input,
                onValueChange = { input = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("说点什么…", color = TextFaint) },
                shape = RoundedCornerShape(22.dp),
                maxLines = 4,
            )
            IconButton(
                onClick = {
                    val text = input.trim()
                    if (text.isEmpty() || chat.isTyping.value) return@IconButton
                    input = ""
                    chat.sendMessage(text, pendingImages.toList(), pendingFiles.toList()) { }
                    pendingImages.clear(); pendingFiles.clear()
                },
                enabled = !chat.isTyping.value,
            ) {
                if (chat.isTyping.value) {
                    CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp, color = Primary)
                } else {
                    Icon(Icons.AutoMirrored.Outlined.Send, "发送", tint = Primary)
                }
            }
        }
        Row(Modifier.padding(horizontal = 14.dp, vertical = 2.dp)) {
            Text("整理上下文", color = TextFaint, style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.clickable { scope.launch { runCatching { repo.api.post("/api/life/compact") } } })
            Spacer(Modifier.size(14.dp))
            Text("清除对话", color = TextFaint, style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.clickable { chat.resetSession() })
        }
    }
}

@Composable
private fun MessageBubble(msg: ChatMessage) {
    val isUser = msg.role == "user"
    Column(
        Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start,
    ) {
        var showThink by remember { mutableStateOf(false) }
        Column(
            Modifier
                .widthIn(max = 320.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(if (isUser) UserBubble else CardAlt)
                .border(1.dp, if (isUser) UserBubble else com.razuresoft.okayapp.ui.theme.BorderC, RoundedCornerShape(14.dp))
                .padding(10.dp),
        ) {
            msg.images.forEach { img ->
                AsyncImage(
                    model = img, contentDescription = null, contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxWidth().height(160.dp).clip(RoundedCornerShape(8.dp)).padding(vertical = 2.dp),
                )
            }
            msg.files.forEach { f ->
                Text("📎 ${f.name}", color = Primary, style = MaterialTheme.typography.labelMedium)
            }
            if (msg.content.isNotBlank()) {
                Text(msg.content, color = com.razuresoft.okayapp.ui.theme.TextMain)
            }
            msg.emotion?.let { emo ->
                val v = emo.dbl("valence"); val irr = emo.dbl("irritation")
                val (label, color) = when {
                    irr > 0.7 -> "烦躁" to Danger
                    v > 0.5 -> "开心" to Success
                    v < -0.3 -> "低落" to Warn
                    else -> "平静" to TextDim
                }
                Box(
                    Modifier.padding(top = 4.dp).clip(RoundedCornerShape(999.dp))
                        .background(color.copy(alpha = 0.2f)).padding(horizontal = 8.dp, vertical = 1.dp),
                ) { Text(label, color = color, style = MaterialTheme.typography.labelSmall) }
            }
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(formatTime(msg.timestamp), color = TextFaint, style = MaterialTheme.typography.labelSmall, modifier = Modifier.padding(top = 2.dp))
            if (!isUser && !msg.thinkSummary.isNullOrBlank()) {
                Text(
                    if (showThink) " 收起思考" else " THINK",
                    color = Accent, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { showThink = !showThink }.padding(top = 2.dp),
                )
            }
        }
        if (showThink && !msg.thinkSummary.isNullOrBlank()) {
            Text(
                msg.thinkSummary.orEmpty(),
                color = TextDim, style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 2.dp).widthIn(max = 320.dp).clip(RoundedCornerShape(8.dp))
                    .background(CardAlt).padding(8.dp),
            )
        }
    }
}
