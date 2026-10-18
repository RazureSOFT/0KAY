import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Small client for the 0kay Core HTTP API (JDK 11+, no dependencies).
 *
 * <pre>
 * Okay okay = new Okay(null);            // arg > CORE_HTTP > OKAY_CORE_PORT > 8080
 * Core core = okay.getCore();
 * Plugin plugin = okay.getPlugin("agent");
 * boolean enabled = plugin.isEnabled();
 * </pre>
 */
public final class OkayDevkit {
    public static final int DEFAULT_PORT = 8080;

    /** Resolve the Core base URL: explicit port > CORE_HTTP(_ADDR) > OKAY_CORE_PORT > default. */
    public static String resolveBaseUrl(Integer port) {
        if (port != null && port > 0) return "http://127.0.0.1:" + port;
        for (String key : new String[]{"CORE_HTTP", "CORE_HTTP_ADDR"}) {
            String value = System.getenv(key);
            if (value != null && !value.isBlank()) return value.trim().replaceAll("/+$", "");
        }
        String envPort = System.getenv("OKAY_CORE_PORT");
        if (envPort != null && envPort.trim().matches("\\d+")) return "http://127.0.0.1:" + envPort.trim();
        return "http://127.0.0.1:" + DEFAULT_PORT;
    }

    public static final class Plugin {
        private final Map<String, Object> data;
        Plugin(Map<String, Object> data) { this.data = data; }
        public String id() { return str(data.get("plugin_id")); }
        public String name() { return str(data.get("name")); }
        public String version() { return str(data.get("version")); }
        public String status() { return str(data.get("status")); }
        public boolean isEnabled() { return !bool(data.get("disabled")); }
        public boolean isHealthy() { return "PLUGIN_STATUS_HEALTHY".equals(status()); }
        public Map<String, Object> raw() { return data; }
        @Override public String toString() {
            return "<Plugin " + name() + " (" + id() + ") enabled=" + isEnabled() + " status=" + status() + ">";
        }
    }

    public static final class Core {
        private final Map<String, Object> data;
        private final String baseUrl;
        Core(Map<String, Object> data, String baseUrl) { this.data = data; this.baseUrl = baseUrl; }
        public String status() { return str(data.get("status")); }
        public int healthy() { return (int) num(data.get("healthy")); }
        public int plugins() { return (int) num(data.get("plugins")); }
        public String baseUrl() { return baseUrl; }
        @Override public String toString() {
            return "<Core " + baseUrl + " status=" + status() + " healthy=" + healthy() + "/" + plugins() + ">";
        }
    }

    public static final class Okay {
        private final String baseUrl;
        private final HttpClient http;

        public Okay(Integer port) {
            this.baseUrl = resolveBaseUrl(port);
            this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
        }

        public String baseUrl() { return baseUrl; }

        public String get(String path) throws Exception {
            HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + path))
                    .timeout(Duration.ofSeconds(10)).GET().build();
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 300) throw new RuntimeException(response.statusCode() + ": " + response.body());
            return response.body();
        }

        @SuppressWarnings("unchecked")
        public Core getCore() throws Exception {
            return new Core((Map<String, Object>) Json.parse(get("/health")), baseUrl);
        }

        @SuppressWarnings("unchecked")
        public List<Plugin> plugins() throws Exception {
            List<Object> items = (List<Object>) Json.parse(get("/api/plugins"));
            List<Plugin> out = new ArrayList<>();
            for (Object item : items) out.add(new Plugin((Map<String, Object>) item));
            return out;
        }

        /** Find a plugin by plugin_id or name (case-insensitive); null if absent. */
        public Plugin getPlugin(String key) throws Exception {
            String needle = key == null ? "" : key.trim().toLowerCase();
            for (Plugin plugin : plugins()) {
                if (plugin.id().toLowerCase().equals(needle) || plugin.name().toLowerCase().equals(needle)) return plugin;
            }
            return null;
        }

        @SuppressWarnings("unchecked")
        public List<Object> settingsSections() throws Exception {
            Map<String, Object> payload = (Map<String, Object>) Json.parse(get("/api/settings/sections"));
            Object sections = payload.get("sections");
            return sections instanceof List ? (List<Object>) sections : List.of();
        }
    }

    // --- tiny JSON parser / serializer (objects, arrays, strings, numbers, bool, null) ---
    static final class Json {
        private final String source;
        private int index;

        private Json(String source) { this.source = source; this.index = 0; }

        static Object parse(String text) { return new Json(text).value(); }

        static String stringify(Object value) {
            StringBuilder out = new StringBuilder();
            write(value, out);
            return out.toString();
        }

        private Object value() {
            skipSpace();
            if (index >= source.length()) throw new IllegalArgumentException("unexpected end of JSON");
            char c = source.charAt(index);
            switch (c) {
                case '{': return object();
                case '[': return array();
                case '"': return string();
                case 't': expect("true"); return Boolean.TRUE;
                case 'f': expect("false"); return Boolean.FALSE;
                case 'n': expect("null"); return null;
                default: return number();
            }
        }

        private Map<String, Object> object() {
            Map<String, Object> map = new LinkedHashMap<>();
            index++;
            skipSpace();
            if (peek('}')) { index++; return map; }
            while (true) {
                skipSpace();
                String key = string();
                skipSpace();
                expectChar(':');
                map.put(key, value());
                skipSpace();
                if (peek(',')) { index++; continue; }
                expectChar('}');
                return map;
            }
        }

        private List<Object> array() {
            List<Object> list = new ArrayList<>();
            index++;
            skipSpace();
            if (peek(']')) { index++; return list; }
            while (true) {
                list.add(value());
                skipSpace();
                if (peek(',')) { index++; continue; }
                expectChar(']');
                return list;
            }
        }

        private String string() {
            expectChar('"');
            StringBuilder out = new StringBuilder();
            while (index < source.length()) {
                char c = source.charAt(index++);
                if (c == '"') return out.toString();
                if (c != '\\') { out.append(c); continue; }
                char escape = source.charAt(index++);
                switch (escape) {
                    case '"': out.append('"'); break;
                    case '\\': out.append('\\'); break;
                    case '/': out.append('/'); break;
                    case 'b': out.append('\b'); break;
                    case 'f': out.append('\f'); break;
                    case 'n': out.append('\n'); break;
                    case 'r': out.append('\r'); break;
                    case 't': out.append('\t'); break;
                    case 'u': out.append((char) Integer.parseInt(source.substring(index, index + 4), 16)); index += 4; break;
                    default: throw new IllegalArgumentException("bad escape \\" + escape);
                }
            }
            throw new IllegalArgumentException("unterminated string");
        }

        private Object number() {
            int start = index;
            while (index < source.length() && "-+.eE0123456789".indexOf(source.charAt(index)) >= 0) index++;
            String text = source.substring(start, index);
            if (text.contains(".") || text.contains("e") || text.contains("E")) return Double.parseDouble(text);
            return Long.parseLong(text);
        }

        private void skipSpace() { while (index < source.length() && Character.isWhitespace(source.charAt(index))) index++; }
        private boolean peek(char c) { return index < source.length() && source.charAt(index) == c; }
        private void expectChar(char c) {
            skipSpace();
            if (index >= source.length() || source.charAt(index) != c) throw new IllegalArgumentException("expected '" + c + "' at " + index);
            index++;
        }
        private void expect(String literal) {
            if (!source.startsWith(literal, index)) throw new IllegalArgumentException("expected " + literal + " at " + index);
            index += literal.length();
        }

        private static void write(Object value, StringBuilder out) {
            if (value == null) { out.append("null"); return; }
            if (value instanceof String) { out.append('"').append(escape((String) value)).append('"'); return; }
            if (value instanceof Number || value instanceof Boolean) { out.append(value); return; }
            if (value instanceof Map) {
                out.append('{');
                boolean first = true;
                for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {
                    if (!first) out.append(',');
                    first = false;
                    out.append('"').append(escape(String.valueOf(entry.getKey()))).append("\":");
                    write(entry.getValue(), out);
                }
                out.append('}');
                return;
            }
            if (value instanceof List) {
                out.append('[');
                boolean first = true;
                for (Object item : (List<?>) value) {
                    if (!first) out.append(',');
                    first = false;
                    write(item, out);
                }
                out.append(']');
                return;
            }
            out.append('"').append(escape(String.valueOf(value))).append('"');
        }

        private static String escape(String text) {
            StringBuilder out = new StringBuilder();
            for (int i = 0; i < text.length(); i++) {
                char c = text.charAt(i);
                switch (c) {
                    case '"': out.append("\\\""); break;
                    case '\\': out.append("\\\\"); break;
                    case '\n': out.append("\\n"); break;
                    case '\r': out.append("\\r"); break;
                    case '\t': out.append("\\t"); break;
                    default: out.append(c);
                }
            }
            return out.toString();
        }
    }

    static String str(Object value) { return value == null ? "" : String.valueOf(value); }
    static boolean bool(Object value) { return value instanceof Boolean && (Boolean) value; }
    static double num(Object value) { return value instanceof Number ? ((Number) value).doubleValue() : 0; }

    /** Discover the running Core and write ../surface.json. */
    public static void main(String[] args) throws Exception {
        Okay okay = new Okay(null);
        Core core = okay.getCore();
        List<Plugin> plugins = okay.plugins();
        List<Object> sections = okay.settingsSections();

        Map<String, Object> surface = new LinkedHashMap<>();
        surface.put("base_url", okay.baseUrl());
        surface.put("health", Map.of("status", core.status(), "healthy", core.healthy(), "plugins", core.plugins()));
        List<Object> rawPlugins = new ArrayList<>();
        for (Plugin plugin : plugins) rawPlugins.add(plugin.raw());
        surface.put("plugins", rawPlugins);
        surface.put("settings_sections", sections);
        surface.put("generated_at", java.time.Instant.now().toString());

        Path out = Path.of("..", "surface.json");
        Files.writeString(out, Json.stringify(surface), StandardCharsets.UTF_8);

        System.out.println("0kay Core at " + okay.baseUrl());
        System.out.println("  status: " + core.status() + " healthy=" + core.healthy() + " plugins=" + core.plugins());
        System.out.print("  plugins: ");
        for (Plugin plugin : plugins) System.out.print(plugin.name() + " ");
        System.out.println();
        System.out.println("  settings sections: " + sections.size());
        System.out.println("  wrote " + out.toAbsolutePath());
    }
}
