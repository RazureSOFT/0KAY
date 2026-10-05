"""Integration tests for the cognition core's settings wiring.

The cognition knobs live in four places, and every hop between them is a place
where a rename or an addition can silently drift:

    panel (CompanionPage.vue COG_DEFAULTS)
      -> CompanionSystem.SETTING_DEFAULTS / CONFIG_SCHEMA
      -> SQLite ``settings`` table
      -> LifeEngine.apply_cognition_settings  (saved > env > default)
      -> per-wave reconfigure()  -> cognition_status() read-out

The panel/backend key contract is read out of the actual Vue source so a knob
that exists on one side but not the other fails loudly here instead of quietly
doing nothing when a user flips the switch in the dashboard.
"""
import asyncio
import json
import os
import re
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem
from life.engine import LifeEngine

ROOT = Path(__file__).resolve().parents[1]
PANEL = ROOT.parent / "plugin-web" / "life" / "src" / "CompanionPage.vue"
BUNDLE = ROOT.parent / "core" / "data" / "plugin-ui" / "life" / "companion.js"


def panel_cog_keys() -> set[str]:
    """Extract the keys of the panel's COG_DEFAULTS object literal."""
    source = PANEL.read_text(encoding="utf-8")
    match = re.search(r"const COG_DEFAULTS[^{]*\{(.*?)\n\}", source, re.S)
    assert match, "COG_DEFAULTS not found in CompanionPage.vue"
    return set(re.findall(r"([A-Za-z_][A-Za-z0-9_]*)\s*:", match.group(1)))


class PanelBackendContract(unittest.TestCase):
    def test_panel_cog_keys_exist_on_backend(self):
        keys = panel_cog_keys()
        self.assertTrue(keys, "panel COG_DEFAULTS is empty")
        for key in sorted(keys):
            self.assertIn(key, CompanionSystem.SETTING_DEFAULTS, f"{key} missing from SETTING_DEFAULTS")
            self.assertIn(key, CompanionSystem.CONFIG_SCHEMA, f"{key} missing from CONFIG_SCHEMA")
            default = CompanionSystem.SETTING_DEFAULTS[key]
            self.assertIsNotNone(CompanionSystem.validate_setting(key, default),
                                 f"{key}={default!r} rejected by validate_setting")

    def test_backend_cog_keys_all_exposed_in_panel(self):
        backend = {k for k in CompanionSystem.SETTING_DEFAULTS if k.startswith("cog_")}
        self.assertEqual(backend - panel_cog_keys(), set(),
                         "cognition keys exist on the backend but are not editable in the panel")

    def test_panel_bundle_ships_cognition_ui(self):
        if not BUNDLE.exists():
            self.skipTest("panel bundle not built (run `npm run build` in plugin-web/life)")
        text = BUNDLE.read_text(encoding="utf-8")
        for needle in ("认知内核", "cog_enabled", "cog-metric"):
            self.assertIn(needle, text, f"{needle!r} absent from built panel bundle")

    def test_panel_readout_keys_exist_in_status(self):
        """Every field the panel reads must exist in cognition_status().

        A field the panel renders but the backend never emits shows a permanent
        "—" and hides a broken circuit, so this is checked against real output.
        """
        source = PANEL.read_text(encoding="utf-8")
        refs = set(re.findall(r"(lastControl|wave1|wave2|wave3|wave4a|wave4b)\?\.([a-z_0-9]+)", source))
        self.assertTrue(refs, "no cognition read-out refs found in the panel")
        # Build the real dicts from a live engine so this cannot drift.  One
        # arbitration is driven first because `last_control` is legitimately
        # empty until the first turn (the panel guards it with `?.`).
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            turn = SimpleNamespace(user_id="", intent="闲聊", session_id="s1")
            engine._cognition_arbitrate("你好", turn, "", {})
            live = engine.cognition_status()
        self.assertTrue(live["last_control"], "arbitration did not populate last_control")
        for source_name, key in refs:
            target = "last_control" if source_name == "lastControl" else source_name
            self.assertIn(target, live, f"panel reads {source_name} but status has no {target}")
            self.assertIn(key, live[target],
                          f"panel reads {source_name}?.{key} but {target} does not emit it")


class CognitionSettingsChain(unittest.TestCase):
    def setUp(self):
        # Isolate from any LIFE_COG_* pinned in the ambient environment.
        self._env_backup = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)

    def tearDown(self):
        os.environ.update(self._env_backup)
        self.directory.cleanup()

    def test_status_shape_and_defaults(self):
        status = self.engine.cognition_status()
        self.assertTrue(status["available"])
        self.assertTrue(status["enabled"])
        self.assertEqual(set(status["modulate"]), {"affect", "language", "social", "selfhood"})
        for wave in ("last_control", "wave1", "wave2", "wave3", "wave4a", "wave4b"):
            self.assertIn(wave, status)
        self.assertTrue(status["modulate"]["affect"])

    def test_saved_settings_apply_to_every_wave(self):
        self.engine.companion.set_settings({
            "cog_plan_depth": 5, "cog_wm_capacity": 9, "cog_tau": 0.15, "cog_use_ofc_map": 0,
            "cog_affect_profile": "anxiety", "cog_affect_vagal": 0.3,
            "cog_social_stage": 3, "cog_selfhood_detail": 33,
        })
        self.engine.apply_cognition_settings()
        self.assertEqual(self.engine.cognition.config.plan_depth, 5)
        self.assertEqual(self.engine.cognition.config.wm_capacity, 9)
        self.assertAlmostEqual(self.engine.cognition.config.tau, 0.15)
        self.assertFalse(self.engine.cognition.config.use_ofc_map)
        self.assertEqual(self.engine.affect.config.erq_profile, "anxiety")
        self.assertAlmostEqual(self.engine.affect.config.baseline_vagal, 0.3)
        self.assertEqual(self.engine.social.config.perspective_stage, 3)
        self.assertAlmostEqual(self.engine.selfhood.config.detail_scale, 33)

    def test_env_tier_wins_when_unsaved(self):
        with patch.dict(os.environ, {"LIFE_COG_PLAN_DEPTH": "6"}):
            self.engine.apply_cognition_settings()
            self.assertEqual(self.engine.cognition.config.plan_depth, 6)

    def test_saved_setting_beats_env(self):
        self.engine.companion.set_settings({"cog_plan_depth": 2})
        with patch.dict(os.environ, {"LIFE_COG_PLAN_DEPTH": "6"}):
            self.engine.apply_cognition_settings()
            self.assertEqual(self.engine.cognition.config.plan_depth, 2)

    def test_off_switch_disables_modulation_but_keeps_circuits(self):
        self.engine.companion.set_settings({"cog_enabled": 0})
        status = self.engine.apply_cognition_settings()
        self.assertFalse(status["enabled"])
        self.assertEqual(status["modulate"],
                         {"affect": False, "language": False, "social": False, "selfhood": False})
        # the circuits still exist and still track state; they just do not
        # modulate the prompt (the "track vs modulate" rule).
        self.assertIsNotNone(self.engine.cognition)
        self.assertTrue(self.engine.cognition_status()["available"])

    def test_modulation_switch_is_independent_of_wave_enable(self):
        self.engine.companion.set_settings({"cog_modulate_social": 0})
        status = self.engine.apply_cognition_settings()
        self.assertFalse(status["modulate"]["social"])
        self.assertTrue(status["modulate"]["affect"])
        # the social circuit is still enabled, only its prompt influence is off
        self.assertTrue(self.engine.social.config.enabled)

    def test_reconfigure_preserves_learned_state(self):
        cognition = self.engine.cognition
        outcome = cognition.control({"intent": "闲聊", "urgency": 0.4}, stakes=1.0)
        cognition.remember_decision("s1", outcome)
        cognition.observe("s1", {"intent": "闲聊", "urgency": 0.4},
                          {"intent": "闲聊", "urgency": 0.1}, reward=1.0)
        before = cognition.stats()
        self.assertGreaterEqual(before["turns"], 1)

        self.engine.companion.set_settings({"cog_plan_depth": 4, "cog_tau": 0.2})
        self.engine.apply_cognition_settings()

        after = cognition.stats()
        self.assertEqual(after["turns"], before["turns"])
        self.assertEqual(after["engrams"], before["engrams"])
        self.assertEqual(after["observed_pairs"], before["observed_pairs"])
        self.assertEqual(self.engine.cognition.config.plan_depth, 4)
        self.assertAlmostEqual(self.engine.cognition.config.tau, 0.2)

    def test_status_is_json_serialisable(self):
        import json
        self.engine.companion.set_settings({"cog_plan_depth": 3})
        self.engine.apply_cognition_settings()
        json.dumps(self.engine.cognition_status())  # must not raise (gRPC ships this)

    # ---------------------------------------------------- proactive timing
    def test_next_send_time_defers_across_quiet_hours(self):
        """The model picks a delay; the rules still forbid sending in the night."""
        hour = datetime.now().hour
        quiet_start, quiet_end = hour, (hour + 1) % 24
        when = self.engine._next_send_time(0, {"quiet_start": str(quiet_start), "quiet_end": str(quiet_end)})
        parsed = datetime.fromisoformat(when)
        self.assertEqual(parsed.hour, quiet_end)
        self.assertGreaterEqual(parsed, datetime.now().replace(second=0, microsecond=0))

    def test_next_send_time_honours_a_zero_delay_when_awake(self):
        when = self.engine._next_send_time(0, {"quiet_start": "0", "quiet_end": "0"})
        self.assertLessEqual(abs((datetime.fromisoformat(when) - datetime.now()).total_seconds()), 90)

    def test_think_parses_proactive_timing_and_control_context(self):
        from life.think.think import ThinkStage
        stage = ThinkStage()
        result = stage.parse_response('{"emotion_delta": {}, "proactive_message": "在吗", "proactive_after_minutes": 30}')
        self.assertEqual(result.proactive_after_minutes, 30)
        context = stage.control_context("FULL", "reply")
        self.assertIn("EVC", context)
        self.assertIn("FULL", context)
        self.assertEqual(stage.control_context("", ""), "")

    # ------------------------------------------------------------- worldview
    def test_worldview_snapshot_exposes_identity_and_map(self):
        self.engine.companion.set_settings({
            "world_fictional": "fictional", "world_country": "曦国", "world_city": "临海城",
            "world_district": "旧港区", "world_premise": "海边小城",
            "world_actors": "小满|朋友\n阿杰|同事", "world_places": "家里, 灯塔, 旧书店"})
        snapshot = asyncio.run(self.engine.worldview_snapshot())
        self.assertEqual(snapshot["city"], "临海城")
        self.assertTrue(snapshot["fictional"])
        # fictional -> a drawn city map, not real coordinates
        self.assertEqual(snapshot["map"]["kind"], "fictional")
        self.assertGreaterEqual(len(snapshot["map"]["locations"]), 3)
        self.assertTrue(snapshot["map"]["districts"])
        self.assertTrue(snapshot["map"]["lakes"])
        self.assertTrue(snapshot["map"]["metro"])
        for actor in snapshot["map"]["actors"]:
            self.assertTrue(actor["location"])

    def test_generate_map_only_keeps_the_setting_text(self):
        """The map-only path must never overwrite the owner's setting text."""
        self.engine.companion.set_settings({
            "world_premise": "一段很长的设定文本", "world_actors": "小满|朋友\n阿杰|同事",
            "world_places": "家里, 学校, 湖", "world_country": "中国", "world_city": "星月城"})

        async def fake_generate(model_id, messages, system_prompt="", thinking=False,
                                max_tokens=1024, temperature=None, usage=None):
            yield json.dumps({"districts": [{"name": "旧港区"}],
                              "water": [{"name": "湖", "kind": "lake"}],
                              "roads": [{"name": "大道", "kind": "arterial", "from": "家里", "to": "学校"}]},
                             ensure_ascii=False)

        with patch.object(self.engine.mocr, "generate", fake_generate):
            result = asyncio.run(self.engine.generate_worldview("", map_only=True))
        self.assertTrue(result.get("map_only"))
        saved = self.engine.companion.get_settings()
        self.assertEqual(saved.get("world_premise"), "一段很长的设定文本")
        self.assertEqual(saved.get("world_actors"), "小满|朋友\n阿杰|同事")
        self.assertEqual(saved.get("world_places"), "家里, 学校, 湖")
        self.assertEqual(saved.get("world_city"), "星月城")
        self.assertTrue(saved.get("world_map"))

    def test_generate_worldview_fails_without_a_model(self):
        """With no model reachable the engine reports an error and keeps the
        stored world untouched instead of persisting a rebuilt default."""
        self.engine.companion.set_settings({
            "world_premise": "一段很长的设定文本", "world_actors": "小满|朋友",
            "world_places": "家里, 学校", "world_city": "星月城"})
        result = asyncio.run(self.engine.generate_worldview(""))
        self.assertFalse(result.get("ok"))
        self.assertTrue(result.get("error"))
        saved = self.engine.companion.get_settings()
        self.assertEqual(saved.get("world_premise"), "一段很长的设定文本")
        self.assertEqual(saved.get("world_actors"), "小满|朋友")
        self.assertEqual(saved.get("world_city"), "星月城")

    # ---------------------------------------------------------- consolidation
    def _turn(self):
        return SimpleNamespace(user_id="", intent="闲聊", session_id="s1")

    def test_consolidation_switches_default_on_and_master_gated(self):
        """The learning circuits default ON: they are what makes lived experience
        leave a trace.  The master switch still gates them, and each one can be
        ablated on its own to reproduce the pre-cognition behaviour."""
        self.assertTrue(self.engine._memory_encode)
        self.assertTrue(self.engine._sleep_replay)
        self.assertTrue(self.engine._memory_reconsolidate)
        self.assertTrue(self.engine._cls_interleave)
        # individually ablatable
        self.engine.companion.set_settings({"cog_memory_encode": 0})
        self.engine.apply_cognition_settings()
        self.assertFalse(self.engine._memory_encode)
        # and gated by the master switch even when individually enabled
        self.engine.companion.set_settings({"cog_enabled": 0, "cog_memory_encode": 1})
        self.engine.apply_cognition_settings()
        self.assertFalse(self.engine._memory_encode)

    def test_memory_encode_is_skipped_when_off(self):
        self.engine.companion.set_settings({"cog_memory_encode": 0})
        self.engine.apply_cognition_settings()
        turn = self._turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._cognition_settle("s1", turn, "一段回答", "", 0.0, 0.0)
        episodes = [i for i in self.engine.memory.page_facts(scope="*").get("items", [])
                    if i.get("memory_type") == "episode"]
        self.assertEqual(episodes, [])

    def test_memory_encode_writes_a_trace_when_on(self):
        self.engine.companion.set_settings({"cog_memory_encode": 1})
        self.engine.apply_cognition_settings()
        self.assertTrue(self.engine._memory_encode)
        turn = self._turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        # force the novelty side of the gate: novelty = 1 - confidence
        self.engine._last_control["confidence"] = 0.1
        self.engine._cognition_settle("s1", turn, "一段值得记住的回答", "", 0.0, 0.0)
        episodes = [i for i in self.engine.memory.page_facts(scope="*").get("items", [])
                    if i.get("memory_type") == "episode"]
        self.assertEqual(len(episodes), 1)
        self.assertIn("值得记住", episodes[0]["content"])

    def test_episode_encoding_gate_rejects_routine_and_keeps_surprising(self):
        """``|pe| > theta_pe or novelty > theta_n`` - both sides, on the real signal."""
        self.engine.companion.set_settings({"cog_memory_encode": 1})
        self.engine.apply_cognition_settings()
        turn = self._turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._last_control["confidence"] = 1.0  # novelty = 0

        # below both thresholds -> no trace
        self.engine._encode_episode(turn, "平淡的回复", {"cerebellar_pe": 0.01}, 0.0)
        # surprise above theta_pe -> trace
        self.engine._encode_episode(turn, "意外的回复", {"cerebellar_pe": 0.9}, 0.0)
        # novelty above theta_n suffices even with no surprise at all
        self.engine._last_control["confidence"] = 0.1  # novelty = 0.9
        self.engine._encode_episode(turn, "新鲜的回复", {"cerebellar_pe": 0.0}, 0.0)

        episodes = [i["content"] for i in self.engine.memory.page_facts(scope="*").get("items", [])
                    if i.get("memory_type") == "episode"]
        self.assertEqual(sorted(episodes), sorted(["意外的回复", "新鲜的回复"]))

    def _drive_turns(self, count: int = 4, message: str = "你好", response: str = "回答"):
        for _ in range(count):
            turn = self._turn()
            self.engine._cognition_arbitrate(message, turn, "", {})
            self.engine._cognition_settle("s1", turn, response, "", 0.0, 0.0)

    def _enter_sleep(self, hours_in: float = 1.0):
        """Put the agent into slow-wave sleep (Rasch & Born 2013: SWS first)."""
        circadian = self.engine.circadian
        circadian.state.is_sleeping = True
        circadian.state.sleep_start = datetime.now() - timedelta(hours=hours_in)

    def test_sleep_replay_is_gated_on_sleep(self):
        """Awake -> nothing happens, even with the switch on."""
        async def scenario():
            self.engine.companion.set_settings({"cog_sleep_replay": 1})
            self.engine.apply_cognition_settings()
            self._drive_turns(4)
            self.assertEqual(self.engine._sleep_phase(), "awake")
            self.assertEqual(await self.engine._run_sleep_replay("n1"), {})
        asyncio.run(scenario())

    def test_sleep_phases_split_the_night(self):
        """Rasch & Born: SWS first, REM later - not one boolean."""
        self._enter_sleep(hours_in=1.0)
        self.assertEqual(self.engine._sleep_phase(), "sws")
        self._enter_sleep(hours_in=6.5)   # 6.5/8 > 0.6
        self.assertEqual(self.engine._sleep_phase(), "rem")
        self.engine.circadian.state.is_sleeping = False
        self.assertEqual(self.engine._sleep_phase(), "awake")

    def test_sws_replays_once_per_night(self):
        async def scenario():
            self.engine.companion.set_settings({"cog_sleep_replay": 1})
            self.engine.apply_cognition_settings()
            self._enter_sleep(hours_in=1.0)
            # enabled but no traces yet -> still nothing to replay, key untouched
            self.assertEqual(await self.engine._run_sleep_replay("n1"), {})
            self.assertEqual(self.engine._last_replay_key, "")

            self._drive_turns(4)  # creates cognition engrams via model.learn
            self.assertGreater(len(self.engine.cognition.model.engrams), 0)

            first = await self.engine._run_sleep_replay("n1")
            self.assertEqual(first.get("phase"), "sws")
            self.assertEqual(self.engine._last_replay_key, "n1")
            self.assertGreater(first.get("replay", 0), 0)
            # same night again -> no-op (a restart must not double-consolidate)
            self.assertEqual(await self.engine._run_sleep_replay("n1"), {})
            # a genuinely new night replays again
            self.assertGreater((await self.engine._run_sleep_replay("n2")).get("replay", 0), 0)
        asyncio.run(scenario())

    def test_rem_stabilizes_by_extracting_semantics(self):
        """REM: structure is extracted into long-term memory, once per night."""
        async def scenario():
            self.engine.companion.set_settings({"cog_sleep_replay": 1, "cog_memory_encode": 1})
            self.engine.apply_cognition_settings()
            turn = self._turn()
            self.engine._cognition_arbitrate("你好", turn, "", {})
            self.engine._last_control["confidence"] = 0.1
            for _ in range(3):
                self.engine._cognition_settle("s1", turn, "今天天气很好去公园散步", "", 0.0, 0.0)
            self._enter_sleep(hours_in=6.5)   # REM half
            self.assertEqual(self.engine._sleep_phase(), "rem")

            first = await self.engine._run_sleep_replay("n1")
            self.assertEqual(first.get("phase"), "rem")
            self.assertGreater(first.get("stabilized", 0), 0)
            semantics = [i for i in self.engine.memory.page_facts(scope="*", limit=100)["items"]
                         if i.get("memory_type") == "semantic"]
            self.assertTrue(semantics)
            self.assertGreaterEqual(semantics[0].get("cluster_size", 0), 3)
            # once per night
            self.assertEqual(await self.engine._run_sleep_replay("n1"), {})
        asyncio.run(scenario())

    def test_cls_interleave_defaults_on_and_ablates(self):
        """CLS interleaving defaults on (it is how replay becomes structural
        learning) and can be switched off on its own."""
        self.assertTrue(self.engine._cls_interleave)
        self.assertTrue(self.engine.cognition.config.use_interleaved_replay)
        self.assertTrue(self.engine.cognition.config.use_consistency_gating)
        self.engine.companion.set_settings({"cog_cls_interleave": 0})
        self.engine.apply_cognition_settings()
        self.assertFalse(self.engine.cognition.config.use_interleaved_replay)
        self.assertFalse(self.engine.cognition.config.use_consistency_gating)

    def test_cls_interleaves_replay_into_online_learning(self):
        """McClelland 1995: replay must be interleaved, not a nightly batch."""
        self.engine.companion.set_settings({"cog_cls_interleave": 1})
        self.engine.apply_cognition_settings()
        model = self.engine.cognition.model
        model.engrams.clear()
        turn = self._turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._cognition_settle("s1", turn, "回答", "", 0.0, 0.0)
        self.assertTrue(model.engrams, "no engram was encoded")
        result = model.learn(0, 0, 0, reward=1.0)
        self.assertGreaterEqual(int(result.get("interleaved", 0)), 1)
        # and it is ablatable on its own
        model.config.use_interleaved_replay = False
        self.assertEqual(int(model.learn(0, 0, 0, reward=1.0).get("interleaved", 0)), 0)

    def test_consistency_gates_the_neocortical_rate(self):
        """Kumaran 2016: consistent -> fast neocortical, surprising -> slow."""
        self.engine.companion.set_settings({"cog_cls_interleave": 1})
        self.engine.apply_cognition_settings()
        model = self.engine.cognition.model
        self.assertGreater(model._consistency_rate(0.0), model._consistency_rate(5.0))
        model.config.use_consistency_gating = False
        self.assertEqual(model._consistency_rate(0.0), model._consistency_rate(5.0))

    def test_goal_biases_replay_priority(self):
        """Kumaran 2016: goal-dependent weighting of experience statistics."""
        model = self.engine.cognition.model
        self._drive_turns(2)
        engram = model.engrams[0] if model.engrams else None
        self.assertIsNotNone(engram)
        plain = model.replay_priority(engram)
        biased = model.replay_priority(engram, goal_states={int(engram.cue)})
        self.assertAlmostEqual(biased, plain * model.config.goal_replay_bias, places=6)

    def test_reconsolidation_revisits_stored_traces(self):
        self.engine.companion.set_settings({"cog_memory_encode": 1, "cog_memory_reconsolidate": 1})
        self.engine.apply_cognition_settings()
        turn = self._turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._last_control["confidence"] = 0.1
        self.engine._cognition_settle("s1", turn, "当时以为很好的答复", "", 0.0, 0.0)
        before = self.engine.memory.page_facts(scope="*")["items"][0]
        report = self.engine._reconsolidate_episodes(reward=1.0)
        self.assertEqual(report["count"], 1)
        self.assertEqual(sum(report["branches"].values()), 1)
        # the branch must be one of the three documented outcomes
        self.assertTrue(set(report["branches"]) <= {"strengthen", "update", "recreate"},
                        report["branches"])
        after = {i["id"]: i for i in self.engine.memory.page_facts(scope="*")["items"]}
        self.assertIn(before["id"], after)
        # a perfect day (reward 1.0) against a trace stored at the same value
        # can only strengthen it
        self.assertEqual(report["branches"].get("strengthen"), 1)

    def test_lability_window_gates_reconsolidation(self):
        """Nader & Hardt 2009: only a reactivated trace can be re-written."""
        memory = self.engine.memory
        trace = memory.remember_episode("一件被推翻的旧事", prediction_error=2.0, strength=1.0)
        self.assertIsNotNone(trace)
        # never retrieved -> not writable
        self.assertFalse(memory.lability_of(trace.id)["labile"])
        self.assertEqual(memory.reconsolidate(trace.id, 1.0)["branch"], "not_reactivated")
        # retrieval opens the window
        memory.reactivate(trace.id)
        self.assertTrue(memory.lability_of(trace.id)["labile"])
        self.assertIn(memory.reconsolidate(trace.id, 1.0)["branch"],
                      {"strengthen", "update", "recreate"})
        # ...and it closes again: a stale reactivation is no longer labile
        memory._find_memory(trace.id).metadata["last_reactivated"] = (
            datetime.now() - timedelta(hours=48)).isoformat()
        self.assertFalse(memory.lability_of(trace.id)["labile"])
        self.assertEqual(memory.reconsolidate(trace.id, 1.0)["branch"], "expired")

    def test_reconsolidation_is_skipped_when_off(self):
        self.assertEqual(self.engine._reconsolidate_episodes(reward=1.0) or {}, {})
        self.engine.companion.set_settings({"cog_memory_reconsolidate": 1})
        self.engine.apply_cognition_settings()
        self.assertEqual(self.engine._reconsolidate_episodes(reward=1.0), {})


if __name__ == "__main__":
    unittest.main()
