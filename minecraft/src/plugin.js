/**
 * Core plugin registration for the Minecraft bot service.
 *
 * Registers as a TOOL plugin, advertises its HTTP address and a settings
 * section, then heartbeats every 10s so Core keeps it listed as healthy.
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as os from 'os';
import * as path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_DIR = process.env.PROTO_DIR || path.resolve(__dirname, '../../proto');
const CORE_ADDRESS = process.env.CORE_ADDRESS || 'localhost:50051';

const LOADER_OPTIONS = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [PROTO_DIR],
};

export const MINECRAFT_SETTINGS_SECTION = {
  id: 'minecraft',
  label: 'Minecraft',
  icon: 'box',
  order: 85,
  description: '0kay Minecraft 机器人服务：连接你服务器的默认参数',
  fields: [
    { key: 'default_edition', type: 'select', label: '默认版本', defaultValue: 'java', options: ['java', 'bedrock'], help: 'Java 用 mineflayer，Bedrock 用 bedrock-protocol' },
    { key: 'default_host', type: 'text', label: '默认服务器', defaultValue: '', help: '例如 mc.example.com' },
    { key: 'default_port', type: 'number', label: '默认端口', defaultValue: '', help: 'Java 默认 25565，Bedrock 默认 19132' },
    { key: 'default_username', type: 'text', label: '默认昵称', defaultValue: '0kay_bot' },
    { key: 'autopilot_default', type: 'bool', label: '连接后自动游玩', defaultValue: 'false', help: '进入服务器后自动开启 AI 挂机' },
    { key: 'autopilot_interval_ms', type: 'number', label: '决策间隔(ms)', defaultValue: '12000' },
  ],
};

async function manifestVersion() {
  try {
    const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
    return manifest.version || '0.1.0';
  } catch {
    return '0.1.0';
  }
}

function hostInfo() {
  return {
    hostname: os.hostname(),
    os: `${os.type()} ${os.release()}`,
    arch: os.arch(),
    cpuModel: os.cpus()[0]?.model || '',
    cpuCores: os.cpus().length || 0,
    memoryTotalBytes: String(os.totalmem()),
    memoryAvailableBytes: String(os.freemem()),
    workdir: process.cwd(),
  };
}

export async function startPlugin({ address, getActiveTasks = () => 0 }) {
  const def = protoLoader.loadSync(path.join(PROTO_DIR, 'core/v1/core.proto'), LOADER_OPTIONS);
  const corePkg = grpc.loadPackageDefinition(def).core?.v1;
  if (!corePkg?.PluginService) {
    throw new Error('core.v1.PluginService not found in proto definition');
  }
  const client = new corePkg.PluginService(CORE_ADDRESS, grpc.credentials.createInsecure());
  let pluginId = null;
  let stopped = false;

  const register = () => new Promise((resolve) => {
    const request = {
      pluginInfo: {
        name: 'minecraft',
        version: '0.1.0',
        description: '0kay Minecraft bot - connect, chat and play on Java/Bedrock servers',
        author: '0kay',
        pluginType: 'PLUGIN_TYPE_TOOL',
      },
      capabilities: ['minecraft'],
      address,
      settingsSections: [MINECRAFT_SETTINGS_SECTION],
    };
    client.waitForReady(new Date(Date.now() + 5000), async (err) => {
      if (err) { resolve(null); return; }
      request.pluginInfo.version = await manifestVersion();
      client.Register(request, { deadline: Date.now() + 5000 }, (error, response) => {
        if (error || !response?.success) {
          resolve(null);
          return;
        }
        pluginId = response.pluginId;
        console.log(`[minecraft] registered with Core: plugin_id=${pluginId}`);
        resolve(pluginId);
      });
    });
  });

  const heartbeat = () => {
    if (stopped) return;
    if (!pluginId) { void register(); return; }
    client.Heartbeat(
      { pluginId, status: 'PLUGIN_STATUS_HEALTHY', activeTasks: getActiveTasks(), host: hostInfo() },
      { deadline: Date.now() + 5000 },
      (err, response) => {
        if (err) {
          if (err.code === grpc.status.UNAVAILABLE || err.code === grpc.status.NOT_FOUND) pluginId = null;
          return;
        }
        if (response?.shutdownSignal) console.warn('[minecraft] Core requested shutdown');
        else if (!response?.ok) pluginId = null;
      },
    );
  };

  await register();
  const timer = setInterval(heartbeat, 10_000);

  return {
    get pluginId() { return pluginId; },
    stop() {
      stopped = true;
      clearInterval(timer);
      try { client.close(); } catch { /* ignore */ }
    },
  };
}
