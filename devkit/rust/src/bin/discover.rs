// Discover the running 0kay Core and write ../surface.json.
use okay_devkit::Okay;

fn main() {
    let okay = Okay::new(None);
    let health = okay.health().expect("health");
    let plugins = okay.plugins().expect("plugins");
    let sections = okay.settings_sections().expect("settings");

    let surface = serde_json::json!({
        "base_url": okay.base_url,
        "health": health,
        "plugins": plugins,
        "settings_sections": sections,
    });

    std::fs::write("../surface.json", serde_json::to_string_pretty(&surface).unwrap())
        .expect("write surface.json");

    println!("0kay Core at {}", okay.base_url);
    println!("  status: {} healthy={} plugins={}", health.status, health.healthy, health.plugins);
    println!("  plugins: {}", plugins.iter().map(|p| p.name.as_str()).collect::<Vec<_>>().join(", "));
    println!("  settings sections: {}", sections.as_array().map(|a| a.len()).unwrap_or(0));
    println!("  wrote ../surface.json");
}
