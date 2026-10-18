//! Small client for the 0kay Core HTTP API.
//!
//! ```no_run
//! let okay = okay_devkit::Okay::new(None);      // arg > CORE_HTTP > OKAY_CORE_PORT > 8080
//! let core = okay.get_core().unwrap();
//! let plugin = okay.get_plugin("agent").unwrap().unwrap();
//! assert!(plugin.is_enabled());
//! ```

use serde::{Deserialize, Deserializer, Serialize};
use std::env;

pub const DEFAULT_PORT: u16 = 8080;

/// Treat an explicit `null` the same as a missing field.
fn null_default<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: Default + Deserialize<'de>,
{
    Ok(Option::<T>::deserialize(deserializer)?.unwrap_or_default())
}

/// Resolve the Core base URL: explicit port > CORE_HTTP(_ADDR) > OKAY_CORE_PORT > default.
pub fn resolve_base_url(port: Option<u16>) -> String {
    if let Some(value) = port {
        return format!("http://127.0.0.1:{value}");
    }
    for key in ["CORE_HTTP", "CORE_HTTP_ADDR"] {
        if let Ok(value) = env::var(key) {
            let trimmed = value.trim();
            if !trimmed.is_empty() {
                return trimmed.trim_end_matches('/').to_string();
            }
        }
    }
    if let Ok(value) = env::var("OKAY_CORE_PORT") {
        if let Ok(parsed) = value.trim().parse::<u16>() {
            return format!("http://127.0.0.1:{parsed}");
        }
    }
    format!("http://127.0.0.1:{DEFAULT_PORT}")
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Plugin {
    #[serde(default, deserialize_with = "null_default")]
    pub plugin_id: String,
    #[serde(default, deserialize_with = "null_default")]
    pub name: String,
    #[serde(default, deserialize_with = "null_default")]
    pub version: String,
    #[serde(default, deserialize_with = "null_default")]
    pub status: String,
    #[serde(default, deserialize_with = "null_default")]
    pub capabilities: Vec<String>,
    #[serde(default, deserialize_with = "null_default")]
    pub active_tasks: i64,
    #[serde(default, deserialize_with = "null_default")]
    pub disabled: bool,
}

impl Plugin {
    pub fn is_enabled(&self) -> bool {
        !self.disabled
    }
    pub fn is_healthy(&self) -> bool {
        self.status == "PLUGIN_STATUS_HEALTHY"
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Core {
    #[serde(default, deserialize_with = "null_default")]
    pub status: String,
    #[serde(default, deserialize_with = "null_default")]
    pub healthy: i64,
    #[serde(default, deserialize_with = "null_default")]
    pub plugins: i64,
}

#[derive(Debug, Clone)]
pub struct Okay {
    pub base_url: String,
}

impl Okay {
    pub fn new(port: Option<u16>) -> Self {
        Self { base_url: resolve_base_url(port) }
    }

    pub fn get(&self, path: &str) -> Result<String, Box<dyn std::error::Error>> {
        let response = ureq::get(&format!("{}{}", self.base_url, path)).call()?;
        Ok(response.into_string()?)
    }

    pub fn health(&self) -> Result<Core, Box<dyn std::error::Error>> {
        Ok(serde_json::from_str(&self.get("/health")?)?)
    }

    pub fn get_core(&self) -> Result<Core, Box<dyn std::error::Error>> {
        self.health()
    }

    pub fn plugins(&self) -> Result<Vec<Plugin>, Box<dyn std::error::Error>> {
        Ok(serde_json::from_str(&self.get("/api/plugins")?)?)
    }

    /// Find a plugin by plugin_id or name (case-insensitive).
    pub fn get_plugin(&self, key: &str) -> Result<Option<Plugin>, Box<dyn std::error::Error>> {
        let needle = key.trim().to_lowercase();
        for plugin in self.plugins()? {
            if plugin.plugin_id.to_lowercase() == needle || plugin.name.to_lowercase() == needle {
                return Ok(Some(plugin));
            }
        }
        Ok(None)
    }

    pub fn settings_sections(&self) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let value: serde_json::Value = serde_json::from_str(&self.get("/api/settings/sections")?)?;
        Ok(value.get("sections").cloned().unwrap_or(serde_json::json!([])))
    }
}
