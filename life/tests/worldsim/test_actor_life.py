"""The fictional cast are real "others": they miss the character, get angry,
and can be reached out to - a social life the user does not see."""
import os
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.engine import LifeEngine  # noqa: E402


class ActorLife(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.tmp = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.tmp.name)
        self.engine.companion.set_settings({"world_density": "texture"})
        self.runtime = self.engine._ensure_worldsim()

    def tearDown(self):
        os.environ.update(self._env)
        self.tmp.cleanup()

    def _actor(self, index=0):
        return list(self.runtime.sim.state["actors"].keys())[index]

    def test_the_cast_are_people_with_relationship_state(self):
        roster = self.runtime.actor_roster()
        self.assertTrue(roster)
        self.assertIn("affinity", roster[0])
        self.assertIn("last_contact_days", roster[0])

    def test_reaching_out_resets_the_clock_and_repairs(self):
        actor_id = self._actor()
        state = self.runtime.sim.state["actors"][actor_id]
        state["last_contact_days"] = 6.0
        state["affinity"] = 0.1
        result = self.runtime.life_contacts(actor_id)
        self.assertTrue(result["success"])
        self.assertEqual(state["last_contact_days"], 0.0)
        self.assertGreater(state["affinity"], 0.1)
        self.assertFalse(state["pending"])

    def test_neglect_cools_affinity(self):
        actor_id = self._actor()
        state = self.runtime.sim.state["actors"][actor_id]
        state["last_contact_days"] = 5.0
        state["affinity"] = 0.5
        self.runtime.decay_actors()
        self.assertLess(state["affinity"], 0.5)

    def test_pending_lists_who_is_missing_or_upset(self):
        actor_id = self._actor()
        self.runtime.sim.state["actors"][actor_id]["last_contact_days"] = 4.0
        pending = self.runtime.pending_actor_contacts()
        self.assertTrue(any(item["id"] == actor_id for item in pending))

    def test_a_beat_reaches_the_character_but_not_the_user(self):
        actor_id = self._actor()
        state = self.runtime.sim.state["actors"][actor_id]
        state["last_contact_days"] = 5.0
        state["affinity"] = 0.1
        self.engine._on_world_actor_beat(actor_id, state["name"], "有人在想你", "upset")
        # It lands in the character's own timeline and relationship state...
        self.assertTrue(self.engine.companion.timeline_list(topic="世界"))
        self.assertIn(f"world:{actor_id}", self.engine.relating.repair.unresolved())
        # ...but never as a user-facing notification.
        self.assertEqual(self.engine.get_notifications(""), [])

    def test_a_reachable_actor_enters_the_observation_context(self):
        actor_id = self._actor()
        self.runtime.sim.state["actors"][actor_id]["last_contact_days"] = 5.0
        text = self.engine._world_contacts_context(self.runtime)
        self.assertIn(self.runtime._actor_name(actor_id), text)

    def test_world_tool_actions(self):
        actor_id = self._actor()
        listed = self.engine._world_action("list")
        self.assertTrue(listed["success"])
        replied = self.engine._world_action("reply", actor_id=actor_id)
        self.assertTrue(replied["success"])

    def test_world_tool_is_off_without_world_density(self):
        other = tempfile.TemporaryDirectory()
        try:
            engine = LifeEngine(other.name)
            result = engine._world_action("list")
            self.assertFalse(result["success"])
        finally:
            other.cleanup()

    def test_world_is_an_allowed_autonomous_tool(self):
        self.assertIn("world", self.engine.AUTONOMY_TOOLS)


if __name__ == "__main__":
    unittest.main()
