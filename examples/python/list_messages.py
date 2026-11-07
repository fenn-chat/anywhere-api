"""Read all retained messages in the conversation passed as the first argument."""
import json
import sys
from urllib.parse import quote
from anywhere import pages
if len(sys.argv) < 2:
    sys.exit("Pass a conversation id from list_conversations")
path = "/conversations/" + quote(sys.argv[1], safe="") + "/messages"
print(json.dumps(list(pages(path, "messages")), ensure_ascii=False, indent=2))
