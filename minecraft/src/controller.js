/**
 * BotController owns the live session and exposes a single action surface that
 * the HTTP API and the autopilot both call. Exactly one connection is kept at a
 * time; switching edition or reconnecting disposes the previous bot cleanly.
 */

import { JavaBot } from './java.js';
import { BedrockBot } from './bedrock.js';

const CHAT_LIMIT = 200;

export class BotController {
  constructor({ coreUrl = 'http://127.0.0.1:8080' } = {}) {
    this.coreUrl = coreUrl;
    this.bot = null;
    this.edition = null;
    this.chat = [];
    this.logs = [];
    this.listeners = new Set();
    this.autopilot = null;
    this.lastAction = null;
    this.events = [];
    this.eventSeq = 0;
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type, data) {
    if (type === 'chat') {
      this.chat.push(data);
      if (this.chat.length > CHAT_LIMIT) this.chat.splice(0, this.chat.length - CHAT_LIMIT);
    }
    if (type === 'log') {
      this.logs.push({ time: new Date().toISOString(), message: data });
      if (this.logs.length > CHAT_LIMIT) this.logs.splice(0, this.logs.length - CHAT_LIMIT);
    }
    const event = { seq: ++this.eventSeq, time: new Date().toISOString(), type, data };
    this.events.push(event);
    if (this.events.length > 1000) this.events.splice(0, this.events.length - 1000);
    for (const listener of this.listeners) {
      try { listener(type, data); } catch { /* listener errors must not break the bot */ }
    }
  }

  eventsSince(since = 0) {
    const cursor = Number(since) || 0;
    return this.events.filter((event) => event.seq > cursor);
  }

  async connect(args = {}) {
    const edition = String(args.edition || process.env.MINECRAFT_EDITION || 'java').toLowerCase() === 'bedrock' ? 'bedrock' : 'java';
    await this.#dispose();
    this.edition = edition;
    this.bot = edition === 'bedrock' ? new BedrockBot((t, d) => this.emit(t, d)) : new JavaBot((t, d) => this.emit(t, d));
    this.emit('log', `controller: connecting ${edition}`);
    const result = await this.bot.connect(args);
    return { ...result, ...this.status() };
  }

  async #dispose() {
    if (this.autopilot?.running) this.autopilot.stop('reconnect');
    const bot = this.bot;
    this.bot = null;
    if (bot) {
      try { await bot.disconnect(); } catch { /* ignore */ }
    }
  }

  get connected() {
    return this.bot?.state === 'connected';
  }

  requireBot() {
    if (!this.bot) throw new Error('no bot session (call connect first)');
    return this.bot;
  }

  status() {
    return {
      edition: this.edition,
      bot: this.bot ? this.bot.describe() : null,
      autopilot: this.autopilot ? this.autopilot.status() : { running: false },
      recentChat: this.chat.slice(-20),
      coreUrl: this.coreUrl,
    };
  }

  async action(name, args = {}) {
    this.lastAction = { name, args, time: new Date().toISOString() };
    switch (name) {
      case 'connect': return this.connect(args);
      case 'disconnect': await this.#dispose(); this.edition = null; return { disconnected: true };
      case 'chat': return this.requireBot().chat(args.message ?? args.text);
      case 'follow': return this.requireBot().follow(args.player ?? args.target, args.distance);
      case 'goto': return this.requireBot().goto(args.x, args.y, args.z);
      case 'stop': return this.requireBot().stop();
      case 'look': return this.requireBot().lookAt(args.target || args.player || args);
      case 'dig': return this.requireBot().dig(args.x, args.y, args.z);
      case 'place': return this.requireBot().place(args.x, args.y, args.z, args.item);
      case 'attack': return this.requireBot().attack(args.target || args.player);
      case 'inventory': return this.requireBot().inventory();
      case 'use': return this.requireBot().use(args.item);
      case 'players': return { players: this.bot ? this.bot.playerList?.() ?? this.bot.describe().players : [] };
      case 'events': return { cursor: this.eventSeq, events: this.eventsSince(args.since) };
      case 'status': return this.status();
      default: throw new Error(`unknown action: ${name}`);
    }
  }
}
