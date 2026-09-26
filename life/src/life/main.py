"""Main entry point for L.I.F.E gRPC server."""

import asyncio
import sys
import os

# Add gen/python to path for protobuf imports (must run BEFORE life imports)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from life.grpc.server import serve
from life.logging_setup import setup_logging


def main():
    """Run the L.I.F.E gRPC server."""
    try:
        asyncio.run(serve())
    except Exception:
        setup_logging(os.getenv("LIFE_DATA_DIR", "./data/life")).exception("LIFE terminated with an unhandled error")
        raise


if __name__ == "__main__":
    main()
