"""The interactive client: layout, key handling and the conversation.

State lives in one object and rendering is a pure function of it, so a repaint
after a resize cannot leave half an old screen behind. Network work happens on
worker threads that only ever push events into a queue; the drawing loop owns
the terminal.
"""

from __future__ import annotations

import os
import queue
import socket
import threading
import time
from dataclasses import dataclass, field

from . import commands as command_table
from . import markdown
from . import session as session_view
from . import state as state_file
from .ansi import PLAIN, display_width, truncate, wrap
from .canvas import Frame
from .widgets import (
    BANNER_VARIANTS, banner_rows, box, context_bar, human_rate, human_tokens,
    spinner,
)

VERSION = "0.1.2"
PROMPT_GLYPH = "❯"
FOLD_GLYPH = "▶"
MORE_GLYPH = "↓"
NEWLINE = chr(10)
MAX_INPUT_ROWS = 6
REASON_ROWS = 6
# Thinking effort as a circle that fills up, the way Claude Code shows it:
# the level is legible at a glance without reading a word.
EFFORT_GLYPHS = {"off": "○", "low": "○", "medium": "◐",
                 "high": "●", "max": "◉"}
# Five stops, not a continuum: the value only ever lands on one of these.
EFFORT_STEPS = ("off", "low", "medium", "high", "max")
EFFORT_VALUES = {"off": 0, "low": 20, "medium": 50, "high": 75, "max": 100}
# Frames for the change animation. A turning half circle reads as "working",
# and the settled glyph is the level itself.
EFFORT_SPIN = ("◐", "◓", "◑", "◒")
EFFORT_OVERDRIVE = ("◉", "◎", "✺", "✹", "❂", "✷")
EFFORT_ANIM_SECONDS = 0.45
EFFORT_OVERDRIVE_SECONDS = 1.1
# Frames per second of the flourish. The draw loop ticks at about 12fps, so
# this is fast enough that consecutive redraws land on different frames.
EFFORT_FPS = 24
# What the max level says about itself, one line per frame.
OVERDRIVE_LINES = ("this is not a drill", "brains to eleven", "no thoughts only think",
                   "reasoning at unreasonable speed")

KEYMAP_HINT = ("? help · ↑↓ history · tab complete · shift+enter newline · "
               "ctrl+c interrupt · ctrl+d quit")


@dataclass
class Entry:
    kind: str                 # user | assistant | system | error | tool
    text: str = ""
    meta: dict = field(default_factory=dict)
    # (theme name, width, text length) -> rendered rows. Only assistant entries
    # use it: markdown is the expensive one and it only ever grows.
    cache: tuple = field(default_factory=tuple)


@dataclass
class Panel:
    title: str
    lines: list[str]
    offset: int = 0
    loading: bool = False
    # A panel can be a list of choices: the cursor walks `choices`, and Enter
    # hands the value back to `action` ("model" for now).
    choices: list[str] = field(default_factory=list)
    cursor: int = 0
    first_choice_row: int = 0
    action: str = ""
    # -1 means "not a slider". Anything else is the value a slider is sitting
    # on; the body is drawn from it instead of from `lines`.
    slider: int = -1

    @property
    def selecting(self) -> bool:
        return bool(self.choices) and self.action != ""


class App:
    def __init__(self, client, theme, terminal, reader, renderer,
                 model: str = "", formatters=None, show_logo: bool = True,
                 workdir: str = "", continue_last: bool = False):
        self.client = client
        self.theme = theme
        self.terminal = terminal
        self.reader = reader
        self.renderer = renderer
        self.model = model
        # Where the agent should work. When the flag was not given, the agent
        # that ends up running the turn reports its own directory and that is
        # used instead -- a remote host has different paths than this one.
        self.workdir = workdir
        self.workdir_explicit = bool(workdir)
        self.continue_last = continue_last
        # "" means "let the gateway choose"; otherwise a plugin id.
        self.executor = ""
        self.agents: list[dict] = []
        self.formatters = formatters

        self.buffer: list[str] = []
        self.cursor = 0
        self.history: list[str] = []
        self.history_index = 0
        self.scroll = 0
        self.palette_index = 0
        self.entries: list[Entry] = []
        # Agent session: the server keeps the conversation, this keeps a map of
        # its task rows and re-derives the transcript from them.
        self.session_id = ""
        self.task_rows: dict[str, dict] = {}
        self.notices: list[Entry] = []
        self.pending: list[str] = []
        self._view_dirty = False
        self._watching = False
        self.task_cursor = ""
        self._session_lock = threading.Lock()
        # "" leaves the choice to the gateway; "normal" asks before sensitive
        # tools, "full_access" does not ask at all.
        self.intensity = ""
        # Restored from the state file below; full access sticks because having
        # to re-arm it every launch is how people end up leaving it off.
        self.permission = "normal"
        self.approvals: list[dict] = []
        self.questions: list[dict] = []
        # id of the question the next Enter answers
        self.answering = ""
        # settings browser: which section's fields are on screen, and a pending
        # text edit (the prompt becomes an input while it is set)
        self.settings_section = ""
        self.settings_fields: dict[str, dict] = {}
        self.setting_key = ""
        self.manual: dict = {}
        # ids already announced, so a blocked turn says so once, not per poll
        self.notified: set[str] = set()
        self._polling = False
        # Effort change animation: set while a flourish is playing.
        self.anim_started = 0.0
        self.anim_until = 0.0
        self.anim_level = ""
        # The task this client is waiting on. Busy is cleared by *this* turn
        # finishing, never by the absence of somebody else's.
        self.turn_task = ""
        self.panel: Panel | None = None
        self.show_logo = show_logo

        self.busy = False
        self.activity = ""
        self.started_at = 0.0
        self.output_tokens = 0
        self.prompt_tokens = 0
        self.context_used = 0
        self.context_window = 0
        # "default" means Core guessed the window rather than reading it from
        # the provider; the status line marks that with a leading "~".
        self.context_source = ""
        self.streamed = 0
        # When the first byte of the answer arrived: the rate is measured over
        # the streaming window, not over the whole turn including the pause
        # before the model starts.
        self.first_chunk_at = 0.0
        self._transcript_total = 0
        # @path completion: one directory listing per prefix, fetched lazily.
        self._listings: dict[str, list[dict]] = {}
        self._listing_roots: dict[str, str] = {}
        self._listing_pending: set[str] = set()
        self._panel_hint = ""

        self.queue: queue.Queue = queue.Queue()
        # Bumped on every turn and on every cancel. Events carry the token they
        # were produced under, so a closed stream cannot push its own
        # "connection reset" into the next conversation as an error row.
        self.stream_token = 0
        self.running = True
        self.dirty = True
        self.tick = 0
        self.online: bool | None = None
        # Set OKAY_TUI_KEYS=1 to see what each key press actually arrived as.
        self.debug_keys = bool(os.environ.get("OKAY_TUI_KEYS"))
        self.last_key = ""

    # -- lifecycle ---------------------------------------------------------
    def restore(self) -> None:
        """Re-apply what the last session was running with."""
        remembered = str(state_file.load().get("permission") or "")
        if remembered == "full_access":
            self.permission = "full_access"
            self.notice("starting with full access · tools will not ask", "warn")
            self._sync_view()

    def run(self) -> int:
        self.restore()
        if self.continue_last:
            remembered = state_file.last_session()
            if remembered:
                self._resume(remembered)
        self._probe()
        self._start_pending_poll()
        while self.running:
            for key in self.reader.read(0.08):
                self._handle_key(key)
                self.dirty = True
            self._drain()
            if self.busy or self.animating():
                self.tick += 1
                self.dirty = True
            if self.dirty:
                self._draw()
                self.dirty = False
        return 0

    # -- network -----------------------------------------------------------
    def _probe(self) -> None:
        def work():
            try:
                self.client.get("/health")
                self.online = True
                self._load_agents()
                self._load_context()
            except Exception:  # noqa: BLE001 - the banner reports it
                self.online = False
            self.queue.put(("probe", None, None))
        threading.Thread(target=work, daemon=True).start()

    def _load_context(self) -> None:
        """Learn the context ceiling, which only one endpoint reports.

        /api/models carries a context_window field that the provider store
        never fills in, so the bar would otherwise read "ctx --" forever. The
        used count still comes from the provider's own usage report: it is the
        number the model was actually billed for.
        """
        try:
            payload = self.client.context(self.session_id or "tui", self.model)
        except Exception:  # noqa: BLE001 - unknown ceiling keeps the bar honest
            return
        breakdown = payload.get("breakdown") or {}
        used = breakdown.get("used") or payload.get("tokens")
        if used:
            self.context_used = int(used)
        window = payload.get("window") or 0
        if window:
            self.context_window = int(window)
            breakdown = payload.get("breakdown") or {}
            self.context_source = str(
                breakdown.get("window_source") or payload.get("window_source") or "")
            if not self.model:
                self.model = str(payload.get("model_id") or self.model or "")

    def _drain(self) -> None:
        # The rebuild has to happen even on the empty path, so it lives in
        # `finally`: `return` inside the loop would otherwise skip it, and the
        # transcript would only catch up on the next keypress.
        try:
            while True:
                try:
                    kind, payload, token = self.queue.get_nowait()
                except queue.Empty:
                    return
                if token is not None and token != self.stream_token:
                    continue
                self.dirty = True
                if kind == "tasks":
                    self._apply_tasks(payload)
                elif kind == "session":
                    self.session_id = str(payload)
                    state_file.save(last_session=self.session_id)
                    self._view_dirty = True
                    threading.Thread(target=self._load_context, daemon=True).start()
                elif kind == "error":
                    self.busy = False
                    self.activity = ""
                    self.notice(str(payload), "error")
                elif kind == "panel":
                    self.panel = self._panel_from(payload)
                elif kind == "pending":
                    self._apply_pending(*payload)
                elif kind == "turn":
                    self.turn_task = str(payload)
                elif kind == "saved":
                    section, note = payload
                    self.notice(note)
                    if self.settings_section:
                        self._open_settings(self.settings_section)
                elif kind == "resumed":
                    self._apply_resumed(*payload)
                elif kind == "resolved":
                    self._drop_pending(str(payload))
                elif kind == "toast":
                    self.notice(str(payload))
                elif kind == "model-choices":
                    hint, entries, matches = payload
                    self._open_model_picker(entries, matches, hint)
                elif kind == "panel_error":
                    self.panel = None
                    self.notice(str(payload), "error")
                elif kind == "probe":
                    pass
                elif kind == "model":
                    chosen, note = payload
                    self.model = chosen
                    self.context_window = 0
                    self.context_source = ""
                    self.notice(note)
                    threading.Thread(target=self._load_context, daemon=True).start()
                elif kind == "listing":
                    directory, result = payload
                    self._listings[directory] = list(result.get("entries") or [])
                    self._listing_roots[directory] = str(result.get("path") or directory)
                    self._listing_pending.discard(directory)
        finally:
            self._sync_view()

    # -- the session view --------------------------------------------------
    def notice(self, text: str, kind: str = "system", meta: dict | None = None) -> None:
        """A line that belongs to the client, not to the conversation."""
        self.notices.append(Entry(kind, text, dict(meta or {})))
        self._view_dirty = True

    def _apply_tasks(self, delta: dict) -> None:
        if not self.session_id:
            return                      # nothing of ours can be in there yet
        self.task_rows = session_view.merge(self.task_rows, delta, self.session_id)
        self._view_dirty = True
        row = self.task_rows.get(self.turn_task) if self.turn_task else None
        state = str((row or {}).get("state") or "")
        if state in session_view.FINISHED:
            self._end_turn()
        elif row is not None or session_view.busy(self.task_rows):
            self.busy = True
        elif self.busy and self.started_at and time.monotonic() - self.started_at > 20:
            # The row never showed up: the task was rejected upstream, and
            # waiting for a state change that will not come is worse than
            # saying so.
            self.notice("no task for this turn · the gateway did not accept it")
            self._end_turn()
        self._sync_view()

    def _end_turn(self) -> None:
        if not self.busy:
            return
        self.busy = False
        self.activity = ""
        self.first_chunk_at = 0.0
        self.streamed = 0
        # The ceiling and the occupancy are per session, and the lookup is an
        # HTTP call: keep it off the drawing thread.
        threading.Thread(target=self._load_context, daemon=True).start()

    def _answer_target(self) -> dict | None:
        """The question the next Enter should answer, if any."""
        if not self.questions:
            return None
        if self.answering:
            for item in self.questions:
                if str(item.get("id")) == self.answering:
                    return item
        return self.questions[0]

    def _apply_pending(self, approvals: list, questions: list) -> None:
        """Remember what is waiting and say so once per item.

        A blocked agent is invisible otherwise: the transcript just stops, so
        every new item gets exactly one line pointing at the command that
        resolves it.
        """
        fresh = [item for item in approvals
                 if item.get("id") and item.get("id") not in self.notified]
        new_questions = [item for item in questions
                         if item.get("id") and item.get("id") not in self.notified]
        for item in fresh:
            self.notified.add(str(item.get("id")))
            tool = item.get("tool") or "tool"
            self.notice(f"approval waiting · {tool} · /approvals to allow or deny",
                        "warn", {"pending_id": str(item.get("id"))})
        for item in new_questions:
            ident = str(item.get("id") or "")
            self.notified.add(ident)
            prompt = " ".join(str(item.get("question") or "").split())[:60]
            self.notice(f"question waiting · {prompt} · /questions", "warn",
                        {"pending_id": ident})
        self.approvals = list(approvals)
        self.questions = list(questions)
        # A pending question is answered by typing, so the prompt needs to know
        # which one it is talking to.
        self.answering = str(questions[0].get("id") or "") if questions else ""
        # A blocked agent deserves the keyboard: open the dialog immediately,
        # unless the user is halfway through a prompt or already reading one.
        if (fresh or new_questions) and not self.buffer and self.panel is None:
            if self.approvals:
                self._open_approvals()
            elif self.questions:
                self._open_questions()
        # Rebuild here rather than relying on the caller: a state change that
        # leaves the screen stale is a bug waiting for the next keypress.
        self._sync_view()

    def _drop_pending(self, ident: str) -> None:
        """Forget an item the user just resolved, and keep the list honest."""
        self.approvals = [item for item in self.approvals
                          if str(item.get("id")) != ident]
        self.questions = [item for item in self.questions
                          if str(item.get("id")) != ident]
        self.notified.discard(ident)
        # The line said "waiting"; it is not waiting any more.
        self.notices = [entry for entry in self.notices
                        if entry.meta.get("pending_id") != ident]
        if self.panel is not None and self.panel.action == "approval":
            if self.approvals:
                self._open_approvals()
            else:
                self.panel = None
        self._sync_view()

    def _sync_view(self) -> None:
        """Rebuild the screen entries from the session rows.

        The server owns the conversation; keeping a client-side copy would
        drift on every reconnect. Prompts that the server has not echoed yet
        are appended so the user sees their own message immediately.
        """
        self._view_dirty = False
        lines = session_view.transcript(self.task_rows.values())
        entries = [Entry(line["kind"], line["text"], line["meta"]) for line in lines]
        seen = [entry.text for entry in entries if entry.kind == "user"]
        unmatched: list[str] = []
        for prompt in self.pending:
            if prompt in seen:
                seen.remove(prompt)
            else:
                unmatched.append(prompt)
        self.pending = unmatched
        for prompt in unmatched:
            entries.append(Entry("user", prompt))
        self.entries = entries + list(self.notices)
        # The rate is measured over the text that is actually on screen.
        self.streamed = sum(len(entry.text) for entry in entries
                            if entry.kind == "assistant")
        if self.streamed and not self.first_chunk_at and self.busy:
            self.first_chunk_at = time.monotonic()

    # -- keys --------------------------------------------------------------
    def _handle_key(self, key: str) -> None:
        if key == "resize":
            return
        if self.debug_keys:
            self.last_key = key
        if key == "ctrl+d":
            self.running = False
            return
        if key == "ctrl+l":
            self.renderer.invalidate()
            return
        if self.panel is not None:
            self._handle_panel_key(key)
            return
        if key == "ctrl+c":
            if self.busy:
                self.stream_token += 1
                running = session_view.running_turn(self.task_rows)
                if running:
                    threading.Thread(target=self._cancel_turn,
                                     args=(running,), daemon=True).start()
                self.busy = False
                self.activity = ""
                self.notice("interrupted")
            elif self.buffer:
                self._clear_input()
            else:
                self.running = False
            return
        if key == "ctrl+p":
            self._open_help()
            return
        if key in ("up", "down") and self._palette_open():
            items = self._palette_items()
            if items:
                step = -1 if key == "up" else 1
                self.palette_index = (self.palette_index + step) % len(items)
            return
        if key == "tab":
            self._complete()
            return
        if key == "enter":
            self._submit()
            return
        if key in ("shift+enter", "alt+enter", "ctrl+j"):
            # A newline in the draft, not a submit: Enter alone still sends.
            self.buffer.insert(self.cursor, NEWLINE)
            self.cursor += 1
            self.palette_index = 0
            return
        if key == "esc":
            if self.manual:
                self.manual = {}
                self.notice("cancelled · nothing was saved")
                self._sync_view()
                return
            if not self.buffer and self._answer_target() is not None:
                self.answering = ""
                self.notice("left the question pending · /questions to come back")
                self._sync_view()
                return
            if self.buffer:
                self._clear_input()
            return
        if key == "up":
            self._history(-1)
            return
        if key == "down":
            self._history(1)
            return
        if key == "left":
            self.cursor = max(0, self.cursor - 1)
            return
        if key == "right":
            self.cursor = min(len(self.buffer), self.cursor + 1)
            return
        if key in ("home", "ctrl+a"):
            self.cursor = 0
            return
        if key in ("end", "ctrl+e"):
            self.cursor = len(self.buffer)
            return
        if key == "bs":
            if self.cursor:
                del self.buffer[self.cursor - 1]
                self.cursor -= 1
                self.palette_index = 0
            return
        if key == "del":
            if self.cursor < len(self.buffer):
                del self.buffer[self.cursor]
            return
        if key == "ctrl+u":
            del self.buffer[: self.cursor]
            self.cursor = 0
            return
        if key == "ctrl+k":
            del self.buffer[self.cursor:]
            return
        if key == "ctrl+w":
            while self.cursor and self.buffer[self.cursor - 1] == " ":
                del self.buffer[self.cursor - 1]
                self.cursor -= 1
            while self.cursor and self.buffer[self.cursor - 1] != " ":
                del self.buffer[self.cursor - 1]
                self.cursor -= 1
            return
        if key == "pgup":
            self.scroll += 5
            return
        if key == "pgdn":
            self.scroll = max(0, self.scroll - 5)
            return
        if len(key) == 1 and key.isprintable():
            self.buffer.insert(self.cursor, key)
            self.cursor += 1
            self.palette_index = 0

    def _handle_panel_key(self, key: str) -> None:
        panel = self.panel
        if key in ("esc", "q", "ctrl+c"):
            self.panel = None
            return
        if panel.slider >= 0:
            self._slide_intensity(key)
            return
        if panel.action == "question" and panel.choices:
            if key.isdigit():
                options = self._question_options()
                index = int(key) - 1
                if 0 <= index < len(options) and self.questions:
                    self._send_answer(self.questions[0], options[index])
                return
            if key == "enter":
                # Hand the keyboard to the prompt, which is already showing the
                # question: typing there is the fastest path for free text.
                self.panel = None
                self._panel_hint = ""
                return
            if len(key) == 1 and key.isprintable():
                # Starting to type closes the dialog and feeds the prompt: the
                # answer should not need a mode switch first.
                self.panel = None
                self._panel_hint = ""
                self.buffer.append(key)
                self.cursor = len(self.buffer)
                return
        if key in ("d", "n", "y", "a", "A") and panel.action == "approval" and panel.choices:
            index = max(0, min(panel.cursor, len(panel.choices) - 1))
            ident = panel.choices[index]
            if key in ("a", "A"):
                # One key for the impatient: everything waiting is approved.
                # Shift-A also stops this tool from asking again.
                if key == "A":
                    self._remember_tool(ident)
                self._decide(ident, True, bulk=True)
                return
            self._decide(ident, key == "y")
            return
        if key == "enter":
            self._choose_panel_row()
            return
        if key in ("up", "k"):
            self._move_panel(-1)
            return
        if key in ("down", "j"):
            self._move_panel(1)
            return
        if key == "pgup":
            panel.offset = max(0, panel.offset - 10)
            return
        if key == "pgdn":
            panel.offset += 10
            return
        if key == "home":
            panel.cursor = 0
            panel.offset = 0
            return
        if key == "end":
            if panel.selecting:
                panel.cursor = len(panel.choices) - 1
                panel.offset = max(0, panel.first_choice_row + panel.cursor - 4)
            else:
                panel.offset = max(0, len(panel.lines) - 5)

    def _slide_intensity(self, key: str) -> None:
        """Move between the five stops.

        Left and right jump a whole level rather than nudging a number: the
        models only have levels, and a continuum invites a choice that does not
        exist. Each jump plays the animation so the change is felt.
        """
        panel = self.panel
        if panel is None:
            return
        index = self._step_index(panel.slider)
        if key in ("left", "h", "pgdn", "["):
            index -= 1
        elif key in ("right", "l", "pgup", "]"):
            index += 1
        elif key == "home":
            index = 0
        elif key == "end":
            index = len(EFFORT_STEPS) - 1
        elif key == "enter":
            self._apply_intensity(panel.slider)
            return
        else:
            return
        index = max(0, min(index, len(EFFORT_STEPS) - 1))
        value = EFFORT_VALUES[EFFORT_STEPS[index]]
        if value != panel.slider:
            panel.slider = value
            self._start_effort_animation(EFFORT_STEPS[index])

    @staticmethod
    def _step_index(value: int) -> int:
        """The stop nearest to `value`, so the knob always sits on one."""
        best = 0
        for index, level in enumerate(EFFORT_STEPS):
            if abs(EFFORT_VALUES[level] - value) < abs(EFFORT_VALUES[EFFORT_STEPS[best]] - value):
                best = index
        return best

    def _start_effort_animation(self, level: str) -> None:
        """Begin the flourish that plays when the level changes."""
        self.anim_started = time.monotonic()
        self.anim_level = level
        self.anim_until = self.anim_started + (
            EFFORT_OVERDRIVE_SECONDS if level == "max" else EFFORT_ANIM_SECONDS)

    def animating(self) -> bool:
        return time.monotonic() < getattr(self, "anim_until", 0.0)

    def effort_frame(self) -> str:
        """The glyph to draw right now: settled, spinning, or overdriving."""
        level = self.anim_level or self._intensity_level(self._intensity_value())
        if not self.animating():
            return EFFORT_GLYPHS.get(level, "◐")
        frame = self.effort_tick()
        if level == "max":
            return EFFORT_OVERDRIVE[frame % len(EFFORT_OVERDRIVE)]
        return EFFORT_SPIN[frame % len(EFFORT_SPIN)]

    def effort_tick(self) -> int:
        """Which frame of the flourish we are on."""
        if not self.animating():
            return 0
        return int((time.monotonic() - self.anim_started) * EFFORT_FPS)

    def _apply_intensity(self, value: int) -> None:
        level = EFFORT_STEPS[self._step_index(int(value))]
        self.intensity = level
        self._start_effort_animation(level)
        self.notice(f"effort → {EFFORT_GLYPHS[level]} {level} · {self._intensity_hint(level)}",
                    "warn" if level == "max" else "system")
        self.panel = None
        self._sync_view()

    @staticmethod
    def _intensity_hint(level: str) -> str:
        return {
            "off": "no reasoning, fastest",
            "low": "a little reasoning",
            "medium": "the balanced default",
            "high": "more reasoning before answering",
            "max": "the most reasoning the model allows",
        }.get(level, "")

    @staticmethod
    def _effort_glyph(value: int) -> str:
        return EFFORT_GLYPHS[App._intensity_level(value)]

    @staticmethod
    def _intensity_level(value: int) -> str:
        """The word the web UI would show for this position."""
        if value <= 0:
            return "off"
        if value < 35:
            return "low"
        if value < 62.5:
            return "medium"
        if value < 87.5:
            return "high"
        return "max"

    def _move_panel(self, step: int) -> None:
        panel = self.panel
        if panel is None:
            return
        if not panel.selecting:
            panel.offset = max(0, panel.offset + step)
            return
        panel.cursor = max(0, min(panel.cursor + step, len(panel.choices) - 1))
        self._reveal_panel_row()

    def _reveal_panel_row(self) -> None:
        """Keep the selected row on screen."""
        panel = self.panel
        if panel is None or not panel.selecting:
            return
        row = panel.first_choice_row + panel.cursor
        rows = self._panel_rows()
        if row < panel.offset:
            panel.offset = row
        elif row >= panel.offset + rows:
            panel.offset = row - rows + 1

    def _panel_rows(self) -> int:
        _, height = self.terminal.size()
        body_top = 2
        status_row = height - (1 if height >= 16 else 0) - 3 - 1
        return max(1, status_row - body_top - 2)

    def _choose_panel_row(self) -> None:
        panel = self.panel
        if panel is None:
            return
        if not panel.selecting:
            self.panel = None
            return
        choice = panel.choices[max(0, min(panel.cursor, len(panel.choices) - 1))]
        action = panel.action
        self.panel = None
        if action == "model":
            self._switch_model(choice, exact=True)
        elif action == "section":
            self._open_settings(choice)
        elif action == "field":
            self._edit_field(choice)
        elif action == "setting":
            key = self.setting_key
            self._save_setting(self.settings_section, key, choice, f"{key} → {choice}")
        elif action == "section":
            self._open_settings(str(choice))
        elif action == "field":
            self._edit_field(str(choice))
        elif action == "setting":
            key = self.setting_key
            self._save_setting(self.settings_section, key, choice, f"{key} → {choice}")
        elif action == "session":
            self._resume(choice)
        elif action == "agent":
            self._choose_agent(self._agent_row(choice) if choice else None)
        elif action == "permission":
            self._set_permission(choice)
        elif action == "intensity":
            self.intensity = choice
            self.notice("thinking effort → " + choice)
            self._sync_view()
        elif action == "approval":
            self._decide(choice, True)

    # -- input -------------------------------------------------------------
    def _clear_input(self) -> None:
        self.buffer = []
        self.cursor = 0
        self.palette_index = 0

    def _history(self, step: int) -> None:
        if not self.history:
            return
        self.history_index = max(0, min(len(self.history), self.history_index + step))
        if self.history_index == len(self.history):
            self.buffer = []
        else:
            self.buffer = list(self.history[self.history_index])
        self.cursor = len(self.buffer)

    # -- completion --------------------------------------------------------
    def _palette_text(self) -> str:
        return "".join(self.buffer)

    def _command_word(self) -> str | None:
        """The bare command word, if the draft is nothing but one."""
        text = self._palette_text()
        if not text.startswith("/") or " " in text or "\n" in text:
            return None
        return text

    def _at_token(self) -> tuple[int, str] | None:
        """Start index and text of the `@path` under the cursor, if any."""
        text = self._palette_text()
        cut = text.rfind("@", 0, self.cursor)
        if cut < 0:
            return None
        if cut > 0 and not text[cut - 1].isspace():
            return None                      # an e-mail address, not a mention
        fragment = text[cut + 1:self.cursor]
        if any(ch.isspace() for ch in fragment):
            return None
        return cut, fragment

    def _palette_open(self) -> bool:
        if self._command_word() is not None:
            return True
        if self._at_token() is not None:
            self._ensure_listing()
            return True
        return False

    def _palette_items(self):
        """Rows the palette shows: commands for `/`, paths for `@`."""
        word = self._command_word()
        if word is not None:
            rows = []
            for command in command_table.matching(word):
                description = command.description
                if command.argument:
                    description = f"{command.argument} — {description}"
                rows.append(command_table.Suggestion(
                    name="/" + command.name,
                    description=description,
                    value="/" + command.name,
                    argument=command.argument,
                ))
            return rows

        token = self._at_token()
        if token is None:
            return []
        cut, fragment = token
        directory, _, prefix = fragment.rpartition("/")
        lowered = prefix.lower()
        hits = [entry for entry in self._listing(directory)
                if entry["name"].lower().startswith(lowered)]
        hits.sort(key=lambda entry: (not entry.get("dir"), entry["name"].lower()))
        return [command_table.Suggestion(
            name=entry["name"] + ("/" if entry.get("dir") else ""),
            description="directory" if entry.get("dir") else "",
            value=entry["name"],
            kind="file",
        ) for entry in hits[:200]]

    def _ensure_listing(self) -> None:
        """Ask for the directory behind the current `@` fragment, once."""
        token = self._at_token()
        if token is None:
            return
        _, fragment = token
        directory = fragment.rpartition("/")[0]
        if directory in self._listings or directory in self._listing_pending:
            return
        self._listing_pending.add(directory)

        def work():
            try:
                result = self.client.tree(directory)
            except Exception:  # noqa: BLE001 - an empty list is a fine failure
                result = {"path": directory, "entries": []}
            self.queue.put(("listing", (directory, result), None))

        threading.Thread(target=work, daemon=True).start()

    def _listing(self, directory: str) -> list[dict]:
        return self._listings.get(directory, [])

    def _palette_choice(self, text: str):
        """The entry the palette is pointing at, for a bare command word."""
        if " " in text or not text.startswith("/"):
            return None
        items = command_table.matching(text)
        if not items:
            return None
        exact = command_table.resolve(text)
        if exact is not None:
            return exact
        return items[max(0, min(self.palette_index, len(items) - 1))]

    def _complete(self) -> None:
        items = self._palette_items()
        if not items:
            return
        choice = items[max(0, min(self.palette_index, len(items) - 1))]
        if self._command_word() is not None:
            self.buffer = list(choice.value + (" " if choice.argument else ""))
            self.cursor = len(self.buffer)
            self.palette_index = 0
            return
        token = self._at_token()
        if token is None:
            return
        cut, fragment = token
        directory = fragment.rpartition("/")[0]
        head = self._palette_text()[:cut + 1]
        tail = self._palette_text()[self.cursor:]
        insert = (directory + "/" if directory else "") + choice.value
        self.buffer = list(head + insert + tail)
        self.cursor = len(head) + len(insert)
        self.palette_index = 0

    def _submit(self) -> None:
        text = "".join(self.buffer).strip()
        if not text:
            return
        if self.manual and not text.startswith("/"):
            setting = self.manual
            self._clear_input()
            self.manual = {}
            raw: object = text
            kind = str((self.settings_fields.get(setting["key"]) or {}).get("type") or "text")
            if kind == "number":
                try:
                    raw = float(text) if "." in text else int(text)
                except ValueError:
                    self.notice(f"{setting['key']} needs a number")
                    self._sync_view()
                    return
            self._save_setting(setting["section"], setting["key"], raw,
                               f"{setting['key']} → {text[:40]}")
            return
        target = self._answer_target() if not text.startswith("/") else None
        if target is not None:
            # The agent is blocked on a question: what was typed is the answer,
            # not a new prompt. The placeholder said so before the first key.
            self._clear_input()
            self._send_answer(target, text)
            return
        if text.startswith("/"):
            chosen = self._palette_choice(text)
            self.history.append(text)
            self.history_index = len(self.history)
            if chosen is not None and chosen.argument and " " not in text:
                # The command is highlighted but still needs an argument:
                # complete it rather than run it and print a usage line.
                self.buffer = list("/" + chosen.name + " ")
                self.cursor = len(self.buffer)
                self.palette_index = 0
                return
            self._clear_input()
            self._run_command("/" + chosen.name if chosen and " " not in text else text)
            return
        if self.busy:
            # Swallowing the key would look like a dead prompt; say why once.
            if not (self.notices and self.notices[-1].kind == "system"
                    and "still working" in self.notices[-1].text):
                self.notice("still working · ctrl+c interrupts")
                self._sync_view()
            return
        self.history.append(text)
        self.history_index = len(self.history)
        self._clear_input()
        self.pending.append(text)
        self.scroll = 0
        self.busy = True
        self.stream_token += 1
        self.started_at = time.monotonic()
        self.streamed = 0
        self.first_chunk_at = 0.0
        self.activity = "thinking"
        self._view_dirty = True
        self._sync_view()
        self._start_watch()
        threading.Thread(target=self._dispatch,
                         args=(text, self.stream_token), daemon=True).start()

    def _session(self, prompt: str) -> str:
        """The session id, creating one on first use.

        Guarded by a lock so two quick turns cannot each create a session and
        split the conversation in two.
        """
        with self._session_lock:
            if not self.session_id:
                title = " ".join(prompt.split())[:48] or "0KAY"
                self.session_id = self.client.create_session(title)
                state_file.save(last_session=self.session_id)
                self.queue.put(("session", self.session_id, None))
            return self.session_id

    def _dispatch(self, prompt: str, token: int) -> None:
        """Hand one prompt to the agent.

        The turn runs on the server; the answer arrives through the task feed,
        not as a response body.
        """
        try:
            session = self._session(prompt)
            result = self.client.send_message(
                session, prompt, model=self.model, workdir=self.workdir,
                intensity=self.intensity, permission=self.permission,
                executor=self.executor,
            )
            self.queue.put(("turn", str(result.get("task_id") or ""), token))
            if not result.get("accepted", True):
                self.queue.put(("error",
                                str(result.get("message") or "the agent refused the task"),
                                token))
        except Exception as error:  # noqa: BLE001 - surfaced as an error row
            self.queue.put(("error", str(error), token))

    def _cancel_turn(self, task: str) -> None:
        try:
            result = self.client.cancel_task(task)
            if not result.get("success", True):
                self.queue.put(("error", str(result.get("message") or "cancel failed"), None))
        except Exception as error:  # noqa: BLE001
            self.queue.put(("error", str(error), None))

    # -- settings ----------------------------------------------------------
    def _open_settings(self, section: str = "") -> None:
        """Browse the same settings the WebUI shows, one section at a time."""
        if section:
            self._background(f"settings · {section}", lambda: self._collect_fields(section),
                             "field")
            return
        self._background("settings", self._collect_sections, "section")

    def _collect_sections(self):
        rows = self.client.settings_sections()
        lines, choices = [], []
        for row in rows:
            ident = str(row.get("id") or "")
            if not ident:
                continue
            label = str(row.get("label") or ident)
            count = len(row.get("fields") or [])
            pad = " " * max(0, 18 - display_width(label))
            lines.append(f"{ident:<12} {label}{pad} {count} settings")
            choices.append(ident)
        return (f"settings · {len(choices)}", lines, choices, 0)

    def _collect_fields(self, section: str):
        payload = self.client.settings(section)
        fields = list((payload.get("section") or {}).get("fields") or [])
        values = payload.get("values") or {}
        self.settings_section = section
        self.settings_fields = {str(field.get("key")): field for field in fields}
        lines, choices = [], []
        for field in fields:
            key = str(field.get("key") or "")
            if not key:
                continue
            kind = str(field.get("type") or "text")
            label = str(field.get("label") or key)
            pad = " " * max(0, 26 - display_width(label))
            lines.append(f"{label}{pad} {self._show_value(kind, values.get(key))}")
            choices.append(key)
        if not lines:
            lines.append("this section has no settings")
        return (f"{section} · {len(choices)}", lines, choices, 0)

    @staticmethod
    def _show_value(kind: str, value) -> str:
        if kind == "bool":
            return "on" if value else "off"
        if value in (None, ""):
            return "—"
        text = str(value)
        return text if len(text) <= 40 else text[:39] + "…"

    def _edit_field(self, key: str) -> None:
        section = self.settings_section
        field = self.settings_fields.get(key) or {}
        kind = str(field.get("type") or "text")
        if not section or not field:
            return
        if kind == "bool":
            payload = self.client.settings(section)
            values = payload.get("values") or {}
            wanted = not bool(values.get(key))
            self._save_setting(section, key, wanted, f"{key} → {'on' if wanted else 'off'}")
            return
        options = [str(option) for option in (field.get("options") or [])]
        if kind == "select" and options:
            payload = self.client.settings(section)
            current = str((payload.get("values") or {}).get(key) or "")
            self.setting_key = key
            self.panel = Panel(f"{section} · {key}", options,
                               choices=options, first_choice_row=0, action="setting")
            self.panel.cursor = options.index(current) if current in options else 0
            self._panel_hint = "↑↓ choose · enter saves · esc cancels"
            return
        # text and number are typed, in the prompt
        self.manual = {"section": section, "key": key, "label": str(field.get("label") or key)}
        self.panel = None
        self.notice(f"type a new value for {key} · enter saves · esc cancels")
        self._sync_view()

    def _save_setting(self, section: str, key: str, value, note: str) -> None:
        def work():
            try:
                self.client.save_settings(section, {key: value})
                self.queue.put(("saved", (section, note), None))
            except Exception as error:  # noqa: BLE001
                self.queue.put(("error", str(error), None))

        threading.Thread(target=work, daemon=True).start()
        self.notice("saving…")
        self._sync_view()

    def _collect_sessions(self):
        """Sessions worth offering to continue, newest first."""
        rows = self.client.sessions()
        lines, choices = [], []
        for row in rows:
            ident = str(row.get("session_id") or "")
            if not ident:
                continue
            # The life plugin keeps per-subsystem sessions; they are not
            # conversations somebody had here.
            if ":life:" in ident:
                continue
            title = " ".join(str(row.get("prompt") or "").split())[:44] or "(untitled)"
            when = str(row.get("started_at") or "")[:16].replace("T", " ")
            mark = "* " if ident == self.session_id else "  "
            # Pad by display width: a CJK title is twice as wide as its length.
            pad = " " * max(0, 46 - display_width(title))
            lines.append(f"{mark}{title}{pad} {when}")
            choices.append(ident)
        if not choices:
            lines.append("no earlier session")
        return (f"sessions · {len(choices)}", lines, choices, 0)

    def _resume(self, ident: str) -> None:
        """Load an earlier session and carry on in it."""
        if not ident:
            self.notice("no session to resume")
            self._sync_view()
            return
        self.panel = None

        def work():
            try:
                payload = self.client.session_turns(ident, limit=100)
            except Exception as error:  # noqa: BLE001
                self.queue.put(("error", str(error), None))
                return
            rows = [row for row in payload.get("tasks") or [] if row.get("task_id")]
            self.queue.put(("resumed", (ident, rows), None))

        self.notice("loading the conversation…")
        self._sync_view()
        threading.Thread(target=work, daemon=True).start()

    def _apply_resumed(self, ident: str, rows: list[dict]) -> None:
        self.session_id = ident
        state_file.save(last_session=ident)
        self.task_rows = {str(row["task_id"]): row for row in rows}
        self.pending = []
        self.notices = []
        self.turn_task = ""
        self.busy = session_view.busy(self.task_rows)
        self.scroll = 0
        self._transcript_total = 0
        self._view_dirty = True
        self._sync_view()
        turns = len(session_view.turns(self.task_rows))
        self.notice(f"resumed {ident} · {turns} turn{'s' if turns != 1 else ''}"
                    + (" · still running" if self.busy else ""))
        self._sync_view()
        self._start_watch()

    def _load_agents(self) -> None:
        """Learn which agents can actually run a turn, and where they work.

        Without this the first prompt just sits there: the gateway accepts the
        task and has no executor to hand it to.
        """
        try:
            payload = self.client.agents()
        except Exception:  # noqa: BLE001 - the turn will report it instead
            return
        agents = [agent for agent in payload.get("agents") or [] if agent.get("plugin_id")]
        self.agents = agents
        if not agents:
            self.notice("no agent registered · start one, or /agent after it connects", "warn")
            self._sync_view()
            return
        online = [agent for agent in agents if _is_online(agent)]
        if not online:
            self.notice("no agent online · the gateway has nowhere to run the turn", "warn")
            self._sync_view()
            return
        if not self.workdir_explicit:
            chosen = self._agent_row(self.executor) or online[0]
            self._adopt_workdir(chosen)

    @staticmethod
    def _agent_host(agent: dict) -> dict:
        host = agent.get("host") or {}
        return host if isinstance(host, dict) else {}

    def _agent_row(self, plugin_id: str) -> dict | None:
        for agent in self.agents:
            if agent.get("plugin_id") == plugin_id:
                return agent
        return None

    def _agent_is_remote(self, agent: dict) -> bool:
        hostname = str(self._agent_host(agent).get("hostname") or "")
        if not hostname:
            return False
        try:
            return hostname.lower() != socket.gethostname().lower()
        except OSError:
            return False

    def _adopt_workdir(self, agent: dict) -> None:
        """Pick the directory the agent should work in.

        A local agent gets this terminal's directory -- that is what "here"
        means to the person typing. A remote one cannot see that path, so its
        own reported directory is the only sensible default.
        """
        if self.workdir_explicit:
            return
        if self._agent_is_remote(agent):
            remote = str(self._agent_host(agent).get("workdir") or "")
            if remote:
                self.workdir = remote
                return
        self.workdir = os.getcwd()

    def _pick_agent(self, argument: str) -> None:
        """Choose which machine runs the turn."""
        argument = argument.strip()
        if argument in ("auto", "local", "any"):
            self.executor = ""
            self.notice("agent → auto · the gateway picks")
            self._sync_view()
            return
        if argument:
            for agent in self.agents:
                if argument in (agent.get("plugin_id"), agent.get("name")):
                    self._choose_agent(agent)
                    return
            self.notice(f"no agent named {argument} · /agent lists them")
            self._sync_view()
            return

        rows = ["auto        let the gateway choose"]
        choices = [""]
        for agent in self.agents:
            host = self._agent_host(agent)
            mark = "" if _is_online(agent) else "  (offline)"
            label = self._agent_short(agent)
            workdir = str(host.get("workdir") or "")
            rows.append(f"{label}{mark}" + (f" · {workdir}" if workdir else ""))
            choices.append(str(agent.get("plugin_id")))
        self.panel = Panel("agent · now " + self._agent_label(), rows,
                           choices=choices, first_choice_row=0, action="agent")
        self.panel.cursor = (choices.index(self.executor)
                             if self.executor in choices else 0)
        self._panel_hint = "↑↓ choose · enter switches · esc closes"

    def _choose_agent(self, agent: dict | None) -> None:
        if agent is None:
            self.executor = ""
            self.notice("agent → auto · the gateway picks")
        else:
            self.executor = str(agent.get("plugin_id") or "")
            host = self._agent_host(agent)
            self._adopt_workdir(agent)
            self.notice(f"agent → {self._agent_short(agent)} · "
                        f"{self.workdir or 'agent default'}")
        self.panel = None
        self._sync_view()

    def _agent_short(self, agent: dict) -> str:
        """How to name an agent in one glance: machine first, name if it adds."""
        name = str(agent.get("name") or "")
        host = str(self._agent_host(agent).get("hostname") or "")
        if not name or name == "agent":
            return host or str(agent.get("address") or "agent")
        return name + ("@" + host if host else "")

    def _resolved_agent(self) -> tuple[dict | None, bool]:
        """The agent that will run the next turn, and whether that was implied.

        "auto" alone does not answer "which machine"; when there is exactly one
        online agent the answer is knowable, so it is shown.
        """
        chosen = self._agent_row(self.executor)
        if chosen is not None:
            return chosen, False
        online = [agent for agent in self.agents if _is_online(agent)]
        if len(online) == 1:
            return online[0], True
        return None, True

    def _where(self) -> str:
        """The line that answers "what is running this, and where".

        Both halves are choosable now, so leaving them implicit means a turn
        can land on another machine without anybody noticing.
        """
        agent, implied = self._resolved_agent()
        if agent is None:
            who = "auto · no agent online" if self.agents else "auto · no agent registered"
        else:
            who = self._agent_short(agent)
            if implied:
                who += " (auto)"
        return f"{who} · {self.workdir or 'agent default'}"

    def _workdir_title(self) -> str:
        """The workdir, trimmed from the left: the tail is what identifies it."""
        path = self.workdir or ""
        if not path:
            return ""
        return path if len(path) <= 28 else "…" + path[-27:]

    def _agent_label(self) -> str:
        agent = self._agent_row(self.executor)
        return self._agent_short(agent) if agent is not None else "auto"

    def _start_pending_poll(self) -> None:
        """Watch for approvals and questions while the client is open.

        The agent blocks on both, so they cannot wait for the user to press
        something: the poll is what makes an approval notice show up at all.
        """
        if getattr(self, "_polling", False):
            return
        self._polling = True
        threading.Thread(target=self._poll_pending, daemon=True).start()

    def _poll_pending(self) -> None:
        while self.running:
            try:
                approvals = self.client.approvals(self.session_id) if self.session_id else []
                questions = self.client.questions(self.session_id) if self.session_id else []
                self.queue.put(("pending", (approvals, questions), None))
            except Exception:  # noqa: BLE001 - a failed poll just retries
                pass
            time.sleep(2.0 if self.busy else 5.0)

    def _start_watch(self) -> None:
        if self._watching:
            return
        self._watching = True
        threading.Thread(target=self._watch, daemon=True).start()

    def _watch(self) -> None:
        """Follow the task feed for the lifetime of the client.

        One stream for all sessions: the rows carry their session id, and
        filtering here keeps reconnects simple -- the cursor is the only state.
        """
        while self.running:
            try:
                for delta in self.client.task_events(self.task_cursor):
                    self.task_cursor = str(delta.get("cursor") or self.task_cursor)
                    self.queue.put(("tasks", delta, None))
            except Exception:  # noqa: BLE001 - a dropped stream just reconnects
                pass
            if not self.running:
                return
            time.sleep(1.5)

    # -- commands ----------------------------------------------------------
    def _run_command(self, text: str) -> None:
        parts = text[1:].split()
        if not parts:
            self.notice("type a command name · /help lists them")
            return
        name = parts[0].lower()
        argument = " ".join(parts[1:])
        command = command_table.resolve(name)
        if command is None:
            self.notice(f"unknown command /{name} · try /help")
            return
        if command.name == "quit":
            self.running = False
        elif command.name == "new":
            self.busy = False
            self.activity = ""
            self.session_id = ""
            self.task_rows = {}
            self.turn_task = ""
            self.pending = []
            self.notices = []
            self.panel = None
            self.scroll = 0
            self.streamed = 0
            self.first_chunk_at = 0.0
            self._transcript_total = 0
            self._view_dirty = True
            self._sync_view()
            self.notice("new session · the next message starts a fresh one")
            self._sync_view()
        elif command.name == "settings":
            self._open_settings(argument.strip())
        elif command.name in ("resume", "sessions"):
            if argument:
                self._resume(argument)
            else:
                self._background("sessions", self._collect_sessions, "session")
        elif command.name == "agent":
            self._pick_agent(argument)
        elif command.name == "permission":
            self._pick_permission(argument)
        elif command.name == "intensity":
            self._pick_intensity(argument)
        elif command.name == "approvals":
            self._open_approvals()
        elif command.name == "questions":
            self._open_questions()
        elif command.name == "answer":
            self._answer_question(argument)
        elif command.name == "session":
            self.notice(self.session_id or "no session yet · the next message starts one")
            self._sync_view()
        elif command.name == "help":
            self._open_help()
        elif command.name == "theme":
            self._apply_theme(argument)
        elif command.name == "health":
            self._background("health", self._collect_health)
        elif command.name == "plugins":
            self._background("plugins", self._collect_plugins)
        elif command.name == "tasks":
            self._background("tasks", self._collect_tasks)
        elif command.name == "usage":
            self._background("usage", self._collect_usage)
        elif command.name == "models":
            self._background("models", self._collect_models, "model")
        elif command.name == "model":
            if argument:
                self._switch_model(argument)
            else:
                self._background("switch model", self._collect_models, "model")
        elif command.name == "reconnect":
            if not argument:
                self.notice("usage: /reconnect <plugin>")
                return
            self._background("reconnect", lambda: self._collect_reconnect(argument))

    def _background(self, title: str, collect, action: str = "") -> None:
        self.panel = Panel(title, [], loading=True)
        self._panel_hint = ""
        def work():
            try:
                self.queue.put(("panel", (collect(), action), None))
            except Exception as error:  # noqa: BLE001
                self.queue.put(("panel_error", f"{title}: {error}", None))
        threading.Thread(target=work, daemon=True).start()

    def _panel_from(self, payload) -> Panel:
        """Build a panel from a collector's (title, lines[, choices, row]) tuple."""
        result, action = payload
        parts = list(result)
        title, lines = parts[0], list(parts[1])
        choices = list(parts[2]) if len(parts) > 2 else []
        first = int(parts[3]) if len(parts) > 3 else 0
        if action == "model" and choices:
            title = f"switch model · {len(choices)} · now {self.model or 'default'}"
        elif action == "session":
            title = f"sessions · {len(choices)} · enter resumes"
        elif action in ("section", "field"):
            title = f"{title}"
        panel = Panel(title, lines, choices=choices, first_choice_row=first,
                      action=action if choices else "")
        if panel.selecting:
            self._panel_hint = "↑↓ choose · enter selects · esc closes"
            for index, value in enumerate(choices):
                if value == self.model:
                    panel.cursor = index
                    break
        return panel

    def _apply_theme(self, argument: str) -> None:
        name = argument.strip().lower() or "auto"
        if name not in ("auto", "light", "dark", "ansi"):
            self.notice("theme is light, dark, ansi or auto")
            return
        from .theme import build
        self.theme = build(name)
        self.renderer.colour = self.theme.colour
        self.renderer.invalidate()
        self.notice(f"theme {self.theme.name}")

    # -- panel content -----------------------------------------------------
    def _collect_plugins(self):
        rows = self.client.plugins()
        text = self.formatters.format_plugins(rows) if self.formatters else str(rows)
        return (f"plugins · {len(rows)}", text.split("\n"))

    def _collect_tasks(self):
        rows = self.client.tasks()
        # The panel scrolls, so there is no reason to hide rows behind the
        # formatter's default limit while the title claims the full count.
        text = (self.formatters.format_tasks(rows, limit=max(1, len(rows)))
                if self.formatters else str(rows))
        return (f"tasks · {len(rows)}", text.split("\n"))

    def _collect_usage(self):
        payload = self.client.usage()
        text = self.formatters.format_usage(payload) if self.formatters else str(payload)
        return ("usage", text.split("\n"))

    def _collect_models(self):
        payload = self.client.models()
        self._remember_window(payload)
        models = list(payload.get("models") or [])
        active = self.model or payload.get("default_model") or ""
        lines = [f"active  {active or '--'}", ""]
        choices: list[str] = []
        if not models:
            lines.append("no models configured")
        for model in models:
            ident = model.get("id") or "?"
            provider = model.get("provider_name") or model.get("provider") or ""
            window = model.get("context_window") or 0
            marks = []
            if model.get("supports_thinking"):
                marks.append("thinking")
            if window:
                marks.append(f"{human_tokens(window)} ctx")
            lines.append(f"{ident:<40} {provider:<18} {' · '.join(marks)}".rstrip())
            choices.append(ident)
        self._panel_hint = "↑↓ choose · enter switches · esc closes"
        return (f"models · {len(models)}", lines, choices, 2)

    def _switch_model(self, name: str, exact: bool = False) -> None:
        """Point the next turn at another model, without freezing the UI.

        Resolution happens off the main thread: the catalog lives behind an
        HTTP call, and a pause on Enter reads as a broken prompt. An ambiguous
        prefix is not guessed at -- it opens the picker, because silently
        choosing one of two models is how a "switch" appears to do nothing.
        """
        def work():
            try:
                catalog = self.client.models()
            except Exception:  # noqa: BLE001 - switching is still allowed offline
                catalog = {}
            models = [model for model in catalog.get("models") or []
                      if model.get("id")]
            ids = [model["id"] for model in models]
            if exact or name in ids:
                self.queue.put(("model", (name, f"model → {name}"), None))
                return
            hits = [ident for ident in ids if ident.lower().startswith(name.lower())]
            if len(hits) == 1:
                self.queue.put(("model", (hits[0], f"model → {hits[0]}"), None))
                return
            if len(hits) > 1:
                self.queue.put(("model-choices", (name, models, hits), None))
                return
            note = f"model → {name}"
            if ids:
                note += " · not in the catalog, the gateway may reject it"
            self.queue.put(("model", (name, note), None))

        threading.Thread(target=work, daemon=True).start()

    # -- permission, effort, approvals -------------------------------------
    def _pick_permission(self, argument: str) -> None:
        """Ask-before-acting, or full access. Nothing in between is honest."""
        argument = argument.strip().lower()
        if argument:
            value = "full_access" if argument in ("full", "full_access", "yolo") else "normal"
            self._set_permission(value)
            return
        self.panel = Panel(
            f"permission · now {self.permission}",
            ["normal       ask before sensitive tools",
             "full_access  run anything, never ask"],
            choices=["normal", "full_access"], first_choice_row=0,
            action="permission")
        self.panel.cursor = 1 if self.permission == "full_access" else 0
        self._panel_hint = "↑↓ choose · enter applies · esc closes"

    def _set_permission(self, value: str) -> None:
        self.permission = "full_access" if value == "full_access" else "normal"
        state_file.save(permission=self.permission)
        if self.permission == "full_access":
            self.notice("permission → full access · tools run without asking", "warn")
        else:
            self.notice("permission → normal · sensitive tools will ask")
        self.panel = None
        self._sync_view()

    def _pick_intensity(self, argument: str) -> None:
        argument = argument.strip().lower()
        if argument in EFFORT_STEPS:
            # One path for both: a name and a click must land the same way,
            # animation and warning included.
            self._apply_intensity(EFFORT_VALUES[argument])
            return
        if argument.isdigit():
            self._apply_intensity(int(argument))
            return
        if argument:
            self.notice("effort is one of " + ", ".join(EFFORT_STEPS))
            self._sync_view()
            return
        value = self._intensity_value()
        # The level moves with the knob, so it belongs in the body, not the
        # title -- a title that disagrees with the slider is a bug to read.
        self.panel = Panel("thinking effort", [], action="intensity",
                           slider=EFFORT_VALUES[EFFORT_STEPS[self._step_index(value)]])
        self._panel_hint = "←→ one level · enter applies · esc cancels"

    def _intensity_value(self) -> int:
        """Where the slider should start, given the current setting."""
        word = str(self.intensity or "").strip().lower()
        if word.isdigit():
            return max(0, min(100, int(word)))
        return {"off": 0, "low": 20, "high": 75, "max": 100}.get(word, 50)

    def _open_approvals(self) -> None:
        if not self.approvals:
            self.notice("nothing waiting for approval")
            self._sync_view()
            return
        lines = []
        for item in self.approvals:
            tool = str(item.get("tool") or "tool")
            args = item.get("args") or {}
            detail = ""
            if isinstance(args, dict):
                for key in ("command", "path", "url", "pattern"):
                    if args.get(key):
                        detail = " " + str(args[key])
                        break
                if not detail:
                    detail = " " + ", ".join(list(args)[:3])
            lines.append((tool.ljust(10) + detail)[:120])
        self.panel = Panel("approvals · " + str(len(lines)), lines,
                           choices=[str(item.get("id")) for item in self.approvals],
                           first_choice_row=0, action="approval")
        self._panel_hint = ("enter/y allow · a allow all · A always allow · "
                            "n deny · esc later")

    def _open_questions(self) -> None:
        """Show what the agent asked, with the answer one keystroke away."""
        if not self.questions:
            self.notice("no question waiting")
            self._sync_view()
            return
        single = len(self.questions) == 1
        lines = []
        for index, item in enumerate(self.questions, start=1):
            question = " ".join(str(item.get("question") or "").split())
            options = [str(option) for option in (item.get("options") or [])]
            if single and options:
                # One question: number the options so a digit answers it.
                lines.append(question)
                lines.append("")
                lines.extend(f"  {position}. {option}"
                             for position, option in enumerate(options, start=1))
            else:
                suffix = "  [" + " | ".join(options[:4]) + "]" if options else ""
                lines.append((str(index) + ". " + question + suffix)[:160])
        lines.append("")
        lines.append("type the answer in the prompt, or /answer <n> <text>")
        self.panel = Panel("question" if single else f"questions · {len(self.questions)}",
                           lines,
                           choices=[str(self.questions[0].get("id") or "")] if single else [],
                           action="question" if single else "")
        self._panel_hint = ("1-9 picks an option · esc then type · enter sends"
                            if single and (self.questions[0].get("options") or [])
                            else "esc then type the answer · enter sends")

    def _question_options(self) -> list[str]:
        item = self.questions[0] if self.questions else {}
        return [str(option) for option in (item.get("options") or [])]

    def _send_answer(self, item: dict, answer: str) -> None:
        ident = str(item.get("id") or "")
        if not ident:
            return

        def work():
            try:
                self.client.answer_question(ident, answer)
                self.queue.put(("resolved", ident, None))
                self.queue.put(("toast", "answered · " + answer[:40], None))
            except Exception as error:  # noqa: BLE001
                self.queue.put(("error", str(error), None))

        self.answering = ""
        threading.Thread(target=work, daemon=True).start()

    def _answer_question(self, argument: str) -> None:
        parts = argument.split(None, 1)
        if len(parts) < 2:
            self.notice("usage: /answer <n> <text>")
            self._sync_view()
            return
        try:
            index = int(parts[0]) - 1
        except ValueError:
            index = -1
        if not (0 <= index < len(self.questions)):
            self.notice("no question " + parts[0] + " · /questions lists them")
            self._sync_view()
            return
        item = self.questions[index]
        ident, answer = str(item.get("id") or ""), parts[1]
        if not ident:
            self.notice("that question has no id")
            self._sync_view()
            return

        def work():
            try:
                self.client.answer_question(ident, answer)
                self.queue.put(("resolved", ident, None))
                self.queue.put(("toast", "answered question " + parts[0], None))
            except Exception as error:  # noqa: BLE001
                self.queue.put(("error", str(error), None))

        threading.Thread(target=work, daemon=True).start()
        self.panel = None

    def _decide(self, ident: str, allow: bool, bulk: bool = False) -> None:
        """Resolve an approval off the drawing thread.

        `bulk` approves everything that is waiting, not just the selection:
        when several tools are queued behind one prompt there is no point in
        answering them one at a time.
        """
        idents = [ident]
        if bulk and allow:
            idents = [str(item.get("id")) for item in self.approvals if item.get("id")] or [ident]

        def work():
            for target in idents:
                try:
                    self.client.decide_approval(target, allow)
                    self.queue.put(("resolved", target, None))
                except Exception as error:  # noqa: BLE001
                    self.queue.put(("error", str(error), None))

        threading.Thread(target=work, daemon=True).start()

    def _remember_tool(self, ident: str) -> None:
        """Add a tool to the agent's always-allow list, so it stops asking."""
        item = next((row for row in self.approvals if str(row.get("id")) == ident), None)
        tool = str((item or {}).get("tool") or "")
        if not tool:
            return

        def work():
            try:
                section = self.client.settings("agent")
                current = str((section.get("values") or {}).get("always_allow_tools") or "")
                tools = [part.strip() for part in current.split(",") if part.strip()]
                if tool not in tools:
                    tools.append(tool)
                    self.client.save_settings("agent", {"always_allow_tools": ",".join(tools)})
                self.queue.put(("toast", f"{tool} will not ask again", None))
            except Exception as error:  # noqa: BLE001
                self.queue.put(("error", str(error), None))

        threading.Thread(target=work, daemon=True).start()

    def _open_model_picker(self, entries: list[dict], matches: list[str] | None,
                           hint: str = "") -> None:
        """Show the candidates so an ambiguous prefix can be resolved.

        Built from entries passed in, not fetched here: the drawing thread must
        not wait on HTTP.
        """
        if matches is not None:
            wanted = set(matches)
            entries = [entry for entry in entries if entry.get("id") in wanted]
        lines = [f"matching  {hint}", ""]
        choices: list[str] = []
        for entry in entries:
            ident = entry.get("id") or "?"
            provider = entry.get("provider_name") or entry.get("provider") or ""
            lines.append(f"{ident:<34} {provider}".rstrip())
            choices.append(ident)
        if not choices:
            lines.append("no matching model")
        self.panel = Panel(f"switch model · {len(choices)}", lines,
                           choices=choices, first_choice_row=2,
                           action="model" if choices else "")
        self._panel_hint = "↑↓ choose · enter selects · esc closes"

    def _remember_window(self, payload: dict) -> None:
        """Adopt the window of our model, or of the gateway's default."""
        entries = payload.get("models") or []
        for want in (self.model, payload.get("default_model")):
            if not want:
                continue
            for entry in entries:
                if entry.get("id") != want:
                    continue
                window = entry.get("context_window") or 0
                if not window:
                    continue
                self.context_window = int(window)
                if not self.model:
                    self.model = str(want)
                return

    def _collect_reconnect(self, name: str):
        result = self.client.reconnect(name)
        return (f"reconnect {name}", [str(result)])

    def _collect_health(self):
        ok = self.client.health()
        return ("health", [f"{self.client.base_url}  {'reachable' if ok else 'unreachable'}"])

    def _open_help(self) -> None:
        from .commands import COMMANDS
        self._panel_hint = ""
        lines = ["keys", ""]
        keymap = [
            ("enter", "send · or run the highlighted command"),
            ("shift+enter", "newline in the draft (ctrl+j works everywhere)"),
            ("tab", "complete a command or an @path"),
            ("↑ ↓", "input history · or move in a list"),
            ("pgup pgdn", "scroll the transcript or a panel"),
            ("ctrl+c", "interrupt the running turn, then clear the input"),
            ("ctrl+l", "repaint after the terminal garbled the screen"),
            ("ctrl+p / ?", "this help"),
            ("ctrl+d", "leave"),
        ]
        for key, description in keymap:
            lines.append(f"  {key:<12}{description}")
        lines += [
            "",
            "the conversation",
            "",
            "  Each message is a turn on an agent session, so the agent has the",
            "  tools, the workspace and the history -- not just a model prompt.",
            "  /session prints the id; /new starts a fresh one; /resume picks an",
            "  earlier conversation (or start with --continue to pick up the last",
            "  one). Ctrl+C cancels the running turn.",
            "",
            "  where it runs",
            "",
            "  /agent                  pick the machine: auto, or a named agent",
            "  The workdir follows it: this directory for a local agent, the",
            "  agent's own for one on another machine. --workdir overrides both.",
            "", "  permission",
            "",
            "  /permission normal      asks before sensitive tools (default)",
            "  /permission full        full access: no tool ever asks",
            "  /intensity              five stops: off low medium high max",
            "  → or ← moves one level, and the change plays a flourish.",
            "  max is louder than the others on purpose.",
            "",
            "  When the agent stops to ask, the status line says so. Approvals:",
            "  /approvals, then enter to allow or d to deny. Questions: /questions",
            "  lists them, /answer <n> <text> replies.",
            "", "completion", "",
                  "  / shows commands. @ shows paths under the agent's working",
                  "  directory; keep typing to narrow, tab to fill in.",
                  "", "commands", ""]
        labels = [f"/{c.name + (' ' + c.argument if c.argument else '')}" for c in COMMANDS]
        column = max(len(label) for label in labels) + 2
        for command, label in zip(COMMANDS, labels):
            lines.append(f"  {label:<{column}}{command.description}")
        lines += [
            "",
            "status line",
            "",
            "  ctx is the share of the model's context window the current",
            "  conversation occupies. tokens are the last reported prompt and",
            "  completion counts; tok/s is measured over the current turn.",
        ]
        self.panel = Panel("help", lines)

    # -- drawing -----------------------------------------------------------
    def _draw(self) -> None:
        if self._view_dirty:
            self._sync_view()
        width, height = self.terminal.size()
        frame = Frame(width, height)
        theme = self.theme

        text = "".join(self.buffer)
        available = max(1, width - 8)
        rows, caret = _input_rows(text, available, self.cursor)
        shown = min(len(rows), MAX_INPUT_ROWS)

        footer_height = 1 if height >= 16 else 0
        prompt_height = shown + 2
        status_row = height - footer_height - prompt_height - 1
        prompt_y = status_row + 1
        body_top = 2
        body_height = max(1, status_row - body_top)

        # The banner needs the strip's rows too, so it replaces it: the online
        # state is repeated by the fold line underneath either way.
        art, label_row, label_col = self._banner_tier(status_row, width)
        if art:
            self._draw_banner_landing(frame, width, status_row, art,
                                      label_row, label_col)
        elif self.panel is not None:
            self._draw_banner(frame, width)
            self._draw_panel(frame, 0, body_top, width, body_height)
        elif self.entries:
            self._draw_banner(frame, width)
            self._draw_transcript(frame, 0, body_top, width, body_height)
        else:
            self._draw_banner(frame, width)
            self._draw_landing(frame, 0, body_top, width, body_height)

        if self._palette_open() and self.panel is None:
            self._draw_palette(frame, width, prompt_y)

        self._draw_status(frame, 0, status_row, width)
        cursor = self._draw_prompt(frame, prompt_y, width, text, rows, caret)
        if footer_height:
            self._draw_footer(frame, height - 1, width)

        self.renderer.draw(frame, cursor)

    def _draw_banner(self, frame, width: int) -> None:
        theme = self.theme
        frame.put(0, 0, "✦ ", theme.style("accent"))
        frame.put(2, 0, "0KAY", theme.style("strong", bold=True))
        state = "checking" if self.online is None else ("online" if self.online else "offline")
        role = "subtle" if self.online is None else ("success" if self.online else "error")
        right = f"{state} · {self.client.base_url}"
        left = display_width("✦ 0KAY") + 2
        if display_width(right) + left < width:
            frame.put_right(width - 1, 0, right, theme.style(role))

    def _banner_tier(self, status_row: int, width: int) -> tuple[list[str], int, int]:
        """The widest version of the logo this terminal can hold.

        Three renditions, best first: the whole banner, the same banner with
        its rows halved, and the banner with its columns halved. Below all
        three the client draws text instead -- a cropped wordmark reads as a
        broken one, so the fallbacks get smaller rather than getting cut.
        """
        if not self.show_logo or self.panel is not None:
            return [], 0, 0
        # Only an actual conversation pushes the logo out of the way. Client
        # notices (a warning, "interrupted") are side lines, and treating them
        # as content is how the banner vanished behind one line of text.
        if any(entry.kind in ("user", "assistant", "tool", "reason")
               for entry in self.entries):
            return [], 0, 0
        for art, label_row, label_column in BANNER_VARIANTS:
            if status_row < len(art) + 1:
                continue
            if width < 2 + label_column + 32:
                continue
            return art, label_row, label_column
        return [], 0, 0

    def _draw_landing(self, frame, x: int, y: int, width: int, height: int) -> None:
        """Text-only welcome, for terminals too small for any version of the art."""
        theme = self.theme
        top = y + 1
        frame.put(x + 2, top, "0KAY", theme.style("strong", bold=True))
        frame.put(x + 7, top, f"v{VERSION} · self-hosted agent stack",
                  theme.style("muted"))
        top += 2

        frame.put(x + 2, top, "Welcome to 0KAY", theme.style("text", bold=True))
        top += 1
        tip = "Type to talk to the agent. / for commands, ? for the keymap."
        frame.put(x + 2, top, truncate(tip, width - 4), theme.style("muted"))
        top += 1
        if top < y + height:
            frame.put(x + 2, top, "Everything runs on your box.",
                      theme.style("accent", italic=True))
            top += 2

        self._draw_fold(frame, x + 2, top, width, y + height)
        top += 1
        if top < y + height:
            frame.put(x + 2, top, truncate(self._where(), width - 4),
                      theme.style("subtle"))

    def _draw_fold(self, frame, x: int, y: int, width: int, limit: int) -> None:
        """The one line saying whether the gateway is reachable."""
        if y >= limit:
            return
        theme = self.theme
        if self.online is False:
            fold, role = "gateway offline · /health to try again", "error"
        elif self.online is None:
            fold, role = "checking the gateway…", "subtle"
        else:
            fold, role = f"gateway reachable · {self.client.base_url}", "success"
        frame.put(x, y, f"{FOLD_GLYPH} ", theme.style(role))
        frame.put(x + 2, y, truncate(fold, width - 4), theme.style("subtle"))

    def _draw_banner_landing(self, frame, width: int, rows: int,
                             art: list[str], label_row: int,
                             label_column: int) -> None:
        """The logo, at whichever height it fits.

        The captions are drawn here rather than taken from the asset so the
        model name can be the live one.
        """
        theme = self.theme
        for index, spans in enumerate(banner_rows(theme, art)):
            if index >= rows:
                break
            frame.put_spans(2, index, spans)
        label_x = 2 + label_column
        base = label_row
        frame.put(label_x, base, "0KAY", theme.style("strong", bold=True))
        frame.put(label_x + 5, base, f"  v{VERSION}", theme.style("subtle"))
        frame.put(label_x, base + 1, "self-hosted agent stack", theme.style("muted"))
        frame.put(label_x, base + 2, self.model or "gateway default model",
                  theme.style("subtle"))

        if width >= label_x + 30 and base + 6 < len(art):
            tip_x = label_x
            frame.put(tip_x, base + 4, "Welcome to 0KAY", theme.style("text", bold=True))
            frame.put(tip_x, base + 5, truncate("Type to talk · / or ? for help",
                                                width - tip_x - 2),
                      theme.style("muted"))
            frame.put(tip_x, base + 6, "Everything runs on your box.",
                      theme.style("accent", italic=True))
            where = truncate(self._where(), width - tip_x - 2)
            frame.put(tip_x, base + 8, where, theme.style("subtle"))
        self._draw_fold(frame, 2, len(art), width, rows)
        # Client notices (a warning about full access, say) must not be hidden
        # by the logo: they go under it, in the space the banner leaves.
        row = len(art) + 1
        for entry in self.entries[-3:]:
            if row >= rows:
                break
            role = {"warn": "warning", "error": "error"}.get(entry.kind, "subtle")
            lead = "! " if entry.kind in ("warn", "error") else "· "
            frame.put(2, row, lead, theme.style(role))
            frame.put(4, row, truncate(entry.text, width - 6),
                      theme.style("warning" if entry.kind == "warn" else "muted"))
            row += 1

    def _draw_transcript(self, frame, x: int, y: int, width: int, height: int) -> None:
        lines = self._transcript_lines(width)
        total = len(lines)
        # While the user is reading back, new output must not push the text
        # under the caret: hold the same content position instead of the
        # same distance from the bottom.
        if self.scroll > 0 and self._transcript_total and total != self._transcript_total:
            self.scroll += total - self._transcript_total
        self._transcript_total = total
        max_scroll = max(0, total - height)
        self.scroll = max(0, min(self.scroll, max_scroll))
        start = max(0, total - height - self.scroll)
        visible = lines[start:start + height]
        for index, spans in enumerate(visible):
            frame.put_spans(x, y + index, spans)

    def _transcript_lines(self, width: int) -> list[list[tuple[str, object]]]:
        theme = self.theme
        out: list[list[tuple[str, object]]] = []
        gutter = 2
        for entry in self.entries:
            if entry.kind == "user":
                body = wrap(entry.text, width - gutter - 2)
                out.append([(f"{PROMPT_GLYPH} ", theme.style("user", bold=True)),
                            (body[0], theme.style("user"))])
                for line in body[1:]:
                    out.append([(" " * (gutter), PLAIN), (line, theme.style("user"))])
                out.append([("", PLAIN)])
            elif entry.kind == "assistant":
                key = (theme.name, width - gutter, len(entry.text))
                if entry.cache and entry.cache[0] == key:
                    body_rows = entry.cache[1]
                else:
                    body_rows = markdown.render(entry.text, width - gutter, theme)
                    entry.cache = (key, body_rows)
                for spans in body_rows:
                    out.append([(" " * gutter, PLAIN)] + list(spans))
                out.append([("", PLAIN)])
            elif entry.kind == "reason":
                # Only the tail: a long reasoning block would push the answer
                # off screen, and the last few lines are the useful ones.
                body = wrap(entry.text, width - 4)
                if len(body) > REASON_ROWS:
                    body = ["…"] + body[-REASON_ROWS:]
                    body[0] = "…"
                for index, line in enumerate(body):
                    lead = "⋯ " if index == 0 else "  "
                    out.append([("  ", PLAIN), (lead, theme.style("subtle")),
                                (line, theme.style("think", italic=True))])
            elif entry.kind == "system":
                out.append([("· ", theme.style("subtle")),
                            (truncate(entry.text, width - 2), theme.style("muted"))])
            elif entry.kind == "warn":
                out.append([("! ", theme.style("warning")),
                            (truncate(entry.text, width - 2), theme.style("warning"))])
            elif entry.kind == "error":
                for index, line in enumerate(wrap(entry.text, width - 2)):
                    prefix = "! " if index == 0 else "  "
                    out.append([(prefix, theme.style("error")),
                                (line, theme.style("error"))])
            elif entry.kind == "tool":
                name = entry.meta.get("name", "tool")
                state = entry.meta.get("state", "ok")
                role = "success" if state == "ok" else "error"
                dot = "●" if state == "ok" else "✗"
                out.append([("  ", PLAIN), (dot + " ", theme.style(role)),
                            (name, theme.style("accent")),
                            ("  " + truncate(entry.text, width - 20), theme.style("muted"))])
        # Drop the trailing blank line so the last answer sits one row above the
        # status line instead of two.
        while out and not out[-1][0][0] and len(out) > 1:
            out.pop()
        return out

    def _draw_panel(self, frame, x: int, y: int, width: int, height: int) -> None:
        theme = self.theme
        title = self.panel.title if self.panel else "panel"
        box(frame, x, y, width, height, theme, title=title, focus=True,
            title_right="esc")
        inner_x, inner_y, inner_w, inner_h = x + 2, y + 1, width - 4, height - 2
        if self.panel is None:
            return
        if self.panel.loading:
            frame.put(inner_x, inner_y, "loading…", theme.style("muted"))
            return
        if self.panel.slider >= 0:
            self._draw_slider(frame, inner_x, inner_y, inner_w)
            return
        lines = self.panel.lines
        panel = self.panel
        selected_row = (panel.first_choice_row + panel.cursor
                        if panel.selecting else -1)
        # The draw is the authority on how many rows fit: scrolling is also
        # approximated when the key is handled, and the two must not disagree.
        if selected_row >= 0 and inner_h > 1:
            if selected_row < panel.offset:
                panel.offset = selected_row
            elif selected_row >= panel.offset + inner_h:
                panel.offset = selected_row - inner_h + 1
        self.panel.offset = max(0, min(self.panel.offset, max(0, len(lines) - inner_h)))
        for index in range(inner_h):
            source = self.panel.offset + index
            if source >= len(lines):
                break
            if not panel.selecting or source < panel.first_choice_row:
                frame.put(inner_x, inner_y + index,
                          truncate(lines[source], inner_w), theme.style("text"))
                continue
            chosen = source == selected_row
            lead = PROMPT_GLYPH + " " if chosen else "  "
            role = "accent" if chosen else "text"
            frame.put(inner_x, inner_y + index, lead,
                      theme.style("accent", bold=True))
            frame.put(inner_x + 2, inner_y + index,
                      truncate(lines[source], inner_w - 2),
                      theme.style(role, bold=chosen))

    def _draw_slider(self, frame, x: int, y: int, width: int) -> None:
        """Five stops with the knob sitting on one of them.

        The track is not continuous on purpose: nothing between the stops can
        be chosen, so nothing between them is drawn. Changing the level spins
        the knob (and at max, spins it a lot).
        """
        theme = self.theme
        index = self._step_index(self.panel.slider)
        level = EFFORT_STEPS[index]
        knob = self.effort_frame()
        overdrive = level == "max" and self.animating()
        track_width = max(len(EFFORT_STEPS) * 6, min(width - 2, 46))
        span = track_width - 1
        # At max the whole track pulses between light and heavy, which reads as
        # the machine straining. It is a joke, but a legible one.
        heavy = "━" if overdrive and self.effort_tick() % 3 == 0 else "─"
        cells = [heavy] * track_width
        # A tick under every stop, so the options are visible even when the
        # knob is at one end.
        for step in range(len(EFFORT_STEPS)):
            cells[round(step / (len(EFFORT_STEPS) - 1) * span)] = "┴"
        knob_at = round(index / (len(EFFORT_STEPS) - 1) * span)
        cells[knob_at] = knob
        track = "".join(cells)

        role = "warning" if overdrive else "accent"
        label = level.upper()
        detail = self._intensity_hint(level)
        if overdrive:
            # Jitter the label and rotate the joke so the frame is unmistakably
            # alive rather than a static word.
            tick = self.effort_tick()
            label = "M A X" if tick % 2 else "MAX"
            detail = OVERDRIVE_LINES[tick % len(OVERDRIVE_LINES)]
        frame.put(x, y, knob, theme.style(role, bold=True))
        frame.put(x + 2, y, label.ljust(6), theme.style(role, bold=True))
        frame.put(x + 9, y, "· " + detail, theme.style("text"))

        frame.put(x, y + 2, track, theme.style("border" if not overdrive else "warning"))
        frame.put(x + knob_at, y + 2, knob, theme.style(role, bold=True))
        # Stop names under their ticks.
        for step, name in enumerate(EFFORT_STEPS):
            at = round(step / (len(EFFORT_STEPS) - 1) * span) - len(name) // 2
            frame.put(x + max(0, at), y + 3, name,
                      theme.style("accent" if step == index else "subtle",
                                  bold=step == index))
        frame.put(x, y + 4, "←→ one level · enter applies · esc cancels",
                  theme.style("subtle"))

    def _palette_start(self, visible_count: int) -> int:
        """First visible item, chosen so the selection stays on screen.

        When the list overflows, its last row shows a "more" hint and cannot
        hold an item, so the usable window is one row shorter.
        """
        total = len(self._palette_items())
        usable = max(1, visible_count - 1) if total > visible_count else visible_count
        if self.palette_index < usable:
            return 0
        return self.palette_index - usable + 1

    def _palette_title(self, count: int) -> str:
        """What the list is, and which directory it is listing.

        `@` is rooted at the agent's working directory, which is not
        necessarily where the client was started, so the title says which.
        """
        if self._command_word() is not None:
            return f"commands · {count}"
        token = self._at_token()
        directory = token[1].rpartition("/")[0] if token else ""
        root = self._listing_roots.get(directory, "")
        name = os.path.basename(root.rstrip("/\\")) or root or "working directory"
        return f"paths · {name} · {count}"

    def _draw_palette(self, frame, width: int, prompt_y: int) -> None:
        theme = self.theme
        items = self._palette_items()
        if not items:
            return
        # The list sits directly on top of the prompt, never over the status
        # line: one row is reserved for status, one for the box's top border.
        room = prompt_y - 2 - 3
        if room < 3:
            return
        box_height = min(len(items) + 2, room)
        visible_count = max(1, box_height - 2)
        self.palette_index = max(0, min(self.palette_index, len(items) - 1))
        start = self._palette_start(visible_count)
        # Rows actually filled with items, then what the hint may claim. The
        # hint takes the last row only when something really is below it, so
        # it can never be written over an entry.
        shown = min(visible_count, len(items) - start)
        remaining = len(items) - (start + shown)
        item_rows = max(1, shown - 1) if remaining > 0 else shown

        top = prompt_y - 1 - box_height
        title = self._palette_title(len(items))
        box(frame, 0, top, width, box_height, theme, title=title)
        inner_x, inner_y, inner_w = 2, top + 1, width - 4
        name_width = min(16, max(8, inner_w // 4))
        for row in range(item_rows):
            index = start + row
            if index >= len(items):
                break
            command = items[index]
            selected = index == self.palette_index
            glyph = PROMPT_GLYPH if selected else " "
            role = "accent" if selected else "text"
            frame.put(inner_x, inner_y + row, f"{glyph} ", theme.style(role, bold=selected))
            frame.put(inner_x + 2, inner_y + row,
                      truncate(command.name, name_width - 1).ljust(name_width),
                      theme.style(role, bold=selected))
            description = command.description
            room_left = inner_w - name_width - 2
            frame.put(inner_x + 2 + name_width, inner_y + row,
                      truncate(description, max(0, room_left)), theme.style("muted"))
        # The hint takes the last row, so the rows above it are the items.
        remaining = len(items) - (start + item_rows)
        if remaining > 0:
            tail = f"↓ {remaining} more · tab completes"
            frame.put(inner_x, inner_y + item_rows,
                      truncate(tail, inner_w), theme.style("subtle"))


    def _draw_status(self, frame, x: int, y: int, width: int) -> None:
        theme = self.theme
        spans: list[tuple[str, object]] = []
        if self.busy:
            spans.append(spinner(theme, self.tick // 2))
            label = self.activity or "working"
            elapsed = time.monotonic() - self.started_at if self.started_at else 0
            spans.append((f"{label} {elapsed:.0f}s", theme.style("text")))
        else:
            spans.append(("· ", theme.style("subtle")))
            spans.append(("ready", theme.style("muted")))

        percent = None
        if self.context_window:
            percent = round(self.context_used / self.context_window * 100)

        spans.append(("  ·  ", theme.style("subtle")))
        if percent is None:
            # An empty bar would read as "0% used"; say we do not know instead.
            spans.append(("ctx --", theme.style("subtle")))
        else:
            spans.append(("ctx ", theme.style("subtle")))
            spans.extend(context_bar(theme, percent, 10))
            spans.append((f" {percent:>3d}%", theme.style("muted")))

        if self.context_window:
            mark = "~" if self.context_source == "default" else ""
            spans.append((f"  {human_tokens(self.context_used)}/"
                          f"{mark}{human_tokens(self.context_window)}",
                          theme.style("subtle")))
        elif self.prompt_tokens or self.output_tokens:
            spans.append((f"  {human_tokens(self.prompt_tokens)} in / "
                          f"{human_tokens(self.output_tokens)} out", theme.style("subtle")))

        if self.busy and self.streamed and self.first_chunk_at:
            window = max(0.2, time.monotonic() - self.first_chunk_at)
            rate = human_rate(self.streamed / 4 / window)
            if rate:
                spans.append((f"  ·  {rate}", theme.style("subtle")))

        if self.scroll > 0:
            spans.append((f"  ·  {MORE_GLYPH} {min(self.scroll, 999)} back",
                          theme.style("warning")))

        # A blocked agent looks exactly like a slow one, so the two things that
        # are waiting on a human get the loudest slot on the line.
        if self.approvals:
            spans.append((f"  ·  {len(self.approvals)} approval"
                          f"{'' if len(self.approvals) == 1 else 's'} · /approvals",
                          theme.style("error", bold=True)))
        if self.questions:
            spans.append((f"  ·  {len(self.questions)} question"
                          f"{'' if len(self.questions) == 1 else 's'} · /questions",
                          theme.style("warning", bold=True)))
        if self.permission == "full_access":
            spans.append(("  ·  full access", theme.style("warning", bold=True)))

        # Only the agent needs a slot here when it is either chosen or
        # ambiguous: with one implicit agent the prompt border and the landing
        # already say where the turn runs, and the model name is worth more.
        agent, implied = self._resolved_agent()
        if agent is None:
            spans.append(("  ·  no agent", theme.style("error", bold=True)))
        elif not implied:
            spans.append((f"  ·  {self._agent_short(agent)}", theme.style("subtle")))

        if self.intensity:
            level = EFFORT_STEPS[self._step_index(self._intensity_value())]
            loud = level == "max" and self.animating()
            spans.append((f"  ·  {self.effort_frame()} {level}",
                          theme.style("warning" if loud else "subtle",
                                      bold=loud)))

        if self.model:
            spans.append((f"  ·  {self.model}", theme.style("subtle")))

        self._put_spans(frame, x, y, spans, width)

    def _draw_prompt(self, frame, y: int, width: int, text: str,
                     rows: list[str], caret: tuple[int, int]) -> tuple[int, int]:
        theme = self.theme
        focus = not self.busy
        shown = min(len(rows), MAX_INPUT_ROWS)
        title = self._workdir_title()
        box(frame, 0, y, width, shown + 2, theme, focus=focus,
            title=title if title and width > len(title) + 12 else "")
        inner_x, inner_w = 2, width - 4
        available = max(1, inner_w - 4)

        # Keep the caret's row on screen when the draft is taller than the box.
        start = 0
        if len(rows) > shown:
            start = max(0, min(caret[0] - shown + 1, len(rows) - shown))

        for offset in range(shown):
            index = start + offset
            if index >= len(rows):
                break
            row_y = y + 1 + offset
            glyph = f"{PROMPT_GLYPH} " if index == 0 else "  "
            frame.put(inner_x, row_y, glyph,
                      theme.style("accent" if focus else "subtle", bold=True))
            frame.put(inner_x + 2, row_y, rows[index], theme.style("text"))

        if not text:
            if self.manual:
                label = str(self.manual.get("label") or self.manual.get("key") or "")
                placeholder = f"new value for {label} · enter saves"
                frame.put(inner_x + 2, y + 1, truncate(placeholder, available),
                          theme.style("accentSoft"))
            target = None if self.manual else self._answer_target()
            if target is not None:
                question = " ".join(str(target.get("question") or "").split())
                options = [str(o) for o in (target.get("options") or [])][:3]
                placeholder = "answer: " + question
                if options:
                    placeholder += "  [" + " / ".join(options) + "]"
            else:
                placeholder = "Ask 0KAY, or type / for commands"
            frame.put(inner_x + 2, y + 1, truncate(placeholder, available),
                      theme.style("accentSoft" if target is not None else "subtle"))
        hint = "…" if self.busy else ("⇧⏎" if "\n" in text else "⏎")
        if inner_w > 10:
            frame.put_right(inner_x + inner_w - 1, y + 1, hint, theme.style("subtle"))

        caret_row = y + 1 + max(0, min(caret[0] - start, shown - 1))
        caret_col = inner_x + 2 + min(caret[1], available)
        return (caret_row, caret_col)

    def _draw_footer(self, frame, y: int, width: int) -> None:
        theme = self.theme
        text = KEYMAP_HINT
        if self.panel is not None:
            text = self._panel_hint or "↑↓ scroll · esc close"
        frame.put(2, y, truncate(text, width - 4), theme.style("subtle"))
        if self.debug_keys:
            frame.put_right(width - 2, y, f"key: {self.last_key or '-'}",
                            theme.style("subtle"))

    def _put_spans(self, frame, x: int, y: int, spans, width: int) -> None:
        cursor = x
        for text, style in spans:
            remaining = width - cursor
            if remaining <= 0:
                break
            piece = truncate(text, remaining)
            frame.put(cursor, y, piece, style if style is not None else PLAIN)
            cursor += display_width(piece)


def _is_online(agent: dict) -> bool:
    """Healthy, or at least not known to be down."""
    status = str(agent.get("status") or "").upper()
    if status.endswith("UNHEALTHY") or status.endswith("OFFLINE"):
        return False
    return True


def _input_rows(text: str, width: int, cursor: int) -> tuple[list[str], tuple[int, int]]:
    """Lay the draft out as rows and say where the caret lands.

    Wrapping is per character rather than per word on purpose: the caret has to
    follow the text exactly, and a word that jumped to the next line would move
    the caret out from under the character it is on.
    """
    if width <= 0:
        return [""], (0, 0)
    rows: list[list[str]] = [[]]
    column = 0
    caret = (0, 0)
    if cursor <= 0:
        caret = (0, 0)
    for index, ch in enumerate(text):
        if index == cursor:
            caret = (len(rows) - 1, column)
        if ch == "\n":
            rows.append([])
            column = 0
            continue
        from .ansi import char_width
        step = char_width(ch)
        if column + step > width:
            rows.append([])
            column = 0
            if index == cursor:
                caret = (len(rows) - 1, 0)
        rows[-1].append(ch)
        column += step
    if cursor >= len(text):
        caret = (len(rows) - 1, column)
    return ["".join(row) for row in rows], caret
