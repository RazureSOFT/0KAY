/**
 * 0kay-mcp is an MCP client gateway. It connects to configured external MCP
 * servers, discovers their tools, and provides a small stable API for Agent
 * and L.I.F.E. It intentionally does not auto-start arbitrary commands.
 */
export interface McpServerConfig {
    id: string;
    transport: 'stdio' | 'http';
    command?: string;
    args?: string[];
    url?: string;
    headers?: Record<string, string>;
    enabled?: boolean;
}
export interface McpToolInfo {
    server: string;
    name: string;
    description: string;
    inputSchema?: Record<string, any>;
}
export declare class McpManager {
    private connections;
    private tools;
    configure(servers: McpServerConfig[]): void;
    refresh(): Promise<McpToolInfo[]>;
    listTools(): McpToolInfo[];
    callTool(server: string, tool: string, args: Record<string, any>): Promise<any>;
    close(): Promise<void>;
    private refreshServer;
    private initialize;
    private ensureProcess;
    private consumeStdio;
    private resolveResponse;
    private request;
    private notify;
    private httpRequest;
}
//# sourceMappingURL=index.d.ts.map