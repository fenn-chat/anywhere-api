"""PATCH /tags/{tag_id}: rename a tag of the person's own. Usage: python3 update_tag.py <tag_id>"""
import json
import sys
import urllib.parse
from anywhere import call

if len(sys.argv) != 2:
    sys.exit("usage: python3 update_tag.py <tag_id>")
result = call("PATCH", "/tags/" + urllib.parse.quote(sys.argv[1], safe=""), body={"name": "Paris favorites"})
print(json.dumps(result, ensure_ascii=False, indent=2))
