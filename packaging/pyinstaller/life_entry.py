"""PyInstaller entry point for the L.I.F.E plugin.

`life.main` inserts a source-tree path to the generated protobuf modules; in a
frozen build those modules are bundled, so the insert is a harmless no-op.
"""

from life.main import main

if __name__ == "__main__":
    main()
