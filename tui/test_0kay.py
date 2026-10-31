import importlib.util
import unittest
from pathlib import Path

MODULE = Path(__file__).resolve().parent / "0kay.py"
spec = importlib.util.spec_from_file_location("okay_tui", MODULE)
tui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tui)


class Bar(unittest.TestCase):
    def test_a_full_bar_reads_one_hundred(self):
        self.assertTrue(tui.bar(100).endswith("100%"))
        self.assertEqual(tui.bar(100).count("░"), 0)

    def test_an_empty_bar_reads_zero(self):
        self.assertTrue(tui.bar(0).endswith("  0%"))
        self.assertEqual(tui.bar(0).count("█"), 0)

    def test_a_missing_value_is_not_zero(self):
        self.assertIn("--", tui.bar(None))
        self.assertNotIn("0%", tui.bar(None))

    def test_out_of_range_values_are_clamped(self):
        self.assertIn("100%", tui.bar(140))
        self.assertIn("0%", tui.bar(-20))

    def test_width_is_constant_so_columns_line_up(self):
        widths = {len(tui.bar(value).split(" ")[0]) for value in (0, 13, 50, 99, 100)}
        self.assertEqual(widths, {tui.BAR_WIDTH})


class Clip(unittest.TestCase):
    def test_short_text_is_untouched(self):
        self.assertEqual(tui.clip("hello", 10), "hello")

    def test_newlines_collapse(self):
        self.assertEqual(tui.clip("a\n b", 10), "a b")

    def test_long_text_is_marked_as_cut(self):
        out = tui.clip("x" * 50, 10)
        self.assertEqual(len(out), 10)
        self.assertTrue(out.endswith("…"))


class Plugins(unittest.TestCase):
    def test_rows_show_phase_and_beat(self):
        text = tui.format_plugins([
            {"name": "life", "lifecycle": "healthy", "heartbeat_age_seconds": 2.4, "uptime_seconds": 3700},
            {"name": "agent", "lifecycle": "failed", "heartbeat_age_seconds": 95.0},
        ])
        self.assertIn("life", text)
        self.assertIn("healthy", text)
        self.assertIn("2.4s", text)
        self.assertIn("1h01m", text)
        self.assertIn("failed", text)
        self.assertIn("PLUGIN", text)

    def test_plugins_that_need_attention_sort_to_the_top(self):
        text = tui.format_plugins([
            {"name": "alive", "lifecycle": "healthy", "heartbeat_age_seconds": 1},
            {"name": "broken", "lifecycle": "failed"},
        ])
        lines = [line for line in text.splitlines() if line.startswith(("broken", "alive"))]
        self.assertTrue(lines[0].startswith("broken"))

    def test_an_empty_list_says_so(self):
        self.assertIn("No plugins", tui.format_plugins([]))


class Tasks(unittest.TestCase):
    def test_progress_shows_for_a_running_task(self):
        text = tui.format_tasks([
            {"task_id": "abcdef012345", "state": "running", "progress": 62, "phase": "editing", "note": "rewriting"},
        ])
        self.assertIn("abcdef0…", text)
        self.assertIn("62%", text)
        self.assertIn("editing", text)

    def test_a_finished_task_reads_full(self):
        text = tui.format_tasks([{"task_id": "done-1", "state": "completed"}])
        self.assertIn("100%", text)

    def test_a_failed_task_shows_the_error(self):
        text = tui.format_tasks([{"task_id": "bad-1", "state": "failed", "error": "model refused"}])
        self.assertIn("model refused", text)

    def test_the_limit_is_respected(self):
        rows = [{"task_id": f"t{i}", "state": "completed"} for i in range(30)]
        text = tui.format_tasks(rows, limit=5)
        self.assertEqual(len([line for line in text.splitlines() if line.startswith("t")]), 5)


class Usage(unittest.TestCase):
    def test_todays_numbers_and_per_model_shares(self):
        text = tui.format_usage({
            "by_day": {"2026-10-31": {"prompt": 1000, "completion": 500, "total": 1500, "count": 7}},
            "by_model": {"deepseek": {"prompt": 900, "completion": 400, "total": 1300, "count": 6}},
            "total_tokens": 42,
            "request_count": 9,
            "cache_hit_ratio": 0.5,
        }, today="2026-10-31")
        self.assertIn("Today (2026-10-31)", text)
        self.assertIn("prompt 1,000", text)
        self.assertIn("1500", text.replace(",", ""))
        self.assertIn("deepseek", text)
        self.assertIn("cache 50.0%", text)

    def test_a_day_without_traffic_says_so(self):
        text = tui.format_usage({"by_day": {}}, today="2026-10-31")
        self.assertIn("no requests", text)

    def test_an_empty_payload_does_not_crash(self):
        self.assertIn("Today", tui.format_usage({}, today="2026-10-31"))


class Phase(unittest.TestCase):
    def test_a_current_core_reports_the_lifecycle(self):
        self.assertEqual(tui.phase_of({"lifecycle": "degraded"}), "degraded")

    def test_an_older_core_reports_a_readable_status(self):
        self.assertEqual(tui.phase_of({"status": "PLUGIN_STATUS_HEALTHY"}), "healthy")
        self.assertEqual(tui.phase_of({"status": "PLUGIN_STATUS_UNHEALTHY"}), "failed")
        self.assertEqual(tui.phase_of({"status": "PLUGIN_STATUS_DISABLED"}), "stopped")

    def test_an_unknown_value_is_passed_through_without_the_prefix(self):
        self.assertEqual(tui.phase_of({"status": "PLUGIN_STATUS_SOMETHING"}), "something")
        self.assertEqual(tui.phase_of({}), "unknown")


if __name__ == "__main__":
    unittest.main()


class Descriptor(unittest.TestCase):
    def test_identity_contributions_and_pages(self):
        text = tui.format_descriptor({
            "id": "life", "name": "life", "version": "0.1.2", "kind": "service",
            "lifecycle": "healthy", "capabilities": ["persona", "chat"],
            "permissions": {"api_requires": ["GET /api/files"], "egress": ["*"]},
            "health": {"degraded_after_seconds": 10, "stale_after_seconds": 60},
            "surfaces": [{"id": "companion", "module": "/api/plugins/life/ui/companion.js"}],
        })
        self.assertIn("life  0.1.2  service", text)
        self.assertIn("[healthy]", text)
        self.assertIn("persona, chat", text)
        self.assertIn("GET /api/files", text)
        self.assertIn("degraded after 10s, stale after 60s", text)
        self.assertIn("companion.js", text)

    def test_a_bare_descriptor_does_not_crash(self):
        text = tui.format_descriptor({"id": "ghost"})
        self.assertIn("ghost", text)
        self.assertIn("[unknown]", text)
