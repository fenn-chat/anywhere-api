"""GET /tags: every tag places have: the standard favorite and wantToGo first, then the person's own."""
import json
from anywhere import pages

print(json.dumps(list(pages("/tags", "tags")), ensure_ascii=False, indent=2))
