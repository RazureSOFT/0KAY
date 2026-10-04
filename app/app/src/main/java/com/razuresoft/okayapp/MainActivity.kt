package com.razuresoft.okayapp

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.CompositionLocalProvider
import androidx.lifecycle.lifecycleScope
import com.razuresoft.okayapp.data.AppRepo
import com.razuresoft.okayapp.data.parsePairing
import com.razuresoft.okayapp.ui.AppRoot
import com.razuresoft.okayapp.ui.LocalRepo
import com.razuresoft.okayapp.ui.theme.OkayTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private lateinit var repo: AppRepo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        repo = AppRepo(applicationContext)
        handlePairingIntent(intent)
        setContent {
            CompositionLocalProvider(LocalRepo provides repo) {
                OkayTheme { AppRoot() }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handlePairingIntent(intent)
    }

    /** 0kay://pair?url=...&token=...&pin=... 扫码/深链配对 */
    private fun handlePairingIntent(intent: Intent?) {
        val text = intent?.dataString() ?: return
        val cfg = parsePairing(text) ?: return
        lifecycleScope.launch {
            repo.store.save(cfg.baseUrl, cfg.token, cfg.pin)
            repo.api.config = cfg
        }
    }
}
