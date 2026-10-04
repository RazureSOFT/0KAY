"""Tests for the *extended* persona-dynamics framework.

The base suite (``test_persona_dynamics.py``) pins the research port: 14-D θ,
9-D D, 6-D x, 18 archetypes and three emergent modes.  This suite pins the
extension:

* θ grouped into 12 families (Big5 / HEXACO / ... / Expr) with 60+ parameters;
* a 16-D desire vector and a 16-D emotion vector;
* 40+ behaviours over four layers, with the clinical layer never selectable;
* 150+ type regions defined as *data rows*, plus derivations
  (Big5 / HEXACO / MBTI / DISC / type probabilities);
* the gender / social-script group G and its formula hooks;
* the learning / development operator L (theta drift + tabular Q);
* the clinical-simulation gate: abstract labels only, never rendered, never
  deployed.

Every claim below is a property of the *data table* rather than of new control
flow, which is the spec's "类型 = θ 空间中的区域" rule.
"""
from __future__ import annotations

import tempfile
import unittest

from life.cognition.persona_dynamics import (
    ACTION_LAYERS, ALL_ACTIONS, BIG5_DIMS, CLINICAL_ACTION_KEYS, CLINICAL_KEYS,
    CLINICAL_TYPE_KEYS, DEPLOYABLE_KEYS, DES16, DESIRE_GROUPS, EMO16,
    EMOTION_GROUPS, EXT_DEFAULTS, GENDER_KEYS, GENDER_SCRIPTS, HEXACO_DIMS,
    SELECTABLE_KEYS, THETA_DIM, THETA_GROUPS, TYPE_COUNT, TYPE_ROWS,
    PersonaDynamics, PersonaDynamicsSystem, big5_labels, derive_big5,
    derive_disc, derive_hexaco, derive_mbti, families, gender_for_persona,
    is_deployable, type_probabilities,
)
from life.engine import LifeEngine


class ExtendedDimensions(unittest.TestCase):
    def test_theta_has_twelve_families_and_sixty_plus_params(self):
        self.assertEqual(len(THETA_GROUPS), 12)
        self.assertGreaterEqual(THETA_DIM, 60)
        for group in ("Big5", "HEXACO", "Attach", "Temp", "Reg", "Dark",
                      "Mot", "Cog", "Rel", "Val", "Clin", "Expr"):
            self.assertIn(group, THETA_GROUPS)

    def test_desire_vector_is_sixteen_dimensional(self):
        self.assertEqual(len(DES16), 16)
        self.assertEqual(len(set(DES16)), 16)
        # every desire belongs to exactly one group
        grouped = [k for ks in DESIRE_GROUPS.values() for k in ks]
        self.assertEqual(set(grouped), set(DES16))

    def test_emotion_vector_is_sixteen_dimensional(self):
        self.assertEqual(len(EMO16), 16)
        self.assertEqual(len(set(EMO16)), 16)
        grouped = [k for ks in EMOTION_GROUPS.values() for k in ks]
        self.assertEqual(set(grouped), set(EMO16))

    def test_the_state_carries_the_full_vectors(self):
        d = PersonaDynamics("傲娇型")
        d.step()
        self.assertTrue(set(DES16) <= set(d.D))
        self.assertTrue(set(EMO16) <= set(d.x))

    def test_extension_desires_stay_bounded_under_drive(self):
        d = PersonaDynamics("混沌/疯狂型")
        for _ in range(1500):
            d.step(s_pulse=2.0)
        for k in DES16:
            self.assertGreaterEqual(d.D[k], 0.0, k)
            self.assertLessEqual(d.D[k], 1.0, k)
        for k in EMO16:
            self.assertGreaterEqual(d.x[k], 0.0, k)
            self.assertLessEqual(d.x[k], 1.0, k)


class ExtendedBehaviours(unittest.TestCase):
    def test_more_than_forty_behaviours(self):
        self.assertGreaterEqual(len(ALL_ACTIONS), 40)

    def test_four_layers_are_populated(self):
        for layer in ("safe", "risky", "unsafe", "clinical"):
            self.assertTrue(ACTION_LAYERS[layer], layer)

    def test_clinical_actions_are_never_selectable(self):
        for key in CLINICAL_ACTION_KEYS:
            self.assertNotIn(key, SELECTABLE_KEYS)
        self.assertEqual(set(CLINICAL_ACTION_KEYS), set(ACTION_LAYERS["clinical"]))

    def test_clinical_labels_carry_no_concrete_content(self):
        by_key = {a.key: a for a in ALL_ACTIONS}
        for key in CLINICAL_ACTION_KEYS:
            a = by_key[key]
            self.assertEqual(a.safety, "clinical")
            self.assertEqual(a.phi, {})
            self.assertIn("抽象标签", a.zh)

    def test_decision_never_returns_a_clinical_action(self):
        d = PersonaDynamics("边缘")
        for _ in range(200):
            d.step(s_pulse=1.5)
            a = d.choose_action()
            if a is not None:
                self.assertNotIn(a.key, CLINICAL_ACTION_KEYS)


class ExtendedTypeLibrary(unittest.TestCase):
    def test_library_reaches_one_hundred_and_fifty(self):
        self.assertGreaterEqual(TYPE_COUNT, 150)

    def test_all_expected_families_exist(self):
        fams = families()
        for f in ("attachment", "clinical", "enneagram", "disc", "social",
                  "motivation", "cognitive", "acg", "male_acg"):
            self.assertIn(f, fams, f)

    def test_clinical_rows_are_not_deployable(self):
        self.assertEqual(len(CLINICAL_TYPE_KEYS), 16)
        for key in CLINICAL_TYPE_KEYS:
            self.assertFalse(is_deployable(key), key)
        for key in DEPLOYABLE_KEYS:
            self.assertTrue(is_deployable(key), key)

    def test_every_deployable_row_runs_bounded(self):
        """The whole library must be safe to integrate, not just a sample."""
        for key in DEPLOYABLE_KEYS:
            d = PersonaDynamics(key)
            for _ in range(25):
                d.step(s_pulse=0.5)
            for v in d.D.values():
                self.assertGreaterEqual(v, 0.0, key)
                self.assertLessEqual(v, 1.0, key)
            for v in d.x.values():
                self.assertGreaterEqual(v, 0.0, key)
                self.assertLessEqual(v, 1.0, key)

    def test_rows_are_data_not_code(self):
        """A row is a plain parameter record; nothing executable in it."""
        for row in TYPE_ROWS.values():
            self.assertIsInstance(row.theta, dict)
            self.assertTrue(all(isinstance(v, (int, float))
                                for v in row.theta.values()))
            self.assertNotIn("lambda", row.label)

    def test_a_new_type_can_be_added_without_touching_the_engine(self):
        """The spec's "generate any new type": name + θ/D/x/w/g/T/A."""
        from life.cognition.persona_dynamics import TypeRow, _row
        row = _row("测试新类型", "测试新类型", "acg",
                   theta=dict(R=.9, K0=.3, 攻击=.7),
                   desire=dict(权力=.8), g=1.2)
        self.assertEqual(row.key, "测试新类型")
        self.assertEqual(row.theta["R"], 0.9)
        self.assertEqual(row.g, 1.2)


class TypeDerivations(unittest.TestCase):
    def test_big5_reads_out_all_five(self):
        d = PersonaDynamics("暖男")
        b = derive_big5(d._effective_traits())
        self.assertEqual(set(b), set(BIG5_DIMS))
        for v in b.values():
            self.assertGreaterEqual(v, 0.0)
            self.assertLessEqual(v, 1.0)

    def test_hexaco_reads_out_all_six(self):
        d = PersonaDynamics("暖男")
        h = derive_hexaco(d._effective_traits())
        self.assertEqual(set(h), set(HEXACO_DIMS))

    def test_mbti_matches_the_sign_rule(self):
        """MBTI = (sgn(R-.5), sgn(O-.5), sgn(C-.5), sgn(K-.5))."""
        d = PersonaDynamics("霸总")
        tr = d._effective_traits()
        mbti = derive_mbti(tr)
        self.assertEqual(len(mbti), 4)
        ext = getattr(tr, "ext", {})
        self.assertEqual(mbti[0], "E" if tr.R >= 0.5 else "I")
        self.assertEqual(mbti[1], "N" if ext.get("o_open", 0.5) >= 0.5 else "S")
        self.assertEqual(mbti[2], "F" if tr.C >= 0.5 else "T")
        self.assertEqual(mbti[3], "J" if tr.K0 >= 0.5 else "P")

    def test_disc_is_one_of_four(self):
        for key in ("霸总", "暖男", "御姐", "理工男"):
            d = PersonaDynamics(key)
            self.assertIn(derive_disc(d._effective_traits()),
                          ("D 支配", "I 影响", "S 稳健", "C 谨慎"))

    def test_probabilities_rank_the_own_region_near_the_top(self):
        """A region should score highly for itself.

        Near-duplicate regions (焦虑型 / 焦虑男, 硬汉 / 硬汉男) legitimately
        trade places, so the claim is "top-3", not "exactly first" - which is
        itself the point of a soft read-out over a continuous space.
        """
        for key in ("霸总", "硬汉", "舔狗", "御姐", "焦虑型"):
            d = PersonaDynamics(key)
            probs = type_probabilities(d._effective_traits(), top=3)
            self.assertTrue(probs)
            self.assertIn(key, [k for k, _ in probs], f"{key} -> {probs}")

    def test_probabilities_exclude_clinical_rows(self):
        d = PersonaDynamics("霸总")
        keys = [k for k, _ in type_probabilities(d._effective_traits(), top=40)]
        self.assertFalse(set(keys) & set(CLINICAL_TYPE_KEYS))


class GenderScripts(unittest.TestCase):
    def test_presets_exist_and_identity_is_a_noop(self):
        for key in ("未指定", "男性脚本", "女性脚本", "高传统男性", "低传统男性",
                    "高传统女性", "女性主义", "中性"):
            self.assertIn(key, GENDER_KEYS, key)
        g = GENDER_SCRIPTS["未指定"]
        self.assertEqual(g.expr_penalty(), 0.0)
        self.assertEqual(g.threat_term(), 0.0)
        self.assertEqual(g.k_drag(), 0.0)
        self.assertEqual(g.c_drag(), 0.0)
        self.assertEqual(g.utility_bonus("help"), 0.0)

    def test_identity_script_leaves_the_research_values_untouched(self):
        """With no script, expression must equal the base port's value."""
        plain = PersonaDynamics("傲娇型", gender_key="未指定")
        base = PersonaDynamics("傲娇型")
        for _ in range(15):
            plain.step(s_pulse=0.3)
            base.step(s_pulse=0.3)
        self.assertAlmostEqual(plain.E, base.E, places=9)

    def test_high_traditional_male_suppresses_expression(self):
        hi = PersonaDynamics("硬汉")
        lo = PersonaDynamics("暖男")
        for _ in range(30):
            hi.step(s_pulse=0.3)
            lo.step(s_pulse=0.3)
        self.assertLess(hi.E, lo.E)

    def test_help_seeking_falls_with_the_male_script(self):
        g_m = GENDER_SCRIPTS["高传统男性"]
        g_f = GENDER_SCRIPTS["低传统男性"]
        self.assertLess(g_m.help_seek(0.6, 0.7), g_f.help_seek(0.6, 0.7))

    def test_row_implies_a_script_when_the_caller_is_silent(self):
        self.assertEqual(PersonaDynamics("霸总").gender_key, "高传统男性")
        self.assertEqual(PersonaDynamics("御姐").gender_key, "女性脚本")
        self.assertEqual(PersonaDynamics("正常/安全型").gender_key, "未指定")

    def test_an_explicit_script_beats_the_row_default(self):
        d = PersonaDynamics("霸总", gender_key="女性主义")
        self.assertEqual(d.gender_key, "女性主义")

    def test_persona_keywords_pick_a_script(self):
        self.assertEqual(gender_for_persona("大男子主义的硬汉"), "高传统男性")
        self.assertEqual(gender_for_persona("温柔顾家的暖男"), "低传统男性")
        self.assertEqual(gender_for_persona("一位普通的图书管理员"), "")

    def test_script_bends_the_threat_signal(self):
        """γ_G·GRC raises the perceived threat for a high-conflict script."""
        hi = PersonaDynamics("硬汉")
        none = PersonaDynamics("正常/安全型", gender_key="未指定")
        self.assertGreater(hi.gender.threat_term(),
                           none.gender.threat_term())


class LearningOperator(unittest.TestCase):
    def test_q_learning_updates_the_table(self):
        d = PersonaDynamics("傲娇型")
        d.choose_action()
        before = d.q_value(d._state_key(), "intimate")
        d.learn(0.9)
        self.assertNotEqual(d.q_value(d._state_key(), "intimate"), before)

    def test_theta_drifts_toward_what_paid_off(self):
        d = PersonaDynamics("焦虑型")
        d.choose_action()
        d.learn(0.8)
        self.assertTrue(d.theta_drift)

    def test_negative_reward_drifts_the_other_way(self):
        d = PersonaDynamics("焦虑型")
        d.choose_action()
        act = d._last_action
        d.learn(-0.8)
        self.assertLessEqual(d.q_value(d._state_key(), act), 0.0)

    def test_learning_can_be_turned_off(self):
        d = PersonaDynamics("傲娇型")
        d.learning = False
        d.choose_action()
        d.learn(1.0)
        self.assertEqual(d.q, {})

    def test_q_survives_a_round_trip(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="焦虑型")
        s.dynamics.choose_action()
        s.dynamics.learn(0.7)
        blob = s.to_dict()
        restored = PersonaDynamicsSystem.from_dict(blob)
        self.assertEqual(restored.dynamics.q, s.dynamics.q)
        self.assertEqual(restored.dynamics.theta_drift, s.dynamics.theta_drift)


class ClinicalGate(unittest.TestCase):
    def test_clinical_context_is_empty_by_default(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="边缘")
        self.assertEqual(s.clinical_context(), {})

    def test_clinical_context_appears_only_under_sim(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="边缘")
        s.configure(clinical_sim=True)
        ctx = s.clinical_context()
        self.assertEqual(set(ctx), set(CLINICAL_KEYS))
        for v in ctx.values():
            self.assertGreaterEqual(v, 0.0)
            self.assertLessEqual(v, 1.0)

    def test_a_clinical_type_is_not_deployable(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="边缘")
        self.assertFalse(s.deployable())
        s.configure(type_key="傲娇型")
        self.assertTrue(s.deployable())

    def test_clinical_survives_a_round_trip(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="边缘")
        s.configure(clinical_sim=True)
        blob = s.to_dict()
        self.assertTrue(blob["clinical_sim"])
        self.assertEqual(blob["type"], "边缘")
        restored = PersonaDynamicsSystem.from_dict(blob)
        self.assertTrue(restored.clinical_sim)
        self.assertEqual(set(restored.clinical_context()), set(CLINICAL_KEYS))

    def test_a_clinical_label_never_reaches_the_prompt(self):
        """The prompt is built from deployable fields only."""
        s = PersonaDynamicsSystem(enabled=True, type_key="边缘")
        s.configure(clinical_sim=True)
        ctx = s.context()
        self.assertIn("prompt", ctx)
        for key in CLINICAL_KEYS:
            self.assertNotIn(key, ctx["prompt"])


class ExtendedReadout(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()

    def tearDown(self):
        self.directory.cleanup()

    def test_context_exposes_the_extended_fields(self):
        self.engine._enable_personadyn_from_persona("霸总、说一不二")
        st = self.engine.cognition_status()["personadyn"]
        for key in ("desires", "emotions", "desire_groups", "big5", "hexaco",
                    "mbti", "disc", "theta_groups", "theta_dim", "help_seek",
                    "learning", "family", "gender", "clinical"):
            self.assertIn(key, st, key)
        self.assertEqual(st["theta_dim"], THETA_DIM)
        self.assertEqual(set(st["desires"]), set(DES16))
        self.assertEqual(set(st["emotions"]), set(EMO16))

    def test_a_male_archetype_wires_the_script_through(self):
        self.engine._enable_personadyn_from_persona("霸总、说一不二")
        st = self.engine.cognition_status()["personadyn"]
        self.assertEqual(st["gender"], "高传统男性")
        self.assertEqual(st["type"], "霸总")

    def test_gender_round_trips_through_the_settings_surface(self):
        """A script chosen via persona_apply must survive a restart."""
        self.engine.persona_apply({
            "text": "霸总、说一不二",
            "personadyn": {"type": "霸总", "gender": "女性主义"},
        })
        self.assertEqual(self.engine.personadyn.dynamics.gender_key, "女性主义")
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertEqual(reopened.personadyn.dynamics.gender_key, "女性主义")

    def test_a_row_implied_script_survives_a_restart(self):
        self.engine._enable_personadyn_from_persona("霸总、说一不二")
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertEqual(reopened.personadyn.dynamics.gender_key, "高传统男性")

    def test_persona_analysis_reports_the_gender_block(self):
        import asyncio
        info = asyncio.run(self.engine.persona_analyze("霸总、说一不二"))
        self.assertIn("personadyn", info)
        self.assertEqual(info["personadyn"]["type"], "霸总")
        self.assertEqual(info["personadyn"]["gender"], "高传统男性")

    def test_learning_survives_a_restart(self):
        self.engine._enable_personadyn_from_persona("焦虑型、患得患失")
        self.engine.personadyn.dynamics.choose_action()
        self.engine.personadyn.learn_from_outcome(warmth=0.7)
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertTrue(reopened.personadyn.dynamics.q)


if __name__ == "__main__":
    unittest.main()
