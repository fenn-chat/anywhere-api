"""DELETE /tags/{tag_id}: remove a tag of the person's own, keeping its places. Usage: python3 remove_tag.py <tag_id>"""
import json
import sys
import urllib.parse
from anywhere import call

if len(sys.argv) != 2:
    sys.exit("usage: python3 remove_tag.py <tag_id>")
print(json.dumps(call("DELETE", "/tags/" + urllib.parse.quote(sys.argv[1], safe="")), ensure_ascii=False, indent=2))
