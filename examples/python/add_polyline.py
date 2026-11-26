"""Draw a temporary waterfront walk."""

import json
import os
import uuid

from anywhere import call

result = call(
    "POST",
    "/polylines",
    body={
        "name": "Waterfront walk",
        "points": [
            {"lat": 37.7955, "lng": -122.3937},
            {"lat": 37.7973, "lng": -122.3951},
            {"lat": 37.7988, "lng": -122.3966},
        ],
        "color": "teal",
    },
    headers={"Idempotency-Key": os.environ.get("ANYWHERE_IDEMPOTENCY_KEY") or str(uuid.uuid4())},
)
print(json.dumps(result, ensure_ascii=False, indent=2))
