"""Session-aware LIFE orchestration: plan, execute, express, and deliver."""
import asyncio
import json
import os
import random
import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path

from . import diary

from .emotion.emotion import EmotionEngine, EmotionState
from .circadian.circadian import CircadianSystem
from .memory.memory import MemorySystem
from .environment import EnvironmentSystem
from .content import ContentSystem
from .media import MediaPipeline
from .usage import UsageLedger
from . import prompt as prompt_sections
from .extensions import ExtensionRegistry
from .think.think import ThinkStage, ThinkResult
from .output.output import OutputStage
from .tools.tools import RuntimeToolConfig, create_default_registry
from .skills import get_skill_registry
from .core_client import get_core_client
from .companion import CompanionSystem
from .model_client import MocrClient
from .soul import SoulState
from .task_records import TaskRecorder, task_context


@dataclass
class TurnContext:
    session_id: str
    user_id: str
    adapter_type: str
    persona_context: str
    history: list[dict] = field(default_factory=list)


class LifeEngine:
    def __init__(self, data_dir=None, mocr_address=None):
        self.data_dir = data_dir or os.getenv("LIFE_DATA_DIR", "./data/life")
        self.emotion = EmotionEngine()
        self.circadian = CircadianSystem()
        self.soul = SoulState()
        self.memory = MemorySystem(f"{self.data_dir}/memory")
        self.companion = CompanionSystem(self.data_dir)
        self.environment = EnvironmentSystem(self.data_dir, settings_getter=self.companion.get_settings)
        self.content = ContentSystem(settings_getter=self.companion.get_settings)
        self.media = MediaPipeline(settings_getter=self.companion.get_settings)
        self.usage = UsageLedger(self.data_dir)
        self.model_routes: dict[str, str] = {}
        self.extensions = ExtensionRegistry()
        self._register_extensions()
        self.think = ThinkStage()
        self.output = OutputStage()
        self.mocr = MocrClient(mocr_address)
        self.task_records = TaskRecorder(self.data_dir)
        self.mocr.recorder = self.task_records
        self.think_model = os.getenv("LIFE_THINK_MODEL", "")
        self.output_model = os.getenv("LIFE_OUTPUT_MODEL", "")
        self.default_model = os.getenv("LIFE_DEFAULT_MODEL", "auto")
        self.core = get_core_client()
        self.online_agents = []
        self.online_agent_count = 0
        self.tool_config = RuntimeToolConfig()
        self.tools = create_default_registry(core_client=self.core, config=self.tool_config, memory=self.memory, companion=self.companion)
        self.tools.recorder = self.task_records
        self.skills = get_skill_registry()
        self.active_tasks = {}
        self.minecraft_cursor = 0
        self.minecraft_host = ""
        self._notifications = []
        self._completed_tasks = []
        self._histories = {}
        self._session_locks = {}
        self._dispatch_lock = asyncio.Lock()
        self._background_tasks = set()
        self._reflection_limit = asyncio.Semaphore(2)
        self._last_plan = datetime.min
        self._last_diary_date = ""
        self._last_dream_date = ""
        self._last_dream_key = ""
        self._last_agenda_date = ""
        self._last_review_date = ""
        self._state_path = Path(self.data_dir) / "state.json"
        self._load_state()

    def _register_extensions(self) -> None:
        """Register optional capabilities; each is fail-closed until its provider exists."""
        settings = self.companion.get_settings
        self.extensions.register("tts", probe=lambda: bool(os.getenv("TTS_ENDPOINT")), detail="TTS_ENDPOINT 未配置")
        self.extensions.register("image", probe=lambda: bool(os.getenv("IMAGE_ENDPOINT")), detail="IMAGE_ENDPOINT 未配置")
        self.extensions.register("comfyui", probe=lambda: bool(os.getenv("COMFYUI_URL")), detail="COMFYUI_URL 未配置")
        self.extensions.register("content", probe=lambda: str(settings().get("enable_content_fetch", "0")) == "1", detail="内容抓取未开启")
        self.extensions.register("vision", probe=lambda: bool(os.getenv("VISION_MODEL")), detail="视觉模型未配置")
        self.extensions.register("qzone", probe=lambda: False, detail="QQ空间扩展未安装")

    def extension_status(self) -> dict:
        return self.extensions.status()

    def sync_agents(self):
        info = self.core.list_agents(include_unhealthy=False)
        self.online_agents = info.get("agents", [])
        self.online_agent_count = info.get("online_count", 0)
        return self.online_agent_count

    def _load_state(self):
        try:
            data = json.loads(self._state_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return
        if "emotion" in data:
            self.emotion.state = EmotionState.from_dict(data["emotion"])
        self.circadian.restore(data.get("circadian", {}))
        self.active_tasks = data.get("active_tasks", {})
        self._notifications = data.get("notifications", [])
        self._completed_tasks = data.get("completed_tasks", [])
        self._histories = data.get("histories", {})
        # Persist daily markers so a restart never regenerates the same diary/dream.
        self._last_diary_date = data.get("last_diary_date", "")
        self._last_dream_date = data.get("last_dream_date", "")
        self._last_dream_key = data.get("last_dream_key", "")
        self._last_agenda_date = data.get("last_agenda_date", "")
        self._last_review_date = data.get("last_review_date", "")

    def _save_state(self):
        self._state_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self._state_path.with_suffix(".tmp")
        temporary.write_text(json.dumps({"emotion": self.emotion.state.to_dict(), "circadian": self.circadian.to_dict(),
            "active_tasks": self.active_tasks, "notifications": self._notifications, "completed_tasks": self._completed_tasks,
            "histories": self._histories, "last_diary_date": self._last_diary_date, "last_dream_date": self._last_dream_date,
            "last_dream_key": self._last_dream_key, "last_agenda_date": self._last_agenda_date,
            "last_review_date": self._last_review_date}, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self._state_path)

    @staticmethod
    def _persona(persona):
        parts = [f"{key}: {persona[key]}" for key in ("name", "birthDate", "description", "personality", "greeting") if persona.get(key)]
        try:
            birth = datetime.strptime(persona.get("birthDate", ""), "%Y-%m-%d").date()
            today = datetime.now().date()
            age = today.year-birth.year-((today.month,today.day)<(birth.month,birth.day))
            if age >= 0: parts.append(f"Current age: {age}")
        except ValueError:
            pass
        parts.append(f"Current local time: {datetime.now().astimezone().isoformat()}")
        return "\n".join(parts)

    @staticmethod
    def _parse_intensity(message):
        for intensity, words in (("max", ("最高强度", "全力", "maximum")), ("high", ("深度思考", "深入", "high")), ("low", ("快速", "轻量", "low"))):
            if any(word in message.lower() for word in words):
                return intensity
        return "medium"

    async def process_message(self, session_id, user_id, message, adapter_type="webui", persona=None, history=None):
        session_id = session_id or f"{adapter_type}:{user_id or 'default'}"
        lock = self._session_locks.setdefault(session_id, asyncio.Lock())
        async with lock:
            previous = list(self._histories.get(session_id, []))
            if history is not None:
                previous = [{"role": item["role"], "content": str(item["content"])[:16000]} for item in history[-21:]
                            if isinstance(item, dict) and item.get("role") in ("user", "assistant", "system") and item.get("content")]
                if previous and previous[-1] == {"role": "user", "content": message}:
                    previous.pop()
            turn = TurnContext(session_id, user_id, adapter_type, self._persona(persona or {}), previous)
            learned = await asyncio.to_thread(self.companion.persona_evolution_context)
            if learned:
                turn.persona_context += "\nStable learned traits:\n" + learned
            world = await asyncio.to_thread(self.companion.world_context)
            if world:
                turn.persona_context += "\nWorld & persona knowledge:\n" + world
            turn.history.append({"role": "user", "content": message})
            token = task_context.set({"session_id": session_id})
            record = await self.task_records.start("conversation", message)
            task_context.set({"session_id": session_id, "task_id": record["task_id"]})
            response = ""
            completed = False
            try:
                async for event in self._process_turn(turn, message):
                    if event.get("type") == "chunk":
                        response += event.get("chunk", "")
                    if event.get("done"):
                        await self.task_records.finish(record, response)
                        completed = True
                    yield event
            except (asyncio.CancelledError, GeneratorExit):
                if not completed:
                    await self.task_records.finish(record, response, cancelled=True)
                raise
            except Exception as error:
                await self.task_records.finish(record, response, str(error))
                raise
            finally:
                task_context.reset(token)

    async def _process_turn(self, turn, message):
        await asyncio.to_thread(self.companion.observe_user, turn.user_id or "anonymous", message, is_group=turn.adapter_type == "onebot_group")
        if turn.adapter_type == "onebot_group":
            await asyncio.to_thread(self.companion.observe_group, turn.session_id, turn.user_id or "anonymous", message)
        self.circadian.tick(0)
        if self.circadian.state.is_sleeping and self.circadian.force_wake():
            self.emotion.state.apply_delta(self.emotion.on_forced_wake())
        self.circadian.observe_interaction()
        self.emotion.state.apply_delta(self.emotion.on_user_message(message))
        turn.intent = self.emotion.classify_intent(message)
        try:
            open_topics = await asyncio.to_thread(self.companion.list_open_topics, turn.user_id or "", 5)
            portrait = await asyncio.to_thread(self.companion.get_user_portrait, turn.user_id or "")
        except Exception:
            open_topics, portrait = [], {}
        if open_topics:
            turn.persona_context += "\nUnfinished topics (pick up naturally if relevant):\n" + "\n".join(f"- {topic}" for topic in open_topics)
        if portrait.get("summary"):
            turn.persona_context += "\nKnown about this user: " + str(portrait["summary"])
        scope = f"session:{turn.session_id}"
        memory_context = await asyncio.to_thread(self.memory.get_memory_context, message, scope, self.soul.recall_limit())
        await asyncio.to_thread(self.sync_agents)
        summaries = []
        guidance = "Respond naturally."
        # Each planning turn sees the preceding tool result before choosing another.
        for step in range(4):
            system = self.think.build_prompt(user_message=message, emotion_context=json.dumps(self.emotion.state.to_dict()),
                energy_context=f"{self._body_phrase()}；{self.circadian.get_prompt_context()}", memory_context=memory_context,
                active_tasks=[tid for tid, task in self.active_tasks.items() if task.get("session_id") == turn.session_id],
                online_agents=self.online_agent_count, skills_context=self.skills.context_block(message),
                tools_context=json.dumps(self.get_tools_schema(), ensure_ascii=False), time_context=datetime.now().strftime("%Y-%m-%d %H:%M"))
            system += "\nPersona:\n" + turn.persona_context + "\nCompleted tool results (do not repeat these actions):\n" + "\n".join(summaries)
            try:
                raw = "".join([chunk async for chunk in self.mocr.generate(self._model_for("think"), turn.history, system, thinking=True)])
                plan = self.think.parse_response(raw)
            except Exception as error:
                guidance = f"Planning service is unavailable ({type(error).__name__}). Explain that the request was not completed. Do not claim a task was dispatched."
                break
            self.emotion.state.apply_delta(plan.emotion_delta)
            guidance = plan.output_guidance
            if plan.memory_query:
                memory_context += "\n" + await asyncio.to_thread(self.memory.get_memory_context, plan.memory_query, scope)
            if plan.skill_call:
                skill = self.skills.get(str(plan.skill_call.get("name", "")))
                if skill:
                    guidance += "\n" + skill.content
                    await asyncio.to_thread(self.companion.grow_skill, str(plan.skill_call.get("name", "")))
            calls = plan.tool_calls or ([plan.tool_call] if plan.tool_call else [])
            if not calls:
                break
            call = calls[0]
            name = call.get("name", "")
            args = call.get("arguments", {key: value for key, value in call.items() if key != "name"})
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except ValueError:
                    args = {}
            if not isinstance(args, dict):
                args = {}
            if name in ("remember", "recall", "note_create", "note_read"):
                args["scope"] = scope
            if name == "useagent":
                intensity = self._parse_intensity(message)
                args.setdefault("agent_prompt", message)
                args["agent_prompt"] = f"[thinking_intensity={intensity}] {args['agent_prompt']}"
                args["thinking_intensity"] = intensity
                args["metadata"] = {"session_id": turn.session_id, "user_id": turn.user_id, "adapter_type": turn.adapter_type, "parent_id": task_context.get().get("task_id", "")}
                # Completion may race the dispatch response. Serialize registration with callbacks.
                async with self._dispatch_lock:
                    result = await self.tools.call(name, **args)
                    if result.success:
                        task_id = result.data["task_id"]
                        self.active_tasks[task_id] = {"prompt": args["agent_prompt"], "status": "pending", "session_id": turn.session_id,
                            "user_id": turn.user_id, "adapter_type": turn.adapter_type, "persona_context": turn.persona_context,
                            "started_at": datetime.now().isoformat()}
                        self._save_state()
                if result.success:
                    yield {"type": "task_started", "task_id": task_id}
            else:
                result = await self.tools.call(name, **args)
            summaries.append(json.dumps({"tool": name, "success": result.success, "data": result.data, "error": result.error}, ensure_ascii=False))
            if name == "useagent":
                guidance = "Report the dispatch result accurately. Accepted means pending, not completed."
                break
        guidance += "\nRelevant memory:\n" + memory_context + "\nTool results:\n" + "\n".join(summaries)
        intent = getattr(turn, "intent", "")
        if intent in ("情绪", "抱怨"):
            guidance = f"用户此刻偏向「{intent}」，先共情回应，不要急着解决问题或说教。\n" + guidance
        elif intent == "请求":
            guidance = "用户提出了请求：先确认再执行，如实报告结果，不要假装已经完成。\n" + guidance
        elif intent == "提问":
            guidance = "用户在提问：先直接回答，再按需要补充。\n" + guidance
        relationship_style = await self._relationship_style(getattr(turn, "user_id", ""))
        if relationship_style:
            guidance = relationship_style + "\n" + guidance
        system = self.output.build_prompt(user_message=message, think_guidance=guidance,
            emotion_context=json.dumps(self.emotion.state.to_dict()), persona_context=turn.persona_context)
        response = ""
        try:
            async for chunk in self.mocr.generate(self._model_for("output"), turn.history, system,
                    max_tokens=self.soul.output_tokens(), temperature=self.soul.temperature()):
                response += chunk
                yield {"type": "chunk", "chunk": chunk, "done": False}
        except Exception:
            text = "\n回复生成服务暂时不可用。"
            if summaries:
                text += "已执行的工具结果：" + "\n".join(summaries)
            else:
                text += "当前请求尚未完成，请稍后重试。"
            response += text
            yield {"type": "chunk", "chunk": text, "done": False}
        if not response:
            response = "模型没有返回内容，当前请求未完成。"
            yield {"type": "chunk", "chunk": response, "done": False}
        turn.history.append({"role": "assistant", "content": response})
        self._histories[turn.session_id] = turn.history[-20:]
        try:
            state = self.emotion.state
            self.soul.resonate(float(getattr(state, "valence", 0.5) or 0.5), float(getattr(state, "arousal", 0.5) or 0.5))
        except Exception:
            pass
        self.usage.record(self._model_for("think"), task="conversation")
        self.usage.record(self._model_for("output"), task="conversation")
        if turn.adapter_type == "onebot_group":
            try:
                group_id = str(turn.session_id).rsplit("_", 1)[-1]
                await asyncio.to_thread(self.companion.note_group_bot_spoke, group_id, message)
            except Exception:
                pass
        # Durable memory comes from extracted key points in _reflect, not the raw turn.
        await asyncio.to_thread(self.memory.enqueue_reflection, turn.session_id, message, response)
        self._save_state()
        if len(self._background_tasks) < 8:
            task = asyncio.create_task(self._reflect(turn, message, response))
            self._background_tasks.add(task)
            task.add_done_callback(self._background_tasks.discard)
        yield {"type": "chunk", "chunk": "", "done": True, "emotion_state": self.emotion.state.to_dict(),
               "mental_energy": self.circadian.state.mental_energy}

    async def _relationship_style(self, user_id: str) -> str:
        """Unified tone guidance from the relationship expression decision (stage + interaction + role)."""
        if not user_id:
            return ""
        state = self.emotion.state
        try:
            expression = await asyncio.to_thread(
                self.companion.relationship_expression, user_id,
                float(getattr(state, "valence", 0.5) or 0.5),
                float(getattr(state, "arousal", 0.5) or 0.5),
                float(getattr(state, "irritation", 0.0) or 0.0))
        except Exception:
            return ""
        role = str(expression.get("role") or "other")
        parts = []
        if role == "owner":
            parts.append("对方是主要陪伴对象；")
        elif role == "secondary":
            parts.append("对方是较熟悉的次要陪伴对象；")
        parts.append(str(expression.get("tone") or ""))
        return "".join(part for part in parts if part)

    async def _reflect(self, turn, message, response):
        async with self._reflection_limit:
            try:
                prompt = ('Review this conversation. Return JSON: '
                          '{"action":"none|proactive_candidate|persona_evolution",'
                          '"content":"","trait":"","value":"","motive":"",'
                          '"memories":["lasting first-person facts/preferences/commitments about the user, each <= 80 chars"],'
                          '"open_topics":["unresolved threads worth following up later"],'
                          '"resolved_topics":["threads that were resolved this turn"],'
                          '"expressions":["short natural phrases from the assistant worth reusing, empty if none"],'
                          '"portrait":"one sentence updating what you know about this user, empty if nothing new"}. '
                          'Only extract durable, useful facts; never store small talk, questions, or the assistant reply; '
                          'use an empty list when nothing lasting was said. The daily diary is written separately, '
                          'so never emit journal/dream here.\n'
                          f'user: {message[:1200]}\nassistant: {response[:1200]}')
                raw = "".join([chunk async for chunk in self.mocr.generate(self._model_for("reflect"),
                    [{"role": "user", "content": prompt}], "Private companion planner. JSON only.", thinking=False, max_tokens=700)])
                decision = json.loads(raw)
                for item in (decision.get("memories") or [])[:self.soul.impression_limit()]:
                    text = str(item).strip()
                    if 4 <= len(text) <= 160:
                        await asyncio.to_thread(self.memory.remember, text, "", ["extracted"], 0.6, "fact", "public")
                if turn.user_id:
                    await asyncio.to_thread(self.companion.record_open_topics, turn.user_id, decision.get("open_topics") or [])
                    if decision.get("resolved_topics"):
                        await asyncio.to_thread(self.companion.resolve_open_topics, turn.user_id, decision["resolved_topics"])
                    if str(decision.get("portrait") or "").strip():
                        await asyncio.to_thread(self.companion.set_user_portrait, turn.user_id, str(decision["portrait"]).strip())
                    for expression in (decision.get("expressions") or [])[:2]:
                        text = str(expression).strip()
                        if 2 <= len(text) <= 200:
                            await asyncio.to_thread(self.companion.add_expression, text, "", "public", "conversation")
                action = decision.get("action")
                content = str(decision.get("content") or "")
                if action == "proactive_candidate" and content:
                    target = f"user:{turn.user_id}"
                    if turn.adapter_type == "onebot_group":
                        target = f"group:{turn.session_id.rsplit('_', 1)[-1]}"
                    await asyncio.to_thread(self.companion.create_proactive_candidate, target, str(decision.get("motive") or "conversation_followup"), content)
                elif action == "persona_evolution" and decision.get("trait") and decision.get("value"):
                    await asyncio.to_thread(self.companion.propose_persona_evolution, decision["trait"], decision["value"], message[:500])
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "companion_reflection", str(error), turn.session_id, "failed")

    def _body_phrase(self) -> str:
        """Qualitative body state (never expose raw gauges to the model's prose)."""
        energy = float(getattr(self.circadian.state, "mental_energy", 100.0) or 0.0)
        hunger = float(getattr(self.circadian.state, "hunger", 0.0) or 0.0)
        health = float(getattr(self.circadian.state, "health", 100.0) or 100.0)
        parts = ["精力充沛" if energy >= 70 else "有些疲惫" if energy >= 40 else "很疲惫"]
        if hunger >= 75:
            parts.append("挺饿的")
        elif hunger >= 45:
            parts.append("有点饿")
        if health < 60:
            parts.append("身体不太舒服")
        if getattr(self.circadian.state, "is_sleeping", False):
            parts.append("正在睡觉")
        return "，".join(parts)

    def _emotion_phrase(self) -> str:
        state = self.emotion.state
        valence = float(getattr(state, "valence", 0.5) or 0.5)
        arousal = float(getattr(state, "arousal", 0.5) or 0.5)
        mood = "心情不错" if valence >= 0.65 else "情绪有些低落" if valence <= 0.35 else "情绪平平"
        extra = "，有点兴奋" if arousal >= 0.65 else "，有点沉闷" if arousal <= 0.35 else ""
        return mood + extra

    async def _diary_complete(self, prompt: str, max_tokens: int = 700) -> str:
        """Single model call used by the diary/dream generators."""
        model = self._model_for("journal")
        self.usage.record(model, task="diary")
        world = await asyncio.to_thread(self.companion.world_context)
        system = prompt_sections.render([
            prompt_sections.section("system.diary", "内心独白作者", "你是 L.I.F.E 的内心独白作者。", source="diary"),
            prompt_sections.section("system.world", "世界与角色设定", world, source="world"),
        ], mode=prompt_sections.RenderMode.LABELED_BLOCK)
        try:
            text = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], system, thinking=False, max_tokens=max_tokens)])
        except Exception:
            return ""
        return text.strip().strip('"')

    async def _daily_context(self, day: str = "") -> dict:
        """Gather a day's real life context (agenda, interactions, groups, mood, body, memories).

        ``day`` defaults to today; pass an explicit YYYY-MM-DD to review a past day
        (used when the diary for the day that just ended is written after midnight).
        """
        now = datetime.now()
        target = day or now.date().isoformat()
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        try:
            agenda = await asyncio.to_thread(self.companion.agenda_for_day, target)
        except Exception:
            agenda = []
        ledger = [event for event in (snapshot.get("relationship_ledger") or []) if str(event.get("created_at") or "").startswith(target)]
        topics: list[str] = []
        for group in (snapshot.get("groups") or {}).values():
            topics.extend([str(topic.get("topic")) for topic in (group.get("topics") or [])[:4]])
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-3:]:
            for item in self._histories[session_id][-5:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:140]}')
        try:
            memories = (await asyncio.to_thread(self.memory.page_facts, "", "", 6, 0, "recent")).get("items", [])
        except Exception:
            memories = []
        try:
            upcoming = await asyncio.to_thread(self.companion.upcoming_important_dates, 7)
        except Exception:
            upcoming = []
        try:
            current, following = self._agenda_position(agenda, now)
        except Exception:
            current, following = None, None
        try:
            digests = await asyncio.to_thread(self.companion.list_digests, "", 6)
        except Exception:
            digests = []
        return {
            "date": target,
            "time": now.strftime("%H:%M"),
            "sleeping": getattr(self.circadian.state, "is_sleeping", False),
            "body_state": self._body_phrase(),
            "emotion_summary": self._emotion_phrase(),
            "environment": self.environment.env_context(),
            "agenda_current": (current or {}).get("title"),
            "agenda_next": (following or {}).get("title"),
            "agenda": [{"title": item.get("title"), "at": item.get("start_at"), "status": item.get("status")} for item in agenda],
            "interactions": [{"who": event.get("user_id"), "event": event.get("event_key"), "delta": event.get("delta")} for event in ledger[:10]],
            "_ledger_events": ledger[:20],
            "_agenda_events": agenda,
            "group_topics": topics[:8],
            "important_dates": [{"title": item.get("title"), "in_days": item.get("days_until")} for item in upcoming],
            "memories": [m.get("content", "")[:80] for m in memories],
            "content": [{"kind": d.get("kind"), "title": d.get("title")} for d in digests],
            "recent_chat": recent[-6:],
            "conversations": list(self._histories.keys())[-3:],
        }

    @staticmethod
    def _agenda_position(agenda: list[dict], now: datetime) -> tuple[dict | None, dict | None]:
        """The agenda item being lived now and the next one (for near-term detail)."""
        current = following = None
        for item in agenda or []:
            start = str(item.get("start_at") or "").replace("T", " ").strip()
            if not start:
                continue
            try:
                start_dt = datetime.fromisoformat(start)
            except ValueError:
                continue
            if start_dt <= now:
                current = item
            elif following is None:
                following = item
        return current, following

    async def generate_companion_text(self, kind: str, hint: str = "", day: str = "") -> str:
        """Write a journal/dream/outreach entry grounded in a day's real, level-tagged facts."""
        context = await self._daily_context(day)
        if kind == "proactive":
            prompt = ("写一条此刻想主动对用户说的话（不超过 80 字），自然、真诚、结合当下状态，只输出这句话本身。"
                      + (f"\n附加提示：{hint[:200]}" if hint else "")
                      + f"\n当前状态（JSON）：{json.dumps(context, ensure_ascii=False)}")
            return await self._diary_complete(prompt, max_tokens=200)
        memory_facts = list(context.get("memories") or [])
        memory_facts += [f"[{item.get('kind')}] {item.get('title')}" for item in (context.get("content") or [])]
        ledger_text, entries = diary.build_ledger(
            agenda=list(context.get("_agenda_events") or []),
            interactions=list(context.get("_ledger_events") or []),
            memories=memory_facts,
            body_phrase=self._body_phrase(), emotion_phrase=self._emotion_phrase(), day=context["date"])
        recent = await asyncio.to_thread(self.companion.recent_journals, "dream" if kind == "dream" else "journal", 3)
        recent_texts = [row.get("content", "") for row in recent]
        if kind == "dream":
            fragments = self._dream_fragments(context, entries)
            theme_name, theme_hint = random.choice(list(diary.DREAM_THEMES.items()))
            return await diary.generate_dream(
                self._diary_complete, theme_name=theme_name, theme_hint=theme_hint,
                context_text=json.dumps(context, ensure_ascii=False), fragments=fragments, recent_texts=recent_texts)
        env = context.get("environment") or {}
        env_text = "，".join(str(part) for part in (
            self.environment.weather_text(), env.get("holiday_today") and f"今天是{env['holiday_today']}") if part)
        return await diary.generate_journal(
            self._diary_complete, day=context["date"], time_text=context["time"],
            ledger_text=ledger_text, entries=entries, recent_texts=recent_texts, environment_text=env_text)

    def _dream_fragments(self, context: dict, entries: list[dict]) -> list[str]:
        """Concrete fragments the dream can mutate: lived agenda, interactions, memories, state."""
        fragments: list[str] = []
        for entry in entries:
            if entry.get("level") in ("confirmed", "state"):
                fragments.append(entry.get("text", ""))
        fragments.extend(str(topic) for topic in (context.get("group_topics") or [])[:3])
        fragments.extend(re.findall(r"[\u4e00-\u9fff]{2,6}", context.get("body_state", "")))
        return [fragment for fragment in dict.fromkeys(fragments) if fragment][:8]

    def _journal_target_day(self, now: datetime, sleeping: bool) -> str:
        """The day a diary written *now* should describe (never a day not yet lived)."""
        today = now.date()
        yesterday = (today - timedelta(days=1)).isoformat()
        # Before dawn (and while still asleep past midnight) the day under review is yesterday.
        if now.hour < 5 or (sleeping and now.hour < 12):
            return yesterday
        if now.hour < 12 and not self.companion.has_journal_for(yesterday, "journal"):
            return yesterday
        return today.isoformat()

    @staticmethod
    def _dream_night_key(now: datetime) -> str:
        """A night belongs to the date it started on (before noon -> previous day)."""
        return (now.date() - timedelta(days=1)).isoformat() if now.hour < 12 else now.date().isoformat()

    async def maybe_daily_entries(self, force: bool = False) -> dict:
        """Write at most one grounded diary per elapsed day and one dream per night."""
        now = datetime.now()
        today = now.date().isoformat()
        sleeping = getattr(self.circadian.state, "is_sleeping", False)
        result: dict = {}
        try:
            await asyncio.to_thread(self.companion.decay_relationships)
        except Exception:
            pass
        try:
            await asyncio.to_thread(self.companion.backup_if_due)
        except Exception:
            pass
        try:
            await self.environment.weather()
        except Exception:
            pass
        target = self._journal_target_day(now, sleeping)
        # Never write today's diary before the evening has actually run.
        if (force or target != today or now.hour >= 22) and not await asyncio.to_thread(self.companion.has_journal_for, target, "journal"):
            text = await self.generate_companion_text("journal", day=target)
            if text:
                at = now.isoformat() if target == today else f"{target}T23:58:00"
                await asyncio.to_thread(self.companion.journal, text, "journal", at)
                self._last_diary_date = target
                result["journal"] = text[:40]
                await asyncio.to_thread(self.companion.timeline_add, "日记", f"写下 {target} 的日记", text[:80])
        night = self._dream_night_key(now)
        if sleeping and self._last_dream_key != night and not await asyncio.to_thread(self.companion.has_journal_for, today, "dream"):
            text = await self.generate_companion_text("dream", day=today)
            if text:
                await asyncio.to_thread(self.companion.journal, text, "dream")
                self._last_dream_date = today
                self._last_dream_key = night
                result["dream"] = text[:40]
                await asyncio.to_thread(self.companion.timeline_add, "梦境", "记录了一个梦", text[:80])
        if result:
            self._save_state()
        return result

    async def run_daily_review(self, force: bool = False) -> dict:
        """Deterministic end-of-day review of the most recently completed day."""
        now = datetime.now()
        target = (now.date() - timedelta(days=1)).isoformat() if now.hour < 12 else now.date().isoformat()
        if not force and self._last_review_date == target:
            return {"skipped": "done", "date": target}
        try:
            agenda = await asyncio.to_thread(self.companion.agenda_for_day, target)
            journals = await asyncio.to_thread(self.companion.journal_count_for_day, target, "journal")
            dreams = await asyncio.to_thread(self.companion.journal_count_for_day, target, "dream")
            delivered = await asyncio.to_thread(self.companion.proactive_delivered_count, target)
            digests = await asyncio.to_thread(self.companion.digests_count, target)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "daily_review", str(error), "", "failed")
            return {"error": str(error)}
        completed = sum(1 for item in agenda if item.get("status") == "completed")
        findings: list[dict] = []
        if not journals:
            findings.append({"level": "warn", "title": "缺少日记", "detail": f"{target} 没有生成日记"})
        if journals > 1:
            findings.append({"level": "warn", "title": "日记偏多", "detail": f"{target} 有 {journals} 篇日记"})
        if not dreams:
            findings.append({"level": "info", "title": "缺少梦境", "detail": f"{target} 没有梦境记录"})
        unfulfilled = [item for item in agenda if item.get("status") == "active"]
        if unfulfilled:
            findings.append({"level": "info", "title": "未推进日程",
                             "detail": f"{len(unfulfilled)} 项日程未完成：" + "、".join(str(item.get("title")) for item in unfulfilled[:3])})
        summary = (f"{target} 复盘：日程 {completed}/{len(agenda)}，日记 {journals}，梦境 {dreams}，"
                   f"主动投递 {delivered}，见闻 {digests}。")
        report = await asyncio.to_thread(self.companion.save_daily_review, target, summary, findings)
        await asyncio.to_thread(self.companion.timeline_add, "复盘", summary[:120], "")
        self._last_review_date = target
        self._save_state()
        return {"date": target, "summary": summary, "findings": findings, "report": report}

    async def maybe_daily_agenda(self, force: bool = False) -> dict:
        """Let LIFE plan its own day: auto-create today's soft-activity agenda (once per day)."""
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        today = datetime.now().date().isoformat()
        if not force and self._last_agenda_date == today:
            return {"skipped": "done"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        existing = [item for item in (snapshot.get("agenda") or []) if str(item.get("start_at") or "").startswith(today)]
        if existing and not force:
            self._last_agenda_date = today
            return {"skipped": "has_agenda", "count": len(existing)}
        context = json.dumps(await self._daily_context(), ensure_ascii=False)
        prompt = (
            "你是 L.I.F.E。为今天安排 3~5 项属于你自己的生活活动（例如整理房间、看书、出门散步、打游戏、写点东西、听歌），"
            f"结合你的作息与最近关心的事；现在是 {today} {datetime.now().strftime('%H:%M')}，时间要合理且不要重复已有日程。"
            '只返回 JSON：{"agenda":[{"title":"","when":"YYYY-MM-DD HH:MM","detail":""}]}。'
            f"\n当前状态与已有日程：\n{context}"
        )
        model = self._model_for("agenda")
        self.usage.record(model, task="agenda")
        try:
            raw = "".join([chunk async for chunk in self.mocr.generate(model, [{"role": "user", "content": prompt}], "为今天安排生活活动。仅输出 JSON。", thinking=False, max_tokens=800)])
            plan = json.loads(raw)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "daily_agenda", str(error), "", "failed")
            return {"error": str(error)}
        created = 0
        for item in (plan.get("agenda") or [])[:5]:
            title = str(item.get("title") or "").strip()
            if not title:
                continue
            # add_agenda confirms immediately by default, so no confirmation step.
            candidate = await asyncio.to_thread(self.companion.add_agenda, title[:120], str(item.get("when") or ""), str(item.get("detail") or "")[:300], "persona_soft_activity")
            if candidate and candidate.get("id") and candidate.get("status") != "ignored":
                created += 1
        self._last_agenda_date = today
        await asyncio.to_thread(self.companion.audit, "daily_agenda", f"created={created}", "", "ok")
        return {"created": created}

    async def autonomous_plan(self, force: bool = False) -> dict:
        """Let LIFE decide what to do next and persist the plan as agenda/proactive candidates."""
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        now = datetime.now()
        if not force and (now - self._last_plan).total_seconds() < 5400:
            return {"skipped": "recent", "minutes_since": int((now - self._last_plan).total_seconds() // 60)}
        self._last_plan = now
        rhythm = self.circadian.to_dict() if hasattr(self.circadian, "to_dict") else {}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        agenda_items = [{"title": item.get("title"), "at": item.get("start_at")} for item in (snapshot.get("agenda") or [])][:6]
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-2:]:
            for item in self._histories[session_id][-3:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:160]}')
        try:
            upcoming = await asyncio.to_thread(self.companion.upcoming_important_dates, 7)
        except Exception:
            upcoming = []
        context = json.dumps({
            "time": now.isoformat(timespec="minutes"),
            "sleeping": rhythm.get("is_sleeping"),
            "energy": rhythm.get("mental_energy"),
            "agenda": agenda_items,
            "important_dates": [{"title": item.get("title"), "in_days": item.get("days_until")} for item in upcoming],
            "recent": recent[-6:],
            "conversations": list(self._histories.keys())[-3:],
        }, ensure_ascii=False)
        prompt = (
            "你是 L.I.F.E，一个有自主性的陪伴体。基于当前状态，独立规划你接下来最想做的事。"
            '只返回 JSON：{"agenda":[{"title":"","when":"","detail":""}],'
            '"proactive":[{"target":"","motive":"","content":""}],"note":""}。'
            "规则：agenda 最多 2 条，仅在确有值得安排的事时给出；proactive 最多 1 条，自然真诚、不打扰；"
            "proactive 的 target 用 \"session:<会话ID>\"（给某个对话发消息，推荐，会话ID 见 conversations）、"
            "\"user:<QQ号>\" 或 \"group:<群号>\"；note 可为空；没有想法就用空数组/空字符串；不要重复已有日程。"
            "note 仅用于解释本次规划，不是长期记忆，不要写调度结果或睡眠状态报告。\n"
            f"当前状态：{context}"
        )
        model = self._model_for("plan")
        self.usage.record(model, task="plan")
        try:
            raw = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], "自主规划。仅输出 JSON。", thinking=False, max_tokens=800)])
            plan = json.loads(raw)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "autonomy_plan", str(error), "", "failed")
            return {"error": str(error)}
        applied = {"agenda": 0, "proactive": 0}
        for item in (plan.get("agenda") or [])[:2]:
            title = str(item.get("title") or "").strip()
            if title:
                await asyncio.to_thread(self.companion.add_agenda, title[:120], str(item.get("when") or ""), str(item.get("detail") or "")[:500])
                applied["agenda"] += 1
        for item in (plan.get("proactive") or [])[:1]:
            content = str(item.get("content") or "").strip()
            if not content:
                continue
            target = str(item.get("target") or "").strip()
            if not target.startswith(("user:", "group:", "session:", "webui:")):
                target = f"session:{list(self._histories.keys())[-1]}" if self._histories else "session:"
            try:
                allowed, _ = await asyncio.to_thread(self.companion.can_proactively_send, target)
            except Exception:
                allowed = False
            if allowed:
                await asyncio.to_thread(self.companion.create_proactive_candidate, target, str(item.get("motive") or "autonomy"), content)
                applied["proactive"] += 1
        # NOTE: the daily diary is owned by maybe_daily_entries so a plan can never
        # write an ungrounded journal; a plan's `note` stays in the audit trail only.
        note = str(plan.get("note") or "").strip()
        if note:
            await asyncio.to_thread(self.companion.audit, "autonomy_note", note[:400], "", "ok")
        await asyncio.to_thread(self.companion.audit, "autonomy_plan", json.dumps(applied, ensure_ascii=False), "", "ok")
        return {"applied": applied, "plan": plan}

    def _interest_keywords(self) -> list[str]:
        """LIFE's own interests: skill names/keywords and world-knowledge titles."""
        words: list[str] = []
        try:
            for skill in self.companion.list_skills():
                words.append(str(skill.get("name") or ""))
                words.extend(part.strip() for part in str(skill.get("keywords") or "").split(","))
        except Exception:
            pass
        try:
            for item in self.companion.list_world_knowledge():
                words.append(str(item.get("title") or ""))
        except Exception:
            pass
        return [word for word in dict.fromkeys(words) if len(word) >= 2]

    async def outfit_tick(self, force: bool = False) -> dict:
        """Compose today's outfit from wardrobe knowledge + weather (text, no image ext needed)."""
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        wardrobe = [item for item in (snapshot.get("world") or []) if item.get("kind") == "wardrobe"]
        if not wardrobe:
            return {"skipped": "no_wardrobe"}
        today = datetime.now().date().isoformat()
        if await asyncio.to_thread(self.companion.has_journal_for, today, "outfit") and not force:
            return {"skipped": "done"}
        options = "\n".join(f"- {item.get('title')}: {str(item.get('content'))[:80]}" for item in wardrobe[:8])
        prompt = (f"根据天气（{self.environment.weather_text() or '未知'}）和下面的衣橱，写一句今天的穿搭想法（40字内）。"
                  f"只输出正文，不要解释。\n衣橱：\n{options}")
        text = await self._diary_complete(prompt, max_tokens=200)
        if text:
            await asyncio.to_thread(self.companion.journal, text, "outfit")
            await asyncio.to_thread(self.companion.timeline_add, "穿搭", text[:80])
        return {"outfit": text[:80]}

    async def generate_image(self, prompt: str) -> dict:
        """Image generation is extension-gated and fail-closed when unavailable."""
        if not self.extensions.is_available("image"):
            return {"ok": False, "reason": "image extension unavailable"}
        return {"ok": False, "reason": "image extension provider not implemented in LIFE"}

    async def content_tick(self, force: bool = False) -> dict:
        """Once per day, gather configured feeds and one self-initiated search."""
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        settings = await asyncio.to_thread(self.companion.get_settings)
        if str(settings.get("enable_content_fetch", "0")) != "1":
            return {"skipped": "disabled"}
        if not force and await asyncio.to_thread(self.companion.has_digest_today):
            return {"skipped": "done"}
        interests = self._interest_keywords()

        async def search(topic: str) -> str:
            result = await self.tools.call("search", query=topic, num_results=3)
            if not result.success:
                return ""
            data = result.data
            if isinstance(data, dict):
                data = data.get("results") or []
            if isinstance(data, list):
                parts = []
                for item in data[:3]:
                    if isinstance(item, dict):
                        parts.append(str(item.get("title") or item.get("snippet") or "")[:120])
                    elif item:
                        parts.append(str(item)[:120])
                return "；".join(part for part in parts if part)
            return str(data)[:300]

        collected = await self.content.collect(self.companion, search=search, interests=interests)
        for item in (collected.get("items") or [])[:5]:
            await asyncio.to_thread(self.companion.timeline_add, "见闻", str(item.get("title"))[:80], str(item.get("summary"))[:160])
        return {"stored": len(collected.get("items") or []), "feeds": collected.get("feeds", 0)}

    def group_should_reply(self, group_id: str, user_id: str, message: str, mentioned: bool = False) -> bool:
        """Whether LIFE speaks in a group without a mention (natural continuation)."""
        if mentioned:
            return True
        try:
            return bool(self.companion.group_should_continue(group_id, message))
        except Exception:
            return False

    def _onebot_adapter(self):
        manager = getattr(self, "onebot", None)
        adapters = getattr(manager, "adapters", None)
        if not adapters:
            return None
        return next(iter(adapters.values()))

    async def send_media(self, kind: str, target: str, payload: dict | None = None) -> dict:
        """Send optional outbound media through OneBot (fail-closed when unavailable)."""
        payload = payload or {}
        adapter = self._onebot_adapter()
        if adapter is None:
            return {"ok": False, "reason": "onebot unavailable"}
        user_id = self._target_user_id(target)
        group_id = self._target_group_id(target)
        try:
            if kind == "tts":
                await adapter.send_tts(str(payload.get("text") or ""), user_id=user_id, group_id=group_id)
            elif kind == "image":
                await adapter.send_image(str(payload.get("file") or ""), user_id=user_id, group_id=group_id)
            elif kind == "poke":
                if user_id is None:
                    return {"ok": False, "reason": "poke requires a user target"}
                await adapter.send_poke(user_id, group_id=group_id)
            elif kind == "status":
                await adapter.set_status(int(payload.get("status") or 0), int(payload.get("battery") or 100))
            else:
                return {"ok": False, "reason": f"unknown media kind: {kind}"}
        except Exception as error:
            return {"ok": False, "reason": str(error)}
        try:
            await asyncio.to_thread(self.companion.timeline_add, "媒体", f"{kind} → {target}", str(payload)[:120])
        except Exception:
            pass
        return {"ok": True, "kind": kind, "target": target}

    async def group_wake_tick(self) -> dict:
        """Interest wake: interject into a group thread matching LIFE's own interests."""
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        settings = await asyncio.to_thread(self.companion.get_settings)
        if str(settings.get("enable_group_observe", "1")) != "1":
            return {"skipped": "group_observe_off"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        interests = self._interest_keywords()
        if not interests:
            return {"skipped": "no_interests"}
        proposed = 0
        for group_id in list((snapshot.get("groups") or {}).keys())[:5]:
            if await asyncio.to_thread(self.companion.group_policy, group_id) == "blacklist":
                continue
            matches = await asyncio.to_thread(self.companion.group_interest_match, group_id, interests)
            if not matches:
                continue
            target = f"group:{group_id}"
            allowed, _ = await asyncio.to_thread(self.companion.can_proactively_send, target)
            if not allowed:
                continue
            content = await self.generate_companion_text("proactive", hint=f"群里正在聊「{matches[0]}」，自然地接一句")
            if content:
                await asyncio.to_thread(self.companion.create_proactive_candidate, target, "group_interest", content)
                await asyncio.to_thread(self.companion.note_group_bot_spoke, group_id, matches[0])
                proposed += 1
        return {"proposed": proposed}

    @staticmethod
    def _proactive_due(candidate: dict, now: datetime) -> bool:
        """Respect the candidate's preferred/expiry window instead of firing immediately."""
        for key, must_be_after in (("preferred_at", True), ("best_until", False), ("expires_at", False)):
            value = str(candidate.get(key) or "").strip()
            if not value:
                continue
            try:
                moment = datetime.fromisoformat(value.replace("Z", ""))
            except ValueError:
                continue
            if must_be_after and moment > now:
                return False
            if not must_be_after and moment < now:
                return False
        return True

    async def proactive_tick(self) -> dict:
        """Deliver due proactive candidates: to OneBot targets or into a conversation.

        Targets:
          ``user:<id>`` / ``group:<id>``  -> send through the OneBot adapter
          ``session:<id>`` / ``webui:<id>`` -> inject into that WebUI conversation
          anything else -> the conversation channel (notifications), so LIFE can
          speak into an open chat without a QQ transport.
        """
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        if getattr(self.emotion.state, "irritation", 0) >= 0.7:
            return {"skipped": "irritated"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        now = datetime.now()
        candidates = [c for c in (snapshot.get("proactive", {}).get("candidates") or [])
                      if c.get("status") == "candidate" and self._proactive_due(c, now)]
        candidates.sort(key=lambda c: str(c.get("preferred_at") or ""))
        try:
            settings = await asyncio.to_thread(self.companion.get_settings)
        except Exception:
            settings = {}
        try:
            min_interval = int(settings.get("min_interval_minutes", "5"))
        except (TypeError, ValueError):
            min_interval = 5
        tts_on = str(settings.get("proactive_tts", "0")) == "1"
        last = await asyncio.to_thread(self.companion.last_delivery_at)
        if last and (now - last).total_seconds() < max(0, min_interval) * 60:
            return {"skipped": "min_interval", "delivered": 0, "blocked": 0, "candidates": len(candidates)}
        delivered = 0
        blocked = 0
        for candidate in candidates[:5]:
            target = str(candidate.get("target") or "")
            try:
                allowed, reason = await asyncio.to_thread(self.companion.can_proactively_send, target)
            except Exception:
                allowed, reason = False, "error"
            candidate_id = str(candidate.get("id") or "")
            if not allowed:
                blocked += 1
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", reason, candidate_id, "blocked")
                continue
            content = str(candidate.get("content") or "").strip()
            if not content:
                continue
            reviewed = await self._review_outgoing(content, target)
            if not reviewed:
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", "review_declined", candidate_id, "blocked")
                blocked += 1
                continue
            user_id = self._target_user_id(target)
            group_id = self._target_group_id(target)
            if target.startswith("session:") or target.startswith("webui:"):
                session_id = target.split(":", 1)[1].strip()
                await asyncio.to_thread(self.push_notification, session_id, reviewed)
            elif user_id is not None or group_id is not None:
                if not self.tool_config.onebot_enabled or self.tool_config.onebot_sender is None:
                    blocked += 1
                    await asyncio.to_thread(self.companion.audit, "proactive_blocked", "onebot_unavailable", candidate_id, "blocked")
                    continue
                try:
                    await self.tool_config.onebot_sender(message=reviewed, user_id=user_id, group_id=group_id)
                except Exception as error:
                    await asyncio.to_thread(self.companion.audit, "proactive_send", str(error), candidate_id, "failed")
                    continue
            else:
                # No transport target: surface it in the conversation channel.
                await asyncio.to_thread(self.push_notification, "", reviewed)
            await asyncio.to_thread(self.companion.mark_proactive_delivered, candidate_id, reviewed)
            await asyncio.to_thread(self.companion.timeline_add, "主动", f"主动联系 {target}", reviewed[:80])
            # Optional voice for the same outreach (CQ TTS through OneBot).
            if tts_on and (user_id is not None or group_id is not None) and self._onebot_adapter() is not None and len(reviewed) <= 60:
                await self.send_media("tts", target, {"text": reviewed})
            delivered += 1
        return {"delivered": delivered, "blocked": blocked, "candidates": len(candidates)}

    def push_notification(self, session_id: str, text: str) -> dict:
        """Deliver a proactive message into a conversation (WebUI polls these)."""
        notification = {"id": uuid.uuid4().hex, "session_id": session_id or "", "text": text, "created_at": datetime.now().isoformat()}
        self._notifications.append(notification)
        self._notifications = self._notifications[-100:]
        self._save_state()
        return notification

    async def _review_outgoing(self, content: str, target: str) -> str:
        """Pre-send review/rewrite via the model; empty string declines sending."""
        prompt = ("以 L.I.F.E 的口吻在发送前复核这条主动消息，使其自然、真诚、不打扰、不超过 80 字。"
                  "只输出最终要发送的文本；若此刻不适合发送，输出空字符串。\n原草稿：" + content)
        try:
            text = "".join([chunk async for chunk in self.mocr.generate(
                self._model_for("output"),
                [{"role": "user", "content": prompt}],
                "主动消息发送前复核。仅输出文本。", thinking=False, max_tokens=200)])
            return text.strip().strip('"')
        except Exception:
            return content

    @staticmethod
    def _target_user_id(target: str):
        if target.startswith("user:"):
            try:
                return int(target.split(":", 1)[1])
            except (ValueError, IndexError):
                return None
        return None

    @staticmethod
    def _target_group_id(target: str):
        if target.startswith("group:"):
            try:
                return int(target.split(":", 1)[1])
            except (ValueError, IndexError):
                return None
        return None

    async def close(self):
        tasks = list(self._background_tasks)
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        await self.mocr.close()

    async def on_task_completed(self, task_id, state, result, error=""):
        state = state.removeprefix("TASK_STATE_").lower()
        async with self._dispatch_lock:
            if task_id in self._completed_tasks:
                return ""
            task = self.active_tasks.pop(task_id, None)
            if task is None:
                # Core may dispatch tasks for callers other than LIFE.
                return ""
            self._completed_tasks = (self._completed_tasks + [task_id])[-200:]
            self.emotion.state.apply_delta(self.emotion.on_task_completed(state == "done"))
            self.circadian.task_completed(60)
        label = {"done": "已完成", "failed": "失败", "cancelled": "已取消"}.get(state, state)
        try:
            await asyncio.to_thread(self.companion.timeline_add, "任务", f"任务{label}",
                                    (result[:160] if state == 'done' else (error or label)[:160]))
        except Exception:
            pass
        facts = result[:2400] if state == 'done' else (error or label)[:800]
        text = f"任务{label}。产物与使用信息：{facts}"
        try:
            prompt = self.output.build_prompt(user_message='请把任务结果简短告诉用户。',
                think_guidance=f'任务状态：{label}。只说明以下产物路径、使用方法、真实限制；不要贴工具日志或长报告，不追问无关扩展。最多三句话。事实：{facts}',
                emotion_context=json.dumps(self.emotion.state.to_dict()),persona_context=task.get('persona_context',''))
            rendered=''.join([chunk async for chunk in self.mocr.generate(self._model_for("output"),[{'role':'user','content':'任务结束，请告知产物和使用方法。'}],prompt,max_tokens=500)])
            if rendered.strip(): text=rendered.strip()
        except Exception:
            pass
        notification = {"id": uuid.uuid4().hex, "session_id": task.get("session_id", ""), "text": text, "created_at": datetime.now().isoformat()}
        async with self._dispatch_lock:
            self._notifications.append(notification)
            self._notifications = self._notifications[-100:]
            self._save_state()
        if task.get("adapter_type", "").startswith("onebot") and self.tool_config.onebot_sender:
            try:
                session = task.get("session_id", "")
                group = task.get("adapter_type") == "onebot_group"
                target = int(session.rsplit("_", 1)[-1].rsplit(":", 1)[-1]) if group else int(task["user_id"])
                await self.tool_config.onebot_sender(message=text, **({"group_id": target} if group else {"user_id": target}))
                self._notifications.remove(notification)
                self._save_state()
            except Exception as exc:
                self.companion.audit("task_notification", str(exc), task_id, "failed")
        return text

    def get_notifications(self, session_id=""):
        selected = [item for item in self._notifications if not session_id or item["session_id"] == session_id]
        return selected

    def acknowledge_notifications(self, session_id, ids):
        self._notifications=[item for item in self._notifications if not (item['session_id']==session_id and item['id'] in ids)]
        self._save_state()

    async def clear_memory(self):
        result=await asyncio.to_thread(self.memory.clear_all)
        self._histories.clear()
        self._save_state()
        return result

    async def compact_conversation(self, history, persona=None):
        entries = [f"{m.get('role', 'user')}: {str(m.get('content', ''))}" for m in history if isinstance(m, dict) and m.get('content')]
        if not entries:
            raise ValueError("没有可压缩的上下文")
        # Summarize bounded batches, carrying the prior summary forward. Never
        # silently replace durable context with the last few lines on failure.
        transcript = "\n".join(entries)
        summary = ""
        for offset in range(0, len(transcript), 18000):
            content = f"Prior summary:\n{summary}\n\nNext transcript segment:\n{transcript[offset:offset+18000]}"
            summary = "".join([chunk async for chunk in self.mocr.generate(self._model_for("compact"),
                [{"role":"user","content":content}], "Update the summary faithfully. Keep user goals, file paths, completed changes, observed results, failures, decisions and unfinished work. Do not invent success. Output concise Chinese.", thinking=True)])
            if not summary.strip() or summary.startswith('[mocr offline]'):
                raise RuntimeError("压缩模型未返回有效摘要，原上下文保持不变")
        return summary

    def get_tools_schema(self):
        return self.tools.list_tools()

    def get_state(self):
        return {"emotion": self.emotion.state.to_dict(), "circadian": self.circadian.to_dict(), "active_tasks": list(self.active_tasks),
                "online_agents": self.online_agent_count, "total_agents": len(self.online_agents)}

    def get_memory_stats(self):
        return self.memory.get_stats()

    def list_memories(self, limit=50, query=""):
        with self.memory._lock:
            items = [{**m.to_dict(), "tier": tier} for tier, records in (("short_term", self.memory.short_term.memories), ("long_term", self.memory.long_term.memories)) for m in records]
        return sorted([m for m in items if query.lower() in m["content"].lower()], key=lambda m: m["created_at"], reverse=True)[:max(1, limit)]

    def get_permissions(self):
        return {"screen_watch": getattr(self, "_screen_watch", False), "computer_use": self.tool_config.computer_use, "report_agent_host": getattr(self, "_report_agent_host", "")}

    def set_permissions(self, screen_watch=False, computer_use=False, report_agent_host=""):
        self._screen_watch = bool(screen_watch)
        self.tool_config.computer_use = bool(computer_use)
        self._report_agent_host = report_agent_host
        return self.get_permissions()

    def _model_for(self, task: str = "think") -> str:
        """Resolve a model per task; routes override the think/output defaults."""
        route = (self.model_routes or {}).get(task)
        if route:
            return str(route)
        if task in ("think", "plan", "agenda", "reflect", "journal", "dream", "compact"):
            return self.think_model or self.default_model
        return self.output_model or self.default_model

    def apply_model_routes(self, routes) -> dict:
        if isinstance(routes, str):
            try:
                routes = json.loads(routes or "{}")
            except ValueError:
                routes = {}
        self.model_routes = {str(key): str(value) for key, value in (routes or {}).items() if str(value).strip()}
        return self.model_routes

    def get_usage(self) -> dict:
        return self.usage.summary()

    def apply_tool_settings(self, values):
        for key in ("mail_mailbox_path", "mail_imap_host", "mail_imap_user", "mail_imap_password"):
            setattr(self.tool_config, key, str(values.get(key) or ""))
        self.tool_config.mail_imap_port = int(values.get("mail_imap_port") or 993)
        self.tool_config.computer_use = bool(values.get("computer_use", False))
        self.tool_config.mcp_enabled = values.get("mcp_enabled") is not False
        self.tool_config.onebot_enabled = bool(values.get("onebot_enabled", False))
        self.tool_config.minecraft_enabled = bool(values.get("minecraft_enabled", False))
        self.tool_config.minecraft_url = str(values.get("minecraft_url") or "http://127.0.0.1:8765")
        self._screen_watch = bool(values.get("screen_watch", False))
        self._report_agent_host = str(values.get("report_agent_host") or "")
        self.think_model = str(values.get("think_model") or os.getenv("LIFE_THINK_MODEL", ""))
        self.output_model = str(values.get("output_model") or os.getenv("LIFE_OUTPUT_MODEL", ""))
        if values.get("model_routes") is not None:
            self.apply_model_routes(values.get("model_routes"))
        self.companion.set_runtime_policy(int(values.get("proactive_daily_limit", 3)), int(values.get("proactive_target_limit", 1)))

    async def poll_minecraft(self):
        """Ingest new 0kay-minecraft events into durable memory.

        Chat from real players and notable connection/auth/server events become
        episodic memories tagged with the server and speaker, so L.I.F.E can
        remember what happened while playing with people.
        """
        if not self.tool_config.minecraft_enabled:
            return
        tool = self.tools.get("minecraft")
        if tool is None:
            return
        try:
            result = await tool.execute(action="events", since=self.minecraft_cursor)
        except Exception:
            return
        if not result.success or not isinstance(result.data, dict):
            return
        events = result.data.get("events") or []
        for event in events[:100]:
            if not isinstance(event, dict):
                continue
            kind = str(event.get("type") or "")
            data = event.get("data")
            if kind == "state" and isinstance(data, dict) and data.get("host"):
                self.minecraft_host = f"{data.get('host')}:{data.get('port', '')}".rstrip(":")
                continue
            if kind == "chat" and isinstance(data, dict):
                if data.get("raw"):
                    continue
                username = str(data.get("username") or "").strip()
                message = str(data.get("message") or "").strip()
                if not username or not message:
                    continue
                try:
                    await asyncio.to_thread(
                        self.memory.remember,
                        f"在 Minecraft「{self.minecraft_host or '服务器'}」里，{username} 说：{message}",
                        f"{username} 在游戏里对我说的话",
                        ["minecraft", self.minecraft_host, username, "chat"],
                        0.45,
                        "episodic",
                    )
                except Exception:
                    pass
                continue
            if kind == "log":
                text = str(data or "")
                if any(marker in text for marker in ("authenticated", "spawned", "kicked", "joined", "left", "sent /register", "sent /login")):
                    try:
                        await asyncio.to_thread(
                            self.memory.remember,
                            f"Minecraft 事件：{text}",
                            "",
                            ["minecraft", self.minecraft_host, "event"],
                            0.4,
                            "episodic",
                        )
                    except Exception:
                        pass
        cursor = result.data.get("cursor")
        if isinstance(cursor, int):
            self.minecraft_cursor = cursor
