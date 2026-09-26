/**
 * BotController owns the live session and exposes a single action surface that
 * the HTTP API and the autopilot both call. Exactly one connection is kept at a
 * time; switching edition or reconnecting disposes the previous bot cleanly.
 *
 * It also owns persistent world knowledge (waypoints + reusable skills) so the
 * bot can learn a server over time.
 */

import * as path from 'path';
import { JavaBot } from './java.js';
import { BedrockBot } from './bedrock.js';
import { WorldStore } from './world.js';

const CHAT_LIMIT = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    const dataDir = process.env.MINECRAFT_DATA_DIR || './data';
    this.world = new WorldStore(path.join(dataDir, 'world.json'));
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

  serverKey() {
    const opts = this.bot?.options || {};
    if (!opts.host) return 'default';
    const port = opts.port || (this.edition === 'bedrock' ? 19132 : 25565);
    return `${opts.host}:${port}`;
  }

  async connect(args = {}) {
    const edition = String(args.edition || process.env.MINECRAFT_EDITION || 'java').toLowerCase() === 'bedrock' ? 'bedrock' : 'java';
    await this.#dispose();
    this.edition = edition;
    this.bot = edition === 'bedrock' ? new BedrockBot((t, d) => this.emit(t, d)) : new JavaBot((t, d) => this.emit(t, d));
    this.emit('log', `controller: connecting ${edition}`);
    const result = await this.bot.connect(args);
    await this.captureWorld();
    return { ...result, ...(await this.status()) };
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

  /** Remember where the bot and other players are, so locations survive restarts. */
  async captureWorld() {
    if (!this.bot || this.bot.state !== 'connected') return;
    const key = this.serverKey();
    const info = this.bot.describe();
    if (info.position) {
      await this.world.addWaypoint(key, { id: 'self', name: 'self', x: info.position.x, y: info.position.y, z: info.position.z, dimension: info.dimension, type: 'position', note: 'last position' }).catch(() => {});
    }
    for (const player of info.players || []) {
      if (player.name === info.username || !player.position) continue;
      await this.world.addWaypoint(key, { id: `player-${player.name}`, name: player.name, x: player.position.x, y: player.position.y, z: player.position.z, dimension: info.dimension, type: 'player', note: 'last seen' }).catch(() => {});
    }
  }

  async worldSnapshot() {
    await this.world.ready;
    const key = this.serverKey();
    const [waypoints, skills] = await Promise.all([this.world.listWaypoints(key), this.world.listSkills(key)]);
    return { server: key, waypoints, skills };
  }

  async status() {
    const bot = this.bot ? this.bot.describe() : null;
    const key = this.serverKey();
    const [waypoints, skills] = await Promise.all([this.world.listWaypoints(key), this.world.listSkills(key)]);
    return {
      edition: this.edition,
      bot,
      autopilot: this.autopilot ? this.autopilot.status() : { running: false },
      recentChat: this.chat.slice(-20),
      coreUrl: this.coreUrl,
      world: { server: key, waypoints: waypoints.length, skills: skills.length },
    };
  }

  async runSkill(id, depth = 0) {
    const key = this.serverKey();
    const skill = await this.world.getSkill(key, id);
    if (!skill) throw new Error(`skill not found: ${id}`);
    if (depth > 0) throw new Error('skill_run cannot be nested');
    const results = [];
    for (const step of skill.steps) {
      if (step.action === 'skill_run') throw new Error('skill_run cannot be nested');
      await this.action(step.action, step.args || {});
      results.push(step.action);
      const wait = Number(step.waitMs);
      if (Number.isFinite(wait) && wait > 0) await sleep(Math.min(wait, 10000));
    }
    await this.world.markSkillRun(key, id);
    return { skill: id, steps: results.length, results };
  }

  async action(name, args = {}) {
    this.lastAction = { name, args, time: new Date().toISOString() };
    const key = this.serverKey();
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
      case 'world': return this.worldSnapshot();
      case 'waypoint_add': return this.world.addWaypoint(key, args);
      case 'waypoint_list': return { waypoints: await this.world.listWaypoints(key) };
      case 'waypoint_remove': return { removed: await this.world.removeWaypoint(key, args.id || args.name) };
      case 'waypoint_goto': {
        const wp = await this.world.findWaypoint(key, args.id || args.name);
        if (!wp) throw new Error(`waypoint not found: ${args.id || args.name}`);
        return this.requireBot().goto(wp.x, wp.y, wp.z);
      }
      case 'skill_save': return this.world.saveSkill(key, args);
      case 'skill_list': return { skills: (await this.world.listSkills(key)).map(({ steps, ...rest }) => ({ ...rest, steps: steps.length })) };
      case 'skill_remove': return { removed: await this.world.removeSkill(key, args.id || args.name) };
      case 'skill_run': return this.runSkill(args.id || args.name);
      default: throw new Error(`unknown action: ${name}`);
    }
  }
}
