"""GET /friends: all friends and the current locations they share with this person."""

import json

from anywhere import pages

print(json.dumps(list(pages("/friends", "friends")), ensure_ascii=False, indent=2))
