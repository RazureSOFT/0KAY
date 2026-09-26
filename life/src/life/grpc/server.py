"""gRPC server for L.I.F.E plugin - Complete implementation."""

import asyncio
import json
import os
import sys

import grpc
from grpc import aio

# Add gen/python to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from life.v1 import life_pb2
from life.v1 import life_pb2_grpc
from plugin.v1 import plugin_pb2

from ..engine import LifeEngine
from ..core_client import get_core_client
from ..logging_setup import setup_logging


class LifeServiceServicer(life_pb2_grpc.LifeServiceServicer):
    """Implementation of LifeService gRPC service."""

    def __init__(self, mocr_address: str = None):
        self.engine = LifeEngine(mocr_address=mocr_address)
        self._sessions: dict[str, asyncio.Task] = {}
        self._sync_task: asyncio.Task | None = None
        self._onebot_task: asyncio.Task | None = None
        self._onebot_started = False
        self._onebot_manager = None

    async def start_background_tasks(self):
        """Start background loops (heartbeat + agent sync + optional OneBot)."""
        self._sync_task = asyncio.create_task(self._background_loop())

    async def _start_onebot(self):
        """Start OneBot adapter if configured (Phase 4)."""
        try:
            from ..adapters.onebot import OneBotConfig, OneBotManager

            values = await self._life_settings()
            ws_url = values.get("onebot_ws_url") or os.environ.get("ONEBOT_WS_URL", "ws://localhost:6700")
            http_url = values.get("onebot_http_url") or os.environ.get("ONEBOT_HTTP_URL", "http://localhost:6700")
            token = values.get("onebot_access_token") or os.environ.get("ONEBOT_ACCESS_TOKEN", "")
            keywords = tuple(k.strip() for k in str(values.get("onebot_trigger_keywords") or "").split(",") if k.strip())

            async def message_handler(session_id: str, user_id: str, message: str, adapter_type: str = "onebot"):
                async for event in self.engine.process_message(
                    session_id=session_id,
                    user_id=user_id,
                    message=message,
                    adapter_type=adapter_type,
                ):
                    yield event

            manager = OneBotManager(message_handler)
            self._onebot_manager = manager
            self.engine.onebot = manager
            manager.add_adapter(
                "primary",
                OneBotConfig(
                    websocket_url=ws_url,
                    http_url=http_url,
                    access_token=token,
                    trigger_keywords=keywords,
                    bot_names=tuple(n.strip() for n in str(values.get("onebot_bot_names") or "").split(",") if n.strip()),
                    observe_group=values.get("onebot_observe_group") is not False,
                    observer=lambda group_id, user_id, message: asyncio.to_thread(self.engine.companion.observe_group, group_id, user_id, message),
                    should_reply=lambda group_id, user_id, message, mentioned: asyncio.to_thread(self.engine.group_should_reply, group_id, user_id, message, mentioned),
                    recall_handler=lambda session_id, user_id, note, adapter_type: asyncio.to_thread(self.engine.companion.timeline_add, "撤回", note[:80], ""),
                ),
            )
            self.engine.tool_config.onebot_sender = manager.send_message
            print(f"[LIFE] OneBot adapter starting → {ws_url}")
            await manager.start_all()
        except Exception as e:
            print(f"[LIFE] OneBot adapter failed: {e}")
        finally:
            if self._onebot_manager:
                await self._onebot_manager.stop_all()
            self.engine.tool_config.onebot_sender = None
            self.engine.onebot = None
            self._onebot_started = False

    async def _life_settings(self) -> dict:
        import httpx
        from ..http_auth import auth_headers
        try:
            base = os.getenv("CORE_HTTP_ADDR") or os.getenv("CORE_HTTP") or "http://127.0.0.1:8080"
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.get(f"{base}/api/settings/life", headers=auth_headers())
                response.raise_for_status()
                return response.json().get("values") or {}
        except Exception:
            return {}

    async def _background_loop(self):
        """Heartbeat to Core + sync online agents every 10s."""
        core = self.engine.core

        # Initial register (retry a few times)
        for attempt in range(10):
            if await asyncio.to_thread(core.register):
                break
            await asyncio.sleep(2)

        # Initial agent sync
        count = await asyncio.to_thread(self.engine.sync_agents)
        print(f"[LIFE] Online agents: {count}")
        await self._refresh_settings()
        if self.engine.tool_config.onebot_enabled:
            self._onebot_started = True
            self._onebot_task = asyncio.create_task(self._start_onebot())

        while True:
            await asyncio.sleep(10)
            try:
                # Heartbeat
                active = len(self.engine.active_tasks)
                ok = await asyncio.to_thread(core.heartbeat, active_tasks=active)
                if not ok and core.plugin_id is None:
                    # Lost registration, try again
                    await asyncio.to_thread(core.register)

                # Sync agents
                count = await asyncio.to_thread(self.engine.sync_agents)
                await self._refresh_settings()
                await self.engine.poll_minecraft()
                await self.engine.learn_from_minecraft()
                await self.engine.task_records.flush()
                self.engine.circadian.tick(0)
                self.engine._save_state()
                # Daily maintenance is intentionally local and bounded: compact
                # memories, rebuild indexes, and retain seven JSON snapshots.
                today = __import__("datetime").date.today().isoformat()
                if getattr(self, "_maintenance_day", "") != today:
                    result = await asyncio.to_thread(self.engine.memory.maintenance)
                    self.engine.companion.audit("daily_memory_maintenance", json.dumps(result, ensure_ascii=False))
                    self._maintenance_day = today
                await asyncio.to_thread(self.engine.memory.process_reflection_queue)
                if not self._onebot_started and self.engine.tool_config.onebot_enabled:
                    self._onebot_started = True
                    self._onebot_task = asyncio.create_task(self._start_onebot())
            except Exception as e:
                print(f"[LIFE] background loop error: {e}")

    async def _refresh_settings(self):
        """Poll the Core-owned settings document; Core remains the secret store."""
        values = await self._life_settings()
        if values:
            self.engine.apply_tool_settings(values)
            if not self.engine.tool_config.onebot_enabled and self._onebot_task:
                self._onebot_task.cancel()
                await asyncio.gather(self._onebot_task, return_exceptions=True)
                self._onebot_task = None

    async def OnTaskCompleted(self, request, context):
        """Handle task completion callback from Core."""
        state_name = plugin_pb2.TaskState.Name(request.state)

        response_text = await self.engine.on_task_completed(
            task_id=request.task_id,
            state=state_name,
            result=request.result,
            error=request.error,
        )

        return life_pb2.OnTaskCompletedResponse(
            acknowledged=True,
            response_text=response_text,
        )

    async def OnUserMessage(self, request, context):
        """Handle user message with streaming response."""
        try:
            async for event in self.engine.process_message(
                session_id=request.session_id,
                user_id=request.user_id,
                message=request.message,
                adapter_type=request.adapter_type,
                persona=json.loads(request.persona_json) if request.persona_json else None,
                history=json.loads(request.history_json) if request.history_json else None,
            ):
                # grpc.aio ServicerContext versions differ: some expose
                # is_active(), others only cancelled(). Keep streaming until
                # the client explicitly cancels in either case.
                active = context.is_active() if hasattr(context, "is_active") else not context.cancelled()
                if not active:
                    break

                # raw_chunk is internal model streaming. WebUI receives only
                # the final OUTPUT chunks, otherwise each reply is duplicated.
                if event.get("type") == "raw_chunk":
                    continue

                # Build emotion state
                emotion_data = event.get("emotion_state", {})
                emotion_state = life_pb2.EmotionState(
                    valence=emotion_data.get("valence", 0.0),
                    arousal=emotion_data.get("arousal", 0.5),
                    connection=emotion_data.get("connection", 0.5),
                    irritation=emotion_data.get("irritation", 0.0),
                )

                yield life_pb2.OnUserMessageResponse(
                    chunk=event.get("chunk", ""),
                    done=event.get("done", False),
                    emotion_state=emotion_state,
                    mental_energy=event.get("mental_energy", 100.0),
                    task_started=event.get("task_id", ""),
                    think_summary=event.get("think_summary", ""),
                )

        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error processing message: {str(e)}")

    async def OnScheduledEvent(self, request, context):
        """Handle scheduled events."""
        event_type = request.event_type

        if event_type == life_pb2.SCHEDULED_EVENT_TYPE_CIRCADIAN_TICK:
            self.engine.circadian.tick(3600)
            # Active memory reinforcement on circadian cadence
            try:
                reinforced = await asyncio.to_thread(self.engine.memory.periodic_reinforce)
                if reinforced:
                    print(f"[LIFE] reinforced {reinforced} weak memories")
            except Exception as e:
                print(f"[LIFE] memory reinforce error: {e}")
        elif event_type == life_pb2.SCHEDULED_EVENT_TYPE_MEMORY_CONSOLIDATION:
            await asyncio.to_thread(self.engine.memory.consolidate)
            try:
                await asyncio.to_thread(self.engine.memory.periodic_reinforce)
            except Exception as e:
                print(f"[LIFE] memory reinforce error: {e}")
        elif event_type == life_pb2.SCHEDULED_EVENT_TYPE_IDLE_CHECK:
            if self.engine.circadian.should_auto_sleep():
                self.engine.circadian.start_sleep()
            # Autonomy cycle: deliver due proactive candidates, then plan new ones.
            async def autonomy_cycle():
                try:
                    await asyncio.to_thread(self.engine.companion.advance_agenda)
                    await self.engine.proactive_tick()
                    await self.engine.maybe_daily_agenda()
                    await self.engine.autonomous_plan()
                    await self.engine.observation_tick()
                    await self.engine.group_wake_tick()
                    await self.engine.content_tick()
                    await self.engine.outfit_tick()
                    await self.engine.maybe_daily_entries()
                    await self.engine.run_daily_review()
                except Exception as e:
                    print(f"[LIFE] autonomy cycle error: {e}")
            try:
                asyncio.create_task(autonomy_cycle())
            except Exception as e:
                print(f"[LIFE] autonomy error: {e}")

        # Save state after events
        self.engine._save_state()

        return life_pb2.OnScheduledEventResponse(acknowledged=True)

    async def GetMemories(self, request, context):
        """Return memory items + stats for the WebUI sidebar."""
        try:
            limit = request.limit if request.limit and request.limit > 0 else 50
            items = await asyncio.to_thread(self.engine.list_memories, limit, request.query or "")
            stats = await asyncio.to_thread(self.engine.get_memory_stats)

            memories = [
                life_pb2.MemoryItem(
                    id=m["id"],
                    content=m["content"],
                    importance=float(m["importance"]),
                    strength=float(m["strength"]),
                    created_at=m["created_at"],
                    tags=list(m.get("tags") or []),
                    tier=m.get("tier", ""),
                )
                for m in items
            ]

            return life_pb2.GetMemoriesResponse(
                memories=memories,
                working_count=int(stats.get("working", 0)),
                short_term_count=int(stats.get("short_term", {}).get("total", 0)),
                long_term_count=int(stats.get("long_term", 0)),
                avg_strength=float(stats.get("short_term", {}).get("avg_strength", 0.0)),
            )
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"GetMemories failed: {e}")
            raise

    async def GetState(self, request, context):
        """Return emotion/energy/permissions for the WebUI."""
        try:
            state = await asyncio.to_thread(self.engine.get_state)
            emotion = state.get("emotion", {})
            circadian = state.get("circadian", {})
            perms = await asyncio.to_thread(self.engine.get_permissions)

            return life_pb2.GetStateResponse(
                emotion=life_pb2.EmotionState(
                    valence=float(emotion.get("valence", 0.0)),
                    arousal=float(emotion.get("arousal", 0.5)),
                    connection=float(emotion.get("connection", 0.5)),
                    irritation=float(emotion.get("irritation", 0.0)),
                ),
                mental_energy=float(circadian.get("mental_energy", state.get("mental_energy", 100.0))),
                is_sleeping=bool(circadian.get("is_sleeping", False)),
                active_tasks=list(state.get("active_tasks") or []),
                screen_watch=bool(perms.get("screen_watch", False)),
                computer_use=bool(perms.get("computer_use", False)),
                report_agent_host=str(perms.get("report_agent_host", "")),
            )
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"GetState failed: {e}")
            raise

    async def SetPermissions(self, request, context):
        """Update screen_watch / computer_use / host report (default OFF)."""
        try:
            await asyncio.to_thread(
                self.engine.set_permissions,
                request.screen_watch,
                request.computer_use,
                request.report_agent_host,
            )
            return life_pb2.SetPermissionsResponse(ok=True)
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"SetPermissions failed: {e}")
            raise

    async def GetCompanion(self, request, context):
        try:
            snapshot = await asyncio.to_thread(self.engine.companion.snapshot)
            rhythm = self.engine.circadian.to_dict()
            snapshot["circadian"] = {key: rhythm[key] for key in ("sleep_hour", "wake_hour", "observed_days", "is_sleeping", "mental_energy", "hunger", "health")}
            snapshot["emotion"] = self.engine.emotion.state.to_dict()
            snapshot["policy"] = await asyncio.to_thread(self.engine.companion.get_policy)
            # Known conversations the panel can target directly (session:<id>).
            snapshot["conversations"] = list(self.engine._histories.keys())[-20:]
            return life_pb2.GetCompanionResponse(json=json.dumps(snapshot, ensure_ascii=False))
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"GetCompanion failed: {e}")
            raise

    async def ManageCompanion(self, request, context):
        try:
            payload = json.loads(request.payload_json or "{}")
            action = request.action
            if action == "add_agenda":
                result = await asyncio.to_thread(self.engine.companion.add_agenda, payload.get("title", ""), payload.get("when", ""), payload.get("detail", ""))
            elif action in ("confirm_agenda", "reject_agenda"):
                result = await asyncio.to_thread(self.engine.companion.confirm_agenda, payload.get("id", ""), action == "confirm_agenda")
            elif action == "complete_agenda":
                result = await asyncio.to_thread(self.engine.companion.complete_agenda, payload.get("id", ""))
            elif action == "journal_page":
                result = await asyncio.to_thread(self.engine.companion.journal_page, str(payload.get("date") or ""))
            elif action in ("journal", "dream"):
                result = await asyncio.to_thread(self.engine.companion.journal, payload.get("content", ""), "dream" if action == "dream" else "journal")
            elif action == "memory_maintenance":
                result = await asyncio.to_thread(self.engine.memory.maintenance)
                self.engine.companion.audit("memory_maintenance", json.dumps(result, ensure_ascii=False))
            elif action == "delete_memory":
                memory_id = payload.get("id", "")
                deleted = await asyncio.to_thread(self.engine.memory.delete_fact, memory_id, "dashboard_delete")
                result = {"deleted": deleted, "id": memory_id}
                self.engine.companion.audit("memory_delete", memory_id, memory_id, "ok" if deleted else "not_found")
            elif action == "clear_all_memory":
                result = await self.engine.clear_memory()
                self.engine.companion.audit("memory_clear_all", json.dumps(result, ensure_ascii=False), outcome="ok")
            elif action == "ack_notifications":
                self.engine.acknowledge_notifications(str(payload.get('session_id') or ''),payload.get('ids') or [])
                result={'ok':True}
            elif action == "memory_page":
                result = await asyncio.to_thread(self.engine.memory.page_facts, payload.get("tier",""), payload.get("query",""), int(payload.get("limit",50)), int(payload.get("offset",0)), payload.get("sort","recent"), payload.get("scope",""))
            elif action == "memory_detail":
                result = await asyncio.to_thread(self.engine.memory.get_fact, payload.get("id",""))
            elif action == "memory_reinforce":
                items = await asyncio.to_thread(self.engine.memory.reinforce_facts, payload.get("query",""), payload.get("ids") or None, int(payload.get("limit",5)))
                result = {"items": items, "reinforced": len(items)}
            elif action == "memory_note_create":
                result = await asyncio.to_thread(self.engine.memory.create_note, payload.get("title",""), payload.get("content",""), payload.get("tags") or [], payload.get("scope","public"))
            elif action == "memory_note_list":
                result = {"notes": await asyncio.to_thread(self.engine.memory.list_notes, payload.get("query",""), int(payload.get("limit",20)), payload.get("scope",""))}
            elif action == "memory_note_read":
                result = await asyncio.to_thread(self.engine.memory.read_note, payload.get("note_id",""), int(payload.get("offset",1)), int(payload.get("limit",200)), payload.get("scope",""))
            elif action == "memory_note_delete":
                note_id = payload.get("note_id","")
                deleted = await asyncio.to_thread(self.engine.memory.delete_note, note_id)
                result = {"deleted": deleted, "note_id": note_id}
            elif action == "memory_reflection_list":
                result = {"reflections": await asyncio.to_thread(self.engine.memory.list_reflections, payload.get("status",""), int(payload.get("limit",50)))}
            elif action == "memory_reflection_review":
                result = await asyncio.to_thread(self.engine.memory.review_reflection, payload.get("id",""), bool(payload.get("accept", True)))
                self.engine.companion.audit("memory_reflection_review", json.dumps(result, ensure_ascii=False), str(payload.get("id","")), "ok")
            elif action == "memory_importance":
                result = await asyncio.to_thread(self.engine.memory.adjust_importance, payload.get("id",""), float(payload.get("delta",0.1)))
            elif action == "memory_export":
                result = await asyncio.to_thread(self.engine.memory.export_snapshot)
            elif action == "memory_import":
                result = await asyncio.to_thread(self.engine.memory.import_snapshot, payload.get("snapshot") or {})
            elif action == "proactive_create":
                result = await asyncio.to_thread(self.engine.companion.create_proactive_candidate, payload.get("target",""), payload.get("motive",""), payload.get("content",""), payload.get("preferred_at",""))
            elif action == "proactive_cancel":
                result = await asyncio.to_thread(self.engine.companion.cancel_proactive, payload.get("id",""), payload.get("reason","dashboard_cancel"))
            elif action == "proactive_policy":
                daily = int(payload.get("daily_limit",6)); per_target = int(payload.get("per_target_limit",2))
                quiet_start = payload.get("quiet_start"); quiet_end = payload.get("quiet_end")
                await asyncio.to_thread(self.engine.companion.set_runtime_policy, daily, per_target,
                                        None if quiet_start in (None,"") else int(quiet_start),
                                        None if quiet_end in (None,"") else int(quiet_end))
                result = {"ok": True, "daily_limit": daily, "per_target_limit": per_target}
            elif action == "relationship_adjust":
                result = await asyncio.to_thread(self.engine.companion.apply_relationship_event, payload.get("user_id",""), payload.get("event_key",""), payload.get("reason","dashboard"), payload.get("channel","webui"), float(payload.get("delta",0)))
            elif action in ("journal_generate", "dream_generate"):
                kind = "journal" if action == "journal_generate" else "dream"
                text = await self.engine.generate_companion_text(kind, str(payload.get("hint","")))
                result = await asyncio.to_thread(self.engine.companion.journal, text, kind) if text else {"status":"empty"}
            elif action == "proactive_suggest":
                content = await self.engine.generate_companion_text("proactive", str(payload.get("hint","")))
                target = str(payload.get("target") or "user:owner")
                result = await asyncio.to_thread(self.engine.companion.create_proactive_candidate, target, "ai_suggestion", content) if content else {"status":"empty"}
            elif action == "autonomy_plan":
                result = await self.engine.autonomous_plan(True)
            elif action == "proactive_tick":
                result = await self.engine.proactive_tick()
            elif action == "date_add":
                result = await asyncio.to_thread(self.engine.companion.add_important_date, payload.get("title",""), payload.get("date",""), bool(payload.get("repeat_yearly", True)), payload.get("note",""))
            elif action == "date_list":
                result = {"dates": await asyncio.to_thread(self.engine.companion.list_important_dates),
                          "upcoming": await asyncio.to_thread(self.engine.companion.upcoming_important_dates, int(payload.get("days",30)))}
            elif action == "date_delete":
                deleted = await asyncio.to_thread(self.engine.companion.delete_important_date, payload.get("id",""))
                result = {"deleted": deleted, "id": payload.get("id","")}
            elif action == "circadian_eat":
                result = await asyncio.to_thread(self.engine.circadian.eat, float(payload.get("amount", 40)))
            elif action == "circadian_wake":
                result = {"woke": await asyncio.to_thread(self.engine.circadian.force_wake)}
            elif action == "journal_clear":
                result = await asyncio.to_thread(self.engine.companion.clear_journal, str(payload.get("kind","")))
            elif action == "daily_agenda":
                result = await self.engine.maybe_daily_agenda(True)
            elif action == "agenda_advance":
                result = await asyncio.to_thread(self.engine.companion.advance_agenda)
            elif action == "user_detail":
                user_id = str(payload.get("user_id") or "")
                detail = await asyncio.to_thread(self.engine.companion.user_detail, user_id, int(payload.get("limit", 100)))
                detail["memories"] = await asyncio.to_thread(self.engine.memory.page_facts, "", "", int(payload.get("memory_limit", 100)), 0, "recent", user_id)
                result = detail
            elif action == "calendar_month":
                result = await asyncio.to_thread(self.engine.companion.calendar_month, str(payload.get("month") or ""))
            elif action == "goal_add":
                result = await asyncio.to_thread(self.engine.companion.add_goal, payload.get("title",""), payload.get("detail",""), payload.get("kind","growth"))
            elif action == "goal_update":
                result = await asyncio.to_thread(self.engine.companion.update_goal, payload.get("id",""), payload.get("progress"), payload.get("status",""), payload.get("detail"))
            elif action == "goal_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_goal, payload.get("id",""))
            elif action == "goal_list":
                result = {"goals": await asyncio.to_thread(self.engine.companion.list_goals, payload.get("status",""))}
            elif action == "goal_log_add":
                result = await asyncio.to_thread(self.engine.companion.add_goal_log, payload.get("id",""), payload.get("evidence",""), payload.get("progress"))
            elif action == "goal_logs":
                result = {"logs": await asyncio.to_thread(self.engine.companion.goal_logs, payload.get("id",""), int(payload.get("limit",20)))}
            elif action == "timeline_list":
                result = {"timeline": await asyncio.to_thread(self.engine.companion.timeline_list, int(payload.get("limit",50)), payload.get("topic",""))}
            elif action == "open_topic_list":
                result = {"topics": await asyncio.to_thread(self.engine.companion.list_open_topics, payload.get("user_id",""), int(payload.get("limit",10)))}
            elif action == "open_topic_add":
                result = {"added": await asyncio.to_thread(self.engine.companion.record_open_topics, payload.get("user_id",""), [payload.get("topic","")])}
            elif action == "open_topic_resolve":
                result = {"resolved": await asyncio.to_thread(self.engine.companion.resolve_open_topics, payload.get("user_id",""), payload.get("topics") or None)}
            elif action == "portrait_get":
                result = await asyncio.to_thread(self.engine.companion.get_user_portrait, payload.get("user_id",""))
            elif action == "relationship_expression":
                result = await asyncio.to_thread(self.engine.companion.relationship_expression, payload.get("user_id",""))
            elif action == "relationship_decay":
                result = await asyncio.to_thread(self.engine.companion.decay_relationships)
            elif action == "food_add":
                result = await asyncio.to_thread(self.engine.companion.add_food, payload.get("name",""), payload.get("kind","meal"), payload.get("tags",""), payload.get("note",""))
            elif action == "food_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_food, payload.get("id",""))
            elif action == "food_list":
                result = {"food": await asyncio.to_thread(self.engine.companion.list_food)}
            elif action == "word_cloud":
                result = {"words": await asyncio.to_thread(self.engine.companion.word_cloud, int(payload.get("limit", 60)))}
            elif action == "group_list":
                result = {"groups": await asyncio.to_thread(self.engine.companion.group_list)}
            elif action == "group_upsert":
                result = await asyncio.to_thread(self.engine.companion.group_upsert, payload.get("group_id",""), payload.get("policy","observe"), payload.get("alias",""), payload.get("note",""))
            elif action == "group_delete":
                result = await asyncio.to_thread(self.engine.companion.group_delete, payload.get("group_id",""))
            elif action == "group_slang_list":
                result = {"slang": await asyncio.to_thread(self.engine.companion.group_slang_list, payload.get("group_id",""))}
            elif action == "group_slang_update":
                result = await asyncio.to_thread(self.engine.companion.group_slang_update, payload.get("group_id",""), payload.get("topic",""), float(payload.get("score",1.0)))
            elif action == "group_slang_delete":
                result = await asyncio.to_thread(self.engine.companion.group_slang_delete, payload.get("group_id",""), payload.get("topic",""))
            elif action == "group_members":
                result = {"members": await asyncio.to_thread(self.engine.companion.group_members, payload.get("group_id",""), int(payload.get("limit",50)))}
            elif action == "group_member_flag":
                result = await asyncio.to_thread(self.engine.companion.group_member_flag, payload.get("group_id",""), payload.get("user_id",""), payload.get("flag","watch"))
            elif action == "group_atmosphere":
                result = await asyncio.to_thread(self.engine.companion.group_atmosphere, payload.get("group_id",""))
            elif action == "group_wake_tick":
                result = await self.engine.group_wake_tick()
            elif action == "content_tick":
                result = await self.engine.content_tick(True)
            elif action == "outfit_tick":
                result = await self.engine.outfit_tick(True)
            elif action == "image_generate":
                result = await self.engine.generate_image(str(payload.get("prompt","")))
            elif action == "content_list":
                result = {"digests": await asyncio.to_thread(self.engine.companion.list_digests, payload.get("kind",""), int(payload.get("limit",30)))}
            elif action == "skill_add":
                result = await asyncio.to_thread(self.engine.companion.add_skill, payload.get("name",""), payload.get("category","general"), int(payload.get("level",1)), payload.get("keywords",""), payload.get("aliases",""), payload.get("note",""))
            elif action == "skill_update":
                result = await asyncio.to_thread(self.engine.companion.update_skill, payload.get("id",""), payload.get("level"), payload.get("keywords"), payload.get("aliases"), payload.get("note"), payload.get("category"))
            elif action == "skill_grow":
                result = await asyncio.to_thread(self.engine.companion.grow_skill, payload.get("name",""), int(payload.get("delta",1)))
            elif action == "skill_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_skill, payload.get("id",""))
            elif action == "skill_list":
                result = {"skills": await asyncio.to_thread(self.engine.companion.list_skills)}
            elif action == "expression_add":
                result = await asyncio.to_thread(self.engine.companion.add_expression, payload.get("text",""), payload.get("scene",""), payload.get("scope","public"), payload.get("source","manual"))
            elif action == "expression_list":
                result = {"expressions": await asyncio.to_thread(self.engine.companion.list_expressions, payload.get("status",""), int(payload.get("limit",200)))}
            elif action == "expression_review":
                result = await asyncio.to_thread(self.engine.companion.review_expression, payload.get("id",""), bool(payload.get("accept", True)))
            elif action == "expression_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_expression, payload.get("id",""))
            elif action == "social_node_upsert":
                result = await asyncio.to_thread(self.engine.companion.upsert_social_node, payload.get("user_id",""), payload.get("name",""), payload.get("tags",""), payload.get("note",""))
            elif action == "social_node_list":
                result = {"nodes": await asyncio.to_thread(self.engine.companion.list_social_nodes)}
            elif action == "social_edge_add":
                result = await asyncio.to_thread(self.engine.companion.add_social_edge, payload.get("source_id",""), payload.get("target_id",""), payload.get("relation","contact"), payload.get("note",""))
            elif action == "social_edge_list":
                result = {"edges": await asyncio.to_thread(self.engine.companion.list_social_edges)}
            elif action == "social_edge_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_social_edge, payload.get("id",""))
            elif action == "settings_get":
                result = await asyncio.to_thread(self.engine.companion.get_settings)
            elif action == "settings_set":
                result = await asyncio.to_thread(self.engine.companion.set_settings, payload.get("settings") or payload)
            elif action == "config_export":
                result = await asyncio.to_thread(self.engine.companion.export_config)
            elif action == "config_import":
                result = await asyncio.to_thread(self.engine.companion.import_config, payload.get("snapshot") or {})
            elif action == "export_all":
                result = await asyncio.to_thread(self.engine.companion.export_all)
            elif action == "import_all":
                result = await asyncio.to_thread(self.engine.companion.import_all, payload.get("snapshot") or {})
            elif action == "diagnostics":
                result = await asyncio.to_thread(self.engine.companion.diagnostics)
            elif action == "daily_review":
                result = await self.engine.run_daily_review(True)
            elif action == "daily_review_list":
                result = {"reviews": await asyncio.to_thread(self.engine.companion.list_daily_reviews, int(payload.get("limit", 14)))}
            elif action == "audit_query":
                result = await asyncio.to_thread(self.engine.companion.audit_query, payload.get("kind",""), payload.get("outcome",""),
                                                 payload.get("target",""), int(payload.get("limit",100)), int(payload.get("offset",0)))
            elif action == "audit_kinds":
                result = {"kinds": await asyncio.to_thread(self.engine.companion.audit_kinds)}
            elif action == "extension_status":
                result = {"extensions": self.engine.extension_status()}
            elif action == "mail_test":
                result = await asyncio.to_thread(self.engine.mail_test, str(payload.get("to", "")), payload.get("config") or None)
            elif action == "approval_list":
                result = {"approvals": self.engine.list_approvals()}
            elif action == "approval_resolve":
                result = {"resolved": await asyncio.to_thread(self.engine.resolve_approval, str(payload.get("id", "")), bool(payload.get("allow", False)))}
            elif action == "media_status":
                result = {"tts": self.engine.media.has_tts()}
            elif action == "send_media":
                result = await self.engine.send_media(str(payload.get("kind","")), str(payload.get("target","")), payload)
            elif action == "usage_summary":
                result = self.engine.get_usage()
            elif action == "usage_record":
                self.engine.usage.record(payload.get("model",""), int(payload.get("input",0)), int(payload.get("output",0)), payload.get("task",""))
                result = self.engine.get_usage()
            elif action == "balance_set":
                result = self.engine.usage.set_balance(payload.get("provider",""), payload.get("amount"), payload.get("currency",""))
            elif action == "model_routes_set":
                result = {"routes": self.engine.apply_model_routes(payload.get("routes") if "routes" in payload else payload)}
            elif action == "config_migrate":
                result = await asyncio.to_thread(self.engine.companion.migrate_config, payload.get("snapshot") or {})
            elif action == "backup_now":
                result = await asyncio.to_thread(self.engine.companion.backup)
            elif action == "world_list":
                result = {"world": await asyncio.to_thread(self.engine.companion.list_world_knowledge, payload.get("kind",""))}
            elif action == "world_upsert":
                result = await asyncio.to_thread(self.engine.companion.upsert_world_knowledge, payload.get("kind","worldview"), payload.get("title",""), payload.get("content",""), payload.get("tags",""), payload.get("id",""))
            elif action == "world_delete":
                result = await asyncio.to_thread(self.engine.companion.delete_world_knowledge, payload.get("id",""))
            else:
                return life_pb2.ManageCompanionResponse(ok=False, error=f"unknown action: {action}")
            return life_pb2.ManageCompanionResponse(ok=True, json=json.dumps(result, ensure_ascii=False))
        except Exception as e:
            return life_pb2.ManageCompanionResponse(ok=False, error=str(e))

    async def CompactConversation(self, request, context):
        try:
            history = json.loads(request.history_json or "[]")
            if not isinstance(history, list):
                raise ValueError("history_json must be an array")
            persona = json.loads(request.persona_json) if request.persona_json else None
            summary = await self.engine.compact_conversation(history, persona)
            return life_pb2.CompactConversationResponse(ok=True, summary=summary)
        except Exception as e:
            return life_pb2.CompactConversationResponse(ok=False, error=str(e))

    async def GetNotifications(self, request, context):
        items = self.engine.get_notifications(request.session_id or "")
        return life_pb2.GetNotificationsResponse(notifications=[life_pb2.LifeNotification(**item) for item in items])


async def serve(mocr_address: str = None):
    """Start the L.I.F.E gRPC server."""
    data_dir = os.environ.get("LIFE_DATA_DIR", "./data/life")
    log = setup_logging(data_dir)
    port = os.environ.get("LIFE_GRPC_PORT", "50053")
    log.info("starting LIFE gRPC server on :%s (data_dir=%s)", port, data_dir)

    server = aio.server()

    try:
        servicer = LifeServiceServicer(mocr_address=mocr_address)
    except Exception:
        log.exception("LIFE failed during initialization")
        raise
    life_pb2_grpc.add_LifeServiceServicer_to_server(servicer, server)

    # Set life address on core client so Core can call us back
    core = get_core_client()
    core.life_address = os.getenv("LIFE_ADDRESS", f"localhost:{port}")

    server.add_insecure_port(f"{os.getenv('LIFE_BIND_HOST', '127.0.0.1')}:{port}")
    await server.start()
    log.info("LIFE gRPC listening on %s:%s (core=%s, mocr=%s)",
             os.getenv("LIFE_BIND_HOST", "127.0.0.1"), port, core.address, mocr_address)

    # Start background tasks (register with Core, heartbeat, sync agents)
    try:
        await servicer.start_background_tasks()
    except Exception:
        log.exception("LIFE background tasks failed to start")

    try:
        await server.wait_for_termination()
    finally:
        log.info("LIFE shutting down")
        for task in (servicer._sync_task, servicer._onebot_task):
            if task:
                task.cancel()
        await asyncio.gather(*(t for t in (servicer._sync_task, servicer._onebot_task) if t), return_exceptions=True)
        await servicer.engine.close()
        core.close()
        await server.stop(grace=5)


if __name__ == "__main__":
    mocr_addr = os.environ.get("MOCR_ADDRESS", "localhost:50052")
    asyncio.run(serve(mocr_addr))
