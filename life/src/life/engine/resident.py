"""A resident, interruptible thinking process.

The old design was purely reactive: a turn ran once and exited, and the
"autonomous loop" was a one-shot task spawned by a 20-minute timer.  Between two
runs nothing thought about the character's own goals, and a new message could
not cut into a run - it merely interleaved with it on the event loop.

:class:`ResidentThinker` fixes that with a single long-lived task that owns a
small, persisted mental state (focus, goal stack, scratchpad).  It wakes on its
own cadence *or* when an external event (a user message) arrives, thinks one
bounded step, and persists what it was doing - so it resumes the same train of
thought across ticks and across restarts.  A user message raises an interrupt
flag: the step checks it between awaits, parks the half-formed thought, and the
next tick picks it back up.  A user's actual turn therefore always takes
priority, but the character does not lose what it was thinking about.

Everything here is dependency-light and driven through ``engine`` hooks, so it
can be tested with a fake model and a short interval.
"""
from __future__ import annotations

import asyncio
import json
import os
import threading
import time
from datetime import datetime
from pathlib import Path

#: Bounded autobiography of the mind: enough to resume a train of thought,
#: not an unbounded log.
SCRATCHPAD_LIMIT = 12


def _now() -> str:
    return datetime.now().isoformat()


def _load_json_object(raw: str) -> dict:
    """Forgiving JSON-object extraction (models like fences and prose)."""
    text = str(raw or "").strip()
    if text.startswith("```"):
        newline = text.find("\n")
        if newline != -1:
            text = text[newline + 1:]
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return {}
    try:
        data = json.loads(text[start:end + 1])
    except (ValueError, TypeError):
        return {}
    return data if isinstance(data, dict) else {}


class MentalState:
    """The intrinsic state that survives between runs and restarts."""

    def __init__(self):
        self.focus: str = ""
        self.pending: str = ""
        self.last_thought: str = ""
        self.scratchpad: list[str] = []
        self.active_goal: str = ""
        self.last_tick: str = ""
        self.ticks: int = 0
        self.interruptions: int = 0

    def add_thought(self, thought: str) -> None:
        thought = str(thought or "").strip()
        if not thought:
            return
        self.last_thought = thought
        self.scratchpad.append(thought)
        if len(self.scratchpad) > SCRATCHPAD_LIMIT:
            del self.scratchpad[: len(self.scratchpad) - SCRATCHPAD_LIMIT]

    def to_dict(self) -> dict:
        return {"focus": self.focus, "pending": self.pending, "last_thought": self.last_thought,
                "scratchpad": list(self.scratchpad), "active_goal": self.active_goal,
                "last_tick": self.last_tick, "ticks": self.ticks,
                "interruptions": self.interruptions}

    @classmethod
    def from_dict(cls, data: dict) -> "MentalState":
        state = cls()
        data = data or {}
        state.focus = str(data.get("focus") or "")
        state.pending = str(data.get("pending") or "")
        state.last_thought = str(data.get("last_thought") or "")
        state.scratchpad = [str(item) for item in (data.get("scratchpad") or []) if str(item).strip()]
        state.active_goal = str(data.get("active_goal") or "")
        state.last_tick = str(data.get("last_tick") or "")
        state.ticks = int(data.get("ticks", 0) or 0)
        state.interruptions = int(data.get("interruptions", 0) or 0)
        return state


class ResidentThinker:
    """One long-lived task that thinks in the background, interruptibly."""

    DEFAULT_INTERVAL = 180.0
    #: A user message pauses thinking for this long so a live conversation is
    #: never competing with inner monologue for the model.
    USER_COOLDOWN = 90.0
    #: Per-tick token ceiling: inner thoughts are short by design.
    MAX_TOKENS = 240
    #: Fallback cadence for writing engine state after a body-clock tick. See
    #: :meth:`_maybe_persist_body`.
    BODY_SAVE_INTERVAL = 300.0

    def __init__(self, engine, interval_seconds: float | None = None,
                 state_path: str | None = None, enabled: bool = True):
        self.engine = engine
        self.state_path = Path(state_path or (Path(getattr(engine, "data_dir", "./data/life")) / "inner_life.json"))
        try:
            env_interval = float(os.getenv("LIFE_RESIDENT_INTERVAL", "") or self.DEFAULT_INTERVAL)
        except (TypeError, ValueError):
            env_interval = self.DEFAULT_INTERVAL
        self.interval = float(env_interval if interval_seconds is None else interval_seconds)
        self.enabled = bool(enabled) and self.interval > 0
        self.state = MentalState()
        self._task: asyncio.Task | None = None
        self._wake = asyncio.Event()
        self._stopping = False
        self._interrupted = False
        self._last_user_at: datetime | None = None
        self._idle_streak = 0
        # Serialize thinking so an on-demand `think_now` cannot interleave with
        # the long-lived `_run` tick (both mutate `state` and persist it).
        self._think_lock = asyncio.Lock()
        self._save_lock = threading.Lock()
        # Fallback persistence for the body clock: the gRPC loop saves engine
        # state every minute, but a LIFE instance not driven through gRPC would
        # otherwise advance physiology that is never written back.
        self._last_body_save = 0.0
        self._body_ticks = 0
        self._load()

    # -- lifecycle ---------------------------------------------------------
    def start(self) -> bool:
        if not self.enabled or self._task is not None:
            return False
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return False
        self._stopping = False
        self._task = loop.create_task(self._run())
        return True

    async def stop(self) -> None:
        self._stopping = True
        self._wake.set()
        task, self._task = self._task, None
        if task is not None:
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)

    @property
    def running(self) -> bool:
        return self._task is not None and not self._task.done()

    async def think_now(self) -> bool:
        """Run one thinking step immediately (used by the 开始生命 button).

        Safe to call while the loop is running: both run on the same event loop
        and the step is cooperative, so this is just an extra, on-demand tick.
        """
        return await self._think_once()

    # -- interruption ------------------------------------------------------
    def notify_user_message(self, session_id: str = "", user_id: str = "", message: str = "") -> None:
        """An external message arrived: interrupt inner thought, defer to it."""
        self._last_user_at = datetime.now()
        self._interrupted = True
        self._idle_streak = 0
        self._wake.set()

    def notify_world_event(self) -> None:
        """Something happened in the character's own world: wake, but do not yield.

        Unlike a user message this must not pause thought (there is no reply to
        give) - it is material for the next step, so it only nudges the loop.
        """
        self._idle_streak = 0
        self._wake.set()

    def _in_user_cooldown(self) -> bool:
        if self._last_user_at is None:
            return False
        return (datetime.now() - self._last_user_at).total_seconds() < self.USER_COOLDOWN

    # -- the loop ----------------------------------------------------------
    async def _run(self) -> None:
        while not self._stopping:
            try:
                await asyncio.wait_for(self._wake.wait(), timeout=await self._effective_interval())
            except asyncio.TimeoutError:
                pass
            self._wake.clear()
            if self._stopping:
                break
            # The body keeps its own time: mood, HPA axis and allostatic load
            # advance on this loop even when no thought is produced (asleep,
            # budget exhausted, or cognition switched off).
            await self._tick_body_clock()
            if self._interrupted:
                # Consume the interrupt: the user's turn has priority this tick.
                self._interrupted = False
                self.state.interruptions += 1
                self._save()
                continue
            if self._in_user_cooldown() or not self._should_think():
                continue
            try:
                await self._think_once()
            except asyncio.CancelledError:
                raise
            except Exception as error:  # pragma: no cover - defensive
                self._log("resident tick failed: %s", error)

    async def _tick_body_clock(self) -> None:
        """Advance the slow physiology from the resident loop itself.

        ``LifeEngine._tick_affect`` was written to be driven by *both* a
        conversation turn and a background clock, but the only background
        caller was Core's gRPC loop. Any LIFE instance not driven through gRPC
        (embedded use, tests, or Core being down) therefore froze the body
        between messages - the exact opposite of "it also changes while you are
        silent". Owning that clock here makes the behaviour depend on LIFE
        itself rather than on whoever happens to be hosting it.
        """
        engine = getattr(self, "engine", None)
        tick = getattr(engine, "_tick_affect", None)
        if engine is None or tick is None or getattr(engine, "affect", None) is None:
            return
        try:
            await asyncio.to_thread(tick)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            self._log("background affect tick failed: %s", error)
            return
        self._body_ticks += 1
        self._maybe_persist_body()

    def _maybe_persist_body(self) -> None:
        """Write engine state back occasionally so the body clock is not lost.

        Deliberately slower than the gRPC loop's once-a-minute save: that loop
        is the normal owner of persistence, and this only has to cover the case
        where nothing else is saving.
        """
        now = time.monotonic()
        if self._last_body_save and (now - self._last_body_save) < self.BODY_SAVE_INTERVAL:
            return
        self._last_body_save = now
        save = getattr(self.engine, "_save_state", None)
        if save is None:
            return
        try:
            save()
        except Exception as error:
            self._log("background state save failed: %s", error)

    def _should_think(self) -> bool:
        engine = self.engine
        if not self.enabled or self._stopping:
            return False
        if getattr(engine, "cognition", None) is None or not getattr(engine, "_cognition_enabled", False):
            return False
        if getattr(getattr(engine, "circadian", None), "state", None) is not None:
            if getattr(engine.circadian.state, "is_sleeping", False):
                return False
        return self._budget_ok()

    def _budget_ok(self) -> bool:
        """Respect the user's daily token budget: thinking is not free."""
        try:
            limit = int(float(self.engine.companion.get_settings().get("daily_token_limit", "0") or 0))
            if limit <= 0:
                return True
            today = self.engine.usage.summary().get("today", {})
            return (int(today.get("input", 0)) + int(today.get("output", 0))) < limit
        except Exception:
            return True

    def _has_world_contacts(self) -> bool:
        runtime = getattr(self.engine, "_worldsim", None)
        if runtime is None:
            return False
        try:
            return bool(runtime.pending_actor_contacts())
        except Exception:
            return False

    async def _effective_interval(self) -> float:
        """Momentum, not a metronome: think sooner when something is live.

        A goal, an unfinished thread or someone in the character's own world
        waiting on it shortens the gap; a settled, empty mind lengthens it (and a
        run of empty thoughts backs off further).  This is the practical version
        of "always thinking" within a bounded token budget - it cannot be a
        literally continuous stream, so cadence tracks salience instead.
        """
        active = bool(self.state.focus or self.state.pending)
        if not active:
            try:
                goals = await asyncio.to_thread(self.engine.companion.list_goals, "active")
                active = any(g.get("status") == "active" for g in goals)
            except Exception:
                active = False
        if not active:
            active = self._has_world_contacts()
        factor = 0.5 if active else 1.5
        factor *= min(3.0, 1.0 + 0.5 * getattr(self, "_idle_streak", 0))
        # A sane floor to avoid busy-looping, but never above the configured
        # cadence (a caller that asks for a tiny interval gets it).
        floor = min(float(self.interval), 20.0)
        return max(floor, float(self.interval) * factor)

    # -- one bounded step --------------------------------------------------
    async def _think_once(self) -> bool:
        async with self._think_lock:
            thought, focus, goal_logs, goal_adds = await self._generate()
            # Interruption may have landed while the model was generating: keep
            # the half-formed thought for next time instead of applying side
            # effects.
            if self._interrupted:
                self.state.pending = thought or self.state.pending
                self._save()
                return False
            await self._apply(thought, focus, goal_logs, goal_adds)
            self.state.pending = ""
            self.state.ticks += 1
            self.state.last_tick = _now()
            # A run of thoughts that produce nothing backs the cadence off, so an
            # idle mind does not keep paying for empty output.
            self._idle_streak = 0 if thought else min(6, getattr(self, "_idle_streak", 0) + 1)
            self._save()
            return True

    async def _generate(self) -> tuple[str, str, list[dict], list[dict]]:
        engine = self.engine
        context = await self._inner_context()
        prompt = (
            "这是你的常驻内心时间。没有用户指令，你可以延续上一刻的念头，也可以想一件你自己在意的事。\n"
            "只返回 JSON：{\"thought\":\"此刻第一人称的念头，<=60字\","
            "\"focus\":\"你接下来想继续想/做的一件事，<=40字，没有就留空\","
            "\"goal_add\":[{\"title\":\"若你想给自己立一个目标\",\"detail\":\"\"}],"
            "\"goal_log\":[{\"title\":\"已有目标的标题\",\"evidence\":\"你确实推进了它的一步\",\"progress\":0.0}]}\n"
            "goals 的推进只记你真的做了的；没有内容就用空字符串/空数组。不要复述这段说明。\n"
            f"你的内在状态：{context}"
        )
        try:
            raw = "".join([chunk async for chunk in engine.mocr.generate(
                engine._model_for("think"), [{"role": "user", "content": "内心时间"}],
                "你是这个角色，正在进行一段安静的自我思考。仅输出 JSON。",
                thinking=False, max_tokens=self.MAX_TOKENS)])
        except Exception as error:
            self._log("resident generation failed: %s", error)
            return "", "", [], []
        data = _load_json_object(raw)
        thought = str(data.get("thought") or "").strip().strip('"')[:120]
        focus = str(data.get("focus") or "").strip().strip('"')[:80]
        goal_adds = [item for item in (data.get("goal_add") or []) if isinstance(item, dict)][:1]
        goal_logs = [item for item in (data.get("goal_log") or []) if isinstance(item, dict)][:2]
        return thought, focus, goal_logs, goal_adds

    async def _apply(self, thought: str, focus: str, goal_logs: list[dict], goal_adds: list[dict]) -> None:
        engine = self.engine
        if thought:
            self.state.add_thought(thought)
            try:
                await asyncio.to_thread(engine.companion.record_self_statement, thought, "resident")
            except Exception as error:  # pragma: no cover - defensive
                self._log("resident self-statement failed: %s", error)
        if focus:
            self.state.focus = focus
        if goal_adds:
            try:
                active_self_goals = [g for g in await asyncio.to_thread(engine.companion.list_goals, "active")
                                     if g.get("kind") == "self"]
            except Exception:
                active_self_goals = []
            for item in goal_adds:
                title = str(item.get("title") or "").strip()[:160]
                if title and len(active_self_goals) < 3:
                    try:
                        await asyncio.to_thread(engine.companion.add_goal, title, str(item.get("detail") or "")[:500], "self")
                        self.state.active_goal = title
                    except Exception as error:  # pragma: no cover - defensive
                        self._log("resident goal_add failed: %s", error)
        if goal_logs:
            try:
                goals = {str(g.get("title")): g.get("id")
                         for g in await asyncio.to_thread(engine.companion.list_goals, "")}
            except Exception:
                goals = {}
            for item in goal_logs:
                goal_id = goals.get(str(item.get("title") or "").strip())
                if not goal_id:
                    continue
                try:
                    await asyncio.to_thread(engine.companion.add_goal_log, goal_id,
                                            str(item.get("evidence") or "")[:300], item.get("progress"))
                except Exception as error:  # pragma: no cover - defensive
                    self._log("resident goal_log failed: %s", error)

    # -- prompt surface ----------------------------------------------------
    def context_block(self) -> str:
        """A compact line for the chat/autonomy prompt: what I am thinking about."""
        parts = []
        if self.state.focus:
            parts.append(f"你最近一直在想：{self.state.focus}")
        elif self.state.last_thought:
            parts.append(f"你上一刻的念头：{self.state.last_thought}")
        if self.state.active_goal:
            parts.append(f"你想推进的目标：{self.state.active_goal}")
        if self.state.pending and self.state.pending != self.state.last_thought:
            parts.append(f"（被打断、待续的念头：{self.state.pending}）")
        return "\n".join(parts)

    async def _inner_context(self) -> str:
        engine = self.engine
        bits = []
        if self.state.focus:
            bits.append(f"上一刻想继续的：{self.state.focus}")
        if self.state.pending:
            bits.append(f"被打断还没想完的：{self.state.pending}")
        if self.state.scratchpad:
            bits.append("最近的念头：" + "；".join(self.state.scratchpad[-3:]))
        try:
            active = [g for g in await asyncio.to_thread(engine.companion.list_goals, "active")][:4]
            if active:
                bits.append("你的目标：" + "、".join(
                    f"{g.get('title')}(进度{float(g.get('progress', 0) or 0):.2f})" for g in active))
        except Exception:
            pass
        try:
            neglect = engine.neglect_days()
            if neglect >= 0.5:
                bits.append(f"你已经 {neglect:.1f} 天没和任何人真正说过话了")
        except Exception:
            pass
        # Its own world's people - read-only, and never triggers a world build.
        try:
            runtime = getattr(engine, "_worldsim", None)
            if runtime is not None:
                world = engine._world_contacts_context(runtime)
                if world:
                    bits.append("你世界里的人：" + world.replace("\n", "；"))
        except Exception:
            pass
        bits.append(f"当前情绪：{engine._emotion_phrase()}")
        return "；".join(bits)

    # -- persistence -------------------------------------------------------
    def _load(self) -> None:
        try:
            data = json.loads(self.state_path.read_text(encoding="utf-8"))
        except (FileNotFoundError, ValueError, OSError):
            return
        if not isinstance(data, dict):
            # A hand-edited/truncated file can be valid JSON without being an
            # object; from_dict expects a mapping.
            return
        self.state = MentalState.from_dict(data)

    def _save(self) -> None:
        # A per-process temp name avoids two writers racing on the same `.tmp`
        # (which caused spurious Windows os.replace PermissionError), and the
        # lock serializes the write+replace pair.
        with self._save_lock:
            try:
                self.state_path.parent.mkdir(parents=True, exist_ok=True)
                temporary = self.state_path.with_name(f"{self.state_path.name}.{os.getpid()}.tmp")
                temporary.write_text(json.dumps(self.state.to_dict(), ensure_ascii=False), encoding="utf-8")
                os.replace(temporary, self.state_path)
            except OSError as error:  # pragma: no cover - best effort
                self._log("resident state save failed: %s", error)

    def reset(self) -> None:
        """Wipe the mind (used by the whole-person reset)."""
        self.state = MentalState()
        try:
            self.state_path.unlink(missing_ok=True)
        except OSError:
            pass

    @staticmethod
    def _log(message: str, *args) -> None:
        try:
            from ..logging_setup import get_logger
            get_logger("life.engine.resident").debug(message, *args)
        except Exception:
            pass
