"""Main entry point for L.I.F.E gRPC server."""

import asyncio
import sys
import os

# Add gen/python to path for protobuf imports (must run BEFORE life imports)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', 'gen', 'python'))

from life.grpc.server import serve


def main():
    """Run the L.I.F.E gRPC server."""
    asyncio.run(serve())


if __name__ == "__main__":
    main()
