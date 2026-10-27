"""POST /tags: create a tag of the person's own. Retry with the same Idempotency-Key."""
import json
import uuid
from anywhere import call

result = call("POST", "/tags", body={"name": "Paris cafés"}, headers={"Idempotency-Key": str(uuid.uuid4())})
print(json.dumps(result, ensure_ascii=False, indent=2))
