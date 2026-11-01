"""Read a picture off the system clipboard.

Text arrives on its own: bracketed paste hands it over, and the key handler
treats it as text. A picture cannot arrive that way -- no terminal has a
sequence for "the clipboard holds an image" -- so it has to be fetched here
and written to a file the renderer already knows how to show.

Windows stores a screenshot as CF_DIB, a bare device-independent bitmap with
no file header. That is turned into PNG in pure Python: the encoder is thirty
lines of zlib, and asking for Pillow or ffmpeg would put a dependency on
something every user has to install first.
"""

from __future__ import annotations

import datetime
import os
import shutil
import struct
import subprocess
import sys
import zlib

# CF_DIB: the clipboard format a screenshot or a copied image lands in.
_CF_DIB = 8
_BI_RGB = 0
_BI_BITFIELDS = 3


def save_image(folder: str) -> str | None:
    """Write the clipboard's picture into `folder` as a PNG.

    Returns the path, or None when the clipboard holds no picture. Never
    raises: a clipboard read is a convenience, and a locked clipboard (another
    program holding it open) is a normal thing, not an error.
    """
    target = os.path.join(os.path.abspath(folder), _name())
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
    except OSError:
        return None
    payload = _png_bytes()
    if payload:
        try:
            with open(target, "wb") as handle:
                handle.write(payload)
        except OSError:
            return None
        return target
    # macOS has no pipe that carries a clipboard image; AppleScript writes a
    # file, so it is the one provider that owns the destination.
    if sys.platform == "darwin" and _osascript_save(target):
        return target
    return None


def _name() -> str:
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    return f"clip-{stamp}.png"


def _png_bytes() -> bytes | None:
    """The clipboard's picture as PNG, on whichever platform this is."""
    if sys.platform == "win32":
        return _windows_png()
    if sys.platform == "darwin":
        return _pngpaste()
    return _linux_png()


# -- windows ----------------------------------------------------------------

def _windows_png() -> bytes | None:
    import ctypes
    from ctypes import wintypes

    try:
        user32 = ctypes.WinDLL("user32", use_last_error=True)
        kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    except OSError:
        return None

    user32.IsClipboardFormatAvailable.argtypes = [wintypes.UINT]
    user32.IsClipboardFormatAvailable.restype = wintypes.BOOL
    user32.GetClipboardData.argtypes = [wintypes.UINT]
    user32.GetClipboardData.restype = wintypes.HANDLE
    user32.OpenClipboard.argtypes = [wintypes.HWND]
    user32.OpenClipboard.restype = wintypes.BOOL
    user32.CloseClipboard.restype = wintypes.BOOL
    kernel32.GlobalLock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalLock.restype = ctypes.c_void_p
    kernel32.GlobalUnlock.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalSize.argtypes = [wintypes.HGLOBAL]
    kernel32.GlobalSize.restype = ctypes.c_size_t

    if not user32.IsClipboardFormatAvailable(_CF_DIB):
        return None
    if not user32.OpenClipboard(None):
        return None
    try:
        handle = user32.GetClipboardData(_CF_DIB)
        if not handle:
            return None
        pointer = kernel32.GlobalLock(handle)
        if not pointer:
            return None
        try:
            size = kernel32.GlobalSize(handle)
            if not size:
                return None
            dib = ctypes.string_at(pointer, size)
        finally:
            kernel32.GlobalUnlock(handle)
    finally:
        user32.CloseClipboard()
    return _dib_to_png(dib)


def _dib_to_png(dib: bytes) -> bytes | None:
    """A CF_DIB payload to PNG bytes.

    Only uncompressed 8, 24 and 32 bit bitmaps are handled, which is what
    screenshots and copied images actually are. Anything else returns None
    rather than guessing at a layout.
    """
    if len(dib) < 40:
        return None
    (header_size, width, height, _planes, bits,
     compression, _image_size, _x, _y, colours_used, _important) = struct.unpack_from(
        "<IiiHHIIiiII", dib, 0)
    if compression not in (_BI_RGB, _BI_BITFIELDS):
        return None
    if bits not in (8, 24, 32):
        return None
    if width <= 0 or height == 0:
        return None

    top_down = height < 0
    rows_of_pixels = abs(height)
    offset = header_size
    if compression == _BI_BITFIELDS:
        offset += 12                     # three colour masks, unused for RGB

    palette: list[tuple[int, int, int]] = []
    if bits == 8:
        count = colours_used or 256
        for index in range(count):
            start = offset + index * 4
            if start + 4 > len(dib):
                break
            blue, green, red, _unused = dib[start:start + 4]
            palette.append((red, green, blue))
        offset += count * 4

    stride = ((width * bits + 31) // 32) * 4
    if offset + stride * rows_of_pixels > len(dib):
        return None

    rows: list[bytes] = []
    for row in range(rows_of_pixels):
        start = offset + row * stride
        if top_down:
            start = offset + row * stride
        else:
            start = offset + (rows_of_pixels - 1 - row) * stride
        line = dib[start:start + stride]
        if bits == 8:
            rows.append(b"".join(bytes(palette[value]) if value < len(palette)
                                 else b"\x00\x00\x00" for value in line[:width]))
        elif bits == 24:
            out = bytearray(width * 3)
            for x in range(width):
                blue, green, red = line[x * 3:x * 3 + 3]
                out[x * 3:x * 3 + 3] = bytes((red, green, blue))
            rows.append(bytes(out))
        else:
            out = bytearray(width * 3)
            for x in range(width):
                blue, green, red = line[x * 4:x * 4 + 3]
                out[x * 3:x * 3 + 3] = bytes((red, green, blue))
            rows.append(bytes(out))
    return _encode_png(width, rows_of_pixels, rows)


def _encode_png(width: int, height: int, rows: list[bytes]) -> bytes:
    """True-colour PNG, one filter byte per row and nothing fancy."""
    raw = b"".join(b"\x00" + row for row in rows)

    def chunk(kind: bytes, body: bytes) -> bytes:
        return (struct.pack(">I", len(body)) + kind + body
                + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF))

    header = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header)
            + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))


# -- macos and linux --------------------------------------------------------

def _run(command: list[str], timeout: float = 10.0) -> bytes | None:
    try:
        result = subprocess.run(command, capture_output=True, timeout=timeout)
    except (OSError, subprocess.SubprocessError):
        return None
    if result.returncode != 0:
        return None
    return result.stdout or None


def _pngpaste() -> bytes | None:
    """macOS: pngpaste is one binary and does exactly this."""
    tool = shutil.which("pngpaste")
    if not tool:
        return None
    payload = _run([tool, "-"])
    return payload if payload and payload.startswith(b"\x89PNG") else None


def _osascript_save(target: str) -> bool:
    """macOS without pngpaste: let AppleScript write the PNG itself."""
    script = (
        'set theImage to the clipboard as «class PNGf»\n'
        'set theFile to open for access POSIX file "{path}" with write permission\n'
        'write theImage to theFile\n'
        'close access theFile\n'
    ).format(path=target.replace('"', '\\"'))
    try:
        result = subprocess.run(["osascript", "-e", script],
                                capture_output=True, timeout=10)
    except (OSError, subprocess.SubprocessError):
        return False
    return result.returncode == 0 and os.path.exists(target)


def _linux_png() -> bytes | None:
    """Wayland first, then X11: both can pipe the image out."""
    for command in (["wl-paste", "-t", "image/png", "-n"],
                    ["xclip", "-selection", "clipboard", "-t", "image/png", "-o"]):
        if not shutil.which(command[0]):
            continue
        payload = _run(command)
        if payload and payload.startswith(b"\x89PNG"):
            return payload
    return None
