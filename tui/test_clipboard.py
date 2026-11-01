"""Turning a clipboard bitmap into a PNG, and putting it in the draft.

The bitmap the Windows clipboard holds is a CF_DIB: a bare
BITMAPINFOHEADER followed by rows of pixels, with no file header and no
compression. These tests build those payloads by hand so the parser is
exercised on the shapes that actually show up -- screenshots are 32 bit,
older captures are 24 or 8, and a bitmap can be stored bottom-up or top-down.
"""

import os
import socket
import struct
import tempfile
import unittest
from unittest import mock

from kit import client, clipboard, graphics, markdown
from kit.theme import build
from test_kit import make_app


def pump(app, predicate, timeout=3.0):
    """Drain the queue until `predicate` holds: the turn lands on a thread."""
    import time
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        app._drain()
        if predicate():
            return True
        time.sleep(0.01)
    return predicate()


def dib(rows, *, bits=32, top_down=False, compression=0, palette=None,
        header_size=40):
    """A CF_DIB payload with the pixels in the order the header describes."""
    height = len(rows)
    width = len(rows[0]) if height else 0
    stored = list(rows) if top_down else list(reversed(rows))
    signed_height = -height if top_down else height
    head = struct.pack("<IiiHHIIiiII", header_size, width, signed_height, 1,
                       bits, compression, 0, 2835, 2835,
                       len(palette) if palette else 0, 0)
    body = b""
    if palette:
        for red, green, blue in palette:
            body += bytes((blue, green, red, 0))
    for row in stored:
        if bits == 32:
            line = b"".join(bytes((blue, green, red, 255))
                            for red, green, blue in row)
        elif bits == 24:
            line = b"".join(bytes((blue, green, red)) for red, green, blue in row)
        else:
            line = bytes(row)
        pad = (-len(line)) % 4
        body += line + b"\x00" * pad
    return head + body


def decode(png: bytes):
    """Decode the PNG we produced, using the renderer's own reader."""
    with tempfile.TemporaryDirectory() as folder:
        path = os.path.join(folder, "out.png")
        with open(path, "wb") as handle:
            handle.write(png)
        return graphics.pixels(path)


def pixel(decoded, x, y):
    width, _height, rgb = decoded
    start = (y * width + x) * 3
    return tuple(rgb[start:start + 3])


class Bitmaps(unittest.TestCase):
    def test_a_32_bit_screenshot_comes_out_the_right_way_up(self):
        rows = [[(10 * x % 256, 20 * y % 256, 128) for x in range(4)]
                for y in range(3)]
        decoded = decode(clipboard._dib_to_png(dib(rows)))
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded[:2], (4, 3))
        self.assertEqual(pixel(decoded, 0, 0), rows[0][0])
        self.assertEqual(pixel(decoded, 3, 2), rows[2][3])

    def test_a_top_down_bitmap_is_not_flipped(self):
        rows = [[(255, 0, 0), (0, 0, 0)],
                [(0, 255, 0), (0, 0, 255)]]
        decoded = decode(clipboard._dib_to_png(dib(rows, top_down=True)))
        self.assertEqual(pixel(decoded, 0, 0), (255, 0, 0))
        self.assertEqual(pixel(decoded, 0, 1), (0, 255, 0))

    def test_a_bottom_up_bitmap_is_flipped_the_right_way(self):
        # Stored bottom-up, so the first row in the file is the last on screen.
        rows = [[(255, 0, 0)], [(0, 0, 255)]]
        decoded = decode(clipboard._dib_to_png(dib(rows)))
        self.assertEqual(pixel(decoded, 0, 0), (255, 0, 0))

    def test_24_bit_pixels_are_read_as_bgr(self):
        rows = [[(1, 2, 3), (4, 5, 6)]]
        decoded = decode(clipboard._dib_to_png(dib(rows, bits=24)))
        self.assertEqual(pixel(decoded, 0, 0), (1, 2, 3))
        self.assertEqual(pixel(decoded, 1, 0), (4, 5, 6))

    def test_8_bit_goes_through_the_palette(self):
        palette = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
        rows = [[0, 1, 2]]
        decoded = decode(clipboard._dib_to_png(dib(rows, bits=8, palette=palette)))
        self.assertEqual(pixel(decoded, 0, 0), (255, 0, 0))
        self.assertEqual(pixel(decoded, 2, 0), (0, 0, 255))

    def test_a_width_that_is_not_a_multiple_of_four_is_unpadded_correctly(self):
        # Three 24-bit pixels are 9 bytes, so each row carries 3 bytes of pad.
        rows = [[(9, 9, 9), (9, 9, 9), (9, 9, 9)],
                [(8, 8, 8), (8, 8, 8), (8, 8, 8)]]
        decoded = decode(clipboard._dib_to_png(dib(rows, bits=24)))
        self.assertEqual(pixel(decoded, 2, 0), (9, 9, 9))
        self.assertEqual(pixel(decoded, 2, 1), (8, 8, 8))

    def test_an_unknown_compression_is_refused_rather_than_guessed(self):
        rows = [[(1, 2, 3)]]
        self.assertIsNone(clipboard._dib_to_png(dib(rows, compression=4)))

    def test_a_truncated_bitmap_is_refused(self):
        payload = dib([[(1, 2, 3)] * 4] * 4)
        self.assertIsNone(clipboard._dib_to_png(payload[:80]))

    def test_rubbish_is_refused(self):
        self.assertIsNone(clipboard._dib_to_png(b"not a bitmap at all"))
        self.assertIsNone(clipboard._dib_to_png(b""))

    def test_a_1_bit_bitmap_is_out_of_scope(self):
        # Not produced by any modern screenshot tool; refusing beats guessing.
        header = struct.pack("<IiiHHIIiiII", 40, 8, 1, 1, 1, 0, 0, 2835, 2835, 2, 0)
        self.assertIsNone(clipboard._dib_to_png(header + b"\x00" * 8))


class Saving(unittest.TestCase):
    def test_the_png_is_written_and_its_path_returned(self):
        png = clipboard._encode_png(2, 1, [bytes((255, 0, 0, 0, 255, 0))])
        with tempfile.TemporaryDirectory() as folder, \
                mock.patch.object(clipboard, "_png_bytes", return_value=png):
            path = clipboard.save_image(os.path.join(folder, "pasted"))
            self.assertIsNotNone(path)
            self.assertTrue(path.endswith(".png"))
            self.assertTrue(os.path.exists(path))
            self.assertEqual(decode(png)[:2], (2, 1))

    def test_an_empty_clipboard_returns_none_and_leaves_no_file(self):
        with tempfile.TemporaryDirectory() as folder, \
                mock.patch.object(clipboard, "_png_bytes", return_value=None), \
                mock.patch.object(clipboard, "_osascript_save", return_value=False):
            self.assertIsNone(clipboard.save_image(folder))
            self.assertEqual(os.listdir(folder), [])

    def test_two_pastes_do_not_overwrite_each_other(self):
        png = clipboard._encode_png(1, 1, [bytes((0, 0, 0))])
        with tempfile.TemporaryDirectory() as folder, \
                mock.patch.object(clipboard, "_png_bytes", return_value=png), \
                mock.patch.object(clipboard, "_name",
                                  side_effect=["a.png", "b.png"]):
            first = clipboard.save_image(folder)
            second = clipboard.save_image(folder)
            self.assertNotEqual(first, second)
            self.assertEqual(len(os.listdir(folder)), 2)


class Draft(unittest.TestCase):
    """The whole point: a picture ends up as a reference in the prompt."""

    def test_ctrl_v_puts_a_reference_in_the_draft(self):
        app, _ = make_app()
        app.queue.put(("image", "/tmp/pasted/clip-1.png", None))
        app._drain()
        self.assertEqual("".join(app.buffer), "![pasted](/tmp/pasted/clip-1.png)")
        self.assertTrue([n for n in app.notices if "clip-1.png" in n.text])
        self.assertEqual(app.pending, [], "pasting a picture sends nothing")

    def test_an_empty_clipboard_says_so_and_inserts_nothing(self):
        app, _ = make_app()
        app.queue.put(("image", "", None))
        app._drain()
        self.assertEqual("".join(app.buffer), "")
        self.assertTrue([n for n in app.notices if "image" in n.text
                         or "图片" in n.text])

    def test_the_image_lands_where_the_caret_is(self):
        app, _ = make_app()
        for char in "看图：":
            app._handle_key(char)
        app.queue.put(("image", "/tmp/x.png", None))
        app._drain()
        self.assertEqual("".join(app.buffer), "看图：![pasted](/tmp/x.png)")

    def test_pasting_goes_through_a_worker_not_the_drawing_thread(self):
        app, _ = make_app()
        with mock.patch.object(clipboard, "save_image", return_value="/tmp/a.png"):
            app._paste_image()          # returns at once
            for _ in range(200):
                app._drain()
                if app.buffer:
                    break
                import time
                time.sleep(0.01)
        self.assertEqual("".join(app.buffer), "![pasted](/tmp/a.png)")


class Paths(unittest.TestCase):
    def test_a_path_with_spaces_is_still_an_image(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "my shot.png")
            with open(path, "wb") as handle:
                handle.write(clipboard._encode_png(1, 1, [bytes((0, 0, 0))]))
            images = []
            rows = markdown.render(f"![shot]({path})", 40, build("dark"),
                                   images=images, protocol=True)
            self.assertEqual(len(images), 1)
            self.assertEqual(images[0]["path"], path)
            self.assertTrue(rows)

    def test_a_windows_style_path_is_understood(self):
        source = "C:\\Users\\me\\shot.png"
        self.assertEqual(markdown._local_path(source), "" if not os.path.exists(source)
                         else source)


class Attaching(unittest.TestCase):
    """A picture has to be uploaded: the agent cannot read this disk.

    The gateway stores the bytes and hands the agent a URL; the agent turns
    that into image content for the model. A path in the prompt alone is a
    string nobody can look at.
    """

    def _app_with_image(self):
        app, _capture = make_app()
        app.client.agent_rows = [{
            "plugin_id": "plugin_local", "name": "agent",
            "status": "PLUGIN_STATUS_HEALTHY", "address": "localhost:50054",
            "host": {"hostname": socket.gethostname(), "workdir": os.getcwd()},
        }]
        app._load_agents()
        folder = tempfile.mkdtemp()
        path = os.path.join(folder, "shot.png")
        with open(path, "wb") as handle:
            handle.write(clipboard._encode_png(2, 1, [bytes((9, 9, 9, 9, 9, 9))]))
        return app, path

    def test_the_picture_in_the_prompt_is_uploaded(self):
        app, path = self._app_with_image()
        refs = app._attachments_for(f"看看 ![shot]({path})")
        self.assertEqual(app.client.uploaded, [path])
        self.assertEqual(len(refs), 1)
        self.assertEqual(refs[0]["url"], "/api/files?file=file_1.png")
        self.assertEqual(refs[0]["mime"], "image/png")
        self.assertEqual(refs[0]["name"], "shot.png")

    def test_the_reference_carries_what_the_gateway_needs(self):
        app, path = self._app_with_image()
        ref = app._attachments_for(f"![a]({path})")[0]
        self.assertEqual(set(ref), {"name", "url", "mime", "size"})
        self.assertIsInstance(ref["size"], int)

    def test_a_prompt_without_pictures_uploads_nothing(self):
        app, _ = make_app()
        self.assertEqual(app._attachments_for("just words"), [])
        self.assertEqual(app.client.uploaded, [])

    def test_a_missing_file_is_not_uploaded(self):
        app, _ = make_app()
        self.assertEqual(app._attachments_for("![x](/nope/gone.png)"), [])
        self.assertEqual(app.client.uploaded, [])

    def test_a_failed_upload_is_reported_and_dropped(self):
        app, path = self._app_with_image()
        app.client.upload_error = "HTTP 413 too large"
        refs = app._attachments_for(f"![shot]({path})")
        self.assertEqual(refs, [], "the turn goes ahead without it")
        app._drain()
        said = " ".join(n.text for n in app.notices)
        self.assertIn("shot.png", said)
        self.assertIn("413", said)

    def test_the_turn_carries_the_attachment(self):
        app, path = self._app_with_image()
        for char in f"看 ![shot]({path})":
            app._handle_key(char)
        app._handle_key("enter")
        pump(app, lambda: app.client.sent_options)
        options = app.client.sent_options[-1]
        self.assertEqual(len(options["attachments"]), 1)
        self.assertEqual(options["attachments"][0]["url"],
                         "/api/files?file=file_1.png")

    def test_a_plain_turn_sends_no_attachments(self):
        app, _path = self._app_with_image()
        for char in "hello":
            app._handle_key(char)
        app._handle_key("enter")
        pump(app, lambda: app.client.sent_options)
        self.assertEqual(app.client.sent_options[-1]["attachments"], [])

    def test_the_model_being_able_to_see_is_said_out_loud(self):
        app, path = self._app_with_image()
        app._attachments_for(f"![shot]({path})")
        app._drain()
        self.assertTrue([n for n in app.notices
                         if "model" in n.text or "模型" in n.text])


class Wire(unittest.TestCase):
    """The multipart body is easy to get subtly wrong, so look at it."""

    def test_the_body_carries_the_bytes_and_a_filename(self):
        with tempfile.TemporaryDirectory() as folder:
            path = os.path.join(folder, "a b.png")
            with open(path, "wb") as handle:
                handle.write(b"\x89PNG\r\n\x1a\npayload")
            body, content_type = client.multipart(path, "BOUND")
        self.assertIn("boundary=BOUND", content_type)
        self.assertTrue(body.startswith(b"--BOUND\r\n"))
        self.assertIn(b'name="file"', body)
        self.assertIn(b'filename="a b.png"', body)
        self.assertIn(b"payload", body)
        self.assertTrue(body.endswith(b"\r\n--BOUND--\r\n"))

    def test_attachments_ride_along_only_when_there_are_some(self):
        sent = []
        stub = client.Client("http://127.0.0.1:1", timeout=0.1)
        stub.post = lambda path, body: sent.append((path, body)) or {}
        stub.send_message("s", "hi")
        self.assertNotIn("attachments", sent[-1][1])
        stub.send_message("s", "hi", attachments=[{"url": "/api/files?file=x"}])
        self.assertEqual(len(sent[-1][1]["attachments"]), 1)


if __name__ == "__main__":
    unittest.main()
