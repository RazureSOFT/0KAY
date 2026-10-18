# okay-devkit (Python)

Tiny, stdlib-only client for the 0kay Core HTTP API.

```python
from okay_devkit import Okay

ok = Okay()                      # prompts for the Core port if unknown
ok.get_core().healthy            # 6
ok.get_plugin("agent").is_enabled
ok.get("/api/models")
```

Install: `pip install .` (from `devkit/python`), or unzip the release archive.
