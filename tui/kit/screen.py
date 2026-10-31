"""Terminal mode, size and key input.

Windows and POSIX disagree on every part of this, so the differences are
confined here: the rest of the client only ever sees key names like "up" or
"ctrl+c", and a size in columns and rows.
"""

from __future__ import annotations

import codecs
import os
import sys

IS_WINDOWS = os.name == "nt"

CSI_HOME = "\x1b[H"
CSI_CLEAR = "\x1b[2J"
HIDE_CURSOR = "\x1b[?25l"
SHOW_CURSOR = "\x1b[?25h"
ALT_SCREEN_ON = "\x1b[?1049h"
ALT_SCREEN_OFF = "\x1b[?1049l"
WRAP_OFF = "\x1b[?7l"
WRAP_ON = "\x1b[?7h"

_SPECIAL_WINDOWS = {
    "H": "up", "P": "down", "K": "left", "M": "right",
    "G": "home", "O": "end", "S": "del", "I": "pgup", "Q": "pgdn",
    "R": "insert",
}

# Virtual key codes, for the console input record. Layout-independent: VK_UP is
# 0x26 on every keyboard, unlike the scan code.
VK_NAMES = {
    0x08: "bs",
    0x09: "tab",
    0x0D: "enter",
    0x1B: "esc",
    0x21: "pgup",
    0x22: "pgdn",
    0x23: "end",
    0x24: "home",
    0x25: "left",
    0x26: "up",
    0x27: "right",
    0x28: "down",
    0x2D: "insert",
    0x2E: "del",
}

SHIFT_PRESSED = 0x0010
LEFT_CTRL_PRESSED = 0x0008
RIGHT_CTRL_PRESSED = 0x0004
LEFT_ALT_PRESSED = 0x0002
RIGHT_ALT_PRESSED = 0x0001
CTRL_MASK = LEFT_CTRL_PRESSED | RIGHT_CTRL_PRESSED
ALT_MASK = LEFT_ALT_PRESSED | RIGHT_ALT_PRESSED


def win_key_name(vk: int, char: str, control: int) -> str | None:
    """One console key event to a key name, or None if it carries nothing.

    A record is not one key: the same press arrives twice (down and up), Ctrl
    arrives as a control character, and `a` arrives with both a virtual key
    code and a character. Deciding here, from the record alone, keeps that
    mess out of the reader and makes it testable without a console.
    """
    ctrl = bool(control & CTRL_MASK)
    alt = bool(control & ALT_MASK)
    if vk == 0x0D and control & SHIFT_PRESSED:
        return "shift+enter"
    named = VK_NAMES.get(vk)
    if ctrl and named is None:
        # Ctrl+letter: 'A' is 0x41, the control character is 0x01.
        if 0x01 <= ord(char or "\x00") <= 0x1A:
            return "ctrl+" + chr(ord(char) + 96)
        if 0x40 <= vk <= 0x5A:
            return "ctrl+" + chr(vk + 32)
        return None
    if named is not None:
        return named
    if alt and char:
        return "alt+" + char
    if char and char.isprintable():
        return char
    return None


# CSI final byte -> name for the POSIX parser.
_SPECIAL_CSI = {
    "A": "up", "B": "down", "C": "right", "D": "left",
    "H": "home", "F": "end", "Z": "btab",
    "~": {
        "1": "home", "2": "insert", "3": "del", "4": "end",
        "5": "pgup", "6": "pgdn", "7": "home", "8": "end",
    },
}


ENABLE_PROCESSED_INPUT = 0x0001
ENABLE_LINE_INPUT = 0x0002
ENABLE_ECHO_INPUT = 0x0004
ENABLE_MOUSE_INPUT = 0x0010
ENABLE_QUICK_EDIT_MODE = 0x0040
ENABLE_EXTENDED_FLAGS = 0x0080
ENABLE_VIRTUAL_TERMINAL_INPUT = 0x0200


def raw_input_mode(mode: int) -> int:
    """Console input mode for character-at-a-time reads.

    Every one of these flags has to go, and each breaks a different key:

    - processed input turns Ctrl+C into a signal, so the process dies instead
      of the turn being interrupted;
    - line input makes the console hold keys until Enter, so nothing the user
      types ever reaches the client;
    - echo input makes the console paint the keys itself at the caret, which
      looks like typing works while the client's own buffer stays empty -- and
      it is why backspace appeared to do nothing: the erase was handled by the
      console, not by us;
    - quick edit lets a mouse selection freeze output until a key is pressed;
    - virtual-terminal input rewrites keys as escape sequences, so `getwch`
      stops returning 0x08 for backspace and the key table no longer matches.
    """
    value = mode & ~(ENABLE_PROCESSED_INPUT | ENABLE_LINE_INPUT | ENABLE_ECHO_INPUT)
    # Mouse records are queued whether or not anything reads them, and every
    # one of them wakes the reader for a key that turns out to be a no-op.
    value &= ~(ENABLE_VIRTUAL_TERMINAL_INPUT | ENABLE_MOUSE_INPUT)
    value |= ENABLE_EXTENDED_FLAGS
    return value & ~ENABLE_QUICK_EDIT_MODE


class Terminal:
    """Raw-mode alternate screen with a guaranteed restore."""

    def __init__(self, stream=None):
        self.stream = stream or sys.stdout
        self._saved = None
        self._saved_mode = None
        self._active = False
        # None = not attempted (POSIX or no console), True = raw mode applied,
        # False = the console refused, in which case keys will echo twice and
        # line editing will eat them until Enter. Callers surface that.
        self.raw_ok: bool | None = None

    def __enter__(self):
        self.enter()
        return self

    def __exit__(self, *exc):
        self.leave()
        return False

    def _console_mode(self, raw: bool) -> None:
        if not IS_WINDOWS:
            return
        try:
            import ctypes

            kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
            handle = kernel32.GetStdHandle(-10)
            mode = ctypes.c_uint()
            if not kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
                self.raw_ok = False
                return
            if raw:
                self._saved_mode = mode.value
                value = raw_input_mode(mode.value)
            else:
                value = self._saved_mode if self._saved_mode is not None else mode.value
            written = kernel32.SetConsoleMode(handle, value)
            if raw:
                self.raw_ok = bool(written)
        except Exception:
            if raw:
                self.raw_ok = False

    def enter(self) -> None:
        if self._active:
            return
        if IS_WINDOWS:
            self._console_mode(True)
        else:
            try:
                import termios
                import tty
                self._saved = termios.tcgetattr(sys.stdin.fileno())
                tty.setraw(sys.stdin.fileno())
            except Exception:
                self._saved = None
        self.write(ALT_SCREEN_ON + CSI_CLEAR + CSI_HOME + HIDE_CURSOR + WRAP_OFF)
        self._active = True

    def leave(self) -> None:
        if not self._active:
            return
        self.write(WRAP_ON + SHOW_CURSOR + ALT_SCREEN_OFF)
        if IS_WINDOWS:
            self._console_mode(False)
        elif self._saved is not None:
            try:
                import termios
                termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, self._saved)
            except Exception:
                pass
            self._saved = None
        self._active = False

    def write(self, text: str) -> None:
        self.stream.write(text)
        self.stream.flush()

    def size(self) -> tuple[int, int]:
        try:
            columns, rows = os.get_terminal_size(self.stream.fileno())
        except (OSError, ValueError, AttributeError):
            try:
                columns, rows = os.get_terminal_size()
            except OSError:
                columns, rows = 100, 30
        # One row is kept free so a stray newline cannot scroll the alt screen.
        return max(20, columns), max(8, rows - 1)


def console_record_types():
    """The two Win32 structs `ReadConsoleInputW` fills in.

    Split out of the reader so the layout can be asserted without a console:
    if these offsets drift, every key decodes to garbage, and the symptom looks
    like "the keyboard does not work" rather than "a struct is wrong".
    Expected: KEY_EVENT_RECORD is 16 bytes, INPUT_RECORD is 20.
    """
    import ctypes
    from ctypes import wintypes

    class KeyEvent(ctypes.Structure):
        _fields_ = [
            ("bKeyDown", wintypes.BOOL),
            ("wRepeatCount", wintypes.WORD),
            ("wVirtualKeyCode", wintypes.WORD),
            ("wVirtualScanCode", wintypes.WORD),
            ("uChar", ctypes.c_wchar),
            ("dwControlKeyState", wintypes.DWORD),
        ]

    class Event(ctypes.Union):
        _fields_ = [("KeyEvent", KeyEvent), ("_raw", ctypes.c_byte * 16)]

    class Record(ctypes.Structure):
        _fields_ = [("EventType", wintypes.WORD), ("Event", Event)]

    return KeyEvent, Record


class _ConsoleInput:
    """Key events straight from the Windows console input queue.

    `msvcrt.getwch()` inherits the console's line and echo modes: in a host
    that refuses those changes it keeps line editing, so Enter only terminates
    the line instead of being delivered as a key, and backspace is eaten by the
    console editor. `ReadConsoleInputW` reads the event queue itself, where
    every press is a record carrying a virtual key code, so neither mode can
    swallow a key. It also reports window resizes, which is otherwise polled.

    Constructing this on anything that is not a console leaves `.ok` False and
    the caller falls back to msvcrt.
    """

    KEY_EVENT = 0x0001
    RESIZE_EVENT = 0x0004
    WAIT_TIMEOUT = 258

    def __init__(self):
        self.ok = False
        self._kernel32 = None
        self._handle = None
        self._record_type = None
        self._wintypes = None
        self._ctypes = None
        if not IS_WINDOWS:
            return
        try:
            import ctypes
            from ctypes import wintypes

            _, Record = console_record_types()
            kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
            handle = kernel32.GetStdHandle(-10)
            kernel32.ReadConsoleInputW.argtypes = [
                wintypes.HANDLE, ctypes.POINTER(Record), wintypes.DWORD,
                ctypes.POINTER(wintypes.DWORD),
            ]
            kernel32.ReadConsoleInputW.restype = wintypes.BOOL
            kernel32.GetNumberOfConsoleInputEvents.argtypes = [
                wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD),
            ]
            kernel32.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
            kernel32.WaitForSingleObject.restype = wintypes.DWORD
            # The probe is the API we actually depend on, not GetConsoleMode:
            # some hosts refuse the mode change but still serve the queue, and
            # the queue is what makes Enter a key.
            probe = wintypes.DWORD()
            if not kernel32.GetNumberOfConsoleInputEvents(handle, ctypes.byref(probe)):
                return
            self._kernel32 = kernel32
            self._handle = handle
            self._record_type = Record
            self._wintypes = wintypes
            self._ctypes = ctypes
            self.ok = True
        except Exception:
            self.ok = False

    def _pending(self) -> bool:
        count = self._wintypes.DWORD()
        if not self._kernel32.GetNumberOfConsoleInputEvents(
                self._handle, self._ctypes.byref(count)):
            return False
        return count.value > 0

    def read(self, timeout: float) -> list[str]:
        keys: list[str] = []
        if not self.ok:
            return keys
        waited = self._kernel32.WaitForSingleObject(self._handle, max(0, int(timeout * 1000)))
        if waited == self.WAIT_TIMEOUT:
            return keys
        byref = self._ctypes.byref
        record = self._record_type()
        count = self._wintypes.DWORD()
        for _ in range(256):  # a bounded drain; a flood must not stall a frame
            if not self._kernel32.ReadConsoleInputW(self._handle, byref(record), 1, byref(count)):
                return keys
            if not count.value:
                return keys
            if record.EventType == self.KEY_EVENT:
                event = record.Event.KeyEvent
                if event.bKeyDown:
                    char = event.uChar or ""
                    if char == "\x00":
                        char = ""
                    name = win_key_name(event.wVirtualKeyCode, char,
                                        event.dwControlKeyState)
                    if name is not None:
                        keys.append(name)
            elif record.EventType == self.RESIZE_EVENT:
                keys.append("resize")
            if not self._pending():
                return keys
        return keys


class KeyReader:
    """Non-blocking key input, normalised to names."""

    def __init__(self, stream=None):
        self.stream = stream or sys.stdin
        # Text, not bytes: keys are compared as characters, and a UTF-8
        # character may arrive split across two reads.
        self._buffer = ""
        self._decoder = codecs.getincrementaldecoder("utf-8")("replace")
        self._console = _ConsoleInput() if IS_WINDOWS else None

    @property
    def using_console_queue(self) -> bool:
        """True when keys come from the console queue rather than msvcrt."""
        return self._console is not None and self._console.ok

    # -- windows -----------------------------------------------------------
    def _windows(self, timeout: float) -> list[str]:
        """msvcrt fallback for hosts that expose no console input queue."""
        import msvcrt
        import time

        deadline = time.monotonic() + timeout
        keys: list[str] = []
        while True:
            while msvcrt.kbhit():
                ch = msvcrt.getwch()
                if ch in ("\x00", "\xe0"):
                    second = msvcrt.getwch()
                    keys.append(_SPECIAL_WINDOWS.get(second, "unknown"))
                    continue
                keys.append(_normalise(ch))
            if keys or time.monotonic() >= deadline:
                return keys
            time.sleep(0.008)

    # -- posix -------------------------------------------------------------
    def _posix(self, timeout: float) -> list[str]:
        import select
        import time

        if not select.select([self.stream], [], [], timeout)[0] and not self._buffer:
            return []
        deadline = time.monotonic() + timeout
        while True:
            ready = select.select([self.stream], [], [], 0)[0]
            if not ready:
                break
            chunk = os.read(self.stream.fileno(), 4096)
            if not chunk:
                break
            # Decode incrementally: a UTF-8 character can straddle a read, and
            # decoding byte by byte turns every CJK keystroke into noise.
            self._buffer += self._decoder.decode(chunk)
            if time.monotonic() > deadline:
                break
        return self._drain_buffer()

    def _drain_buffer(self) -> list[str]:
        """Turn the pending text into key names, keeping any partial tail."""
        keys: list[str] = []
        data = self._buffer
        index = 0
        while index < len(data):
            char = data[index]
            if char == "\x1b":
                # A lone ESC is the escape key; a sequence continues with [ or O.
                if index + 1 >= len(data):
                    keys.append("esc")
                    index += 1
                    continue
                follower = data[index + 1]
                if follower in "[O":
                    end = index + 2
                    while end < len(data) and not ("@" <= data[end] <= "~"):
                        end += 1
                    if end >= len(data):
                        # Incomplete: keep it for the next read.
                        break
                    keys.append(self._parse_csi(data[index + 2:end], follower == "O"))
                    index = end + 1
                    continue
                if follower in "\r\n":
                    keys.append("alt+enter")
                    index += 2
                    continue
                keys.append("esc")
                index += 1
                continue
            keys.append(_normalise(char))
            index += 1
        self._buffer = data[index:]
        return keys

    def _parse_csi(self, body: str, ss3: bool) -> str:
        if ss3:
            return {"A": "up", "B": "down", "C": "right", "D": "left",
                    "H": "home", "F": "end"}.get(body, "unknown")
        final = body[-1] if body else ""
        params = body[:-1]
        if final == "~":
            table = _SPECIAL_CSI["~"]
            return table.get(params.split(";")[0], "unknown")
        return _SPECIAL_CSI.get(final, "unknown")  # type: ignore[return-value]

    # -- public ------------------------------------------------------------
    def read(self, timeout: float = 0.1) -> list[str]:
        if IS_WINDOWS:
            if self._console is not None and self._console.ok:
                return self._console.read(timeout)
            return self._windows(timeout)
        return self._posix(timeout)


def _normalise(ch: str) -> str:
    # A raw terminal sends CR for Enter and LF for Ctrl+J. Keeping them apart
    # is what makes a newline bindable; the two look identical otherwise.
    if ch == "\r":
        return "enter"
    if ch == "\n":
        return "ctrl+j"
    if ch == "\x7f" or ch == "\x08":
        return "bs"
    if ch == "\t":
        return "tab"
    if ch == "\x1b":
        return "esc"
    if len(ch) == 1 and ord(ch) < 32:
        return "ctrl+" + chr(ord(ch) + 96)
    return ch
