"""A cell grid and a renderer that only repaints what changed.

Repainting the whole screen every frame is what makes hand-written terminal
UIs flicker: the terminal clears, then redraws, and for one refresh the user
sees an empty screen. This keeps the previous frame and rewrites only the rows
whose rendered text actually differs, so a streaming answer touches one line.

Rows are compared after rendering, not cell by cell. Rendering is cheap at
these sizes and comparing strings catches style-only changes for free.
"""

from __future__ import annotations

from .ansi import PLAIN, Colour, char_width, display_width, render


class Frame:
    """One screenful of cells. Coordinates are 0-based columns and rows."""

    def __init__(self, width: int, height: int):
        self.width = max(1, width)
        self.height = max(1, height)
        self.reset()

    def reset(self) -> None:
        self._cells = [[(" ", PLAIN) for _ in range(self.width)] for _ in range(self.height)]

    def fill_row(self, y: int, char: str = " ", style=PLAIN) -> None:
        if 0 <= y < self.height:
            self._cells[y] = [(char, style) for _ in range(self.width)]

    def put(self, x: int, y: int, text: str, style=PLAIN, limit: int | None = None) -> int:
        """Write `text` at (x, y). Returns the column after the last glyph.

        A wide character claims two cells; the second holds "" so the renderer
        knows not to emit a trailing space that would shift the row.
        """
        if not (0 <= y < self.height):
            return x
        row = self._cells[y]
        right = self.width if limit is None else min(self.width, x + limit)
        cursor = x
        for ch in text:
            step = char_width(ch)
            if step == 0:
                # Combining marks attach to whatever was just written.
                target = cursor - 1
                if 0 <= target < self.width:
                    previous, previous_style = row[target]
                    row[target] = (previous + ch, previous_style)
                continue
            if cursor + step > right:
                break
            if cursor >= 0:
                row[cursor] = (ch, style)
                if step == 2 and cursor + 1 < self.width:
                    row[cursor + 1] = ("", style)
            cursor += step
        return cursor

    def put_spans(self, x: int, y: int, spans) -> int:
        cursor = x
        for text, style in spans:
            cursor = self.put(cursor, y, text, style if style is not None else PLAIN)
        return cursor

    def put_right(self, x_end: int, y: int, text: str, style=PLAIN) -> int:
        start = x_end - display_width(text)
        return self.put(start, y, text, style)

    def row_text(self, y: int) -> str:
        if not (0 <= y < self.height):
            return ""
        return "".join(ch for ch, _ in self._cells[y])

    def lines(self) -> list[str]:
        return [self.row_text(y) for y in range(self.height)]

    def render_row(self, y: int, colour: Colour) -> str:
        row = self._cells[y]
        # Trailing blanks are not emitted: the renderer erases the line first,
        # and sending a hundred spaces per row is pure traffic.
        end = len(row)
        while end > 0 and row[end - 1][0] in (" ", ""):
            end -= 1
        out: list[str] = []
        current = None
        buffer: list[str] = []
        for ch, style in row[:end]:
            if ch == "":
                continue
            style = style or PLAIN
            if current is None or style != current:
                if buffer:
                    out.append(render("".join(buffer), current, colour))
                    buffer = []
                current = style
            buffer.append(ch)
        if buffer:
            out.append(render("".join(buffer), current, colour))
        return "".join(out)


class Renderer:
    """Diffs frames and emits the minimum terminal traffic.

    `out` is any object with write(); the caller flushes.
    """

    def __init__(self, out, colour: Colour):
        self.out = out
        self.colour = colour
        self._previous: list[str] = []
        self._height = 0
        self._cursor: tuple[int, int] | None = None
        self._cursor_visible = False

    def invalidate(self) -> None:
        self._previous = []

    def draw(self, frame: Frame, cursor: tuple[int, int] | None = None) -> None:
        chunks: list[str] = []
        if len(self._previous) > frame.height:
            # The terminal got shorter: erase the orphaned rows.
            for y in range(frame.height, len(self._previous)):
                chunks.append(f"\x1b[{y + 1};1H\x1b[2K")
            self._previous = self._previous[: frame.height]

        rendered = [frame.render_row(y, self.colour) for y in range(frame.height)]
        for y, line in enumerate(rendered):
            if y < len(self._previous) and self._previous[y] == line:
                continue
            chunks.append(f"\x1b[{y + 1};1H\x1b[2K")
            chunks.append(line)

        self._previous = rendered

        if cursor is not None:
            row, column = cursor
            if 0 <= row < frame.height:
                chunks.append(f"\x1b[{row + 1};{column + 1}H")
                if not self._cursor_visible:
                    chunks.append("\x1b[?25h")
                    self._cursor_visible = True
            else:
                if self._cursor_visible:
                    chunks.append("\x1b[?25l")
                    self._cursor_visible = False
        elif self._cursor_visible:
            chunks.append("\x1b[?25l")
            self._cursor_visible = False

        if chunks:
            self.out.write("".join(chunks))
            self.out.flush()
