/**
 * 0kay-mcp is an MCP client gateway. It connects to configured external MCP
 * servers, discovers their tools, and provides a small stable API for Agent
 * and L.I.F.E. It intentionally does not auto-start arbitrary commands.
 */
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
export class McpManager {
    connections = new Map();
    tools = new Map();
    configure(servers) {
        const next = new Set(servers.filter((server) => server.enabled !== false).map((server) => server.id));
        for (const [id, conn] of this.connections) {
            if (!next.has(id)) {
                conn.process?.kill();
                this.connections.delete(id);
                this.tools.delete(id);
            }
        }
        for (const server of servers) {
            if (!server.id || server.enabled === false)
                continue;
            const existing = this.connections.get(server.id);
            if (existing && JSON.stringify(existing.config) === JSON.stringify(server))
                continue;
            existing?.process?.kill();
            this.connections.set(server.id, { config: server, pending: new Map(), buffer: '', initialized: false });
            this.tools.delete(server.id);
        }
    }
    async refresh() {
        for (const id of this.connections.keys())
            await this.refreshServer(id);
        return this.listTools();
    }
    listTools() {
        return [...this.tools.values()].flat().sort((a, b) => `${a.server}:${a.name}`.localeCompare(`${b.server}:${b.name}`));
    }
    async callTool(server, tool, args) {
        const conn = this.connections.get(server);
        if (!conn)
            throw new Error(`MCP server '${server}' is not configured`);
        await this.initialize(conn);
        return this.request(conn, 'tools/call', { name: tool, arguments: args });
    }
    async close() {
        for (const conn of this.connections.values())
            conn.process?.kill();
        this.connections.clear();
        this.tools.clear();
    }
    async refreshServer(id) {
        const conn = this.connections.get(id);
        if (!conn)
            return;
        await this.initialize(conn);
        const result = await this.request(conn, 'tools/list', {});
        const raw = Array.isArray(result?.tools) ? result.tools : [];
        this.tools.set(id, raw.filter((tool) => tool && typeof tool.name === 'string').map((tool) => ({
            server: id,
            name: tool.name,
            description: tool.description || '',
            inputSchema: tool.inputSchema || tool.input_schema || { type: 'object', properties: {} },
        })));
    }
    async initialize(conn) {
        if (conn.initialized)
            return;
        if (conn.config.transport === 'stdio')
            this.ensureProcess(conn);
        await this.request(conn, 'initialize', {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: '0kay-mcp', version: '0.1.0' },
        });
        await this.notify(conn, 'notifications/initialized', {});
        conn.initialized = true;
    }
    ensureProcess(conn) {
        if (conn.process && !conn.process.killed)
            return;
        if (!conn.config.command)
            throw new Error(`MCP stdio server '${conn.config.id}' needs command`);
        const child = spawn(conn.config.command, conn.config.args || [], { shell: process.platform === 'win32', stdio: 'pipe', windowsHide: true });
        conn.process = child;
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (data) => this.consumeStdio(conn, data));
        child.stderr.on('data', (data) => console.warn(`[0kay-mcp:${conn.config.id}] ${data.toString().trim()}`));
        child.on('exit', () => {
            conn.process = undefined;
            conn.initialized = false;
            for (const pending of conn.pending.values())
                pending.reject(new Error(`MCP server '${conn.config.id}' exited`));
            conn.pending.clear();
        });
    }
    consumeStdio(conn, data) {
        conn.buffer += data;
        for (;;) {
            const lineEnd = conn.buffer.indexOf('\n');
            if (lineEnd < 0)
                return;
            const line = conn.buffer.slice(0, lineEnd).trim();
            conn.buffer = conn.buffer.slice(lineEnd + 1);
            if (!line)
                continue;
            try {
                this.resolveResponse(conn, JSON.parse(line));
            }
            catch { /* ignore malformed server log lines */ }
        }
    }
    resolveResponse(conn, response) {
        if (response.id === undefined)
            return;
        const pending = conn.pending.get(String(response.id));
        if (!pending)
            return;
        conn.pending.delete(String(response.id));
        if (response.error)
            pending.reject(new Error(response.error.message || `MCP error ${response.error.code ?? ''}`));
        else
            pending.resolve(response.result);
    }
    async request(conn, method, params) {
        const id = randomUUID();
        if (conn.config.transport === 'http')
            return this.httpRequest(conn, { jsonrpc: '2.0', id, method, params });
        const process = conn.process;
        if (!process?.stdin.writable)
            throw new Error(`MCP server '${conn.config.id}' is unavailable`);
        const response = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                conn.pending.delete(id);
                reject(new Error(`MCP ${method} timed out`));
            }, 30_000);
            conn.pending.set(id, {
                resolve: (value) => { clearTimeout(timer); resolve(value); },
                reject: (error) => { clearTimeout(timer); reject(error); },
            });
        });
        process.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
        return response;
    }
    async notify(conn, method, params) {
        if (conn.config.transport === 'http') {
            await this.httpRequest(conn, { jsonrpc: '2.0', method, params });
            return;
        }
        const process = conn.process;
        if (!process?.stdin.writable)
            throw new Error(`MCP server '${conn.config.id}' is unavailable`);
        process.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
    }
    async httpRequest(conn, body) {
        if (!conn.config.url)
            throw new Error(`MCP HTTP server '${conn.config.id}' needs url`);
        const response = await fetch(conn.config.url, {
            method: 'POST',
            headers: { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json', ...(conn.config.headers || {}) },
            body: JSON.stringify(body),
        });
        if (!response.ok)
            throw new Error(`MCP server '${conn.config.id}' returned ${response.status}`);
        const text = await response.text();
        const jsonLine = text.split(/\r?\n/).find((line) => line.startsWith('data:'))?.replace(/^data:\s*/, '') || text;
        const parsed = JSON.parse(jsonLine);
        if (parsed.error)
            throw new Error(parsed.error.message || `MCP error ${parsed.error.code ?? ''}`);
        return parsed.result;
    }
}
//# sourceMappingURL=index.js.map