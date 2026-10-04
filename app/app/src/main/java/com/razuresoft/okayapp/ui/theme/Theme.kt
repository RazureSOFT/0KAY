package com.razuresoft.okayapp.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Bg = Color(0xFF0B1020)
val BgAlt = Color(0xFF0E1530)
val CardC = Color(0xFF141B36)
val CardAlt = Color(0xFF1A2344)
val BorderC = Color(0xFF243056)
val TextMain = Color(0xFFE8ECFF)
val TextDim = Color(0xFF9AA4C7)
val TextFaint = Color(0xFF6B76A0)
val Primary = Color(0xFF5B8CFF)
val Success = Color(0xFF3DDC84)
val Warn = Color(0xFFFFB454)
val Danger = Color(0xFFFF5C5C)
val UserBubble = Color(0xFF24406F)
val Accent = Color(0xFFA78BFA)

private val okayColors = darkColorScheme(
    primary = Primary,
    onPrimary = Color.White,
    background = Bg,
    onBackground = TextMain,
    surface = CardC,
    onSurface = TextMain,
    surfaceVariant = CardAlt,
    onSurfaceVariant = TextDim,
    outline = BorderC,
    error = Danger,
    onError = Color.White,
    secondary = Accent,
)

@Composable
fun OkayTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = okayColors, content = content)
}
