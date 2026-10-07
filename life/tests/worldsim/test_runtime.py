"""S5 gate: the world runs at runtime without an LLM, is off by default, and
feeds the timeline/mood/memory when enabled."""
import asyncio
import os
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.engine import LifeEngine  # noqa: E402
from life.worldsim.runtime import WorldRuntime  # noqa: E402


class RuntimeGate(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.tmp = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.tmp.name)
        self.runtime = WorldRuntime(world_dir=str(ROOT / "world"), models_dir=str(ROOT / "models"),
                                    data_dir=str(Path(self.tmp.name) / "worldsim"), seed=3)

    def tearDown(self):
        os.environ.update(self._env)
        self.tmp.cleanup()

    def test_off_by_default_is_a_noop(self):
        result = asyncio.run(self.engine.worldsim_tick())
        self.assertEqual(result.get("skipped"), "off")

    def test_texture_consumes_into_the_timeline(self):
        for _ in range(4):
            self.runtime.tick(self.engine, "texture")
        rows = self.engine.companion.timeline_list(topic="世界")
        self.assertGreaterEqual(len(rows), 1)

    def test_render_validates_against_the_cast(self):
        event = self.runtime.sim.step()
        if event is None:
            self.skipTest("no event this step")
        text = self.runtime.render(event)
        self.assertTrue(text)
        self.assertEqual(self.runtime.validate(text, event), [])

    def test_runtime_runs_without_llm(self):
        result = self.runtime.tick(self.engine, "full")  # full also needs no LLM
        self.assertTrue(result is None or "event" in result)

    def test_legacy_state_without_somatic_still_ticks(self):
        """States persisted before the somatic key existed must not die every tick.

        A real install logged ``worldsim tick failed: 'somatic'`` every 20
        minutes for a day: _load() replaced the fresh state wholesale with a
        pre-schemas-version-2 file, and _advance_clock() indexed
        state["somatic"] directly.
        """
        import json
        payload = {
            "state": {k: v for k, v in self.runtime.sim.state.items() if k != "somatic"},
            "ledger": self.runtime.sim.ledger,
            "obligations": self.runtime.sim.obligations,
            "due_echoes": self.runtime.sim.due_echoes,
            "now_step": 5,
            "world_key": self.runtime.world_key,
            "actor_locations": dict(self.runtime.actor_locations),
            "events": [],
        }
        self.runtime.path.parent.mkdir(parents=True, exist_ok=True)
        self.runtime.path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        revived = WorldRuntime(world_dir=str(ROOT / "world"), models_dir=str(ROOT / "models"),
                               data_dir=str(Path(self.tmp.name) / "worldsim"), seed=3)
        self.assertIn("somatic", revived.sim.state)
        self.assertIn("burden", revived.sim.state["somatic"])
        revived.tick(self.engine, "texture")  # _advance_clock must not KeyError


if __name__ == "__main__":
    unittest.main()
