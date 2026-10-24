from __future__ import annotations

import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

_LOGGER_NAME = "life"


def _force_utf8_streams() -> None:
    for name in ("stdout", "stderr"):
        stream = getattr(sys, name, None)
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure is None:
            continue
        try:
            reconfigure(encoding="utf-8", errors="backslashreplace")
        except (ValueError, OSError):
            pass


def setup_logging(data_dir: str) -> logging.Logger:
    _force_utf8_streams()
    logger = logging.getLogger(_LOGGER_NAME)
    target = Path(os.path.abspath(os.path.join(str(data_dir), "life.log")))
    if logger.handlers:
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
        pass
    return logger


def get_logger(name: str = _LOGGER_NAME) -> logging.Logger:
    return logging.getLogger(name if name.startswith(_LOGGER_NAME) else f"{_LOGGER_NAME}.{name}")
