/**
 * Java Edition bot backed by mineflayer + mineflayer-pathfinder.
 *
 * The controller owns the session; this class only knows how to drive a single
 * Java connection and reports state back through the `emit` callback.
 */

import mineflayer from 'mineflayer';
import pf from 'mineflayer-pathfinder';
import Vec3 from 'vec3';

const { pathfinder, Movements, goals } = pf;

const CHAT_LIMIT = 200;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class JavaBot {
  constructor(emit) {
    this.emit = emit;
    this.bot = null;
    this.state = 'idle';
    this.lastError = '';
    this.chat = [];
    this.options = {};
  }

  describe() {
    const bot = this.bot;
    const pos = bot?.entity?.position;
    return {
      edition: 'java',
      state: this.state,
      error: this.lastError,
      username: this.options.username || '',
      host: this.options.host || '',
      port: this.options.port || 25565,
      version: bot?.version || this.options.version || '',
      connected: this.state === 'connected',
      position: pos ? { x: +pos.x.toFixed(2), y: +pos.y.toFixed(2), z: +pos.z.toFixed(2) } : null,
      health: bot?.health ?? null,
      food: bot?.food ?? null,
      dimension: bot?.game?.dimension || '',
      players: this.playerList(),
      motd: bot?.game?.dimension || '',
    };
  }

  async connect(opts = {}) {
    await this.disconnect();
    this.options = {
      host: opts.host || process.env.MINECRAFT_HOST || '127.0.0.1',
      port: Number(opts.port) || Number(process.env.MINECRAFT_JAVA_PORT) || 25565,
      username: opts.username || process.env.MINECRAFT_USERNAME || '0kay_bot',
      version: opts.version || process.env.MINECRAFT_VERSION || undefined,
      auth: opts.auth === 'microsoft' || opts.password ? 'microsoft' : 'offline',
      password: opts.password || process.env.MINECRAFT_PASSWORD || undefined,
    };
    this.lastError = '';
    this.state = 'connecting';
    this.emit('log', `java: connecting to ${this.options.host}:${this.options.port} as ${this.options.username}`);

    this.bot = mineflayer.createBot({
      host: this.options.host,
      port: this.options.port,
      username: this.options.username,
      version: this.options.version,
      auth: this.options.auth,
      password: this.options.password,
      hideErrors: true,
    });

    this.bot.loadPlugin(pathfinder);
    this.#wire(this.bot);
    return { accepted: true, edition: 'java', state: this.state };
  }

  #wire(bot) {
    bot.once('spawn', () => {
      this.state = 'connected';
      try {
        bot.pathfinder.setMovements(new Movements(bot));
      } catch (error) {
        this.emit('log', `java: pathfinder init failed: ${error.message}`);
      }
      this.emit('state', this.describe());
      this.emit('log', 'java: spawned');
    });
    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      this.#pushChat(username, message);
    });
    bot.on('message', (jsonMsg) => {
      const text = jsonMsg?.toString?.() || '';
      if (text && !this.chat.some((entry) => entry.raw === text)) this.#pushChat('', text, true);
    });
    bot.on('playerJoined', (player) => this.emit('log', `java: ${player.username} joined`));
    bot.on('playerLeft', (player) => this.emit('log', `java: ${player.username} left`));
    bot.on('kicked', (reason) => this.#fail(`kicked: ${typeof reason === 'string' ? reason : JSON.stringify(reason)}`));
    bot.on('error', (error) => this.#fail(error.message));
    bot.on('end', (reason) => {
      this.#pushChat('', `bot disconnected (${reason})`);
      if (this.state !== 'error') this.state = 'idle';
      this.emit('state', this.describe());
    });
  }

  #pushChat(username, message, raw = false) {
    const entry = { time: new Date().toISOString(), username, message, raw };
    this.chat.push(entry);
    if (this.chat.length > CHAT_LIMIT) this.chat.splice(0, this.chat.length - CHAT_LIMIT);
    this.emit('chat', entry);
  }

  #fail(message) {
    this.lastError = message;
    this.state = 'error';
    this.emit('log', `java: ${message}`);
    this.emit('state', this.describe());
  }

  playerList() {
    const bot = this.bot;
    if (!bot) return [];
    return Object.values(bot.players || {}).map((player) => ({
      name: player.username,
      uuid: player.uuid || '',
      ping: player.ping ?? null,
      gamemode: player.gamemode ?? null,
      position: player.entity?.position
        ? { x: +player.entity.position.x.toFixed(1), y: +player.entity.position.y.toFixed(1), z: +player.entity.position.z.toFixed(1) }
        : null,
    }));
  }

  entityByName(name) {
    const bot = this.bot;
    if (!bot) return null;
    const target = String(name || '').toLowerCase();
    if (!target) return null;
    if (target === 'nearest') {
      const me = bot.entity?.position;
      let best = null;
      let bestDist = Infinity;
      for (const entity of Object.values(bot.entities || {})) {
        if (!entity || entity === bot.entity) continue;
        const kind = entity.type || entity.kind;
        if (kind !== 'player' && kind !== 'mob' && kind !== 'hostile' && kind !== 'animal' && kind !== 'passive') continue;
        const dist = me ? me.distanceTo(entity.position) : 0;
        if (dist < bestDist) { bestDist = dist; best = entity; }
      }
      return best;
    }
    const player = bot.players?.[name];
    if (player?.entity) return player.entity;
    for (const entity of Object.values(bot.entities || {})) {
      if ((entity.username || entity.name || '').toLowerCase() === target) return entity;
    }
    return null;
  }

  requireReady() {
    if (!this.bot || this.state !== 'connected') throw new Error(`java bot not connected (${this.state}${this.lastError ? `: ${this.lastError}` : ''})`);
    return this.bot;
  }

  async chat(message) {
    const bot = this.requireReady();
    const text = String(message || '').slice(0, 250);
    if (!text) throw new Error('message is required');
    bot.chat(text);
    return { sent: true, message: text };
  }

  async follow(name, distance = 3) {
    const bot = this.requireReady();
    const entity = this.entityByName(name);
    if (!entity) throw new Error(`entity not found: ${name}`);
    const range = clamp(Number(distance) || 3, 1, 16);
    bot.pathfinder.setGoal(new goals.GoalFollow(entity, range), true);
    return { following: name, distance: range };
  }

  async goto(x, y, z) {
    const bot = this.requireReady();
    const goal = new goals.GoalBlock(Math.floor(Number(x)), Math.floor(Number(y)), Math.floor(Number(z)));
    bot.pathfinder.setGoal(goal);
    return { goingTo: { x: Math.floor(Number(x)), y: Math.floor(Number(y)), z: Math.floor(Number(z)) } };
  }

  async stop() {
    const bot = this.requireReady();
    bot.pathfinder.setGoal(null);
    bot.clearControlStates();
    return { stopped: true };
  }

  async lookAt(target) {
    const bot = this.requireReady();
    if (typeof target === 'object' && target !== null) {
      await bot.lookAt(new Vec3(Number(target.x), Number(target.y), Number(target.z)), true);
      return { lookingAt: target };
    }
    const entity = this.entityByName(target);
    if (!entity) throw new Error(`entity not found: ${target}`);
    await bot.lookAt(entity.position.offset(0, entity.height ? entity.height * 0.9 : 1.6, 0), true);
    return { lookingAt: target };
  }

  async dig(x, y, z) {
    const bot = this.requireReady();
    const block = bot.blockAt(new Vec3(Math.floor(Number(x)), Math.floor(Number(y)), Math.floor(Number(z))));
    if (!block || block.name === 'air') throw new Error('no block at target position');
    await bot.dig(block, true);
    return { dug: block.name, position: { x: block.position.x, y: block.position.y, z: block.position.z } };
  }

  async place(x, y, z, item) {
    const bot = this.requireReady();
    const target = new Vec3(Math.floor(Number(x)), Math.floor(Number(y)), Math.floor(Number(z)));
    if (item) {
      const stack = bot.inventory.items().find((entry) => entry.name.includes(String(item)));
      if (!stack) throw new Error(`item not in inventory: ${item}`);
      await bot.equip(stack, 'hand');
    }
    const reference = bot.blockAt(target.offset(0, -1, 0)) || bot.blockAt(target.offset(1, 0, 0));
    if (!reference || reference.name === 'air') throw new Error('no adjacent block to place against');
    const face = target.minus(reference.position);
    await bot.placeBlock(reference, face);
    return { placed: item || bot.heldItem?.name || 'block', position: { x: target.x, y: target.y, z: target.z } };
  }

  async attack(target) {
    const bot = this.requireReady();
    if (target === 'nearest' || !target) {
      const entity = this.entityByName('nearest');
      if (!entity) throw new Error('no nearby entity');
      bot.attack(entity);
      return { attacked: entity.name || entity.username || entity.type || 'entity' };
    }
    const entity = this.entityByName(target);
    if (!entity) throw new Error(`entity not found: ${target}`);
    bot.attack(entity);
    return { attacked: target };
  }

  async inventory() {
    const bot = this.requireReady();
    const items = bot.inventory.items().map((item) => ({ name: item.name, count: item.count, slot: item.slot }));
    return { held: bot.heldItem?.name || null, items };
  }

  async use(item) {
    const bot = this.requireReady();
    if (item) {
      const stack = bot.inventory.items().find((entry) => entry.name.includes(String(item)));
      if (!stack) throw new Error(`item not in inventory: ${item}`);
      await bot.equip(stack, 'hand');
    }
    await bot.activateItem();
    return { used: item || bot.heldItem?.name || 'held item' };
  }

  async disconnect() {
    const bot = this.bot;
    this.bot = null;
    this.state = 'idle';
    if (bot) {
      try { bot.quit('0kay disconnect'); } catch { /* ignore */ }
      try { bot.end(); } catch { /* ignore */ }
    }
    return { disconnected: true };
  }
}
