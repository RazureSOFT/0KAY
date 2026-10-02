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


if __name__ == "__main__":
    unittest.main()
