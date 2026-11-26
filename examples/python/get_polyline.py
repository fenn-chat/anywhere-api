"""Read one active line with its points."""

import json
import sys
from urllib.parse import quote

from anywhere import call

if len(sys.argv) != 2:
    sys.exit("usage: python3 get_polyline.py <polyline_id>")
result = call("GET", "/polylines/" + quote(sys.argv[1], safe=""))
print(json.dumps(result, ensure_ascii=False, indent=2))
