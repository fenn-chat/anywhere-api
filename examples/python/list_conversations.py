"""List every chat; optionally pass a person_id to filter by member."""
import json
import sys
from anywhere import pages
query = {"person_id": sys.argv[1]} if len(sys.argv) > 1 else {}
print(json.dumps(list(pages("/conversations", "conversations", query)), ensure_ascii=False, indent=2))
