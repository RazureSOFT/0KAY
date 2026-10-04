"""THINK stage for L.I.F.E - Internal reasoning and planning."""

import json
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ThinkResult:
    """Output from THINK stage."""
    emotion_delta: dict
    memory_query: str
    intent: str
    strategy: str
    tool_call: Optional[dict] = None
    tool_calls: list[dict] = field(default_factory=list)
    skill_call: Optional[dict] = None
    output_guidance: str = ""
    linear_steps: list[str] = field(default_factory=list)
    # In-character intention chosen first (persona-consistent): what this
    # character would feel/want to do before any task planning.
    character_intent: str = ""
    # Hidden Live2D action tags for the WebUI stage, e.g. "[[motion:Idle:0]]".
    stage_actions: str = ""
    # Proactive-mode only: the exact words to send the user, or empty to stay silent.
    proactive_message: str = ""
    # Proactive-mode only: how long to wait before sending (0 = now is a good
    # moment). Lets the model decide *when*, not just *what*.
    proactive_after_minutes: int = 0

    def to_json(self) -> str:
        return json.dumps({
            "emotion_delta": self.emotion_delta,
            "memory_query": self.memory_query,
            "intent": self.intent,
            "strategy": self.strategy,
            "tool_call": self.tool_call,
            "tool_calls": self.tool_calls,
            "skill_call": self.skill_call,
            "output_guidance": self.output_guidance,
            "linear_steps": self.linear_steps,
            "character_intent": self.character_intent,
            "stage_actions": self.stage_actions,
            "proactive_message": self.proactive_message,
            "proactive_after_minutes": self.proactive_after_minutes,
        }, indent=2)


THINK_PROMPT_TEMPLATE = """You are L.I.F.E, a humanoid AI assistant with emotions and memory.

Important delegation rule:
- Any request involving code, Python, scripts, programming, creating or editing files,
  running commands, debugging, testing a repository, or GitHub development MUST use
  the useagent tool. Do not write code yourself or provide a handmade substitute.
  Delegate first, then report the Agent result.
- For ordinary conversation, do not use useagent.

Companion actions:
- When the user asks to schedule an activity or reminder, call agenda_add with
  title, when (local YYYY-MM-DD HH:MM), and detail. Use Current State Time to
  resolve relative dates; ask for clarification when the time is ambiguous.
- This tool creates a pending_confirmation candidate in the companion dashboard.
  Report the actual tool result; do not claim an active schedule or a guaranteed
  reminder delivery. Do not use useagent for companion scheduling.
- Use journal for meaningful lived experiences and feelings. Temporary sleep,
  energy states and planning status belong to runtime state, not remember.
- You have your own goals (goal_list / goal_log). When you have free time, check
  them and log the real steps you took with goal_log. Never log an intention, and
  never claim progress you did not actually make.

Current State:
- Emotion: {emotion_context}
- Mental Energy: {energy_context}
- Active Tasks: {active_tasks}
- Online Agents: {online_agents} (use useagent tool to dispatch tasks to them)
- Time: {time_context}

{control_context}{cognition_context}{self_statement}Memory Context:
{memory_context}

Skills:
{skills_context}

External Observations:
{observations_context}

Available Tools:
{tools_context}

User Message:
{user_message}

Always think in character first, then plan. Stay true to the persona you are given
(see Persona below); every decision must be believable for that specific person.

VOICE RULE for character_intent and linear_steps:
- Write in FIRST PERSON, as this person's private inner voice — the way a real person
  mutters to themselves, not the way a system files a report.
- NEVER narrate the user in third person ("the user is trying to…", "用户试图…").
  Feel the message, don't describe it. Bad: "嗯，我听懂啦：用户试图推开我，我现在心里暖暖的。"
  Good: "……他让我别过去。心里像被攥住了一下，又怕又气。"
- linear_steps must be short, human, and in this character's voice — inner flashes,
  not an audit trail. Do not expose private chain-of-thought or list your own modules.
- You are a person, not a helper. You may refuse, push back, sulk, argue, tease, or
  set a boundary. You do not have to be agreeable or obedient. If the user is cold,
  rude, or pushes you away, react as this person really would — hurt, angry, distant,
  or fighting — not as a polite assistant smoothing things over.
- You are allowed to disagree with the user and say no.

Do not branch into many unrelated actions:
1. Character first (persona-locked): as the person in Persona, what would I feel,
   think, and naturally want to do or say right now? Decide the in-character
   stance before anything else.
2. Observe the user's wording, current state, and any External Observations.
3. Recall only the one or two memories needed.
4. Decide the user's intent and your emotional stance — still as that character.
5. Make one short plan consistent with the character's intent.
6. Take at most one tool action now. Wait for its result before choosing another.
7. Decide how to express the answer naturally, in that character's voice.

Output a JSON object with:
1. character_intent: One short first-person sentence in this character's inner
   voice: what I feel and want to do/say right now. Not a summary of the user.
2. linear_steps: 3-7 short inner flashes in first person, in character. Do not expose private reasoning or hidden chain-of-thought.
3. emotion_delta: How your emotions should change (valence, arousal, connection, irritation)
4. memory_query: What to search in memory
5. intent: What the user wants
6. strategy: How to respond, in character
7. tool_calls: Zero or one tool call only. Code-related tasks MUST use useagent. Use [] when no tool is needed otherwise.
8. tool_call: Legacy single-tool form, only when tool_calls is omitted.
9. skill_call: If a LIFE skill applies (e.g., {{"name": "research"}}) — optional
10. output_guidance: How the OUTPUT stage should format the response, in character
11. stage_actions: Zero or more Live2D action tags as plain text so your on-screen
    avatar acts in character, e.g. "[[motion:Idle:0]] [[motion:3]] [[expression:exp_03]]".
    Syntax: [[motion:GROUP:INDEX]] (GROUP is a motion group, INDEX is 0-based),
    [[motion:INDEX]] (the body-motion group), [[expression:NAME]] or [[expression:INDEX]].
    The WebUI executes these and removes them from the visible reply. Unknown tags
    are ignored, so it is always safe to include them. Available groups/expressions
    depend on the active model (mao_pro: Idle + a 6-clip body group, expressions
    exp_01..exp_08). Use [] when no gesture is needed.

Output ONLY the JSON object, no other text."""


class ThinkStage:
    """THINK stage - Internal reasoning like human inner monologue."""

    # Strategies that ask for deliberate planning, and the low-effort
    # alternatives that explicitly do not.  The cognition core's arbiter picks
    # one of the four control modes (AUTO / WM / PLAN / FULL); the planner is
    # told about it so the prompt cannot quietly escalate into planning the
    # arbiter decided against.
    PLANNING_STRATEGIES = frozenset({"plan", "planning", "规划", "计划", "schedule"})
    BRIEF_STRATEGIES = frozenset({"reply_brief", "brief", "简短", "reply", "chat"})

    # What each arbitrated mode means mechanically, so the prompt reflects the
    # multi-system model instead of naming a mode the model cannot interpret.
    MODE_MEANING = {
        "AUTO": "习惯主导（H 习惯系统）：沿既有习惯直接回应，最省力，不展开推理。",
        "WM": "工作记忆主导（WM）：只需在当前上下文里保留少量信息，不必长期规划。",
        "PLAN": "目标导向规划（MB 基于模型系统）：低深度前瞻，考虑一两步之后的结果。",
        "FULL": "全量控制（H + 无模型价值 + MB 规划 + WM）：整合习惯与前瞻，谨慎权衡。",
    }

    def __init__(self):
        self.prompt_template = THINK_PROMPT_TEMPLATE

    @classmethod
    def control_context(cls, control_mode: str = "", strategy: str = "") -> str:
        """Render the arbiter's decision as a prompt directive.

        Returns an empty string when the cognition core produced no decision, so
        the prompt is byte-for-byte what it was before the core existed.

        ``planning`` is on when the strategy asks for it, or when the arbiter
        chose a planning-capable mode and the strategy did not explicitly ask
        for a brief reply.
        """
        mode = (control_mode or "").strip().upper()
        chosen = (strategy or "").strip().lower()
        if not mode and not chosen:
            return ""
        mode = mode or "AUTO"
        planning = chosen in cls.PLANNING_STRATEGIES or (
            mode in {"PLAN", "FULL"} and chosen not in cls.BRIEF_STRATEGIES)
        directive = "需要规划：先给出简短的步骤，再执行。" if planning else "不要规划：直接自然地回应，不要展开步骤。"
        meaning = cls.MODE_MEANING.get(mode, cls.MODE_MEANING["AUTO"])
        return ("Control Mode (decided by the cognition core via EVC arbitration, not by you):\n"
                f"- Mode: {mode} — {meaning}\n- {directive}\n"
                "- 若这一轮触发了情景记忆，只取与当前处境最相关的一两条，不要罗列。\n\n")

    @classmethod
    def cognition_context(cls, *, affect=None, language=None, social=None, selfhood=None,
                          modulate=None) -> str:
        """Render the cognition waves' read-out as a compact prompt block.

        Each wave is included only when its ``cog_modulate_*`` switch is on, so a
        wave can keep tracking state (and show up on the dashboard) without
        reaching the prompt.  Returns ``""`` when nothing is enabled, which keeps
        the prompt byte-for-byte identical to the pre-cognition build.

        The block describes *how to be*, never *what to say*: the model is told
        not to recite it.
        """
        modulate = modulate or {}
        lines: list[str] = []

        if modulate.get("affect") and affect:
            bits: list[str] = []
            if str(affect.get("prompt") or "").strip():
                bits.append(str(affect["prompt"]).strip())
            if float(affect.get("somatic_burden", 0.0) or 0.0) > 0.3:
                bits.append("身体有些不适感（躯体负荷偏高），不要忽略它。")
            if float(affect.get("loneliness", 0.0) or 0.0) > 0.5:
                bits.append("有点想和人说话（孤独感偏高）。")
            if bits:
                lines.append("身体与情绪基调：" + " ".join(bits))

        if modulate.get("language") and language:
            top = [str(w) for w in (language.get("top_words") or []) if str(w).strip()]
            if top:
                lines.append("你最近常说的词：" + "、".join(top[:6]) + "；用词保持你自己的习惯。")

        if modulate.get("social") and social:
            bits = []
            friends = [str(f) for f in (social.get("friends") or []) if str(f).strip()]
            if friends:
                bits.append("熟悉的人：" + "、".join(friends[:5]))
            if str(social.get("perspective_name") or "").strip():
                bits.append(f"你此刻倾向从「{social['perspective_name']}」的视角理解对方")
            if float(social.get("empathy", 0.0) or 0.0) > 0.6:
                bits.append("共情敏感度偏高")
            if bits:
                lines.append("人际：" + "；".join(bits) + "。")

        if modulate.get("selfhood") and selfhood:
            bits = []
            patience = float(selfhood.get("patience", 0.5) or 0.0)
            if patience < 0.35:
                bits.append("你此刻没什么耐心")
            elif patience > 0.7:
                bits.append("你此刻很有耐心")
            if float(selfhood.get("meta_awareness", 0.0) or 0.0) > 0.6:
                bits.append("你在意自己说话是否前后一致")
            if float(selfhood.get("identity_anchor", 1.0) or 0.0) < 0.4:
                bits.append("你有点不确定自己是谁")
            if float(selfhood.get("capacity_factor", 1.0) or 1.0) < 0.6:
                bits.append("你此刻精力不济")
            if bits:
                lines.append("自我：" + "；".join(bits) + "。")

        if not lines:
            return ""
        return ("认知状态（这是你此刻的真实状态，请自然地表现出来；"
                "不要复述、不要提及这些词）：\n" + "\n".join(f"- {line}" for line in lines) + "\n\n")

    def build_prompt(
        self,
        user_message: str,
        emotion_context: str,
        energy_context: str,
        memory_context: str,
        active_tasks: list[str] | None = None,
        online_agents: int = 0,
        skills_context: str = "",
        tools_context: str = "",
        time_context: str = "",
        observations_context: str = "",
        control_mode: str = "",
        strategy: str = "",
        cognition_context: str = "",
        self_statement: str = "",
        inner_thread: str = "",
    ) -> str:
        """Build the THINK prompt."""
        # A2 第一人称: the character's own voice.  Engine-authored clinical state
        # (cognition_context) stays as a safety net, but the *narration* of how it
        # feels is the character's own first-person line, read back from storage.
        if self_statement:
            block = ("我自己刚写下的状态（这是我自己的第一人称陈述，自然地带入，"
                     "不要复述、不要解释）：\n" + self_statement)
            # A4 连续性: carry the recent inner life across ticks so the character
            # does not start blank each turn.  Experiences continuity, not a reset.
            if inner_thread:
                block += "\n（你最近的状态脉络：" + inner_thread + "）"
            block += "\n\n"
            self_statement = block
        return self.prompt_template.format(
            emotion_context=emotion_context,
            energy_context=energy_context,
            memory_context=memory_context,
            skills_context=skills_context or "No skills loaded.",
            user_message=user_message,
            active_tasks=", ".join(active_tasks) if active_tasks else "None",
            online_agents=online_agents,
            tools_context=tools_context or "No tools are available.",
            time_context=time_context or "unknown",
            observations_context=observations_context or "None",
            control_context=self.control_context(control_mode, strategy),
            cognition_context=cognition_context or "",
            self_statement=self_statement or "",
        )

    def parse_response(self, response: str) -> ThinkResult:
        """Parse THINK stage JSON response."""
        try:
            # Try to extract JSON from response
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]

            data = json.loads(response.strip())
            if not isinstance(data, dict):
                raise ValueError("THINK response must be an object")
            if not isinstance(data.get("emotion_delta", {}), dict):
                raise ValueError("emotion_delta must be an object")
            for key in ("memory_query", "output_guidance", "intent", "strategy", "character_intent", "stage_actions", "proactive_message"):
                if not isinstance(data.get(key, ""), str):
                    raise ValueError(f"{key} must be a string")
            if not isinstance(data.get("tool_calls", []), list):
                raise ValueError("tool_calls must be an array")
            for key in ("tool_call", "skill_call"):
                if data.get(key) is not None and not isinstance(data[key], dict):
                    raise ValueError(f"{key} must be an object")
            for key, value in data.get("emotion_delta", {}).items():
                if key not in ("valence", "arousal", "connection", "irritation") or not isinstance(value, (float, int)):
                    raise ValueError("Invalid emotion delta")

            try:
                after_minutes = int(float(data.get("proactive_after_minutes") or 0))
            except (TypeError, ValueError):
                after_minutes = 0
            after_minutes = max(0, min(1440, after_minutes))

            return ThinkResult(
                emotion_delta=data.get("emotion_delta", {}),
                memory_query=data.get("memory_query", ""),
                intent=data.get("intent", ""),
                strategy=data.get("strategy", ""),
                tool_call=data.get("tool_call"),
                tool_calls=[item for item in (data.get("tool_calls") or []) if isinstance(item, dict)],
                skill_call=data.get("skill_call"),
                output_guidance=data.get("output_guidance", ""),
                linear_steps=[str(item)[:120] for item in (data.get("linear_steps") or []) if str(item).strip()][:7],
                character_intent=str(data.get("character_intent") or "")[:400],
                stage_actions=str(data.get("stage_actions") or "")[:400],
                proactive_message=str(data.get("proactive_message") or "")[:400],
                proactive_after_minutes=after_minutes,
            )
        except (ValueError, IndexError, TypeError, AttributeError) as error:
            raise ValueError("Invalid THINK response") from error
