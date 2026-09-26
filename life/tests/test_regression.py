import asyncio
import json
import os
from datetime import date
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import MemorySystem
from life.engine import LifeEngine
from life.think.think import ThinkStage
from life.tools.tools import UseAgentTool
from life.companion import CompanionSystem
from life.model_client import MocrClient


class MemoryTests(unittest.TestCase):
    def test_agenda_snapshot_hides_past_days(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            with companion.db() as db:
                for event_id, start in [("past", "2020-01-01 08:00"), ("today", f"{date.today().isoformat()} 09:00"), ("future", "2999-01-01 09:00"), ("none", "")]:
                    db.execute("INSERT INTO calendar_events VALUES(?,?,?,?,?,?,?,?,?,?)", (event_id, "", f"{event_id} t", start, "", "persona_soft_activity", "active", 1, "x", "x"))
            ids = [row["id"] for row in companion.snapshot()["agenda"]]
            self.assertNotIn("past", ids)
            self.assertIn("today", ids)
            self.assertIn("future", ids)
            self.assertIn("none", ids)

    def test_calendar_month_conflicts_goals_and_food(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            with companion.db() as db:
                for event_id, start in [("a", "2026-03-05 09:00"), ("b", "2026-03-05 09:00"), ("c", "2026-04-01 09:00")]:
                    db.execute("INSERT INTO calendar_events VALUES(?,?,?,?,?,?,?,?,?,?)", (event_id, "", event_id, start, "", "persona_soft_activity", "active", 1, "x", "x"))
            page = companion.calendar_month("2026-03")
            self.assertEqual([e["id"] for e in page["events"]], ["a", "b"])
            self.assertEqual(len(page["conflicts"]), 1)
            self.assertEqual(page["conflicts"][0]["titles"], ["a", "b"])
            goal = companion.add_goal("learn piano")
            self.assertEqual(companion.list_goals()[0]["title"], "learn piano")
            self.assertTrue(companion.update_goal(goal["id"], progress=0.5)["updated"])
            self.assertTrue(companion.delete_goal(goal["id"])["deleted"])
            companion.add_food("ramen", tags="hot")
            self.assertEqual(companion.list_food()[0]["name"], "ramen")
            with self.assertRaises(ValueError): companion.calendar_month("nope")

    def test_user_detail_aggregates_record_and_scoped_memory(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            memory = MemorySystem(directory)
            memory.store("likes jazz", metadata={"scope": "session:u1"})
            memory.store("someone else", metadata={"scope": "session:u2"})
            companion.apply_relationship_event("u1", "k1", "chat", "private", 0.05)
            companion.create_proactive_candidate("user:u1", "care", "hello")
            detail = companion.user_detail("u1")
            self.assertEqual(detail["relationship"]["user_id"], "u1")
            self.assertEqual(detail["counts"]["ledger"], 1)
            self.assertEqual(detail["counts"]["candidates"], 1)
            page = memory.page_facts(scope="u1")
            self.assertEqual(page["total"], 1)
            self.assertEqual(page["items"][0]["content"], "likes jazz")
            with self.assertRaises(ValueError): companion.user_detail("")

    def test_diary_date_lookup_includes_old_entries_and_orders_paragraphs(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            with companion.db() as db:
                db.executemany("INSERT INTO journal_entries VALUES(?,?,?,?)", [
                    ("old-evening", "journal", "晚上的感受", "2020-01-01T20:00:00"),
                    ("old-morning", "journal", "早上的经历", "2020-01-01T08:00:00"),
                    ("dream", "dream", "梦境不混入日记", "2020-01-01T09:00:00"),
                    *[(f"new-{i}", "journal", "新记录", "2026-09-26T10:00:00") for i in range(60)],
                ])
            page = companion.journal_page("2020-01-01")
            self.assertEqual(page["content"], "早上的经历\n\n晚上的感受")
            self.assertIsNone(page["previous"])
            self.assertEqual(page["next"], "2026-09-26")
            empty = companion.journal_page("2024-01-01")
            self.assertEqual(empty["content"], "")
            self.assertEqual(empty["previous"], "2020-01-01")
            with self.assertRaises(ValueError): companion.journal_page("invalid")

    def test_private_notes_are_scoped(self):
        with tempfile.TemporaryDirectory() as directory:
            memory=MemorySystem(directory)
            note=memory.create_note('private','privatealpha',scope='session:a')
            self.assertEqual(memory.list_notes('privatealpha',scope='session:b'),[])
            self.assertEqual(memory.active_recall('privatealpha',scope='session:b'),[])
            with self.assertRaises(PermissionError): memory.read_note(note['note_id'],scope='session:b')
            self.assertIn('privatealpha',memory.read_note(note['note_id'],scope='session:a')['content'])
            memory.daily_backup();memory.clear_all()
            self.assertEqual(list(memory.backup_dir.glob('*.json')),[])

    def test_cold_start_restart_scope_and_retraction(self):
        with tempfile.TemporaryDirectory() as directory:
            memory = MemorySystem(directory)
            a = memory.store("unique alpha", metadata={"scope": "session:a"})
            memory.store("unique beta", metadata={"scope": "session:b"})
            self.assertEqual([m.id for m in memory.recall("unique", scope="session:a")], [a.id])
            self.assertEqual(memory.recall("unrelatedkeyword"), [])
            count = a.recall_count
            restarted = MemorySystem(directory)
            self.assertEqual(next(m for m in restarted.short_term.memories if m.id == a.id).recall_count, count)
            self.assertTrue(restarted.delete_fact(a.id))
            self.assertNotIn(a.id, [m.id for m in MemorySystem(directory).short_term.memories])
            restarted.clear_all()
            self.assertEqual(MemorySystem(directory).get_stats()["short_term"]["total"], 0)

    def test_invalid_plan_never_invents_a_task(self):
        for raw in ("write a python csv parser", "[]", '{"emotion_delta":null}'):
            with self.assertRaises(ValueError):
                ThinkStage().parse_response(raw)


class EngineTests(unittest.IsolatedAsyncioTestCase):
    async def test_autonomy_status_is_not_stored_as_memory(self):
        class Model:
            async def generate(self, *args, **kwargs):
                yield json.dumps({"note": "已进入睡眠状态，现有日程已覆盖睡前活动，不再新增安排。"})
        self.engine.mocr = Model()
        with patch.object(self.engine.memory, "remember") as remember:
            await self.engine.autonomous_plan(True)
            remember.assert_not_called()
        self.assertTrue(any(row["kind"] == "autonomy_note" for row in self.engine.companion.snapshot()["audit"]))

    async def test_think_schedule_tool_creates_companion_candidate(self):
        plan = self.engine.think.parse_response(json.dumps({"tool_calls": [{"name": "agenda_add", "arguments": {"title": "散步", "when": "2026-09-27 18:00"}}]}))
        call = plan.tool_calls[0]
        result = await self.engine.tools.call(call["name"], **call["arguments"])
        self.assertTrue(result.success)
        candidates = self.engine.companion.snapshot()["calendar_candidates"]
        self.assertEqual(candidates[0]["title"], "散步")
        self.assertEqual(candidates[0]["status"], "pending_confirmation")

    async def asyncSetUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        async def flush():
            pass
        self.engine.task_records.flush = flush
        self.engine.sync_agents = lambda: 0
        async def reflect(*args):
            pass
        self.engine._reflect = reflect

    async def asyncTearDown(self):
        for task in list(self.engine._background_tasks):
            await task
        self.directory.cleanup()

    async def test_sessions_streaming_and_history(self):
        requests = []
        class Model:
            async def generate(self, model_id, messages, system_prompt="", thinking=False, **kwargs):
                requests.append((thinking, list(messages), system_prompt))
                await asyncio.sleep(0)
                if thinking:
                    yield json.dumps({"output_guidance": "reply", "memory_query": "unique", "tool_calls": []})
                else:
                    yield "first"
                    await asyncio.sleep(0)
                    yield "second"
        self.engine.mocr = Model()
        async def collect(session, name, text):
            return [e async for e in self.engine.process_message(session, session, text, persona={"name": name})]
        a, b = await asyncio.gather(collect("a", "Alice", "one"), collect("b", "Bob", "two"))
        self.assertEqual([e["chunk"] for e in a if e["type"] == "chunk"], ["first", "second", ""])
        self.assertTrue(a[-1]["done"])
        for thinking, messages, system in requests:
            self.assertIn("Alice" if messages[-1]["content"] == "one" else "Bob", system)
            self.assertNotIn("Bob" if messages[-1]["content"] == "one" else "Alice", system)
        await collect("a", "Alice", "followup")
        history = requests[-1][1]
        self.assertEqual([m["content"] for m in history], ["one", "firstsecond", "followup"])

    async def test_completion_is_session_addressed_idempotent_and_keeps_error(self):
        class Offline:
            async def generate(self, *args, **kwargs):
                raise RuntimeError("offline")
                yield ""
        self.engine.mocr = Offline()
        self.engine.active_tasks["t"] = {"session_id": "a", "user_id": "u", "adapter_type": "webui"}
        text = await self.engine.on_task_completed("t", "TASK_STATE_DONE", "actual result")
        self.assertIn("已完成", text)
        self.assertEqual(self.engine.get_notifications("b"), [])
        self.assertEqual(len(self.engine.get_notifications("a")), 1)
        self.assertEqual(len(self.engine.get_notifications("a")), 1)
        self.engine.acknowledge_notifications('a',[item['id'] for item in self.engine.get_notifications('a')])
        self.assertEqual(self.engine.get_notifications('a'),[])
        self.assertEqual(await self.engine.on_task_completed("t", "TASK_STATE_DONE", "again"), "")
        self.engine.active_tasks["f"] = {"session_id": "a"}
        self.assertIn("actual error", await self.engine.on_task_completed("f", "TASK_STATE_FAILED", "", "actual error"))
        restarted = LifeEngine(self.directory.name)
        self.assertEqual(len(restarted.get_notifications("a")), 1)

    async def test_offline_dispatch_is_not_success(self):
        result = await UseAgentTool().execute(agent_prompt="write a CSV parser")
        self.assertFalse(result.success)

    async def test_compaction_failure_does_not_fake_a_summary(self):
        class Model:
            async def generate(self, *args, **kwargs):
                raise RuntimeError('model unavailable')
                yield ''
        self.engine.mocr=Model()
        with self.assertRaisesRegex(RuntimeError,'unavailable'):
            await self.engine.compact_conversation([{'role':'user','content':'important early facts'}])

    async def test_compaction_carries_early_facts_through_batches(self):
        prompts=[]
        class Model:
            async def generate(self, model, messages, *args, **kwargs):
                prompts.append(messages[0]['content'])
                yield 'retained early facts'
        self.engine.mocr=Model()
        summary=await self.engine.compact_conversation([{'role':'user','content':'early fact '+('x'*20000)}, {'role':'assistant','content':'latest fact'}])
        self.assertGreater(len(prompts),1)
        self.assertIn('early fact',prompts[0])
        self.assertIn('retained early facts',prompts[-1])
        self.assertIn('latest fact',prompts[-1])
        self.assertEqual(summary,'retained early facts')

    async def test_tool_results_replan_and_secondary_recall_reaches_output(self):
        self.engine.memory.store("secretmarker useful fact", metadata={"scope": "session:a"})
        systems = []
        class Model:
            turns = 0
            async def generate(self, model_id, messages, system_prompt="", thinking=False, **kwargs):
                systems.append(system_prompt)
                if thinking:
                    self.turns += 1
                    if self.turns == 1:
                        yield json.dumps({"memory_query": "secretmarker", "tool_calls": [{"name": "recall", "arguments": {"query": "secretmarker"}}]})
                    else:
                        yield json.dumps({"output_guidance": "use retrieved facts"})
                else:
                    yield "answer"
        self.engine.mocr = Model()
        events = [e async for e in self.engine.process_message("a", "u", "question")]
        self.assertIn("secretmarker useful fact", systems[-1])
        self.assertIn('"tool": "recall"', systems[1])
        self.assertTrue(events[-1]["done"])

    async def test_task_prompt_and_callback_origin_are_preserved(self):
        captured = {}
        class Core:
            def use_agent(self, **kwargs):
                captured.update(kwargs)
                return {"accepted": True, "task_id": kwargs["task_id"]}
        self.engine.tools.get("useagent").core_client = Core()
        class Model:
            async def generate(self, model_id, messages, system_prompt="", thinking=False, **kwargs):
                if thinking:
                    yield json.dumps({"tool_calls": [{"name": "useagent", "arguments": {"agent_prompt": "write a CSV parser"}}]})
                else:
                    yield "dispatched"
        self.engine.mocr = Model()
        events = [e async for e in self.engine.process_message("session-one", "user-one", "write a CSV parser")]
        self.assertIn("write a CSV parser", captured["prompt"])
        self.assertNotIn("github", captured["prompt"])
        task_id = next(e["task_id"] for e in events if e["type"] == "task_started")
        self.assertEqual(self.engine.active_tasks[task_id]["session_id"], "session-one")
        class FailingModel:
            async def generate(self, *args, **kwargs):
                raise RuntimeError("mocr down")
                yield ""
        self.engine.mocr = FailingModel()
        await self.engine.on_task_completed(task_id, "TASK_STATE_FAILED", "", "compiler error")
        self.assertIn("compiler error", self.engine.get_notifications("session-one")[0]["text"])
        records = self.engine.task_records.pending
        self.assertTrue(any(record['kind']=='conversation' and record['state']=='done' for record in records))
        self.assertTrue(any(record['kind']=='tool' and record['parent_id'] for record in records))

    async def test_model_credentials_are_resolved_each_request(self):
        key = ["initial"]
        requests = []
        class Response:
            def raise_for_status(self): pass
            def json(self):
                return {"default_provider_id": "a", "providers": [
                    {"id": "a", "models": ["a"], "api_key": "wrong"},
                    {"id": "b", "models": ["b"], "api_key": key[0], "base_url": "http://b", "provider": "b"}]}
        class HTTP:
            def __init__(self, **kwargs): pass
            async def __aenter__(self): return self
            async def __aexit__(self, *args): pass
            async def get(self, url, **kwargs): return Response()
        class Call:
            def __aiter__(self): return self
            async def __anext__(self):
                from mocr.v1 import mocr_pb2
                return mocr_pb2.GenerateResponse(done=True, chunk="ok")
            def cancel(self): pass
        class Stub:
            def Generate(self, request, **kwargs):
                requests.append(request)
                return Call()
        client = MocrClient()
        client._stub = Stub()
        with patch("life.model_client.httpx.AsyncClient", HTTP):
            for value in ("initial", "rotated"):
                key[0] = value
                self.assertEqual([chunk async for chunk in client.generate("b", [])], ["ok"])
                self.assertEqual(requests[-1].api_key, value)
                self.assertEqual(requests[-1].base_url, "http://b")


if __name__ == "__main__":
    unittest.main()
