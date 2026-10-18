"""Resilience tests for persisted emotion state and the state-file loader.

Both were single points of failure with no self-heal path:
  - `_load_state` only caught FileNotFoundError, and it is called unguarded from
    LifeEngine.__init__, so one truncated byte in state.json propagated through
    serve() and the kernel refused to start.
  - `EmotionState.from_dict` did no coercion, so a string or None on the dataclass
    made every later emotion operation raise TypeError.
"""

import json
import tempfile
import unittest
from pathlib import Path

from life.emotion.emotion import EmotionState


class EmotionStateFromDict(unittest.TestCase):
    def test_round_trip(self):
        state = EmotionState(valence=-0.4, arousal=0.8, connection=0.2, irritation=0.6)
        again = EmotionState.from_dict(json.loads(json.dumps(state.to_dict())))
        self.assertAlmostEqual(again.valence, -0.4)
        self.assertAlmostEqual(again.arousal, 0.8)
        self.assertAlmostEqual(again.connection, 0.2)
        self.assertAlmostEqual(again.irritation, 0.6)

    def test_missing_keys_take_the_documented_neutral(self):
        state = EmotionState.from_dict({})
        self.assertEqual(state.valence, 0.0)
        self.assertEqual(state.arousal, 0.5)
        self.assertEqual(state.connection, 0.5)
        self.assertEqual(state.irritation, 0.0)

    def test_strings_are_coerced(self):
        # A hand-edited state file. Before the coercion this installed "0.4" and
        # then every decay() raised TypeError: can't multiply sequence by non-int.
        state = EmotionState.from_dict(
            {"valence": "0.4", "arousal": "0.7", "connection": None, "irritation": "x"})
        self.assertAlmostEqual(state.valence, 0.4)
        self.assertAlmostEqual(state.arousal, 0.7)
        self.assertAlmostEqual(state.connection, 0.5)
        self.assertAlmostEqual(state.irritation, 0.0)
        # The whole point: the object is usable afterwards.
        state.decay(60)
        state.apply_delta({"valence": 0.1, "arousal": 0.05})

    def test_out_of_range_values_are_clamped(self):
        state = EmotionState.from_dict(
            {"valence": 9.0, "arousal": -4.0, "connection": 7.0, "irritation": 99.0})
        self.assertEqual(state.valence, 1.0)
        self.assertEqual(state.arousal, 0.0)
        self.assertEqual(state.connection, 1.0)
        self.assertEqual(state.irritation, 1.0)

    def test_nan_falls_back_to_default(self):
        state = EmotionState.from_dict({"valence": float("nan")})
        self.assertEqual(state.valence, 0.0)
        state.decay(1)


class EmotionDecay(unittest.TestCase):
    def test_axes_return_toward_their_neutral_not_toward_zero(self):
        # arousal and connection have neutral 0.5. Pure multiplicative decay
        # pinned them at 0.0 after an idle gap, so the character woke permanently
        # drowsy and disconnected and never came back to baseline.
        state = EmotionState(valence=0.0, arousal=0.5, connection=0.5, irritation=0.0)
        state.decay(6 * 3600)
        self.assertAlmostEqual(state.arousal, 0.5, places=3)
        self.assertAlmostEqual(state.connection, 0.5, places=3)

    def test_extreme_values_converge_to_neutral(self):
        state = EmotionState(valence=0.8, arousal=1.0, connection=1.0, irritation=0.9)
        state.decay(6 * 3600)
        self.assertLess(state.arousal, 1.0)
        self.assertGreater(state.arousal, 0.0)
        self.assertGreater(state.connection, 0.0)
        self.assertLess(state.connection, 1.0)
        self.assertLess(abs(state.valence), 0.8)
        self.assertLess(abs(state.irritation), 0.9)

    def test_rate_clamp_prevents_sign_flip(self):
        state = EmotionState(valence=-0.5)
        state.decay(10 ** 9)
        self.assertGreaterEqual(state.valence, -1.0)
        self.assertLessEqual(state.valence, 0.0)

    def test_zero_and_negative_intervals_are_no_ops(self):
        state = EmotionState(valence=0.5, arousal=0.5, connection=0.5, irritation=0.5)
        before = state.to_dict()
        state.decay(0)
        state.decay(-100)
        self.assertEqual(state.to_dict(), before)


class ApplyDelta(unittest.TestCase):
    def test_explicit_none_does_not_raise(self):
        state = EmotionState()
        state.apply_delta({"valence": None, "arousal": None})
        self.assertEqual(state.valence, 0.0)
        self.assertEqual(state.arousal, 0.5)

    def test_out_of_range_delta_is_clamped(self):
        state = EmotionState()
        state.apply_delta({"valence": 5.0, "arousal": -5.0, "connection": 5.0, "irritation": -5.0})
        self.assertEqual(state.valence, 1.0)
        self.assertEqual(state.arousal, 0.0)
        self.assertEqual(state.connection, 1.0)
        self.assertEqual(state.irritation, 0.0)

    def test_garbage_delta_is_ignored(self):
        state = EmotionState(valence=0.2)
        state.apply_delta({"valence": "abc"})
        self.assertAlmostEqual(state.valence, 0.2)


class StateFileRecovery(unittest.TestCase):
    """The loader must survive every way state.json can be wrong."""

    def _engine(self, state_text):
        from life.engine import legacy

        engine = legacy.LifeEngine.__new__(legacy.LifeEngine)
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        engine._state_path = Path(tmp.name) / "state.json"
        engine._state_path.write_text(state_text, encoding="utf-8")
        return engine

    def _engine_bytes(self, raw: bytes):
        from life.engine import legacy

        engine = legacy.LifeEngine.__new__(legacy.LifeEngine)
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        engine._state_path = Path(tmp.name) / "state.json"
        engine._state_path.write_bytes(raw)
        return engine

    def test_truncated_json_does_not_raise(self):
        engine = self._engine('{"emotion": {"valence": 0.1')
        engine._load_state()  # used to raise JSONDecodeError out of __init__

    def test_json_null_does_not_raise(self):
        engine = self._engine("null")
        engine._load_state()  # parsed fine, then failed on `"emotion" in data`

    def test_json_array_does_not_raise(self):
        engine = self._engine("[1, 2, 3]")
        engine._load_state()

    def test_empty_file_does_not_raise(self):
        engine = self._engine("")
        engine._load_state()

    def test_missing_file_does_not_raise(self):
        from life.engine import legacy

        engine = legacy.LifeEngine.__new__(legacy.LifeEngine)
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        engine._state_path = Path(tmp.name) / "absent.json"
        engine._load_state()

    def test_non_utf8_bytes_do_not_raise(self):
        # Written as BYTES on purpose. The previous version wrote
        # "\x00\x01\x02 not utf-8 either" with encoding="utf-8", which is valid
        # UTF-8 and therefore never exercised the decode failure — while the
        # loader caught only OSError and UnicodeDecodeError is a ValueError.
        engine = self._engine_bytes(b'{"emotion": "\xff\xfe\x00"}')
        engine._load_state()

    def test_non_dict_emotion_block_is_ignored(self):
        # A hand-mangled `"emotion": "nonsense"` used to reach from_dict and then
        # `.get()` on a str, raising AttributeError. Reaching the subsystem code
        # after that point requires stubbing most of LifeEngine, which is what
        # pushed an earlier version of this test to assert on inspect.getsource
        # instead — which passed if the guard string appeared in a comment.
        engine = self._engine(json.dumps({"emotion": "nonsense"}))
        engine.emotion = _StubEmotion()
        engine.circadian = _FakeCircadian()
        engine.soul = _FakeSoul()
        engine.affect = None
        engine._load_state()
        # Survived, and left the default state untouched rather than installing
        # the garbage value.
        self.assertAlmostEqual(engine.emotion.state.valence, 0.0)
        self.assertAlmostEqual(engine.emotion.state.arousal, 0.5)


class _FakeCircadian:
    def restore(self, _data):
        return None


class _FakeSoul:
    def load(self, _data):
        return None


class _StubEmotion:
    def __init__(self):
        self.state = EmotionState()


if __name__ == "__main__":
    unittest.main()