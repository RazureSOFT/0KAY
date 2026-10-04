package com.razuresoft.okayapp.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Switch
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
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.components.AppTextField
import com.razuresoft.okayapp.ui.components.CardBox
import com.razuresoft.okayapp.ui.components.ErrorBox
import com.razuresoft.okayapp.ui.components.Loading
import com.razuresoft.okayapp.ui.components.PrimaryButton
import com.razuresoft.okayapp.ui.components.RowItem
import com.razuresoft.okayapp.ui.components.TonalButton
import com.razuresoft.okayapp.ui.theme.TextDim
import kotlinx.coroutines.launch
import kotlinx.serialization.json.JsonObject
import com.razuresoft.okayapp.data.arr
import com.razuresoft.okayapp.data.asObject
import com.razuresoft.okayapp.data.jsNum
import com.razuresoft.okayapp.data.jsStr
import com.razuresoft.okayapp.data.jsonOf
import com.razuresoft.okayapp.data.obj
import com.razuresoft.okayapp.data.str

/**
 * 通用设置分区表单：字段类型 bool/number/text/select/model/models，
 * 保存整 dict 到 POST /api/settings/{id}；支持插件的 test 按钮。
 */
@Composable
fun SectionScreen(nav: NavHostController, id: String) {
    val repo = LocalRepo.current
    val scope = rememberCoroutineScope()
    var section by remember { mutableStateOf<JsonObject?>(null) }
    var values by remember { mutableStateOf<Map<String, String>>(emptyMap()) }
    var bools by remember { mutableStateOf<Map<String, Boolean>>(emptyMap()) }
    var error by remember { mutableStateOf<String?>(null) }
    var saved by remember { mutableStateOf(false) }
    var testResult by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(id) {
        try {
            val resp = repo.api.get("/api/settings/sections", listOf("values" to "1")).asObject()
            val s = resp.arr("sections").map { it.asObject() }.firstOrNull { it.str("id") == id }
            section = s
            if (s != null) {
                val v = s.obj("values")
                values = v.keys.associateWith { v[it]?.toString()?.trim('"') ?: "" }
                bools = s.arr("fields").map { it.asObject() }.filter { it.str("type") == "bool" }
                    .associate { it.str("key") to (v[it.str("key")]?.toString()?.toBooleanStrictOrNull() ?: false) }
            }
        } catch (e: Exception) {
            error = e.message
        }
    }

    val s = section ?: run {
        if (error != null) ErrorBox(error) else Loading()
        return
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        Text(
            s.str("description"),
            color = TextDim,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 4.dp),
        )
        s.arr("fields").forEach { raw ->
            val f = raw.asObject()
            val key = f.str("key")
            val label = f.str("label").ifEmpty { key }
            when (f.str("type")) {
                "bool" -> RowItem(
                    title = label,
                    subtitle = f.str("help").ifEmpty { null },
                    trailing = {
                        Switch(
                            checked = bools[key] ?: false,
                            onCheckedChange = { bools = bools + (key to it); saved = false },
                        )
                    },
                )
                "select" -> Column {
                    Text(label, color = TextDim, style = MaterialTheme.typography.labelMedium, modifier = Modifier.padding(horizontal = 18.dp))
                    val options = f.arr("options").map { it.toString().trim('"') }
                    Row(Modifier.padding(horizontal = 14.dp, vertical = 4.dp)) {
                        options.forEach { opt ->
                            TonalButton(
                                if ((values[key] ?: "") == opt) "● $opt" else "○ $opt",
                                { values = values + (key to opt); saved = false },
                                Modifier.padding(end = 6.dp),
                            )
                        }
                    }
                }
                else -> Column(Modifier.padding(horizontal = 14.dp, vertical = 6.dp)) {
                    AppTextField(
                        values[key] ?: "",
                        { values = values + (key to it); saved = false },
                        label = label,
                        numeric = f.str("type") == "number",
                    )
                }
            }
        }

        ErrorBox(error)
        Column(Modifier.padding(14.dp)) {
            if (saved) Text("已保存 ✓", color = com.razuresoft.okayapp.ui.theme.Success, style = MaterialTheme.typography.labelMedium)
            testResult?.let { Text(it, color = TextDim, style = MaterialTheme.typography.labelSmall) }
            Spacer(Modifier.height(6.dp))
            Row {
                PrimaryButton("保存", {
                    scope.launch {
                        try {
                            val body = values.mapValues { (k, v) ->
                                if (bools.containsKey(k)) com.razuresoft.okayapp.data.jsBool(bools[k] ?: false)
                                else (v.toDoubleOrNull()?.let { com.razuresoft.okayapp.data.jsNum(it) } ?: jsStr(v))
                            }
                            repo.api.post("/api/settings/$id", jsonOf(*body.map { (k, v) -> k to v }.toTypedArray()))
                            error = null; saved = true
                        } catch (e: Exception) {
                            error = e.message; saved = false
                        }
                    }
                })
                Spacer(Modifier.padding(6.dp))
                TonalButton("测试", {
                    scope.launch {
                        try {
                            repo.api.post("/api/settings/$id/test")
                            testResult = "测试通过 ✓"
                        } catch (e: Exception) {
                            testResult = "测试失败: ${e.message}"
                        }
                    }
                })
            }
        }
        Spacer(Modifier.height(24.dp))
    }
}
