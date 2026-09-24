"""L.I.F.E Engine - Main orchestrator for persona plugin with mocr integration."""

import asyncio
import json
import os
import uuid
import re
from datetime import datetime
from typing import AsyncIterator, Optional

import grpc
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from mocr.v1 import mocr_pb2, mocr_pb2_grpc
from life.v1 import life_pb2

from .emotion.emotion import EmotionEngine, EmotionState
from .circadian.circadian import CircadianSystem, CircadianState
from .memory.memory import MemorySystem
from .think.think import ThinkStage, ThinkResult
from .output.output import OutputStage, OutputResult
from .tools.tools import ToolRegistry, RuntimeToolConfig, create_default_registry, ToolResult
from .skills import get_skill_registry
from .core_client import CoreClient, get_core_client
from .companion import CompanionSystem


class MocrClient:
    """Client for mocr service (injects provider credentials from Core)."""

    def __init__(self, address: str = "localhost:50052", core_http: str = "http://127.0.0.1:8080"):
        self.address = address
        self.core_http = core_http.rstrip("/")
        self._channel: Optional[grpc.aio.Channel] = None
        self._stub: Optional[mocr_pb2_grpc.MocrServiceStub] = None
        self._creds: Optional[dict] = None

    async def connect(self):
        self._channel = grpc.aio.insecure_channel(self.address)
        self._stub = mocr_pb2_grpc.MocrServiceStub(self._channel)

    async def close(self):
        if self._channel:
            await self._channel.close()

    async def _ensure_creds(self) -> dict:
        if self._creds is not None:
            return self._creds
        try:
            import urllib.request
            req = urllib.request.Request(f"{self.core_http}/api/providers", method="GET")
            with urllib.request.urlopen(req, timeout=2) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            providers = data.get("providers") or data
            if isinstance(providers, dict):
                providers = providers.get("providers") or []
            # Prefer default provider with non-empty key
            default_id = data.get("default_provider_id") if isinstance(data, dict) else ""
            chosen = None
            for p in providers:
                if not isinstance(p, dict):
                    continue
                if default_id and p.get("id") == default_id:
                    chosen = p
                    break
                if not chosen and p.get("enabled", True) and p.get("api_key"):
                    chosen = p
            if chosen and chosen.get("api_key"):
                self._creds = {
                    "provider": chosen.get("provider") or "",
                    "base_url": chosen.get("base_url") or "",
                    "api_key": chosen.get("api_key") or "",
                }
                return self._creds
        except Exception:
            pass
        self._creds = {"provider": "", "base_url": "", "api_key": ""}
        return self._creds

    async def choose_models(
        self,
        prompt: str,
        difficulty: float = 0.5,
        require_thinking: bool = False,
        max_tokens: int = 1024,
    ) -> tuple[dict, dict]:
        """Choose think_model and output_model."""
        if not self._stub:
            await self.connect()

        request = mocr_pb2.ChooseModelsRequest(
            prompt=prompt,
            context=mocr_pb2.SelectionContext(
                difficulty_hint=difficulty,
                require_thinking=require_thinking,
                max_tokens=max_tokens,
            ),
        )

        response = await self._stub.ChooseModels(request)
        return {
            "model_id": response.think_model.model_id,
            "provider": response.think_model.provider,
        }, {
            "model_id": response.output_model.model_id,
            "provider": response.output_model.provider,
        }

    async def generate(
        self,
        model_id: str,
        messages: list[dict],
        system_prompt: str = "",
        thinking: bool = False,
        max_tokens: int = 1024,
    ) -> AsyncIterator[str]:
        """Stream text generation from model."""
        if not self._stub:
            await self.connect()

        proto_messages = [
            mocr_pb2.Message(role=m["role"], content=m["content"])
            for m in messages
        ]

        request = mocr_pb2.GenerateRequest(
            model_id=model_id,
            messages=proto_messages,
            system_prompt=system_prompt,
            max_tokens=max_tokens,
            stream=True,
            thinking=thinking,
        )
        creds = await self._ensure_creds()
        if creds.get("provider"):
            request.provider = creds["provider"]
        if creds.get("base_url"):
            request.base_url = creds["base_url"]
        if creds.get("api_key"):
            request.api_key = creds["api_key"]

        async for response in self._stub.Generate(request):
            if response.chunk:
                yield response.chunk
            if response.done:
                break


class LifeEngine:
    """Main L.I.F.E engine orchestrating THINK → OUTPUT pipeline."""

    def __init__(self, data_dir: str = "./data/life", mocr_address: str = "localhost:50052"):
        self.data_dir = data_dir
        self.emotion = EmotionEngine()
        self.circadian = CircadianSystem()
        self.memory = MemorySystem(f"{data_dir}/memory")
        self.companion = CompanionSystem(data_dir)
        self.think = ThinkStage()
        self.output = OutputStage()
        self.mocr = MocrClient(mocr_address)
        # LIFE uses independent configured models for internal thinking and
        # outward expression. Empty values retain the legacy default fallback.
        self.think_model = os.environ.get("LIFE_THINK_MODEL", "")
        self.output_model = os.environ.get("LIFE_OUTPUT_MODEL", "")
        self.default_model = os.environ.get("LIFE_DEFAULT_MODEL", "gpt-4o-mini")

        # Core client for agent discovery / task dispatch
        self.core: CoreClient = get_core_client()

        # Online agents known to L.I.F.E (synced from Core)
        self.online_agents: list[dict] = []
        self.online_agent_count: int = 0

        self.tool_config = RuntimeToolConfig()
        self.tools = create_default_registry(core_client=self.core, config=self.tool_config, memory=self.memory, companion=self.companion)
        self.skills = get_skill_registry()

        self.active_tasks: dict[str, dict] = {}
        self._notifications: list[dict] = []
        # Default Agent dispatch intensity. Keep this explicit so the normal
        # medium path never depends on a dynamically-created attribute.
        self._agent_intensity = "medium"
        self._state_path = f"{data_dir}/state.json"
        self._load_state()

    def sync_agents(self) -> int:
        """Query Core for online agents. Returns the online count."""
        try:
            info = self.core.list_agents(include_unhealthy=False)
            self.online_agents = info.get("agents", [])
            self.online_agent_count = info.get("online_count", 0)
        except Exception as e:
            print(f"[LIFE] sync_agents failed: {e}")
        return self.online_agent_count

    def _load_state(self) -> None:
        """Load persistent state."""
        try:
            with open(self._state_path, "r") as f:
                data = json.load(f)
            if "emotion" in data:
                self.emotion.state = EmotionState.from_dict(data["emotion"])
            if "circadian" in data:
                self.circadian.state.mental_energy = data["circadian"].get("mental_energy", 100.0)
                self.circadian.state.is_sleeping = data["circadian"].get("is_sleeping", False)
            if "active_tasks" in data:
                self.active_tasks = data["active_tasks"]
        except FileNotFoundError:
            os.makedirs(os.path.dirname(self._state_path), exist_ok=True)

    def _save_state(self) -> None:
        """Save persistent state."""
        os.makedirs(os.path.dirname(self._state_path), exist_ok=True)
        data = {
            "emotion": self.emotion.state.to_dict(),
            "circadian": self.circadian.to_dict(),
            "active_tasks": self.active_tasks,
        }
        with open(self._state_path, "w") as f:
            json.dump(data, f, indent=2)

    def _parse_intensity(self, text: str) -> Optional[str]:
        """Parse user-stated thinking intensity; None if not mentioned."""
        if not text:
            return None
        low = text.lower()
        # Chinese / English explicit keywords
        if any(k in low for k in ("max", "maximum", "最高", "狠狠", "全力", "彻底", "往死", "极限")):
            return "max"
        if "认真" in low or "认真的" in low or "认真思考" in low:
            return "max"
        if any(k in low for k in ("high", "深度", "深度思考", "深入")):
            return "high"
        if any(k in low for k in ("medium", "中等", "普通", "正常强度")):
            return "medium"
        if any(k in low for k in ("low", "快速", "随便", "简单", "轻量")):
            return "low"
        return None

    @staticmethod
    def _intensity_to_difficulty(intensity: str) -> float:
        return {"low": 0.2, "medium": 0.5, "high": 0.75, "max": 1.0}.get(intensity, 0.5)

    @staticmethod
    def _mk_think(guide: str, base: Optional[ThinkResult] = None) -> ThinkResult:
        if base is not None:
            return ThinkResult(
                emotion_delta=base.emotion_delta,
                memory_query=base.memory_query,
                intent=base.intent,
                strategy=base.strategy,
                tool_call=base.tool_call,
                output_guidance=guide or base.output_guidance,
            )
        return ThinkResult(
            emotion_delta={},
            memory_query="",
            intent="clarify",
            strategy="ask_user",
            tool_call=None,
            output_guidance=guide,
        )

    async def _emit_output(self, message: str, think_result: ThinkResult) -> AsyncIterator[dict]:
        """Run OUTPUT stage and yield the same event stream as process_message."""
        output_system = self.output.build_prompt(
            user_message=message,
            think_guidance=think_result.output_guidance,
            emotion_context=json.dumps(self.emotion.state.to_dict()),
            persona_context=getattr(self, "_active_persona_context", "No custom persona is configured."),
        )
        output_messages = [{"role": "user", "content": message}]
        output_response = ""
        try:
            async for chunk in self.mocr.generate(
                model_id=self.output_model or self.default_model,
                messages=output_messages,
                system_prompt=output_system,
                thinking=False,
            ):
                output_response += chunk
                yield {"type": "raw_chunk", "chunk": chunk}
            if output_response.startswith("[mocr offline]"):
                output_response = self._fallback_output(message, think_result)
        except Exception:
            # Fallback when mocr unavailable: answer from guidance directly
            output_response = think_result.output_guidance or self._fallback_output(message, think_result)

        if not output_response.strip():
            output_response = self._fallback_output(message, think_result)

        output_response = self._normalize_persona_output(output_response, getattr(self, "_active_persona_context", ""))
        output_result = OutputResult.from_text(output_response)
        self.memory.add_working("assistant", output_response)
        self.memory.store(message, importance=0.3)
        self.memory.store(output_response, importance=0.3)
        self._save_state()
        for i, chunk in enumerate(output_result.chunks):
            yield {
                "type": "chunk",
                "chunk": chunk,
                "done": i == len(output_result.chunks) - 1,
                "emotion_state": self.emotion.state.to_dict(),
                "mental_energy": self.circadian.state.mental_energy,
            }

    async def process_message(
        self,
        session_id: str,
        user_id: str,
        message: str,
        adapter_type: str = "webui",
        persona: dict | None = None,
    ) -> AsyncIterator[dict]:
        """Process a user message through THINK → OUTPUT pipeline."""
        # Persona is supplied by the WebUI per turn. It remains a typed value
        # until prompt assembly, so it cannot be confused with user content.
        persona = persona or {}
        name = str(persona.get("name") or "").strip()
        description = str(persona.get("description") or "").strip()
        personality = str(persona.get("personality") or "").strip()
        greeting = str(persona.get("greeting") or "").strip()
        self._active_persona_context = "\n".join(part for part in [
            f"Your name is {name}." if name else "",
            f"Identity and background: {description}" if description else "",
            f"Personality and speaking style: {personality}" if personality else "",
            f"Preferred greeting: {greeting}" if greeting else "",
            "You are the configured human character, not a technology product. Never call yourself AI, artificial intelligence, a bot, an assistant, an intelligent assistant, L.I.F.E, a language model, DeepSeek, OpenAI, or any model provider. If asked who you are, say only your character name and human role.",
        ] if part) or "No custom persona is configured. Do not claim a model-provider identity."
        learned = self.companion.persona_evolution_context()
        if learned:
            self._active_persona_context += "\nStable traits learned from repeated interaction:\n" + learned

        # Store in working memory
        self.memory.add_working("user", message)
        self.companion.observe_user(user_id or "anonymous", message, is_group=adapter_type == "onebot_group")
        if adapter_type == "onebot_group" and session_id:
            self.companion.observe_group(session_id, user_id or "anonymous", message)

        # Update circadian state
        self.circadian.tick(0)

        # Check if sleeping
        forced_wake = False
        if self.circadian.state.is_sleeping:
            was_sleeping = self.circadian.force_wake()
            if was_sleeping:
                forced_wake = True
                wake_delta = self.emotion.on_forced_wake()
                self.emotion.state.apply_delta(wake_delta)

        # Dissatisfaction from recent forced wake / exhaustion feeds irritation
        try:
            diss = self.circadian.dissatisfaction_level()
            if diss > 0:
                self.emotion.state.apply_delta({"irritation": diss * 0.3, "valence": -diss * 0.1})
        except Exception:
            pass

        # Apply emotion delta from user message
        msg_delta = self.emotion.on_user_message(message)
        self.emotion.state.apply_delta(msg_delta)

        # Get memory context (auto-fetch before THINK)
        memory_context = self.memory.get_memory_context(message)
        # Active reinforcement for topic-relevant weak memories
        try:
            self.memory.reinforce(message, max_items=3)
        except Exception:
            pass

        # Refresh online agent count before THINK (so THINK can use it)
        self.sync_agents()

        # Auto-fetch secondary context from best-matching LIFE skill
        skills_context = self.skills.context_block(message)
        auto_skill = self.skills.match(message)
        if auto_skill:
            memory_context = (
                f"{memory_context}\n\nSuggested skill context ({auto_skill.name}):\n"
                f"{auto_skill.content.strip()}"
            )

        # Resolve pending agent dispatch from a previous intensity prompt
        pending = getattr(self, "_pending_useagent", None)
        if pending is not None:
            intensity = self._parse_intensity(message) or "medium"
            pending = dict(pending)
            pending["thinking_intensity"] = intensity
            nested = pending.get("arguments")
            if isinstance(nested, dict):
                tool_kwargs = {k: v for k, v in nested.items() if k != "name"}
            else:
                tool_kwargs = {k: v for k, v in pending.items() if k not in ("name", "arguments")}
            tool_result = await self.tools.call("useagent", **tool_kwargs)
            self._pending_useagent = None
            if tool_result.success:
                task_id = tool_result.data.get("task_id")
                self.active_tasks[task_id] = {
                    "prompt": pending.get("agent_prompt", ""),
                    "status": "pending",
                    "thinking_intensity": intensity,
                    "started_at": datetime.now().isoformat(),
                }
                self._save_state()
                yield {"type": "task_started", "task_id": task_id}
                guide = (
                    f"Agent dispatched at thinking intensity={intensity}. "
                    "Briefly confirm to the user and mention the intensity."
                )
            else:
                guide = f"Agent dispatch failed: {tool_result.error}. Explain briefly."
            async for event in self._emit_output(message, self._mk_think(guide)):
                yield event
            return

        # === THINK STAGE ===
        think_messages = [
            {"role": "user", "content": message},
        ]

        think_system = self.think.build_prompt(
            user_message=message,
            emotion_context=json.dumps(self.emotion.state.to_dict()),
            energy_context=f"{self.circadian.state.mental_energy:.1f}%",
            memory_context=memory_context,
            active_tasks=list(self.active_tasks.keys()),
            online_agents=self.online_agent_count,
            skills_context=skills_context,
            tools_context=json.dumps(self.get_tools_schema(), ensure_ascii=False),
            # Short fixed-width time context keeps every THINK turn grounded
            # without paying for an expanded calendar narrative.
            time_context=datetime.now().strftime("%Y-%m-%d %H:%M %a"),
        )
        # Surface dissatisfaction / forced-wake context to OUTPUT as well
        try:
            if self.circadian.was_forced_wake_recently():
                think_system += "\n\nNote: You were just woken from sleep against your will. Express mild dissatisfaction briefly before continuing."
            if forced_wake:
                think_system += "\nNote: The user woke you. Show slight irritation naturally."
        except Exception:
            pass

        # Call mocr for THINK (fixed model — ChooseModels is agent-only)
        think_response = ""
        try:
            async for chunk in self.mocr.generate(
                model_id=self.think_model or self.default_model,
                messages=think_messages,
                system_prompt=think_system,
                thinking=True,
            ):
                think_response += chunk
        except Exception as e:
            # Fallback if mocr unavailable
            think_response = self._fallback_think(message, forced_wake)

        # Parse THINK output
        think_result = self.think.parse_response(think_response)
        # A model may return valid JSON while still omitting the required tool
        # call. Coding/task intent is safety-critical: route it deterministically
        # instead of falling back to conversational filler.
        if self._looks_like_agent_task(message) and not any(
            call.get("name") == "useagent" for call in (think_result.tool_calls or [])
        ) and not (think_result.tool_call and think_result.tool_call.get("name") == "useagent"):
            think_result.tool_calls = [{
                "name": "useagent",
                "agent_prompt": self._agent_prompt_for(message),
                "agent_type": "code",
            }]
            think_result.intent = "用户希望 Agent 编写并运行一个 Python 脚本"
            think_result.output_guidance = "任务已经交给 Agent，确认派发并说明会带回代码和运行结果。"
        # The WebUI can inspect the exact THINK model response on demand. It
        # is intentionally kept separate from the safe roleplay summary.
        think_summary = json.dumps({
            "raw": think_response,
        }, ensure_ascii=False)

        # Apply emotion delta from THINK
        self.emotion.state.apply_delta(think_result.emotion_delta)

        # Auto-fetch second-pass memory context from THINK's memory_query
        mq = (think_result.memory_query or "").strip()
        if mq and mq.lower() not in ("none", "n/a", "-"):
            try:
                extra = self.memory.get_memory_context(mq)
                if extra and extra != "No relevant memories found.":
                    memory_context = f"{memory_context}\n\nFollow-up recall ({mq}):\n{extra}"
            except Exception:
                pass

        # Apply LIFE skill guidance when THINK selected one
        if think_result.skill_call:
            skill_name = str(think_result.skill_call.get("name") or "").strip()
            skill = self.skills.get(skill_name) if skill_name else None
            if skill:
                think_result.output_guidance = (
                    f"{think_result.output_guidance}\n\nFollow skill '{skill.name}':\n{skill.content.strip()}"
                ).strip()

        # Execute an ordered THINK tool batch. The legacy tool_call field is
        # accepted for existing models, but new prompts use tool_calls.
        tool_calls = list(think_result.tool_calls or [])
        if not tool_calls and think_result.tool_call:
            tool_calls = [think_result.tool_call]
        tool_summaries = []
        dispatched_task_id = ""
        for tool_call in tool_calls[:4]:
            tool_name = tool_call.get("name")
            if not tool_name:
                continue
            # Accept both flat LIFE calls and OpenAI-style
            # {name, arguments:{...}} / {name, arguments:"{...}"} calls.
            nested_arguments = tool_call.get("arguments")
            if isinstance(nested_arguments, dict):
                tool_kwargs = {k: v for k, v in nested_arguments.items() if k != "name"}
            elif isinstance(nested_arguments, str):
                try:
                    parsed_arguments = json.loads(nested_arguments)
                    tool_kwargs = parsed_arguments if isinstance(parsed_arguments, dict) else {}
                except json.JSONDecodeError:
                    tool_kwargs = {k: v for k, v in tool_call.items() if k not in ("name", "arguments")}
            else:
                tool_kwargs = {k: v for k, v in tool_call.items() if k != "name"}

            if tool_name == "useagent":
                # Intensity: explicit in this message → dispatch now;
                # otherwise ask the user first (unless already set earlier).
                intensity = self._parse_intensity(message)
                # Medium is the safe default. Do not make a normal task wait
                # for a second message just to choose a thinking intensity.
                resolved = intensity or getattr(self, "_agent_intensity", "medium") or "medium"
                self._agent_intensity = resolved
                tool_kwargs["thinking_intensity"] = resolved
                tool_kwargs["difficulty_hint"] = self._intensity_to_difficulty(resolved)
                tool_kwargs["require_thinking"] = resolved in ("high", "max")
                ap = str(tool_kwargs.get("agent_prompt", "") or "")
                tool_kwargs["agent_prompt"] = f"[thinking_intensity={resolved}] {ap}".strip()
                tool_kwargs["metadata"] = {
                    "thinking_intensity": resolved,
                    "difficulty_hint": self._intensity_to_difficulty(resolved),
                    "require_thinking": resolved in ("high", "max"),
                }

            tool_result = await self.tools.call(tool_name, **tool_kwargs)
            if tool_result.success:
                preview = json.dumps(tool_result.data, ensure_ascii=False)[:1200]
                tool_summaries.append(f"{tool_name} succeeded: {preview}")
            else:
                tool_summaries.append(f"{tool_name} failed: {tool_result.error}")

            if tool_name == "useagent" and tool_result.success:
                task_id = tool_result.data.get("task_id")
                dispatched_task_id = str(task_id or "")
                self.active_tasks[task_id] = {
                    "prompt": tool_kwargs.get("agent_prompt", ""),
                    "status": "pending",
                    "thinking_intensity": getattr(self, "_agent_intensity", "medium") or "medium",
                    "started_at": datetime.now().isoformat(),
                }
                self._save_state()
                yield {"type": "task_started", "task_id": task_id}

        if tool_summaries:
            think_result.output_guidance = (
                f"{think_result.output_guidance}\n\nTool results (use these facts in the reply; do not invent results):\n"
                + "\n".join(f"- {summary}" for summary in tool_summaries)
            ).strip()

        # === OUTPUT STAGE ===
        output_system = self.output.build_prompt(
            user_message=message,
            think_guidance=think_result.output_guidance,
            emotion_context=json.dumps(self.emotion.state.to_dict()),
            persona_context=self._active_persona_context,
        )

        output_messages = [
            {"role": "user", "content": message},
        ]

        # Call mocr for OUTPUT (fixed model — ChooseModels is agent-only)
        output_response = ""
        try:
            async for chunk in self.mocr.generate(
                model_id=self.output_model or self.default_model,
                messages=output_messages,
                system_prompt=output_system,
                thinking=False,
            ):
                output_response += chunk
                yield {"type": "raw_chunk", "chunk": chunk}
            if output_response.startswith("[mocr offline]"):
                output_response = self._fallback_output(message, think_result)
        except Exception as e:
            output_response = self._fallback_output(message, think_result)

        if not output_response.strip():
            output_response = self._fallback_output(message, think_result)
        if dispatched_task_id:
            output_response = f"我已经把这个任务交给 Agent 处理了（任务 {dispatched_task_id}），完成后会把 Python 代码和 GitHub 连通性测试结果带回来。"
        elif output_response.startswith("I heard you say:") and self._looks_like_agent_task(message):
            output_response = "我识别到这是一个编码任务，正在交给 Agent 创建脚本并测试 github.com 的连通性。完成后我会把代码和运行结果带回来。"

        # Process final output
        output_response = self._normalize_persona_output(output_response, self._active_persona_context)
        output_result = OutputResult.from_text(output_response)

        # Store in memory
        self.memory.add_working("assistant", output_response)
        self.memory.store(message, importance=0.3)
        self.memory.store(output_response, importance=0.3)
        self.memory.enqueue_reflection(session_id, message, output_response)
        asyncio.create_task(self._run_companion_reflection(session_id, user_id, message, output_response, adapter_type))

        # Save state periodically
        self._save_state()

        # Yield final response chunks
        for i, chunk in enumerate(output_result.chunks):
            yield {
                "type": "chunk",
                "chunk": chunk,
                "done": i == len(output_result.chunks) - 1,
                "emotion_state": self.emotion.state.to_dict(),
                "mental_energy": self.circadian.state.mental_energy,
                "think_summary": think_summary if i == 0 else "",
            }

    def _fallback_think(self, message: str, forced_wake: bool) -> str:
        """Fallback THINK when mocr unavailable."""
        if forced_wake:
            return json.dumps({
                "emotion_delta": {"irritation": 0.3, "arousal": 0.2},
                "memory_query": "",
                "intent": "annoyed_wake",
                "strategy": "express_irritation",
                "output_guidance": "Express annoyance at being woken up. Keep it short.",
            })
        lowered = (message or "").lower()
        task_words = ("python", "脚本", "代码", "代码文件", "github", "连通性", "ping", "运行", "写一个")
        if any(word in lowered for word in task_words):
            return json.dumps({
                "emotion_delta": {"valence": 0.05, "connection": 0.03},
                "memory_query": "",
                "intent": "用户希望 Agent 编写并运行一个 Python 连通性测试脚本",
                "strategy": "把明确的编码任务交给 Agent 执行，并在完成后带回代码和运行结果",
                "tool_calls": [{
                    "name": "useagent",
                    "agent_prompt": (
                        "创建一个 Python 文件 hello_github.py，只修改这个文件。脚本必须先打印 Hello, World!，"
                        "然后使用 socket.create_connection 测试 github.com 的 443 端口，超时 5 秒，"
                        "打印 reachable 或 unreachable。运行脚本并返回完整代码、stdout、stderr 和退出码。"
                    ),
                    "agent_type": "code",
                }],
                "output_guidance": "确认任务已经交给 Agent，说明默认使用 medium 思考强度；完成后带回代码和运行结果。",
            })
        return json.dumps({
            "emotion_delta": {"valence": 0.05},
            "memory_query": message[:50],
            "intent": "general_conversation",
            "strategy": "respond_warmly",
            "output_guidance": "Use short sentences. Be friendly. Split into 2-3 lines.",
        })

    def _persona_think_summary(self, message: str, think_result: ThinkResult) -> str:
        """Write a short characterful inner aside without exposing chain of thought."""
        name = "我"
        if self._active_persona_context.startswith("Your name is "):
            name = self._active_persona_context.split("Your name is ", 1)[1].split(".", 1)[0].strip() or "我"
        valence = self.emotion.state.valence
        connection = self.emotion.state.connection
        irritation = self.emotion.state.irritation
        if irritation > .65:
            feeling = "虽然有一点烦，但还是先把语气放软一点"
        elif valence > .35 and connection > .55:
            feeling = "心里一下子亮起来了，想亲近一点回应"
        elif valence < -.25:
            feeling = "情绪有些低落，不过还是想认真接住这句话"
        else:
            feeling = "安静地陪着对方聊下去"
        text = (message or "").strip()
        is_greeting = any(word in text.lower() for word in ("你好", "嗨", "hello", "hi", "早上好", "晚上好"))
        if is_greeting:
            return f"{name}在和我打招呼呀～{feeling}，先回他一句，再看看他今天想聊什么。"
        if any(word in text for word in ("开心吗", "心情", "难过", "累不累")):
            return f"他是在关心我的状态呢。{feeling}，我想坦诚告诉他现在的感觉，也问问他自己怎么样。"
        if think_result.tool_calls:
            return f"这件事不能只靠猜，我先替他查一下；等结果回来，再用{name}自己的方式告诉他。"
        return f"我大概明白他想说什么了。{feeling}，先自然地接住这句话，不急着把话说得太满。"

    def _fallback_output(self, message: str, think_result: ThinkResult) -> str:
        """Fallback OUTPUT when mocr unavailable."""
        tool_names = [str(call.get("name")) for call in (think_result.tool_calls or []) if call.get("name")]
        if think_result.tool_call and think_result.tool_call.get("name"):
            tool_names.append(str(think_result.tool_call.get("name")))
        if "useagent" in tool_names:
            return "我已经把这个任务交给 Agent 处理了，等它完成后我会把代码和运行结果带回来。"
        persona = getattr(self, "_active_persona_context", "")
        name = ""
        if persona.startswith("Your name is "):
            name = persona.split("Your name is ", 1)[1].split(".", 1)[0].strip()
        if name and any(token in message.lower() for token in ("你是谁", "你叫", "who are you", "your name")):
            return f"我是{name}，0kay 的 LIFE 陪伴助手。现在模型服务暂时不可用，但我会保持这个身份继续陪你。"
        if self.circadian.state.is_sleeping:
            return "Zzz... *wakes up grumpily* What? What do you want?"
        elif self.circadian.state.mental_energy < 20:
            return "*yawns* Can we talk later? I'm so tired..."
        elif self.emotion.state.irritation > 0.7:
            return "What now? I'm busy."
        elif "hello" in message.lower() or "hi" in message.lower():
            return "Hey there! What's up?"
        else:
            return f"I heard you say: {message[:50]}... Tell me more!"

    @staticmethod
    def _normalize_persona_output(text: str, persona_context: str = "") -> str:
        value = (text or '').strip()
        if not value:
            return value
        if value.startswith('I heard you say:'):
            return '我听到了。你可以再告诉我具体想让我帮你做什么。'
        configured_name = "星瑶"
        if persona_context.startswith("Your name is "):
            configured_name = persona_context.split("Your name is ", 1)[1].split(".", 1)[0].strip() or configured_name
        forbidden = re.search(r'(?:我是|我叫[^，。！？!?]{0,20}[，。]?)\s*(?:一个)?(?:AI|人工智能|智能助手|人形智能助手|语言模型|机器人|聊天机器人|L\.I\.F\.E|DeepSeek|OpenAI)', value, re.IGNORECASE)
        if forbidden:
            value = re.sub(r'(?:我是|我叫[^，。！？!?]{0,20}[，。]?)\s*(?:一个)?(?:AI|人工智能|智能助手|人形智能助手|语言模型|机器人|聊天机器人|L\.I\.F\.E|DeepSeek|OpenAI)[^。！？!?]*', f'我是{configured_name}，一个有自己性格、会认真陪你聊天的人', value, flags=re.IGNORECASE)
        value = re.sub(r'```(?:\w+)?\s*', '', value).replace('```', '')
        value = re.sub(r'^\s{0,3}#{1,6}\s*', '', value, flags=re.MULTILINE)
        value = re.sub(r'^\s*[-*+]\s+', '', value, flags=re.MULTILINE)
        value = re.sub(r'\*\*(.*?)\*\*', r'\1', value)
        value = re.sub(r'__(.*?)__', r'\1', value)
        value = re.sub(r'`([^`]+)`', r'\1', value)
        return re.sub(r'\n{3,}', '\n\n', value).strip()

    @staticmethod
    def _looks_like_agent_task(message: str) -> bool:
        text = (message or "").lower()
        task_terms = ("python", "脚本", "代码", "github", "连通性", "ping", "运行", "创建文件", "写一个")
        request_terms = ("帮我", "能不能", "可以", "请", "搞一个", "写一个", "创建")
        return any(term in text for term in task_terms) and any(term in text for term in request_terms)

    @staticmethod
    def _agent_prompt_for(message: str) -> str:
        return (
            "完成用户的编码任务，只修改必要文件。用户原话：" + (message or "") + "\n"
            "如果任务涉及 Python 和 GitHub 连通性：创建 hello_github.py，打印 Hello, World!，"
            "使用 socket.create_connection 测试 github.com:443，timeout=5，运行脚本并返回代码、stdout、stderr 和退出码。"
        )

    async def _run_companion_reflection(self, session_id: str, user_id: str, message: str, response: str, adapter_type: str) -> None:
        """Let THINK propose optional private companion actions after delivery.

        The model only proposes JSON. Code validates the small action surface
        and records every decision; it never lets the model mutate state freely.
        """
        prompt = (
            "Given a completed conversation, decide whether LIFE should privately write a journal, record a dream, "
            "or create a proactive contact candidate. These are optional; most turns should return action=none. "
            "Never send a message directly. Return only JSON: "
            '{"action":"none|journal|dream|proactive_candidate|persona_evolution","content":"...","trait":"","value":"","target":"","motive":""}.\n'
            f"time={datetime.now().strftime('%Y-%m-%d %H:%M')} user={user_id} channel={adapter_type}\n"
            f"user: {message[:1200]}\nassistant: {response[:1200]}"
        )
        try:
            raw = ""
            async for chunk in self.mocr.generate(
                model_id=self.think_model or self.default_model,
                messages=[{"role": "user", "content": prompt}],
                system_prompt="You are a private companion lifecycle planner. Output JSON only.",
                thinking=True,
                max_tokens=300,
            ):
                raw += chunk
            if not raw or raw.startswith("[mocr offline]"):
                return
            match = re.search(r"\{[\s\S]*\}", raw)
            decision = json.loads(match.group(0) if match else raw)
            action = decision.get("action")
            content = str(decision.get("content") or "").strip()
            if action == "journal" and content:
                self.companion.journal(content, "journal")
                self.companion.audit("autonomous_journal", content[:500], session_id)
            elif action == "dream" and content:
                self.companion.journal(content, "dream")
                self.companion.audit("autonomous_dream", content[:500], session_id)
            elif action == "proactive_candidate" and content:
                target = str(decision.get("target") or f"user:{user_id}")
                motive = str(decision.get("motive") or "conversation_followup")
                self.companion.create_proactive_candidate(target, motive, content)
                self.companion.audit("autonomous_proactive_candidate", content[:500], target)
            elif action == "persona_evolution":
                trait = str(decision.get("trait") or "")
                value = str(decision.get("value") or "")
                if trait and value:
                    self.companion.propose_persona_evolution(trait, value, message[:500])
            else:
                self.companion.audit("companion_reflection", "no_action", session_id)
        except Exception as error:
            self.companion.audit("companion_reflection", str(error), session_id, "failed")

    async def on_task_completed(self, task_id: str, state: str, result: str) -> str:
        """Handle task completion callback."""
        if task_id in self.active_tasks:
            task = self.active_tasks.pop(task_id)

            # Update emotion based on task result
            delta = self.emotion.on_task_completed(state == "done")
            self.emotion.state.apply_delta(delta)

            # Apply circadian drain
            self.circadian.task_completed(60)

            # Generate natural insertion message using OUTPUT
            prompt = f"Task completed. Result: {result[:200]}"
            output_system = self.output.build_prompt(
                user_message=prompt,
                think_guidance="Inform the user naturally about the completed task.",
                emotion_context=json.dumps(self.emotion.state.to_dict()),
                persona_context=getattr(self, "_active_persona_context", "No custom persona is configured."),
            )

            try:
                response = ""
                async for chunk in self.mocr.generate(
                    model_id=self.output_model or self.default_model,
                    messages=[{"role": "user", "content": prompt}],
                    system_prompt=output_system,
                ):
                    response += chunk
                self._save_state()
                text = response or (result if state == "done" else f"Agent task failed: {result or state}")
                self._notifications.append({"id": f"notification_{datetime.now().timestamp()}", "session_id": "webui:default", "text": text, "created_at": datetime.now().isoformat()})
                self._notifications = self._notifications[-100:]
                return text
            except Exception:
                if state == "done":
                    text = f"Agent 任务已完成：{result[:500]}"
                else:
                    text = f"Agent 任务失败：{result[:500]}"
                self._notifications.append({"id": f"notification_{datetime.now().timestamp()}", "session_id": "webui:default", "text": text, "created_at": datetime.now().isoformat()})
                self._notifications = self._notifications[-100:]
                return text

        # Tasks can complete after the originating HTTP stream is closed. Keep
        # a short session-addressed notification queue for WebUI/OneBot.
        text = result if state == "done" else f"Agent task failed: {result or state}"
        self._notifications.append({"id": f"notification_{datetime.now().timestamp()}", "session_id": "webui:default", "text": text, "created_at": datetime.now().isoformat()})
        self._notifications = self._notifications[-100:]
        return text

    def get_notifications(self, session_id: str = "") -> list[dict]:
        selected = [item for item in self._notifications if not session_id or item["session_id"] == session_id]
        self._notifications = [item for item in self._notifications if item not in selected]
        return selected

    async def compact_conversation(self, history: list[dict], persona: dict | None = None) -> str:
        """Create a durable session summary through LIFE's configured model."""
        safe = [item for item in history if isinstance(item, dict) and item.get("content")]
        transcript = "\n".join(
            f"{str(item.get('role') or 'user')}: {str(item.get('content') or '')[:4000]}"
            for item in safe[-80:]
        )
        if not transcript:
            return "暂无可整理的对话上下文。"
        persona = persona or {}
        name = str(persona.get("name") or "L.I.F.E")
        prompt = (
            f"You are {name}. Summarize this conversation for future context. "
            "Keep user preferences, commitments, unresolved questions, decisions, and important facts. "
            "Do not invent details. Write concise Chinese bullet points.\n\n"
            + transcript
        )
        try:
            response = ""
            async for chunk in self.mocr.generate(
                model_id=self.think_model or self.output_model or self.default_model,
                messages=[{"role": "user", "content": prompt}],
                system_prompt="You compress conversation context faithfully. Output only the summary.",
                thinking=True,
                max_tokens=900,
            ):
                response += chunk
            if response and not response.startswith("[mocr offline]"):
                self.companion.audit("context_compaction", response[:1000], outcome="ok")
                return response.strip()
        except Exception as error:
            self.companion.audit("context_compaction", str(error), outcome="failed")
        # Deterministic fallback preserves continuity when the model is unavailable.
        lines = [line for line in transcript.splitlines() if line.strip()]
        summary = "对话摘要（模型不可用时生成）：\n" + "\n".join(f"- {line[:300]}" for line in lines[-12:])
        self.companion.audit("context_compaction", "deterministic fallback", outcome="fallback")
        return summary

    def get_tools_schema(self) -> list[dict]:
        return self.tools.list_tools()

    def get_state(self) -> dict:
        return {
            "emotion": self.emotion.state.to_dict(),
            "circadian": self.circadian.to_dict(),
            "active_tasks": list(self.active_tasks.keys()),
            "online_agents": self.online_agent_count,
            "total_agents": len(self.online_agents),
        }

    def get_memory_stats(self) -> dict:
        return self.memory.get_stats()

    def list_memories(self, limit: int = 50, query: str = "") -> list[dict]:
        """Collect recent memories across tiers for the WebUI."""
        items: list[dict] = []

        def push(m, tier: str):
            items.append({
                "id": m.id,
                "content": m.content,
                "importance": m.importance,
                "strength": m.strength,
                "created_at": m.created_at.isoformat(),
                "tags": list(m.tags or []),
                "tier": tier,
            })

        for m in self.memory.working.messages[-20:]:
            items.append({
                "id": f"work_{len(items)}",
                "content": m.get("content", ""),
                "importance": 0.5,
                "strength": 1.0,
                "created_at": m.get("timestamp", ""),
                "tags": [],
                "tier": "working",
            })

        for m in list(self.memory.short_term.memories)[-limit:]:
            push(m, "short_term")
        for m in list(self.memory.long_term.memories)[-limit:]:
            push(m, "long_term")

        if query:
            ql = query.lower()
            items = [i for i in items if ql in i["content"].lower()]
        return items[: max(1, limit)]

    # Permissions (screen_watch / computer_use / host report) — default OFF
    def get_permissions(self) -> dict:
        return getattr(self, "_permissions", {
            "screen_watch": False,
            "computer_use": False,
            "report_agent_host": "",
        })

    def set_permissions(self, screen_watch: bool = False, computer_use: bool = False, report_agent_host: str = "") -> dict:
        self.tool_config.computer_use = bool(computer_use)
        self._permissions = {
            "screen_watch": bool(screen_watch),
            "computer_use": bool(computer_use),
            "report_agent_host": report_agent_host or "",
        }
        return self._permissions

    def apply_tool_settings(self, values: dict) -> None:
        """Apply saved Core settings without ever persisting secrets in LIFE state."""
        self.tool_config.computer_use = bool(values.get("computer_use", False))
        self.tool_config.mail_mailbox_path = str(values.get("mail_mailbox_path") or "")
        self.tool_config.mail_imap_host = str(values.get("mail_imap_host") or "")
        self.tool_config.mail_imap_port = int(values.get("mail_imap_port") or 993)
        self.tool_config.mail_imap_user = str(values.get("mail_imap_user") or "")
        self.tool_config.mail_imap_password = str(values.get("mail_imap_password") or "")
        self.tool_config.mcp_enabled = values.get("mcp_enabled") is not False
        self.tool_config.onebot_enabled = bool(values.get("onebot_enabled", False))
        self.think_model = str(values.get("think_model") or "").strip()
        self.output_model = str(values.get("output_model") or "").strip()
        self.companion.set_runtime_policy(
            int(values.get("proactive_daily_limit") or 3),
            int(values.get("proactive_target_limit") or 1),
        )
