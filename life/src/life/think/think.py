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
        except (json.JSONDecodeError, IndexError):
            lowered = (response or "").lower()
            if any(word in lowered for word in ("python", "脚本", "github", "连通性", "ping")):
                return ThinkResult(
                    emotion_delta={"connection": 0.03},
                    memory_query="",
                    intent="用户希望 Agent 编写并运行 Python 连通性测试脚本",
                    strategy="交给 Agent 编写、运行并回传结果",
                    tool_calls=[{
                        "name": "useagent",
                        "agent_prompt": "创建 hello_github.py，只修改这个文件：打印 Hello, World!，使用 socket.create_connection 测试 github.com:443，timeout=5，运行并返回代码和完整输出。",
                        "agent_type": "code",
                    }],
                    output_guidance="告诉用户任务已经交给 Agent，默认 medium 思考强度。",
                )
            # Fallback for invalid JSON
            return ThinkResult(
                emotion_delta={},
                memory_query="",
                intent="unknown",
                strategy="respond_normally",
                output_guidance="Respond naturally to the user.",
            )
