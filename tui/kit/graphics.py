"""Images in the terminal: the Kitty protocol, sixel, and an honest fallback.

Text cells are the only thing a line renderer can draw by itself, so an image
needs a graphics protocol underneath. Two exist that a terminal will speak
without an external viewer:

- Kitty's protocol takes the PNG bytes as they are and scales them into a
  rectangle of cells, so nothing here has to decode an image.
- Sixel takes raw pixels, so this module carries a small PNG decoder and a
  fixed palette. Sixel is what xterm-likes and WezTerm/iTerm understand.

Everything is best-effort: when neither is available the caller draws a line of
text instead, because a blank rectangle in the transcript is worse than a
caption.
"""

from __future__ import annotations

import base64
import os
import shutil
import struct
import subprocess
import zlib
from collections import OrderedDict

# The Kitty protocol and the sixel introducer are both escapes the renderer
# writes outside the text grid.
ST = "\x1b\\"
APC = "\x1b_G"

# Cells are about twice as tall as they are wide, which is what a picture's
# aspect ratio has to be corrected by when it is mapped onto them.
CELL_ASPECT = 2.0


def _term() -> str:
    return (os.environ.get("TERM") or "").lower()


def _program() -> str:
    return (os.environ.get("TERM_PROGRAM") or "").lower()


def kitty_available() -> bool:
    if os.environ.get("KITTY_WINDOW_ID"):
        return True
    if "kitty" in _term():
        return True
    return _program() in ("wezterm", "ghostty")


def sixel_available() -> bool:
    if _program() in ("wezterm", "iterm.app"):
        return True
    if "sixel" in _term():
        return True
    return "sixel" in (os.environ.get("XTERM_VERSION") or "").lower()


def kind() -> str:
    """Which protocol to draw with, or "" when the terminal has neither."""
    if kitty_available():
        return "kitty"
    if sixel_available():
        return "sixel"
    return ""


# -- reading an image's size, without decoding it -------------------------

def image_size(path: str) -> tuple[int, int]:
    """(width, height) in pixels, or (0, 0) when the format is unknown."""
    try:
        with open(path, "rb") as handle:
            head = handle.read(64)
            if head[:8] == b"\x89PNG\r\n\x1a\n":
                width, height = struct.unpack(">II", head[16:24])
                return int(width), int(height)
            if head[:2] == b"\xff\xd8":
                handle.seek(2)
                while True:
                    marker = handle.read(2)
                    if len(marker) < 2 or marker[0] != 0xFF:
                        return 0, 0
                    if marker[1] in (0xC0, 0xC1, 0xC2):
                        handle.read(3)
                        height, width = struct.unpack(">HH", handle.read(4))
                        return int(width), int(height)
                    length = struct.unpack(">H", handle.read(2))[0]
                    handle.seek(length - 2, os.SEEK_CUR)
            if head[:6] in (b"GIF87a", b"GIF89a"):
                width, height = struct.unpack("<HH", head[6:10])
                return int(width), int(height)
            if head[:2] == b"BM":
                width, height = struct.unpack("<ii", head[18:26])
                return abs(int(width)), abs(int(height))
    except (OSError, struct.error):
        return 0, 0
    return 0, 0


def cells_for(path: str, max_cols: int, max_rows: int) -> tuple[int, int]:
    """How many cells to give an image, keeping its aspect ratio."""
    width, height = image_size(path)
    if width <= 0 or height <= 0:
        return min(24, max_cols), min(10, max_rows)
    # One cell is CELL_ASPECT times taller than it is wide.
    rows_per_col = height / width / CELL_ASPECT
    cols = max(8, min(max_cols, 46))
    rows = max(2, round(cols * rows_per_col))
    if rows > max_rows:
        rows = max(2, max_rows)
        cols = max(8, round(rows / rows_per_col))
    return min(cols, max_cols), min(rows, max_rows)


# -- Kitty -----------------------------------------------------------------

_next_id = [0]


def new_image_id() -> int:
    _next_id[0] += 1
    return _next_id[0]


def kitty_upload(path: str, image_id: int) -> str:
    """Transmit the file once; placement happens per frame."""
    with open(path, "rb") as handle:
        payload = base64.standard_b64encode(handle.read()).decode("ascii")
    out: list[str] = []
    chunk = 4096
    first = True
    while payload:
        piece, payload = payload[:chunk], payload[chunk:]
        more = 1 if payload else 0
        if first:
            out.append(f"{APC}a=t,f=100,i={image_id},q=2,m={more};{piece}{ST}")
            first = False
        else:
            out.append(f"{APC}m={more};{piece}{ST}")
    return "".join(out)


def kitty_delete(image_id: int) -> str:
    return f"{APC}a=d,d=i,i={image_id},q=2{ST}"


def kitty_place(image_id: int, cols: int, rows: int) -> str:
    """Place an uploaded image at the cursor, scaled into `cols` x `rows`."""
    return (f"{APC}a=p,i={image_id},p=1,c={cols},r={rows},C=1,q=2{ST}")


# -- sixel -----------------------------------------------------------------

_PIXEL_CACHE: "OrderedDict[str, tuple[int, int, bytes]]" = OrderedDict()
_CACHE_LIMIT = 12


def _ffmpeg_png(path: str) -> bytes | None:
    """Turn any image ffmpeg understands into PNG bytes.

    This is the only way to read a JPEG here: a baseline JPEG decoder is a
    project of its own, and ffmpeg is already on most machines where somebody
    would look at a screenshot in a terminal.
    """
    tool = shutil.which("ffmpeg")
    if not tool:
        return None
    try:
        result = subprocess.run(
            [tool, "-v", "error", "-i", path, "-frames:v", "1",
             "-f", "image2pipe", "-vcodec", "png", "-"],
            capture_output=True, timeout=20)
    except (OSError, subprocess.SubprocessError):
        return None
    if result.returncode != 0 or not result.stdout:
        return None
    return result.stdout


def pixels(path: str) -> tuple[int, int, bytes] | None:
    """(width, height, rgb) for an image, whatever format it is in.

    Decoded once and kept: the transcript redraws on every keystroke, and
    decoding a screenshot each time would make the prompt feel broken.
    """
    try:
        info = os.stat(path)
    except OSError:
        return None
    key = f"{path}|{info.st_mtime_ns}|{info.st_size}"
    cached = _PIXEL_CACHE.get(key)
    if cached is not None:
        _PIXEL_CACHE.move_to_end(key)
        return cached
    decoded = _png_bytes(path)
    if decoded is None:
        converted = _ffmpeg_png(path)
        if converted:
            decoded = _decode_png(converted)
    if decoded is None:
        return None
    result = (decoded[0], decoded[1], decoded[2])
    _PIXEL_CACHE[key] = result
    # Evict the least recently used entry, not the whole cache: a transcript
    # with more pictures than the limit would otherwise re-decode all of them
    # on every keystroke.
    while len(_PIXEL_CACHE) > _CACHE_LIMIT:
        _PIXEL_CACHE.popitem(last=False)
    return result


def _png_bytes(path: str) -> tuple[int, int, bytes, int] | None:
    try:
        with open(path, "rb") as handle:
            return _decode_png(handle.read())
    except OSError:
        return None


def block_cells(path: str, max_cols: int, max_rows: int):
    """The picture as half-block cells: (upper hex, lower hex) per column.

    A cell draws two rows of pixels with one `▀`: its colour is the lower
    pixel and its background the upper one. That is text, so every terminal
    can do it -- no graphics protocol, and the colour layer already knows how
    to degrade a hex value to 256 or 16 colours.
    """
    decoded = pixels(path)
    if decoded is None:
        return None
    width, height, rgb = decoded
    cols, rows = cells_for(path, max_cols, max_rows)
    # One cell holds two pixel rows, so the sample grid is cols x rows*2 --
    # no cell multiplier here, that belongs to sixel.
    sample_w, sample_h, small = _resize(rgb, width, height, cols, rows * 2)
    out: list[list[tuple[str, str]]] = []
    for row in range(rows):
        line: list[tuple[str, str]] = []
        for column in range(cols):
            upper = ((row * 2) * sample_w + column) * 3
            lower = ((row * 2 + 1) * sample_w + column) * 3
            line.append(("#%02x%02x%02x" % tuple(small[upper:upper + 3]),
                         "#%02x%02x%02x" % tuple(small[lower:lower + 3])))
        out.append(line)
    return out


def _decode_png(data: bytes) -> tuple[int, int, bytes, int] | None:
    """Decode a PNG to RGB bytes. Returns (width, height, rgb, channels)."""
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    pos = 8
    width = height = 0
    depth = colour = 0
    interlace = 0
    idat = bytearray()
    palette = b""
    while pos + 8 <= len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        pos += 12 + length
        if kind == b"IHDR":
            width, height, depth, colour, _comp, _filter, interlace = struct.unpack(
                ">IIBBBBB", body)
        elif kind == b"PLTE":
            palette = body
        elif kind == b"IDAT":
            idat += body
        elif kind == b"IEND":
            break
    if width <= 0 or height <= 0 or depth != 8 or interlace:
        return None
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}.get(colour)
    if channels is None:
        return None
    try:
        raw = zlib.decompress(bytes(idat))
    except zlib.error:
        return None
    stride = width * channels
    out = bytearray(width * height * 3)
    previous = bytearray(stride)
    offset = 0
    for row in range(height):
        if offset >= len(raw):
            return None
        filter_type = raw[offset]
        offset += 1
        line = bytearray(raw[offset:offset + stride])
        offset += stride
        if filter_type == 1:
            for index in range(channels, stride):
                line[index] = (line[index] + line[index - channels]) & 0xFF
        elif filter_type == 2:
            for index in range(stride):
                line[index] = (line[index] + previous[index]) & 0xFF
        elif filter_type == 3:
            for index in range(stride):
                left = line[index - channels] if index >= channels else 0
                line[index] = (line[index] + ((left + previous[index]) >> 1)) & 0xFF
        elif filter_type == 4:
            for index in range(stride):
                left = line[index - channels] if index >= channels else 0
                up = previous[index]
                up_left = previous[index - channels] if index >= channels else 0
                estimate = left + up - up_left
                pa, pb, pc = abs(estimate - left), abs(estimate - up), abs(estimate - up_left)
                best = left if (pa <= pb and pa <= pc) else (up if pb <= pc else up_left)
                line[index] = (line[index] + best) & 0xFF
        previous = line
        for column in range(width):
            base = column * channels
            if colour == 3:
                index = line[base] * 3
                red, green, blue = (palette[index:index + 3] + b"\0\0\0")[:3]
            elif channels >= 3:
                red, green, blue = line[base], line[base + 1], line[base + 2]
            else:
                red = green = blue = line[base]
            target = (row * width + column) * 3
            out[target:target + 3] = bytes((red, green, blue))
    return width, height, bytes(out), 3


def _to_palette(rgb: bytes) -> tuple[list[tuple[int, int, int]], bytearray]:
    """A fixed 4x4x4 palette: no quantiser, but every colour is representable."""
    levels = (0, 85, 170, 255)
    palette = [(red, green, blue)
               for red in levels for green in levels for blue in levels]
    index_of: list[int] = []
    table = bytearray(len(rgb) // 3)
    for position in range(0, len(rgb), 3):
        red, green, blue = rgb[position], rgb[position + 1], rgb[position + 2]
        index = ((red // 85) << 4) | ((green // 85) << 2) | (blue // 85)
        table[index_of.__len__()] = index
        index_of.append(index)
    return palette, table


def _resize(rgb: bytes, width: int, height: int,
            target_w: int, target_h: int) -> tuple[int, int, bytes]:
    """Nearest-neighbour resample to an exact pixel size."""
    target_w = max(1, target_w)
    target_h = max(1, target_h)
    out = bytearray(target_w * target_h * 3)
    for y in range(target_h):
        source_y = min(height - 1, y * height // target_h)
        for x in range(target_w):
            source_x = min(width - 1, x * width // target_w)
            source = (source_y * width + source_x) * 3
            target = (y * target_w + x) * 3
            out[target:target + 3] = rgb[source:source + 3]
    return target_w, target_h, bytes(out)


def _sample(rgb: bytes, width: int, height: int,
            cols: int, rows: int) -> tuple[int, int, bytes]:
    """Resample into the cell box at sixel's pixel grid (2x4 per cell)."""
    return _resize(rgb, width, height, cols * 2, rows * 4)


def sixel(path: str, cols: int, rows: int) -> str:
    """Encode an image as sixel, scaled into the cell box. Empty on failure."""
    decoded = pixels(path)
    if decoded is None:
        return ""
    width, height, rgb = decoded
    small_w, small_h, small = _sample(rgb, width, height, cols, rows)
    palette, table = _to_palette(small)
    out = ["\x1bP0;1;0q", f'"1;1;{small_w};{small_h}']
    for red, green, blue in palette:
        out.append(f"#{palette.index((red, green, blue))}"
                   f";2;{red // 255 * 100};{green // 255 * 100};{blue // 255 * 100}")
    for top in range(0, small_h, 6):
        for colour_index in range(len(palette)):
            band = []
            used = False
            for x in range(small_w):
                bits = 0
                for offset in range(6):
                    y = top + offset
                    if y >= small_h:
                        continue
                    if table[y * small_w + x] == colour_index:
                        bits |= 1 << offset
                        used = True
                band.append(chr(63 + bits))
            if used:
                out.append(f"#{colour_index}" + "".join(band) + "$")
        out.append("-")
    out.append("\x1b\\")
    return "".join(out)


def caption(alt: str, path: str) -> str:
    """The one-line stand-in when no graphics protocol is available."""
    name = os.path.basename(path) or path
    width, height = image_size(path)
    size = f" {width}×{height}" if width and height else ""
    label = alt.strip() or name
    return f"[image] {label}{size}"
