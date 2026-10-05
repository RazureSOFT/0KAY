"""File + console logging for the LIFE service.

Launchers often discard the child process stdout/stderr, so a rotating file log
under the data dir is the only reliable way to diagnose a startup crash.
"""

from __future__ import annotations

import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

_LOGGER_NAME = "life"


def _force_utf8_streams() -> None:
    """Make console output UTF-8 even when the launcher's locale is not.

    Core redirects the plugin's stdout/stderr into ``run.err.log``. On Windows
    the inherited stdio encoding is the ANSI codepage, so any non-ASCII text
    (Chinese user input, persona names) lands in the log as mojibake such as
    ``¿ªÊ¼ÉúÃü``. Reconfiguring both streams once at startup is cheaper and
    more reliable than rewriting every log call site.
    """
    for name in ("stdout", "stderr"):
        stream = getattr(sys, name, None)
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is None:
            continue
        try:
            reconfigure(encoding="utf-8", errors="backslashreplace")
        except (ValueError, OSError):
            pass  # already detached / replaced by a test harness


def setup_logging(data_dir: str) -> logging.Logger:
    _force_utf8_streams()
    logger = logging.getLogger(_LOGGER_NAME)
    target = Path(os.path.abspath(os.path.join(str(data_dir), "life.log")))
    if logger.handlers:
        # A second call with a *different* data dir must not keep writing to the
        # first file, so only short-circuit when the file target is unchanged.
        file_handlers = [h for h in logger.handlers if isinstance(h, RotatingFileHandler)]
        if file_handlers and all(Path(os.path.abspath(h.baseFilename)) == target for h in file_handlers):
            return logger
        for handler in file_handlers:
            logger.removeHandler(handler)
            try:
                handler.close()
            except Exception:  # pragma: no cover - best effort
                pass
    logger.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")

    # Reuse an existing console handler on a re-init so it is not duplicated.
    if not any(isinstance(h, logging.StreamHandler) and not isinstance(h, RotatingFileHandler)
               for h in logger.handlers):
        stream = logging.StreamHandler(sys.stderr)
        stream.setFormatter(formatter)
        logger.addHandler(stream)

    try:
        path = target
        path.parent.mkdir(parents=True, exist_ok=True)
        file_handler = RotatingFileHandler(path, maxBytes=5_000_000, backupCount=5, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except OSError:
        pass  # read-only data dir: console logging still works
    return logger


def get_logger(name: str = _LOGGER_NAME) -> logging.Logger:
    return logging.getLogger(name if name.startswith(_LOGGER_NAME) else f"{_LOGGER_NAME}.{name}")
