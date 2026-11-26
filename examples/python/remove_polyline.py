"""Delete a line and keep its linked places."""

import json
import sys
from urllib.parse import quote

from anywhere import call

if len(sys.argv) != 2:
    sys.exit("usage: python3 remove_polyline.py <polyline_id>")
result = call("DELETE", "/polylines/" + quote(sys.argv[1], safe=""))
print(json.dumps(result, ensure_ascii=False, indent=2))
