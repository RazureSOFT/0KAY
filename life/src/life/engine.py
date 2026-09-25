"""Session-aware LIFE orchestration: plan, execute, express, and deliver."""
import asyncio
import json
import os
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from .emotion.emotion import EmotionEngine, EmotionState
from .circadian.circadian import CircadianSystem
from .memory.memory import MemorySystem
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
        self.think = ThinkStage()
        self.output = OutputStage()
        self.mocr = MocrClient(mocr_address)
        self.task_records = TaskRecorder(self.data_dir)
        self.mocr.recorder = self.task_records
        self.think_model = os.getenv("LIFE_THINK_MODEL", "")
        self.output_model = os.getenv("LIFE_OUTPUT_MODEL", "")
        self.default_model = os.getenv("LIFE_DEFAULT_MODEL", "gpt-4o-mini")
        self.core = get_core_client()
        self.online_agents = []
        self.online_agent_count = 0
        self.tool_config = RuntimeToolConfig()
        self.tools = create_default_registry(core_client=self.core, config=self.tool_config, memory=self.memory, companion=self.companion)
        self.tools.recorder = self.task_records
        self.skills = get_skill_registry()
        self.active_tasks = {}
        self._notifications = []
        self._completed_tasks = []
        self._histories = {}
        self._session_locks = {}
        self._dispatch_lock = asyncio.Lock()
        self._background_tasks = set()
        self._reflection_limit = asyncio.Semaphore(2)
        self._last_plan = datetime.min
        self._state_path = Path(self.data_dir) / "state.json"
        self._load_state()

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

    def _save_state(self):
        self._state_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self._state_path.with_suffix(".tmp")
        temporary.write_text(json.dumps({"emotion": self.emotion.state.to_dict(), "circadian": self.circadian.to_dict(),
            "active_tasks": self.active_tasks, "notifications": self._notifications, "completed_tasks": self._completed_tasks,
            "histories": self._histories}, ensure_ascii=False), encoding="utf-8")
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
        scope = f"session:{turn.session_id}"
        memory_context = await asyncio.to_thread(self.memory.get_memory_context, message, scope, self.soul.recall_limit())
        await asyncio.to_thread(self.sync_agents)
        summaries = []
        guidance = "Respond naturally."
        # Each planning turn sees the preceding tool result before choosing another.
        for step in range(4):
            system = self.think.build_prompt(user_message=message, emotion_context=json.dumps(self.emotion.state.to_dict()),
                energy_context=f"{self.circadian.state.mental_energy:.1f}%; {self.circadian.get_prompt_context()}; sleep {self.circadian.sleep_hour:02}:00–{self.circadian.wake_hour:02}:00", memory_context=memory_context,
                active_tasks=[tid for tid, task in self.active_tasks.items() if task.get("session_id") == turn.session_id],
                online_agents=self.online_agent_count, skills_context=self.skills.context_block(message),
                tools_context=json.dumps(self.get_tools_schema(), ensure_ascii=False), time_context=datetime.now().strftime("%Y-%m-%d %H:%M"))
            system += "\nPersona:\n" + turn.persona_context + "\nCompleted tool results (do not repeat these actions):\n" + "\n".join(summaries)
            try:
                raw = "".join([chunk async for chunk in self.mocr.generate(self.think_model or self.default_model, turn.history, system, thinking=True)])
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
        relationship_style = await self._relationship_style(getattr(turn, "user_id", ""))
        if relationship_style:
            guidance = relationship_style + "\n" + guidance
        system = self.output.build_prompt(user_message=message, think_guidance=guidance,
            emotion_context=json.dumps(self.emotion.state.to_dict()), persona_context=turn.persona_context)
        response = ""
        try:
            async for chunk in self.mocr.generate(self.output_model or self.default_model, turn.history, system,
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
        """Tone guidance derived from the long-term relationship stage (expression decision)."""
        if not user_id:
            return ""
        try:
            relationship = await asyncio.to_thread(self.companion.relationship, user_id)
        except Exception:
            return ""
        stage = str(relationship.get("stage") or "") if isinstance(relationship, dict) else ""
        styles = {
            "亲近": "与对方关系亲近：语气亲密放松，可用昵称和玩笑，主动关心对方。",
            "温暖": "与对方关系温暖：语气温和体贴，适度关心。",
            "熟悉": "与对方关系熟悉：语气自然友好。",
            "疏离": "与对方关系疏离：语气克制礼貌，保持距离，不主动示好。",
            "受伤": "与对方关系紧张：语气简短克制，避免热情与玩笑。",
        }
        return styles.get(stage, "")

    async def _reflect(self, turn, message, response):
        async with self._reflection_limit:
            try:
                prompt = ('Review this conversation. Return JSON: '
                          '{"action":"none|journal|dream|proactive_candidate|persona_evolution",'
                          '"content":"","trait":"","value":"","motive":"",'
                          '"memories":["lasting first-person facts/preferences/commitments about the user, each <= 80 chars"]}. '
                          'Only extract durable, useful facts; never store small talk, questions, or the assistant reply; '
                          'use an empty list when nothing lasting was said.\n'
                          f'user: {message[:1200]}\nassistant: {response[:1200]}')
                raw = "".join([chunk async for chunk in self.mocr.generate(self.think_model or self.default_model,
                    [{"role": "user", "content": prompt}], "Private companion planner. JSON only.", thinking=True, max_tokens=600)])
                decision = json.loads(raw)
                for item in (decision.get("memories") or [])[:self.soul.impression_limit()]:
                    text = str(item).strip()
                    if 4 <= len(text) <= 160:
                        await asyncio.to_thread(self.memory.remember, text, "", ["extracted"], 0.6, "fact", "public")
                action = decision.get("action")
                content = str(decision.get("content") or "")
                if action in ("journal", "dream") and content:
                    await asyncio.to_thread(self.companion.journal, content, action)
                elif action == "proactive_candidate" and content:
                    target = f"user:{turn.user_id}"
                    if turn.adapter_type == "onebot_group":
                        target = f"group:{turn.session_id.rsplit('_', 1)[-1]}"
                    await asyncio.to_thread(self.companion.create_proactive_candidate, target, str(decision.get("motive") or "conversation_followup"), content)
                elif action == "persona_evolution" and decision.get("trait") and decision.get("value"):
                    await asyncio.to_thread(self.companion.propose_persona_evolution, decision["trait"], decision["value"], message[:500])
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "companion_reflection", str(error), turn.session_id, "failed")

    async def generate_companion_text(self, kind: str, hint: str = "") -> str:
        """Ask the model to write a short companion entry (journal / dream / proactive note)."""
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-3:]:
            for item in self._histories[session_id][-4:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:200]}')
        context = "\n".join(recent)[-1500:]
        instructions = {
            "journal": "以第一人称写一段今天的日记，简短、真诚，不超过 120 字，结合最近的对话与心情。只输出正文。",
            "dream": "以第一人称写一个简短的梦或睡眠反思，不超过 120 字，带一点意象与情绪。只输出正文。",
            "proactive": "写一条想主动对用户说的话，不超过 80 字，自然、不说教，只输出这句话本身。",
        }
        instruction = instructions.get(kind, instructions["journal"])
        prompt = f"{instruction}\n附加提示：{hint[:400]}\n最近对话：\n{context}" if hint else f"{instruction}\n最近对话：\n{context}"
        model = self.think_model or self.default_model
        text = "".join([chunk async for chunk in self.mocr.generate(
            model, [{"role": "user", "content": prompt}], "你是 L.I.F.E 的内心独白作者。", thinking=False, max_tokens=512)])
        return text.strip()

    async def autonomous_plan(self, force: bool = False) -> dict:
        """Let LIFE decide what to do next and persist the plan as agenda/proactive candidates."""
        now = datetime.now()
        if not force and (now - self._last_plan).total_seconds() < 5400:
            return {"skipped": "recent", "minutes_since": int((now - self._last_plan).total_seconds() // 60)}
        self._last_plan = now
        rhythm = self.circadian.to_dict() if hasattr(self.circadian, "to_dict") else {}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        agenda_titles = [item.get("title") for item in (snapshot.get("agenda") or [])][:6]
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-2:]:
            for item in self._histories[session_id][-3:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:160]}')
        context = json.dumps({
            "time": now.isoformat(timespec="minutes"),
            "sleeping": rhythm.get("is_sleeping"),
            "energy": rhythm.get("mental_energy"),
            "agenda": agenda_titles,
            "recent": recent[-6:],
        }, ensure_ascii=False)
        prompt = (
            "你是 L.I.F.E，一个有自主性的陪伴体。基于当前状态，独立规划你接下来最想做的事。"
            '只返回 JSON：{"agenda":[{"title":"","when":"","detail":""}],'
            '"proactive":[{"target":"","motive":"","content":""}],"journal":"","note":""}。'
            "规则：agenda 最多 2 条，仅在确有值得安排的事时给出；proactive 最多 1 条，自然真诚、不打扰；"
            "journal/note 可为空；没有想法就用空数组/空字符串；不要重复已有日程。\n"
            f"当前状态：{context}"
        )
        model = self.think_model or self.default_model
        try:
            raw = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], "自主规划。仅输出 JSON。", thinking=True, max_tokens=800)])
            plan = json.loads(raw)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "autonomy_plan", str(error), "", "failed")
            return {"error": str(error)}
        applied = {"agenda": 0, "proactive": 0, "journal": 0}
        for item in (plan.get("agenda") or [])[:2]:
            title = str(item.get("title") or "").strip()
            if title:
                await asyncio.to_thread(self.companion.add_agenda, title[:120], str(item.get("when") or ""), str(item.get("detail") or "")[:500])
                applied["agenda"] += 1
        for item in (plan.get("proactive") or [])[:1]:
            content = str(item.get("content") or "").strip()
            if not content:
                continue
            target = str(item.get("target") or "user:owner")
            try:
                allowed, _ = await asyncio.to_thread(self.companion.can_proactively_send, target)
            except Exception:
                allowed = False
            if allowed:
                await asyncio.to_thread(self.companion.create_proactive_candidate, target, str(item.get("motive") or "autonomy"), content)
                applied["proactive"] += 1
        journal_text = str(plan.get("journal") or "").strip()
        if journal_text:
            await asyncio.to_thread(self.companion.journal, journal_text, "journal")
            applied["journal"] += 1
        note = str(plan.get("note") or "").strip()
        if note:
            await asyncio.to_thread(self.memory.remember, note[:400], "", ["autonomy"], 0.6, "note", "public")
        await asyncio.to_thread(self.companion.audit, "autonomy_plan", json.dumps(applied, ensure_ascii=False), "", "ok")
        return {"applied": applied, "plan": plan}

    async def proactive_tick(self) -> dict:
        """Deliver due proactive candidates within quotas, quiet hours and state gates."""
        if not self.tool_config.onebot_enabled or self.tool_config.onebot_sender is None:
            return {"skipped": "onebot_unavailable"}
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        if getattr(self.emotion.state, "irritation", 0) >= 0.7:
            return {"skipped": "irritated"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        candidates = [c for c in (snapshot.get("proactive", {}).get("candidates") or []) if c.get("status") == "candidate"]
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
            user_id = self._target_user_id(target)
            group_id = self._target_group_id(target)
            if user_id is None and group_id is None:
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", "unknown_target", candidate_id, "blocked")
                continue
            content = str(candidate.get("content") or "").strip()
            if not content:
                continue
            reviewed = await self._review_outgoing(content, target)
            if not reviewed:
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", "review_declined", candidate_id, "blocked")
                blocked += 1
                continue
            try:
                await self.tool_config.onebot_sender(message=reviewed, user_id=user_id, group_id=group_id)
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "proactive_send", str(error), candidate_id, "failed")
                continue
            await asyncio.to_thread(self.companion.mark_proactive_delivered, candidate_id, reviewed)
            delivered += 1
        return {"delivered": delivered, "blocked": blocked, "candidates": len(candidates)}

    async def _review_outgoing(self, content: str, target: str) -> str:
        """Pre-send review/rewrite via the model; empty string declines sending."""
        prompt = ("以 L.I.F.E 的口吻在发送前复核这条主动消息，使其自然、真诚、不打扰、不超过 80 字。"
                  "只输出最终要发送的文本；若此刻不适合发送，输出空字符串。\n原草稿：" + content)
        try:
            text = "".join([chunk async for chunk in self.mocr.generate(
                self.output_model or self.default_model,
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
        facts = result[:2400] if state == 'done' else (error or label)[:800]
        text = f"任务{label}。产物与使用信息：{facts}"
        try:
            prompt = self.output.build_prompt(user_message='请把任务结果简短告诉用户。',
                think_guidance=f'任务状态：{label}。只说明以下产物路径、使用方法、真实限制；不要贴工具日志或长报告，不追问无关扩展。最多三句话。事实：{facts}',
                emotion_context=json.dumps(self.emotion.state.to_dict()),persona_context=task.get('persona_context',''))
            rendered=''.join([chunk async for chunk in self.mocr.generate(self.output_model or self.default_model,[{'role':'user','content':'任务结束，请告知产物和使用方法。'}],prompt,max_tokens=500)])
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
            summary = "".join([chunk async for chunk in self.mocr.generate(self.think_model or self.default_model,
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

    def apply_tool_settings(self, values):
        for key in ("mail_mailbox_path", "mail_imap_host", "mail_imap_user", "mail_imap_password"):
            setattr(self.tool_config, key, str(values.get(key) or ""))
        self.tool_config.mail_imap_port = int(values.get("mail_imap_port") or 993)
        self.tool_config.computer_use = bool(values.get("computer_use", False))
        self.tool_config.mcp_enabled = values.get("mcp_enabled") is not False
        self.tool_config.onebot_enabled = bool(values.get("onebot_enabled", False))
        self._screen_watch = bool(values.get("screen_watch", False))
        self._report_agent_host = str(values.get("report_agent_host") or "")
        self.think_model = str(values.get("think_model") or os.getenv("LIFE_THINK_MODEL", ""))
        self.output_model = str(values.get("output_model") or os.getenv("LIFE_OUTPUT_MODEL", ""))
        self.companion.set_runtime_policy(int(values.get("proactive_daily_limit", 3)), int(values.get("proactive_target_limit", 1)))
