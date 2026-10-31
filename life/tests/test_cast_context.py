import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.cast import CastContexts, minor_model  # noqa: E402


class ActorIsolation(unittest.TestCase):
    def setUp(self):
        self.cast = CastContexts()
        self.cast.add_fact("lin", "The user's sister is in hospital.")
        self.cast.observe("lin", "actor", "My brother is not well.")
        self.cast.observe("lin", "user", "I will visit on Sunday.")
        self.cast.add_fact("zhou", "The user owes me money.")
        self.cast.observe("zhou", "actor", "Still waiting on that transfer.")

    def test_a_private_fact_never_reaches_another_actors_prompt(self):
        self.assertIn("sister is in hospital", self.cast.prompt_for("lin"))
        self.assertNotIn("sister is in hospital", self.cast.prompt_for("zhou"))
        self.assertIn("owes me money", self.cast.prompt_for("zhou"))
        self.assertNotIn("owes me money", self.cast.prompt_for("lin"))

    def test_turns_do_not_cross_between_actors(self):
        lin = self.cast.prompt_for("lin")
        zhou = self.cast.prompt_for("zhou")
        self.assertIn("I will visit on Sunday", lin)
        self.assertNotIn("I will visit on Sunday", zhou)
        self.assertIn("Still waiting on that transfer", zhou)
        self.assertNotIn("Still waiting on that transfer", lin)

    def test_an_unknown_actor_gets_nothing_from_anyone_else(self):
        prompt = self.cast.prompt_for("nobody")
        self.assertIn("nobody", prompt)
        self.assertNotIn("in hospital", prompt)
        self.assertNotIn("transfer", prompt)

    def test_relations_render_as_closeness_not_as_facts(self):
        self.cast.relate("lin", "zhou", 0.8)
        prompt = self.cast.prompt_for("lin")
        self.assertIn("zhou (close)", prompt)
        self.assertNotIn("owes me money", prompt)

    def test_the_same_turn_is_not_stored_twice_and_history_is_capped(self):
        self.cast.observe("lin", "user", "   ")
        self.assertFalse(any(turn["text"] == "" for turn in self.cast.get("lin").turns))
        for index in range(20):
            self.cast.observe("lin", "user", f"message {index}")
        self.assertEqual(len(self.cast.get("lin").turns), 8)
        self.assertEqual(self.cast.get("lin").turns[-1]["text"], "message 19")


class Persistence(unittest.TestCase):
    def test_the_cast_survives_a_reload(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "cast.json"
            first = CastContexts(path, names={"lin": "Lin"})
            first.add_fact("lin", "A fact told in confidence.")
            first.observe("lin", "user", "See you tomorrow.")
            first.relate("lin", "zhou", 0.6)
            first.save()
            second = CastContexts(path)
            self.assertIn("A fact told in confidence.", second.prompt_for("lin"))
            self.assertIn("See you tomorrow.", second.prompt_for("lin"))
            self.assertIn("Lin", second.prompt_for("lin"))
            self.assertNotIn("in confidence", second.prompt_for("zhou"))

    def test_a_corrupt_file_does_not_stop_the_cast_from_loading(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "cast.json"
            path.write_text("{not json", encoding="utf-8")
            cast = CastContexts(path)
            cast.add_fact("lin", "still works")
            self.assertIn("still works", cast.prompt_for("lin"))


class MinorModel(unittest.TestCase):
    def test_important_actors_keep_the_main_model(self):
        settings = {"model_routes": json.dumps({"minor_actor": "cheap-model"})}
        self.assertEqual(minor_model(settings, "lin", {"lin"}), "")
        self.assertEqual(minor_model(settings, "zhou", {"lin"}), "cheap-model")

    def test_no_route_means_no_override(self):
        self.assertEqual(minor_model({"model_routes": "{}"}, "zhou"), "")
        self.assertEqual(minor_model({"model_routes": "{broken"}, "zhou"), "")
        self.assertEqual(minor_model(None, "zhou"), "")


class WorldRuntimeCast(unittest.TestCase):
    def test_a_beat_is_recorded_for_that_actor_only(self):
        from life.engine import LifeEngine

        with tempfile.TemporaryDirectory() as tmp:
            engine = LifeEngine(tmp)
            engine.companion.set_settings({"world_density": "texture"})
            runtime = engine._ensure_worldsim()
            first, second = list(runtime.sim.state["actors"])[:2]
            text = runtime.render_actor_beat(first, "upset")
            self.assertIn(text, runtime.cast_context.prompt_for(first))
            self.assertNotIn(text, runtime.cast_context.prompt_for(second))

    def test_the_contact_context_only_quotes_the_person_being_discussed(self):
        from life.engine import LifeEngine

        with tempfile.TemporaryDirectory() as tmp:
            engine = LifeEngine(tmp)
            engine.companion.set_settings({"world_density": "texture"})
            runtime = engine._ensure_worldsim()
            first, second = list(runtime.sim.state["actors"])[:2]
            for actor_id in (first, second):
                state = runtime.sim.state["actors"][actor_id]
                state["last_contact_days"] = 5.0
                state["affinity"] = 0.1
            runtime.render_actor_beat(first, "upset")
            context = engine._world_contacts_context(runtime)
            self.assertIn(runtime.cast_context.last_line(first), context)
            self.assertNotIn(runtime.cast_context.last_line(second) or "\0", context)


if __name__ == "__main__":
    unittest.main()
