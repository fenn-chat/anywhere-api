// PATCH /tags/{tag_id}: rename a tag of the person's own. Usage: node update_tag.ts <tag_id>
import { call, type TagWriteResult } from "./anywhere.ts";

const id = process.argv[2];
if (!id) throw new Error("usage: node update_tag.ts <tag_id>");
console.log(JSON.stringify(await call<TagWriteResult>("PATCH", `/tags/${encodeURIComponent(id)}`, {
  body: { name: "Paris favorites" },
}), null, 2));
