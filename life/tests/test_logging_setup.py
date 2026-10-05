"""`setup_logging` must be safe to call twice and must force UTF-8 console output.

A launcher that discards stdio relies on the rotating file handler being the
only durable log, so a second initialisation with a different data dir must move
the file target rather than keep writing to the first one.  The console
reconfigure is what keeps non-ASCII text readable under a non-UTF-8 locale.
"""
import logging
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.logging_setup import setup_logging  # noqa: E402


class SetupLoggingTests(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self._logger = logging.getLogger("life")
        self._saved = list(self._logger.handlers)
        for handler in list(self._logger.handlers):
            self._logger.removeHandler(handler)

    def tearDown(self):
        for handler in list(self._logger.handlers):
            self._logger.removeHandler(handler)
            try:
                handler.close()
            except Exception:
                pass
        for handler in self._saved:
            self._logger.addHandler(handler)
        self._dir.cleanup()

    def _flush(self, logger):
        for handler in logger.handlers:
            try:
                handler.flush()
            except Exception:
                pass

    def test_second_call_with_a_new_dir_switches_the_file(self):
        first = os.path.join(self._dir.name, "a")
        second = os.path.join(self._dir.name, "b")
        logger = setup_logging(first)
        logger.info("first message")
        self._flush(logger)

        same = setup_logging(second)
        self.assertIs(same, logger)
        logger.info("second message")
        self._flush(logger)

        self.assertTrue(os.path.exists(os.path.join(first, "life.log")))
        self.assertTrue(os.path.exists(os.path.join(second, "life.log")))
        with open(os.path.join(second, "life.log"), encoding="utf-8") as handle:
            self.assertIn("second message", handle.read())
        with open(os.path.join(first, "life.log"), encoding="utf-8") as handle:
            self.assertNotIn("second message", handle.read())

    def test_repeated_call_with_the_same_dir_does_not_duplicate_handlers(self):
        data_dir = os.path.join(self._dir.name, "same")
        first = setup_logging(data_dir)
        before = len(first.handlers)
        second = setup_logging(data_dir)
        self.assertEqual(len(second.handlers), before)

    def test_non_utf8_console_is_reconfigured(self):
        calls: list[dict] = []

        class FakeStream:
            def reconfigure(self, **kwargs):
                calls.append(kwargs)

        saved_out, saved_err = sys.stdout, sys.stderr
        sys.stdout = FakeStream()
        sys.stderr = FakeStream()
        try:
            setup_logging(os.path.join(self._dir.name, "locale"))
        finally:
            sys.stdout, sys.stderr = saved_out, saved_err
        self.assertTrue(calls)
        self.assertTrue(all(call.get("encoding") == "utf-8" for call in calls))


if __name__ == "__main__":
    unittest.main()
