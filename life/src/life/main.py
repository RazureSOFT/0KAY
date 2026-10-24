import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from life.grpc.server import serve
from life.logging_setup import setup_logging


def main():
    try:
        asyncio.run(serve())
    except Exception:
        setup_logging(os.getenv("LIFE_DATA_DIR", "./data/life")).exception("LIFE terminated with an unhandled error")
        raise


if __name__ == "__main__":
    main()
