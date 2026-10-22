"""POST /places: saves a venue to the person's want-to-go list, with a note.

The outcome is created for a new place, merged when the venue was on the map
already. The Idempotency-Key makes a retry safe: retry with the same key,
never a new one.
"""

import uuid

from anywhere import call

result = call(
    "POST",
    "/places",
    body={
        "name": "Café de Flore",
        "lat": 48.854,
        "lng": 2.3326,
        "address": "172 Boulevard Saint-Germain, 75006 Paris, France",
        "category": "cafe",
        "status": "wantToGo",
        "note": "Hot chocolate on the terrace",
    },
    headers={"Idempotency-Key": str(uuid.uuid4())},
)
place = result["place"]
print(f"{result['outcome']}: {place['name']}, {place['status']} (id {place['id']})")
