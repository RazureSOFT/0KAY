"""Upload a complete local model folder through the same API as the WebUI."""
import json
import sys
from pathlib import Path
import httpx

root = Path(sys.argv[1]).resolve()
paths = sorted(path for path in root.rglob('*') if path.is_file())
handles = []
try:
    for path in paths:
        handles.append(path.open('rb'))
    response = httpx.post('http://127.0.0.1:8080/api/live2d',
        files=[('files', (path.name, handle, 'application/octet-stream')) for path, handle in zip(paths, handles)],
        data={'paths': json.dumps([root.name + '/' + path.relative_to(root).as_posix() for path in paths])}, timeout=120)
    response.raise_for_status()
    print(response.text)
finally:
    for handle in handles:
        handle.close()
