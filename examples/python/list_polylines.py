"""List active lines, newest change first."""

import json

from anywhere import call

result = call("GET", "/polylines")
print(json.dumps(result, ensure_ascii=False, indent=2))
