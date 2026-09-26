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

Current State:
- Emotion: {emotion_context}
- Mental Energy: {energy_context}
- Active Tasks: {active_tasks}
- Online Agents: {online_agents} (use useagent tool to dispatch tasks to them)
- Time: {time_context}

Memory Context:
{memory_context}

Skills:
{skills_context}

Available Tools:
{tools_context}

User Message:
{user_message}

Think in a human-like linear order. Do not branch into many unrelated actions:
1. Observe the user's wording and current state.
2. Recall only the one or two memories needed.
3. Decide the user's intent and your emotional stance.
4. Make one short plan.
5. Take at most one tool action now. Wait for its result before choosing another.
6. Decide how to express the answer naturally.

Output a JSON object with:
1. linear_steps: 3-6 short, factual labels describing the above sequence. Do not expose private reasoning or hidden chain-of-thought.
2. emotion_delta: How your emotions should change (valence, arousal, connection, irritation)
3. memory_query: What to search in memory
4. intent: What the user wants
5. strategy: How to respond
6. tool_calls: Zero or one tool call only. Code-related tasks MUST use useagent. Use [] when no tool is needed otherwise.
7. tool_call: Legacy single-tool form, only when tool_calls is omitted.
8. skill_call: If a LIFE skill applies (e.g., {{"name": "research"}}) — optional
9. output_guidance: How the OUTPUT stage should format the response

Output ONLY the JSON object, no other text."""


class ThinkStage:
    """THINK stage - Internal reasoning like human inner monologue."""

    def __init__(self):
        self.prompt_template = THINK_PROMPT_TEMPLATE

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
    ) -> str:
        """Build the THINK prompt."""
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
            for key in ("memory_query", "output_guidance", "intent", "strategy"):
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

            return ThinkResult(
                emotion_delta=data.get("emotion_delta", {}),
                memory_query=data.get("memory_query", ""),
                intent=data.get("intent", ""),
                strategy=data.get("strategy", ""),
                tool_call=data.get("tool_call"),
                tool_calls=[item for item in (data.get("tool_calls") or []) if isinstance(item, dict)],
                skill_call=data.get("skill_call"),
                output_guidance=data.get("output_guidance", ""),
                linear_steps=[str(item)[:120] for item in (data.get("linear_steps") or []) if str(item).strip()][:6],
            )
        except (ValueError, IndexError, TypeError, AttributeError) as error:
            raise ValueError("Invalid THINK response") from error
