import asyncio
import json
import os
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
from life.model_client import MocrClient


class MemoryTests(unittest.TestCase):
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
            async def get(self, url): return Response()
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
