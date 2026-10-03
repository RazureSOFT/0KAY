"""开始生命 / 暂停生命: one click ignites the character's autonomous life."""
import asyncio
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine


def _fake_model(payload):
    async def generate(self, model_id, messages, system_prompt="", thinking=False,
                       max_tokens=1024, temperature=None):
        yield payload if isinstance(payload, str) else json.dumps(payload, ensure_ascii=False)
    return generate


class StartLifeTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.engine.mocr.generate = types.MethodType(
            _fake_model({"thought": "我醒过来了", "focus": "想看看今天"}), self.engine.mocr)

    def tearDown(self):
        self.directory.cleanup()

    def test_life_is_off_until_started(self):
        self.assertFalse(self.engine.life_is_alive())
        self.assertFalse(self.engine.life_status()["resident_running"])
        # The dashboard read-out carries the life status.
        self.assertIn("life", self.engine.cognition_status())

    def test_start_life_ignites_cognition_resident_and_proactive(self):
        async def scenario():
            status = await self.engine.start_life()
            self.assertTrue(status["alive"])
            self.assertTrue(status["resident_running"])
            self.assertTrue(status["resident_enabled"])
            self.assertTrue(status["cognition_enabled"])
            self.assertTrue(status["proactive_enabled"])
            # The very first autonomous thought already happened.
            self.assertGreaterEqual(status["ticks"], 1)
            self.assertEqual(status["last_thought"], "我醒过来了")
            self.assertTrue(status["focus"])
            stopped = await self.engine.stop_life()
            self.assertFalse(stopped["alive"])
            self.assertFalse(stopped["resident_running"])
            self.assertFalse(stopped["proactive_enabled"])
        asyncio.run(scenario())

    def test_life_state_survives_a_restart(self):
        async def scenario():
            await self.engine.start_life()
            reopened = LifeEngine(self.directory.name)
            self.assertTrue(reopened.life_is_alive())
            await self.engine.stop_life()
        asyncio.run(scenario())

    def test_greet_delivers_the_first_message(self):
        self.engine.mocr.generate = types.MethodType(_fake_model("我会好好活的"), self.engine.mocr)

        async def scenario():
            status = await self.engine.start_life(greet=True, session_id="webui:1")
            self.assertEqual(status.get("greeting"), "我会好好活的")
            notes = self.engine.get_notifications("webui:1")
            self.assertTrue(any(note["text"] == "我会好好活的" for note in notes))
            await self.engine.stop_life()
        asyncio.run(scenario())


if __name__ == "__main__":
    unittest.main()
