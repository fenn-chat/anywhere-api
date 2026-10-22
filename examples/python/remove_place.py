"""DELETE /places/{place_id}: takes a saved place off the person's map. They are
told, and can undo it in the app.

Usage: python3 remove_place.py <place_id>
"""

import sys

from anywhere import call, place_path

if len(sys.argv) != 2:
    sys.exit("usage: python3 remove_place.py <place_id>")
result = call("DELETE", place_path(sys.argv[1]))
print(f"{result['outcome']}: {result['place']['name']} (change {result['change_id']}, undoable in the app)")
