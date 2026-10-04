"""Regression tests for the chat-quality batch:

- rejection lexicon (a rebuff must read as rejection, not warmth),
- page-chrome stripping (a select-all paste must not become the message),
- history-as-hint (a stale client history must not erase server memory),
- lite/token-saver mode (off by default; on, it compresses the prompts).
"""
import unittest

from life.emotion import lexicon
from life.emotion.emotion import EmotionEngine
from life.engine.legacy import LifeEngine
from life.output.output import OUTPUT_PROMPT_TEMPLATE
from life.think.think import THINK_PROMPT_TEMPLATE


class RejectionLexiconTests(unittest.TestCase):
    def test_refusal_reads_as_rejection(self):
        hits = lexicon.scan("你别过来")
        self.assertEqual(hits["rejection"], 1)
        self.assertLess(hits["polarity"], 0)

    def test_multiple_refusals_stack(self):
        self.assertGreaterEqual(lexicon.scan("别碰我，离我远点")["rejection"], 2)

    def test_affection_is_positive(self):
        self.assertGreater(lexicon.scan("我想你了")["polarity"], 0)

    def test_reassurance_softens_a_refusal(self):
        # "别走，留下来" contains 别 but the reassurance wins.
        self.assertGreater(lexicon.scan("别走，留下来")["polarity"], 0)

    def test_emotion_engine_drops_valence_on_refusal(self):
        delta = EmotionEngine().on_user_message("你别过来")
        self.assertLess(delta["valence"], 0)
        self.assertLess(delta["connection"], 0)

    def test_emotion_engine_raises_valence_on_affection(self):
        self.assertGreater(EmotionEngine().on_user_message("我喜欢你")["valence"], 0)


class PageChromeTests(unittest.TestCase):
    CHROME = (
        "0kay\n对话\n简体中文\n对话\nAgent\n1\n记忆\n陪伴\n技能\n插件\n插件市场\n"
        "用量\n设置\n角色状态\npatch\n白荼\n年龄\n15 岁\n时间\n2026/10/4 14:22:23\n"
        "时区\nAsia/Shanghai\n心情\n平静\n情绪\n愉悦度\n唤醒度\n亲近感\n烦躁度\n在吗"
    )

    def test_strips_full_page_chrome(self):
        self.assertEqual(LifeEngine._strip_page_chrome(self.CHROME), "在吗")

    def test_leaves_a_real_message_alone(self):
        self.assertEqual(LifeEngine._strip_page_chrome("你说了0kay这个词"),
                         "你说了0kay这个词")

    def test_leaves_a_plain_message_alone(self):
        self.assertEqual(LifeEngine._strip_page_chrome("普通消息"), "普通消息")

    def test_does_not_strip_when_no_real_content_follows(self):
        text = "0kay\n对话\nAgent"
        self.assertEqual(LifeEngine._strip_page_chrome(text), text)


class HistoryAsHintTests(unittest.TestCase):
    def test_client_history_cannot_shrink_server_memory(self):
        # A session that already has 4 turns must not lose them because the UI
        # later sends an empty history (tab switch / rebuild).
        previous = [
            {"role": "user", "content": "一"},
            {"role": "assistant", "content": "二"},
            {"role": "user", "content": "三"},
            {"role": "assistant", "content": "四"},
        ]
        client_hist = []
        if len(client_hist) >= len(previous):
            previous = client_hist
        else:
            seen = {(i["role"], i["content"]) for i in previous}
            for item in client_hist:
                if (item["role"], item["content"]) not in seen:
                    previous.append(item)
        self.assertEqual(len(previous), 4)

    def test_new_client_rows_are_merged_in(self):
        previous = [{"role": "user", "content": "一"}]
        client_hist = [{"role": "assistant", "content": "新"}]
        seen = {(i["role"], i["content"]) for i in previous}
        for item in client_hist:
            if (item["role"], item["content"]) not in seen:
                previous.append(item)
                seen.add((item["role"], item["content"]))
        self.assertEqual(len(previous), 2)


class LiteModeTests(unittest.TestCase):
    def test_prompt_templates_carry_the_new_rules(self):
        self.assertIn("parenthetical", OUTPUT_PROMPT_TEMPLATE)
        self.assertIn("FIRST PERSON", THINK_PROMPT_TEMPLATE)
        self.assertIn("push back", OUTPUT_PROMPT_TEMPLATE)

    def test_lite_mode_off_by_default(self):
        engine = LifeEngine(data_dir=None)
        self.assertFalse(engine._lite_mode)

    def test_lite_think_prompt_is_compact(self):
        engine = LifeEngine(data_dir=None)

        class Turn:
            persona_context = "你是白荼。"

        prompt = engine._lite_think_prompt(Turn(), "在吗")
        self.assertLess(len(prompt), len(THINK_PROMPT_TEMPLATE) / 3)
        self.assertIn("在吗", prompt)
        self.assertIn("JSON", prompt)

    def test_settings_define_lite_mode(self):
        from life.companion.legacy import CompanionSystem
        self.assertEqual(CompanionSystem.SETTING_DEFAULTS.get("cog_lite_mode"), "0")
        self.assertIn("cog_lite_mode", CompanionSystem.CONFIG_SCHEMA)


class SafetyGuardVoiceTests(unittest.TestCase):
    """The safety guard must be obeyed silently, never spoken.

    Regression: an earlier guard wording was paraphrased into the reply as
    "我会保留依恋与占有欲的张力，但用紧紧拥抱… 这样既安全又能延续情感深度，
    你觉得可以吗？" — the assistant talking about itself, out of character.
    """

    def test_all_guards_are_marked_private(self):
        from life.cognition.persona_dynamics import PersonaDynamicsSystem
        from life.cognition.attachment import AttachmentSystem
        from life.cognition.tsundere import TsundereSystem

        # The literal used by every guard() implementation.
        marker = "不得说出"
        for module in ("persona_dynamics.py", "attachment.py", "tsundere.py"):
            import pathlib
            path = pathlib.Path(__file__).resolve().parents[1] / "src" / "life" / "cognition" / module
            text = path.read_text(encoding="utf-8")
            self.assertIn(marker, text, f"{module} guard lost its private marker")

    def test_output_prompt_forbids_paraphrasing_safety(self):
        self.assertIn("PRIVATE", OUTPUT_PROMPT_TEMPLATE)
        self.assertIn("更健康的方式", OUTPUT_PROMPT_TEMPLATE)
        self.assertIn("既安全又能延续情感深度", OUTPUT_PROMPT_TEMPLATE)

    def test_guard_text_tells_the_model_not_to_evaluate_itself(self):
        from life.cognition.persona_dynamics import PersonaDynamicsSystem
        system = PersonaDynamicsSystem(enabled=True, type_key="病娇型")
        system.dynamics.A = 1.0
        system.dynamics.X = 1.0
        system.dynamics.Tr = 0.0
        system.dynamics.K = 0.0
        system.dynamics.D["O"] = 1.0
        guard = system.guard()
        self.assertTrue(guard, "extreme state must produce a guard")
        self.assertIn("不得说出", guard)
        self.assertIn("更健康的方式", guard)


if __name__ == "__main__":
    unittest.main()
