/**
 * 0kay Minecraft bot service.
 *
 * A single local HTTP service that L.I.F.E (or any local component) calls to
 * connect a bot to a Minecraft server, chat, and let it play alongside people.
 * Java Edition uses mineflayer; Bedrock uses bedrock-protocol. An optional
 * autopilot loop asks Core's model gateway for one action per tick.
 */

import http from 'http';
import { BotController } from './controller.js';
import { Autopilot } from './autopilot.js';
import { startPlugin } from './plugin.js';

const PORT = Number(process.env.MINECRAFT_PORT) || 8765;
const HOST = process.env.MINECRAFT_BIND_HOST || '127.0.0.1';
const CORE_URL = process.env.CORE_HTTP_ADDR || process.env.CORE_HTTP || 'http://127.0.0.1:8080';
const TOKEN = process.env.MINECRAFT_TOKEN || '';

const controller = new BotController({ coreUrl: CORE_URL });
const autopilot = new Autopilot(controller, { coreUrl: CORE_URL });
controller.autopilot = autopilot;

const serverSettings = {};
let pluginHandle = null;

function mergedConnectArgs(args = {}) {
  return {
    edition: args.edition || serverSettings.default_edition || undefined,
    host: args.host || serverSettings.default_host || undefined,
    port: args.port || serverSettings.default_port || undefined,
    username: args.username || serverSettings.default_username || undefined,
    version: args.version,
    auth: args.auth,
    password: args.password || args.server_password || serverSettings.default_password || undefined,
    microsoft_password: args.microsoft_password,
  };
}

async function pollSettings() {
  try {
    const res = await fetch(`${CORE_URL}/api/settings/minecraft`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const body = await res.json();
    Object.assign(serverSettings, body?.values || {});
  } catch {
    // Core not reachable yet; keep previous defaults
  }
}

const sseClients = new Set();
controller.on((type, data) => {
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
});

function send(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(text);
}

function authorized(req) {
  if (!TOKEN) return true;
  return (req.headers.authorization || '') === `Bearer ${TOKEN}`;
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 262144) { reject(new Error('request too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) { resolve({}); return; }
      try { resolve(JSON.parse(raw)); } catch (error) { reject(new Error(`invalid JSON: ${error.message}`)); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'OPTIONS') {
    send(res, 204, {});
    return;
  }
  if (path === '/health') {
    send(res, 200, { ok: true, connected: controller.connected, edition: controller.edition, pluginId: pluginHandle?.pluginId || null });
    return;
  }
  if (path === '/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`data: ${JSON.stringify({ type: 'state', data: controller.status() })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }
  if (!authorized(req)) {
    send(res, 401, { error: 'unauthorized' });
    return;
  }

  try {
    if (req.method === 'GET' && path === '/status') {
      send(res, 200, { ...controller.status(), pluginId: pluginHandle?.pluginId || null, settings: serverSettings });
      return;
    }
    if (req.method === 'GET' && path === '/autopilot') {
      send(res, 200, autopilot.status());
      return;
    }
    if (req.method !== 'POST') {
      send(res, 405, { error: 'method not allowed' });
      return;
    }

    const body = await readJson(req);

    if (path === '/action') {
      const action = String(body.action || '');
      const args = action === 'connect' ? mergedConnectArgs(body.args || {}) : (body.args || {});
      const result = await controller.action(action, args);
      send(res, 200, { ok: true, result });
      return;
    }
    if (path === '/autopilot/start') {
      send(res, 200, { ok: true, autopilot: autopilot.start(body) });
      return;
    }
    if (path === '/autopilot/stop') {
      send(res, 200, { ok: true, autopilot: autopilot.stop('api') });
      return;
    }

    const shortcut = path.replace(/^\//, '');
    const allowed = new Set(['connect', 'disconnect', 'chat', 'follow', 'goto', 'stop', 'look', 'dig', 'place', 'attack', 'inventory', 'use', 'players']);
    if (allowed.has(shortcut)) {
      const args = shortcut === 'connect' ? mergedConnectArgs({ ...body, ...(body.args || {}) }) : { ...body };
      const result = await controller.action(shortcut, args);
      send(res, 200, { ok: true, result });
      return;
    }

    send(res, 404, { error: `unknown endpoint: ${path}` });
  } catch (error) {
    send(res, 200, { ok: false, error: error.message });
  }
});

server.listen(PORT, HOST, async () => {
  console.log(`[minecraft] 0kay Minecraft bot service listening on http://${HOST}:${PORT}`);
  console.log(`[minecraft] Core model gateway: ${CORE_URL}`);
  console.log(`[minecraft] Editions: java (mineflayer), bedrock (bedrock-protocol)`);
  await pollSettings();
  setInterval(pollSettings, 15_000).unref();
  try {
    pluginHandle = await startPlugin({ address: `http://${HOST}:${PORT}`, getActiveTasks: () => (controller.connected ? 1 : 0) });
  } catch (error) {
    console.warn(`[minecraft] Core plugin registration failed: ${error.message}`);
  }
});

function shutdown() {
  console.log('[minecraft] shutting down');
  autopilot.stop('shutdown');
  pluginHandle?.stop();
  controller.action('disconnect').catch(() => {});
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
