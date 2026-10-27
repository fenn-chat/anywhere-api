// POST /tags: create a tag of the person's own. Retry with the same Idempotency-Key.
import { call, type TagWriteResult } from "./anywhere.ts";

const result = await call<TagWriteResult>("POST", "/tags", {
  body: { name: "Paris cafés" }, headers: { "Idempotency-Key": crypto.randomUUID() },
});
console.log(JSON.stringify(result, null, 2));
