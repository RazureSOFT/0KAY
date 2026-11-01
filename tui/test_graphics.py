"""Images: reading them, encoding them, and putting them on screen.

The pictures here are generated in the test, so nothing depends on a file
that happens to be lying around.
"""

import io
import os
import struct
import tempfile
import unittest
import zlib

from kit import graphics
from kit.canvas import Frame, Renderer
from kit.theme import build

ESC = chr(27)
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def png_bytes(width, height, colour=(200, 30, 90), noise=False):
    def chunk(kind, body):
        crc = zlib.crc32(kind + body) & 0xFFFFFFFF
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", crc)
    if noise:
        # A solid colour compresses to almost nothing and would never need
        # more than one Kitty chunk.
        import random
        random.seed(7)
        raw = b"".join(b"\x00" + bytes(random.getrandbits(8) for _ in range(width * 3))
                       for _ in range(height))
    else:
        raw = b"".join(b"\x00" + bytes(colour) * width for _ in range(height))
    header = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    return (PNG_SIGNATURE + chunk(b"IHDR", header)
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


def make_png(path, width=8, height=4, colour=(200, 30, 90), noise=False):
    with open(path, "wb") as handle:
        handle.write(png_bytes(width, height, colour, noise))


def write_halves(path, width=20, height=10):
    """A picture that is white on the left and black on the right."""
    rows = []
    for _ in range(height):
        line = b"\x00"
        for x in range(width):
            line += bytes((255, 255, 255)) if x < width // 2 else bytes((0, 0, 0))
        rows.append(line)

    def chunk(kind, body):
        crc = zlib.crc32(kind + body) & 0xFFFFFFFF
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", crc)
    header = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    with open(path, "wb") as handle:
        handle.write(PNG_SIGNATURE + chunk(b"IHDR", header)
                     + chunk(b"IDAT", zlib.compress(b"".join(rows)))
                     + chunk(b"IEND", b""))


class Environment:
    """Swaps terminal-detection variables for the duration of one test."""

    def __init__(self, **values):
        self.values = values
        self.saved = {}

    def __enter__(self):
        self.saved = {key: os.environ.get(key) for key in self.values}
        for key, value in self.values.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        return self

    def __exit__(self, *exc):
        for key, value in self.saved.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value


class Size(unittest.TestCase):
    def test_a_png_reports_its_pixels(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path, 32, 16)
            self.assertEqual(graphics.image_size(path), (32, 16))

    def test_a_missing_file_is_not_an_error(self):
        self.assertEqual(graphics.image_size("/nope/none.png"), (0, 0))

    def test_a_gif_header_is_read(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.gif")
            with open(path, "wb") as handle:
                handle.write(b"GIF89a" + struct.pack("<HH", 12, 7))
            self.assertEqual(graphics.image_size(path), (12, 7))


class Cells(unittest.TestCase):
    def test_a_wide_image_gets_more_columns_than_rows(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "wide.png")
            make_png(path, 400, 100)
            cols, rows = graphics.cells_for(path, 40, 14)
            self.assertGreater(cols, rows)

    def test_a_tall_image_is_capped_by_the_row_limit(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "tall.png")
            make_png(path, 100, 800)
            cols, rows = graphics.cells_for(path, 40, 10)
            self.assertLessEqual(rows, 10)
            self.assertGreaterEqual(cols, 8)

    def test_the_cell_box_is_never_empty(self):
        cols, rows = graphics.cells_for("/nope/none.png", 40, 10)
        self.assertGreaterEqual(cols, 8)
        self.assertGreaterEqual(rows, 2)


class Kitty(unittest.TestCase):
    def test_the_upload_is_a_transmit_command(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path)
            payload = graphics.kitty_upload(path, 7)
        self.assertIn("a=t", payload)
        self.assertIn("i=7", payload)
        self.assertIn("f=100", payload)

    def test_a_large_image_is_chunked(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "big.png")
            make_png(path, 120, 120, noise=True)
            payload = graphics.kitty_upload(path, 3)
        self.assertGreater(payload.count("m=1"), 1, "more than one chunk")
        self.assertIn("m=0", payload, "the last chunk ends the transfer")

    def test_placement_scales_into_cells(self):
        placed = graphics.kitty_place(5, 20, 8)
        self.assertIn("a=p", placed)
        self.assertIn("c=20", placed)
        self.assertIn("r=8", placed)

    def test_deleting_names_the_image(self):
        self.assertIn("d=i", graphics.kitty_delete(9))
        self.assertIn("i=9", graphics.kitty_delete(9))


class Sixel(unittest.TestCase):
    def test_a_png_decodes_and_encodes(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path, 16, 8)
            data = graphics.sixel(path, 8, 3)
        self.assertTrue(data.startswith(ESC + "P"), "a sixel introducer")
        self.assertTrue(data.endswith(ESC + chr(92)))
        self.assertIn("#", data)

    def test_a_non_image_is_refused_instead_of_garbled(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.bin")
            with open(path, "wb") as handle:
                handle.write(b"not really an image")
            self.assertEqual(graphics.sixel(path, 8, 3), "")


class Detection(unittest.TestCase):
    def test_kitty_is_detected_from_its_own_variable(self):
        with Environment(KITTY_WINDOW_ID="1", TERM_PROGRAM=None, TERM="xterm"):
            self.assertEqual(graphics.kind(), "kitty")

    def test_sixel_is_detected_from_iterm(self):
        with Environment(KITTY_WINDOW_ID=None, TERM_PROGRAM="iTerm.app", TERM="xterm"):
            self.assertEqual(graphics.kind(), "sixel")

    def test_a_plain_terminal_has_neither(self):
        with Environment(KITTY_WINDOW_ID=None, TERM_PROGRAM=None,
                         TERM="xterm-256color", WT_SESSION="1"):
            self.assertEqual(graphics.kind(), "")


class Painting(unittest.TestCase):
    def _draw(self, kind):
        values = {"KITTY_WINDOW_ID": "1" if kind == "kitty" else None,
                  "TERM_PROGRAM": "iTerm.app" if kind == "sixel" else None,
                  "TERM": "xterm"}
        with Environment(**values):
            frame = Frame(40, 12)
            with tempfile.TemporaryDirectory() as folder:
                path = os.path.join(folder, "a.png")
                make_png(path, 40, 10)
                frame.image(2, 3, 10, 4, path, "a shot")
                out = io.StringIO()
                Renderer(out, build("dark").colour).draw(frame, (0, 0))
                return out.getvalue()

    def test_kitty_places_the_picture_at_its_cell(self):
        painted = self._draw("kitty")
        self.assertIn(ESC + "_Ga=", painted)
        self.assertIn("[4;3H", painted, "row 3, column 2, one-based")

    def test_sixel_writes_the_picture_body(self):
        self.assertIn(ESC + "P", self._draw("sixel"))

    def test_without_a_protocol_nothing_is_painted(self):
        frame = Frame(40, 12)
        frame.image(0, 0, 10, 4, "/nope.png")
        out = io.StringIO()
        with Environment(KITTY_WINDOW_ID=None, TERM_PROGRAM=None,
                         TERM="xterm-256color", XTERM_VERSION=None):
            Renderer(out, build("dark").colour).draw(frame, None)
        self.assertNotIn(ESC + "_G", out.getvalue())


class Blocks(unittest.TestCase):
    """Half blocks: the picture as text, so any colour terminal can show it."""

    def test_a_png_becomes_two_rows_of_pixels_per_cell(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path, 16, 16, colour=(10, 120, 200))
            cells = graphics.block_cells(path, 16, 8)
        self.assertTrue(cells)
        self.assertLessEqual(len(cells), 8)
        self.assertEqual(cells[0][0], ("#0a78c8", "#0a78c8"))

    def test_the_shape_survives_the_sampling(self):
        # Regression: the sampler multiplied the cell box by its pixel grid a
        # second time, so only one quadrant of the picture was ever read.
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "half.png")
            write_halves(path)
            cells = graphics.block_cells(path, 20, 5)
        left = [int(line[0][0][1:3], 16) for line in cells]
        right = [int(line[-1][0][1:3], 16) for line in cells]
        self.assertGreater(min(left), 200, "the left edge is the white half")
        self.assertLess(max(right), 40, "the right edge is the black half")

    def test_an_undecodable_file_returns_nothing(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.bin")
            with open(path, "wb") as handle:
                handle.write(b"not an image at all")
            self.assertIsNone(graphics.block_cells(path, 10, 4))

    def test_a_jpeg_is_read_through_ffmpeg_when_it_is_there(self):
        tool = graphics.shutil.which("ffmpeg")
        if not tool:
            self.skipTest("no ffmpeg to convert with")
        import subprocess
        with tempfile.TemporaryDirectory() as folder:
            png = os.path.join(folder, "a.png")
            make_png(png, 16, 16, colour=(0, 200, 40))
            jpeg = os.path.join(folder, "a.jpg")
            done = subprocess.run([tool, "-v", "error", "-i", png,
                                   "-frames:v", "1", jpeg], capture_output=True)
            self.assertEqual(done.returncode, 0)
            decoded = graphics.pixels(jpeg)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded[:2], (16, 16))

    def test_pixels_are_decoded_once(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path, 8, 8)
            first = graphics.pixels(path)
            second = graphics.pixels(path)
        self.assertIs(first, second, "the cache returns the same object")


class MarkdownImageChoice(unittest.TestCase):
    """A protocol gets a rectangle; everything else gets blocks."""

    def _render(self, protocol):
        from kit import markdown
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a.png")
            make_png(path, 16, 16, colour=(20, 30, 40))
            images = []
            rows = markdown.render("![shot](a.png)", 40, build("dark"),
                                   images=images, base=folder, protocol=protocol)
            return rows, images

    def test_with_a_protocol_the_rows_are_reserved_and_recorded(self):
        rows, images = self._render(True)
        self.assertEqual(len(images), 1)
        self.assertTrue(all("".join(t for t, _ in row).strip() == "" for row in rows))

    def test_without_a_protocol_the_picture_is_drawn_in_blocks(self):
        rows, images = self._render(False)
        self.assertEqual(images, [])
        self.assertIn(chr(0x2580), "".join(t for t, _ in rows[0]))

    def test_a_missing_file_still_gets_a_caption(self):
        from kit import markdown
        rows = markdown.render("![gone](/nope/none.png)", 40, build("dark"),
                               images=[], protocol=False)
        self.assertIn("[image]", "".join(t for t, _ in rows[0]))


class Caption(unittest.TestCase):
    def test_a_caption_names_the_file_and_its_size(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "shot.png")
            make_png(path, 64, 32)
            text = graphics.caption("the login page", path)
        self.assertIn("the login page", text)
        self.assertIn("64×32", text)

    def test_without_an_alt_it_falls_back_to_the_file_name(self):
        self.assertIn("shot.png", graphics.caption("", "/tmp/shot.png"))


if __name__ == "__main__":
    unittest.main()
