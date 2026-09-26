/**
 * Bedrock Edition bot backed by bedrock-protocol.
 *
 * Bedrock's movement protocol is stateful and version specific, so autonomous
 * play is intentionally limited: connect, chat, player list and status are
 * reliable; raw movement is best-effort and may be ignored by strict servers.
 */

import bedrock from 'bedrock-protocol';

const CHAT_LIMIT = 200;

export class BedrockBot {
  constructor(emit) {
    this.emit = emit;
    this.client = null;
    this.state = 'idle';
    this.lastError = '';
    this.chatLog = [];
    this.players = new Map();
    this.options = {};
    this.entityId = null;
  }

  describe() {
    return {
      edition: 'bedrock',
      state: this.state,
      error: this.lastError,
      username: this.options.username || '',
      host: this.options.host || '',
      port: this.options.port || 19132,
      version: this.options.version || '',
      connected: this.state === 'connected',
      position: null,
      health: null,
      food: null,
      players: [...this.players.values()],
      note: 'Bedrock autonomy is limited to chat; movement is best-effort.',
    };
  }

  async connect(opts = {}) {
    await this.disconnect();
    this.options = {
      host: opts.host || process.env.MINECRAFT_BEDROCK_HOST || process.env.MINECRAFT_HOST || '127.0.0.1',
      port: Number(opts.port) || Number(process.env.MINECRAFT_BEDROCK_PORT) || 19132,
      username: opts.username || process.env.MINECRAFT_USERNAME || '0kay_bot',
      version: opts.version || process.env.MINECRAFT_BEDROCK_VERSION || undefined,
      offline: opts.auth === 'microsoft' ? false : true,
    };
    this.lastError = '';
    this.state = 'connecting';
    this.emit('log', `bedrock: connecting to ${this.options.host}:${this.options.port} as ${this.options.username}`);

    this.client = bedrock.createClient({
      host: this.options.host,
      port: this.options.port,
      username: this.options.username,
      version: this.options.version,
      offline: this.options.offline,
      skipPing: true,
    });
    this.#wire(this.client);
    return { accepted: true, edition: 'bedrock', state: this.state };
  }

  #wire(client) {
    client.on('join', () => this.emit('log', 'bedrock: joined'));
    client.on('spawn', () => {
      this.state = 'connected';
      this.emit('state', this.describe());
      this.emit('log', 'bedrock: spawned');
    });
    client.on('text', (packet) => {
      const data = packet?.data || packet || {};
      const username = data.source_name || data.sourceName || data.xuid || '';
      const message = data.message || '';
      if (message) this.#pushChat(username, message);
    });
    client.on('player_list', (packet) => this.#ingestPlayerList(packet));
    client.on('kick', (reason) => this.#fail(`kicked: ${JSON.stringify(reason)}`));
    client.on('error', (error) => this.#fail(error.message));
    client.on('close', () => {
      if (this.state !== 'error') this.state = 'idle';
      this.emit('state', this.describe());
    });
  }

  #ingestPlayerList(packet) {
    const records = packet?.records?.records || packet?.records || [];
    for (const record of records) {
      const type = record.type || packet?.records?.type;
      if (type === 'add' || type === 'add_player') {
        const name = record.name || record.username || record.xbox_user_id || '';
        if (name) this.players.set(name, { name, uuid: record.uuid || '', xuid: record.xuid || '' });
      } else if (type === 'remove') {
        if (record.name) this.players.delete(record.name);
      }
    }
    if (this.entityId === null && packet?.records?.records?.[0]?.entity_unique_id) {
      this.entityId = packet.records.records[0].entity_unique_id;
    }
  }

  #pushChat(username, message) {
    const entry = { time: new Date().toISOString(), username, message };
    this.chatLog.push(entry);
    if (this.chatLog.length > CHAT_LIMIT) this.chatLog.splice(0, this.chatLog.length - CHAT_LIMIT);
    this.emit('chat', entry);
  }

  #fail(message) {
    this.lastError = message;
    this.state = 'error';
    this.emit('log', `bedrock: ${message}`);
    this.emit('state', this.describe());
  }

  requireReady() {
    if (!this.client || this.state !== 'connected') throw new Error(`bedrock bot not connected (${this.state}${this.lastError ? `: ${this.lastError}` : ''})`);
    return this.client;
  }

  async chat(message) {
    const client = this.requireReady();
    const text = String(message || '').slice(0, 250);
    if (!text) throw new Error('message is required');
    const candidates = [
      { type: 'chat', needs_translation: false, source_name: this.options.username, xuid: '', platform_chat_id: '', filtered_message: '', message: text },
      { type: 'chat', needs_translation: false, source_name: this.options.username, xuid: '', message: text },
    ];
    let lastError = null;
    for (const payload of candidates) {
      try {
        client.queue('text', payload);
        return { sent: true, message: text };
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(`bedrock chat failed: ${lastError?.message || 'unknown error'}`);
  }

  async chatOnly() {
    throw new Error('unsupported');
  }

  unsupported(what) {
    throw new Error(`${what} is not supported on Bedrock (chat and status only)`);
  }

  async follow() { this.unsupported('follow'); }
  async goto() { this.unsupported('goto'); }
  async stop() { this.unsupported('stop'); }
  async lookAt() { this.unsupported('lookAt'); }
  async dig() { this.unsupported('dig'); }
  async place() { this.unsupported('place'); }
  async attack() { this.unsupported('attack'); }
  async use() { this.unsupported('use'); }

  async inventory() {
    return { held: null, items: [], note: 'inventory is not exposed on Bedrock' };
  }

  async disconnect() {
    const client = this.client;
    this.client = null;
    this.state = 'idle';
    this.players.clear();
    if (client) {
      try { client.disconnect('0kay disconnect'); } catch { /* ignore */ }
    }
    return { disconnected: true };
  }
}
