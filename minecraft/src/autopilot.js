/**
 * Autopilot: a periodic decision loop that lets the local model drive the bot.
 *
 * Each tick it summarises the game state and recent chat, asks Core's model
 * gateway (/api/mocr/generate) for exactly one action as JSON, then executes it
 * through the controller. It is deliberately conservative: chat is rate limited,
 * unknown actions are rejected, and repeated failures back off instead of
 * hammering the server.
 */

const ALLOWED_ACTIONS = ['follow', 'goto', 'stop', 'look', 'dig', 'place', 'attack', 'chat', 'use', 'inventory'];

const SYSTEM_PROMPT = `You are the brain of a Minecraft companion bot that plays alongside human players.
Reply with exactly one JSON object and nothing else:
{"action": "<one of: follow|goto|stop|look|dig|place|attack|chat|use|inventory>", "args": { }, "say": "<optional short chat message or empty>"}
Rules:
- Prefer social play: follow or look at players, and answer chat.
- Only dig/place/attack when it clearly helps the shared goal; never grief other players' builds.
- Keep "say" short (under 120 chars) and only when useful, not every tick.
- If unsure, use {"action":"look","args":{"target":"nearest"},"say":""}.`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJson(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

export class Autopilot {
  constructor(controller, options = {}) {
    this.controller = controller;
    this.coreUrl = options.coreUrl || controller.coreUrl || 'http://127.0.0.1:8080';
    this.running = false;
    this.goal = options.goal || '和玩家一起玩：跟随他们、按需帮忙、参与聊天';
    this.intervalMs = Math.max(4000, Number(options.intervalMs) || 12000);
    this.modelId = options.modelId || '';
    this.minChatIntervalMs = Math.max(0, Number(options.minChatIntervalMs) || 6000);
    this.maxTicks = Number(options.maxTicks) || 0;
    this.ticks = 0;
    this.errors = 0;
    this.lastDecision = null;
    this.lastChatAt = 0;
    this.log = [];
    this.abort = null;
  }

  status() {
    return {
      running: this.running,
      goal: this.goal,
      intervalMs: this.intervalMs,
      modelId: this.modelId || '(auto)',
      ticks: this.ticks,
      errors: this.errors,
      lastDecision: this.lastDecision,
      recent: this.log.slice(-8),
    };
  }

  start(options = {}) {
    if (this.running) return this.status();
    if (options.goal) this.goal = String(options.goal);
    if (options.intervalMs) this.intervalMs = Math.max(4000, Number(options.intervalMs));
    if (options.modelId !== undefined) this.modelId = String(options.modelId || '');
    if (options.maxTicks !== undefined) this.maxTicks = Number(options.maxTicks) || 0;
    this.running = true;
    this.ticks = 0;
    this.errors = 0;
    this.#note('autopilot started');
    this.abort = new AbortController();
    this.#loop().catch((error) => this.#note(`loop crashed: ${error.message}`));
    return this.status();
  }

  stop(reason = 'manual') {
    if (!this.running) return this.status();
    this.running = false;
    this.abort?.abort();
    this.#note(`autopilot stopped (${reason})`);
    return this.status();
  }

  #note(message) {
    this.log.push({ time: new Date().toISOString(), message });
    if (this.log.length > 100) this.log.splice(0, this.log.length - 100);
    this.controller.emit('log', `autopilot: ${message}`);
  }

  async #loop() {
    while (this.running) {
      const started = Date.now();
      try {
        await this.tick();
        this.errors = 0;
      } catch (error) {
        this.errors += 1;
        this.#note(`tick failed: ${error.message}`);
      }
      this.ticks += 1;
      if (this.maxTicks && this.ticks >= this.maxTicks) {
        this.stop('max ticks reached');
        break;
      }
      const elapsed = Date.now() - started;
      const wait = Math.max(1000, this.intervalMs - elapsed) + Math.min(this.errors, 5) * 1000;
      await sleep(wait);
    }
  }

  async tick() {
    if (!this.controller.connected) return;
    const bot = this.controller.bot;
    if (this.editionMismatch(bot)) return;

    const state = this.#stateSummary(bot);
    const decision = await this.#decide(state);
    if (!decision) {
      this.#note('model returned no usable decision');
      return;
    }
    this.lastDecision = { ...decision, time: new Date().toISOString() };
    await this.#apply(decision);
  }

  editionMismatch(bot) {
    return bot?.state !== 'connected';
  }

  #stateSummary(bot) {
    const info = bot.describe();
    const recentChat = this.controller.chat.slice(-12).map((entry) => `${entry.username || 'system'}: ${entry.message}`);
    const mentioned = this.controller.chat.slice(-5).some((entry) =>
      (entry.message || '').includes(info.username) || /0kay|机器人|bot/i.test(entry.message || ''));
    return { info, recentChat, mentioned, goal: this.goal };
  }

  async #decide(state) {
    const prompt = [
      `Edition: ${state.info.edition}`,
      `Goal: ${state.goal}`,
      `Bot username: ${state.info.username}`,
      `Health: ${state.info.health ?? 'unknown'}, Position: ${JSON.stringify(state.info.position)}`,
      `Players online: ${state.info.players?.map((p) => p.name).join(', ') || '(none)'}`,
      `You were mentioned recently: ${state.mentioned ? 'yes' : 'no'}`,
      'Recent chat (oldest first):',
      state.recentChat.join('\n') || '(none)',
      '',
      'Choose the single next action now as JSON.',
    ].join('\n');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    let response;
    try {
      response = await fetch(`${this.coreUrl}/api/mocr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          system_prompt: SYSTEM_PROMPT,
          model_id: this.modelId || undefined,
          stream: false,
          max_tokens: 400,
          temperature: 0.6,
          session_id: 'minecraft-autopilot',
        }),
      });
    } finally {
      clearTimeout(timer);
    }
    if (!response.ok) throw new Error(`model gateway HTTP ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(`model error: ${data.error}`);
    const parsed = extractJson(data.response || '');
    return this.#validate(parsed);
  }

  #validate(parsed) {
    if (!parsed || typeof parsed !== 'object') return null;
    const action = String(parsed.action || '').trim();
    if (!ALLOWED_ACTIONS.includes(action)) return null;
    const args = parsed.args && typeof parsed.args === 'object' ? parsed.args : {};
    const say = typeof parsed.say === 'string' ? parsed.say.trim().slice(0, 200) : '';
    return { action, args, say };
  }

  async #apply(decision) {
    if (decision.say) {
      const now = Date.now();
      if (now - this.lastChatAt >= this.minChatIntervalMs && this.controller.connected) {
        try {
          await this.controller.action('chat', { message: decision.say });
          this.lastChatAt = now;
        } catch (error) {
          this.#note(`say failed: ${error.message}`);
        }
      }
    }
    try {
      const result = await this.controller.action(decision.action, decision.args);
      this.#note(`${decision.action} -> ok`);
      return result;
    } catch (error) {
      this.#note(`${decision.action} -> ${error.message}`);
      return null;
    }
  }
}
