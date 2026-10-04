package com.razuresoft.okayapp.ui.screens

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
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.bool
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.str
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.Routes
import com.razuresoft.okayapp.ui.components.Badge
import com.razuresoft.okayapp.ui.components.DangerTextButton
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject

@Composable
fun ProvidersScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var data by remember { mutableStateOf<JsonObject?>(null) }
    var error by remember { mutableStateOf<String?>(null) }

    fun refresh() {
        scope.launch { runCatching { data = repo.api.get("/api/providers").asObject() }.onFailure { error = it.message } }
    }
    LaunchedEffect(Unit) { refresh() }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        ErrorBox(error)
        val d = data
        if (d == null) {
            if (error == null) EmptyBox("加载中…")
            return@Column
        }
        SectionTitle("默认")
        Column {
            RowItem("默认供应商", d.str("default_provider_id").ifEmpty { "未设置" })
            RowItem("默认模型", d.str("default_model").ifEmpty { "未设置" })
        }
        SectionTitle("供应商 (${d.arr("providers").size})")
        d.arr("providers").forEach { raw ->
            val p = raw.asObject()
            Column {
                RowItem(
                    title = p.str("name").ifEmpty { p.str("id") },
                    subtitle = "${p.str("provider")} · ${p.str("base_url")}",
                    onClick = { nav.navigate("${Routes.Provider}/${p.str("id")}").let { } },
                    trailing = { if (p.bool("enabled")) Badge("启用") else Badge("停用", com.razuresoft.okayapp.ui.theme.Warn) },
                )
                Row(Modifier.padding(start = 14.dp, bottom = 6.dp)) {
                    if (p.str("default_model").isNotEmpty()) {
                        Text("默认: ${p.str("default_model")}", color = TextDim, style = MaterialTheme.typography.labelSmall)
                    }
                    Spacer(Modifier.weight(1f))
                    DangerTextButton("删除", {
                        scope.launch {
                            runCatching { repo.api.delete("/api/providers/${p.str("id")}") }
                            refresh()
                        }
                    })
                }
            }
        }
        Column(Modifier.padding(14.dp)) {
            PrimaryButton("新增供应商", { nav.navigate("${Routes.Provider}/__new__") }, Modifier.fillMaxWidth())
        }
        Spacer(Modifier.height(24.dp))
    }
}
