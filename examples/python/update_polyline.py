"""Rename a line and preserve its expiry."""

import json
import sys
from urllib.parse import quote

from anywhere import call

if len(sys.argv) != 2:
    sys.exit("usage: python3 update_polyline.py <polyline_id>")
result = call(
    "PATCH", "/polylines/" + quote(sys.argv[1], safe=""),
    body={"name": "Evening waterfront walk"},
)
print(json.dumps(result, ensure_ascii=False, indent=2))
