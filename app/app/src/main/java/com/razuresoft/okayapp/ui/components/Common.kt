package com.razuresoft.okayapp.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.unit.dp
import com.razuresoft.okayapp.ui.theme.BorderC
import com.razuresoft.okayapp.ui.theme.CardAlt
import com.razuresoft.okayapp.ui.theme.CardC
import com.razuresoft.okayapp.ui.theme.Danger
import com.razuresoft.okayapp.ui.theme.Primary
import com.razuresoft.okayapp.ui.theme.TextDim
import com.razuresoft.okayapp.ui.theme.TextFaint
import com.razuresoft.okayapp.ui.theme.TextMain

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScreenScaffold(
    title: String,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
    content: @Composable (PaddingValues) -> Unit,
) {
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(title, fontWeight = FontWeight.Bold)
                        if (!subtitle.isNullOrBlank()) {
                            Text(subtitle, color = TextDim, style = MaterialTheme.typography.labelSmall, maxLines = 1)
                        }
                    }
                },
                navigationIcon = {
                    if (onBack != null) {
                        IconButton(onClick = onBack) {
                            Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "返回", tint = TextMain)
                        }
                    }
                },
                actions = actions,
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = TextMain,
                ),
            )
        },
        content = content,
    )
}

@Composable
fun CardBox(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(CardC)
            .border(1.dp, BorderC, RoundedCornerShape(12.dp))
            .padding(14.dp),
        content = content,
    )
}

@Composable
fun SectionTitle(text: String) {
    Text(
        text,
        color = TextDim,
        fontWeight = FontWeight.Bold,
        style = MaterialTheme.typography.labelLarge,
        modifier = Modifier.padding(start = 18.dp, top = 14.dp, bottom = 6.dp),
    )
}

@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    loading: Boolean = false,
) {
    androidx.compose.material3.Button(
        onClick = onClick,
        enabled = enabled && !loading,
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
    ) {
        if (loading) {
            CircularProgressIndicator(Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
        } else {
            Text(text, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
fun TonalButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    androidx.compose.material3.FilledTonalButton(onClick = onClick, modifier = modifier, shape = RoundedCornerShape(12.dp)) {
        Text(text)
    }
}

@Composable
fun DangerTextButton(text: String, onClick: () -> Unit) {
    TextButton(onClick = onClick) { Text(text, color = Danger) }
}

@Composable
fun AppTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    singleLine: Boolean = true,
    password: Boolean = false,
    numeric: Boolean = false,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        placeholder = placeholder?.let { { Text(it, color = TextFaint) } },
        modifier = modifier.fillMaxWidth(),
        singleLine = singleLine,
        shape = RoundedCornerShape(12.dp),
        visualTransformation = if (password) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(
            keyboardType = when {
                numeric -> KeyboardType.Number
                password -> KeyboardType.Password
                else -> KeyboardType.Text
            },
        ),
    )
}

@Composable
fun RowItem(
    title: String,
    subtitle: String? = null,
    value: String? = null,
    onClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null,
) {
    Row(
        Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.fillMaxWidth(0.62f)) {
            Text(title, color = TextMain)
            if (!subtitle.isNullOrBlank()) {
                Text(subtitle, color = TextFaint, style = MaterialTheme.typography.labelSmall)
            }
        }
        Spacer(Modifier.weight(1f))
        if (value != null) {
            Text(value, color = TextDim, style = MaterialTheme.typography.bodySmall, maxLines = 1)
        }
        trailing?.invoke()
    }
}

@Composable
fun Badge(text: String, color: Color = Primary) {
    Box(
        Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(color.copy(alpha = 0.2f))
            .border(1.dp, color, RoundedCornerShape(999.dp))
            .padding(horizontal = 8.dp, vertical = 2.dp),
    ) {
        Text(text, color = color, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun Loading(label: String? = null) {
    Column(
        Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        CircularProgressIndicator(color = Primary)
        if (label != null) {
            Spacer(Modifier.height(8.dp))
            Text(label, color = TextDim)
        }
    }
}

@Composable
fun ErrorBox(message: String?, onRetry: (() -> Unit)? = null) {
    if (message.isNullOrBlank()) return
    Column(
        Modifier
            .fillMaxWidth()
            .padding(14.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Danger.copy(alpha = 0.15f))
            .border(1.dp, Danger, RoundedCornerShape(12.dp))
            .padding(12.dp),
    ) {
        Text(message, color = TextMain)
        if (onRetry != null) {
            Spacer(Modifier.height(6.dp))
            TonalButton("重试", onRetry)
        }
    }
}

@Composable
fun EmptyBox(text: String) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(text, color = TextFaint)
    }
}

@Composable
fun DividerLine() {
    Box(
        Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(BorderC),
    )
}
