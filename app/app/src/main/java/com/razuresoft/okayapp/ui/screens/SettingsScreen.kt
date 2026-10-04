package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.Routes
import com.razuresoft.okayapp.ui.components.EmptyBox
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.SectionTitle
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.str

/** 设置：来自 /api/settings/sections 的分区列表（含插件注入的 section）。 */
@Composable
fun SettingsScreen(nav: NavHostController) {
    val repo = LocalRepo.current
    var sections by remember { mutableStateOf<List<JsonObject>>(emptyList()) }
    var loaded by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        runCatching {
            sections = repo.api.get("/api/settings/sections", listOf("values" to "1"))
                .asObject().arr("sections").map { it.asObject() }
        }
        loaded = true
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        SectionTitle("内置")
        Column {
            RowItem("Live2D 形象", subtitle = "模型选择与上传", onClick = { nav.navigate(Routes.Companion) })
        }
        if (sections.isNotEmpty()) {
            SectionTitle("分区")
            Column {
                sections.forEach { s ->
                    RowItem(
                        s.str("label").ifEmpty { s.str("id") },
                        subtitle = s.str("plugin_name").ifEmpty { null },
                        onClick = { nav.navigate("${Routes.Section}/${s.str("id")}") },
                    )
                }
            }
        }
        if (loaded && sections.isEmpty()) EmptyBox("没有可配置的分区")
    }
}
