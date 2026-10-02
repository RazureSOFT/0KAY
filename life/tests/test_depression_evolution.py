"""The course of depression: does it onset, remit, relapse - and does it evolve
on the clock, not only when someone is talking."""
import asyncio
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.affect import AffectConfig, AffectSystem, DepressiveEpisode
from life.engine import LifeEngine


def _depressed(episode, vulnerability=1.0):
    episode.assess(mood=-0.9, anhedonia=0.1, allostatic_load=1.0, rumination=1.0,
                   fatigue=1.0, sleep_debt=1.0, vagal_tone=0.0, vulnerability=vulnerability)


def _well(episode, vulnerability=1.0):
    episode.assess(mood=0.9, anhedonia=1.0, allostatic_load=0.0, rumination=0.0,
                   fatigue=0.0, sleep_debt=0.0, vagal_tone=1.0, vulnerability=vulnerability)


class EpisodeCourse(unittest.TestCase):
    def test_a_single_bad_assessment_is_not_an_episode(self):
        episode = DepressiveEpisode(onset=0.5, remission=0.3, sustain=2)
        _depressed(episode)
        episode.update()
        self.assertNotEqual(episode.state, DepressiveEpisode.EPISODE)

    def test_sustained_severity_onsets_an_episode(self):
        episode = DepressiveEpisode(onset=0.5, remission=0.3, sustain=2)
        for _ in range(2):
            _depressed(episode)
            episode.update(dt_seconds=86400)
        self.assertEqual(episode.state, DepressiveEpisode.EPISODE)
        self.assertEqual(episode.episodes, 1)
        self.assertIsNotNone(episode.onset_clock)

    def test_sustained_wellness_remits(self):
        episode = DepressiveEpisode(onset=0.5, remission=0.3, sustain=2)
        for _ in range(2):
            _depressed(episode)
            episode.update(dt_seconds=86400)
        for _ in range(2):
            _well(episode)
            episode.update(dt_seconds=86400)
        self.assertEqual(episode.state, DepressiveEpisode.EUTHYMIC)
        self.assertTrue(episode.snapshot()["remitted"])

    def test_a_new_episode_after_remission_is_a_relapse(self):
        episode = DepressiveEpisode(onset=0.5, remission=0.3, sustain=2)
        for _ in range(2):
            _depressed(episode); episode.update(dt_seconds=86400)
        for _ in range(2):
            _well(episode); episode.update(dt_seconds=86400)
        for _ in range(2):
            _depressed(episode); episode.update(dt_seconds=86400)
        self.assertEqual(episode.episodes, 2)
        self.assertEqual(episode.relapses, 1)

    def test_subthreshold_before_the_episode(self):
        episode = DepressiveEpisode(onset=0.9, remission=0.2, sustain=2)
        episode.assess(mood=-0.4, anhedonia=0.7, allostatic_load=0.2, rumination=0.2,
                       fatigue=0.1, sleep_debt=0.0, vagal_tone=0.7, vulnerability=0.3)
        episode.update()
        self.assertEqual(episode.state, DepressiveEpisode.SUBTHRESHOLD)

    def test_vulnerability_amplifies_the_same_state(self):
        low = DepressiveEpisode()
        high = DepressiveEpisode()
        _depressed(low, vulnerability=0.0)
        _depressed(high, vulnerability=1.0)
        self.assertGreater(high.severity, low.severity)

    def test_episode_round_trips(self):
        episode = DepressiveEpisode()
        for _ in range(2):
            _depressed(episode); episode.update(dt_seconds=86400)
        restored = DepressiveEpisode.from_dict(episode.to_dict())
        self.assertEqual(restored.state, episode.state)
        self.assertEqual(restored.episodes, episode.episodes)


class AffectSystemCourse(unittest.TestCase):
    def test_chronic_stress_evolves_into_an_episode(self):
        system = AffectSystem()
        for _ in range(48):
            system.observe_outcome(success=False, reward=-0.5, stressor=0.9)
            system.tick(3600, hour=14, sleeping=False)
        self.assertEqual(system.episode.state, DepressiveEpisode.EPISODE)
        self.assertIn("低落", system.context()["prompt"])

    def test_sleep_and_positive_events_can_remit_it(self):
        system = AffectSystem()
        for _ in range(48):
            system.observe_outcome(success=False, reward=-0.5, stressor=0.9)
            system.tick(3600, hour=14, sleeping=False)
        for _ in range(240):
            system.observe_outcome(success=True, reward=1.0, stressor=0.0)
            system.tick(3600, hour=2, sleeping=True)
        self.assertEqual(system.episode.state, DepressiveEpisode.EUTHYMIC)

    def test_episode_persists_across_a_restart(self):
        system = AffectSystem()
        for _ in range(48):
            system.observe_outcome(success=False, reward=-0.5, stressor=0.9)
            system.tick(3600, hour=14)
        restored = AffectSystem.from_dict(system.to_dict())
        self.assertEqual(restored.episode.state, system.episode.state)
        self.assertAlmostEqual(restored.episode.severity, system.episode.severity, places=6)

    def test_disabled_system_tracks_nothing(self):
        system = AffectSystem(AffectConfig(enabled=False))
        system.observe_outcome(False, reward=-1.0, stressor=1.0)
        system.tick(3600)
        self.assertEqual(system.episode.state, DepressiveEpisode.EUTHYMIC)


class EngineWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def _feedback(self, message, seconds_ago=5.0):
        self.engine._awaiting_feedback["s1"] = {
            "sent_at": (datetime.now() - timedelta(seconds=seconds_ago)).isoformat(),
            "user_id": "u1", "context": {}, "control": {}, "valence": 0.0,
            "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}
        self.engine._receive_feedback(self.turn, message)

    def test_hostile_feedback_reaches_the_stress_axis(self):
        before = self.engine.affect.hpa.cortisol
        self._feedback("闭嘴，我讨厌你，滚")
        self.assertGreater(self.engine.affect.hpa.cortisol, before)

    def test_the_background_clock_advances_the_physiology(self):
        self.engine._last_affect_at = datetime.now() - timedelta(hours=2)
        before = self.engine.affect.episode.clock_seconds
        self.engine._tick_affect()
        self.assertGreater(self.engine.affect.episode.clock_seconds, before)

    def test_prompt_speaks_as_someone_in_an_episode(self):
        self.engine.affect.episode.state = DepressiveEpisode.EPISODE
        self.engine.affect.episode.severity = 0.8
        self.assertIn("低落", self.engine.affect.context()["prompt"])


if __name__ == "__main__":
    unittest.main()
