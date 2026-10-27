// DELETE /tags/{tag_id}: remove a tag of the person's own, keeping its places. Usage: node remove_tag.ts <tag_id>
import { call, type TagWriteResult } from "./anywhere.ts";

const id = process.argv[2];
if (!id) throw new Error("usage: node remove_tag.ts <tag_id>");
console.log(JSON.stringify(await call<TagWriteResult>("DELETE", `/tags/${encodeURIComponent(id)}`), null, 2));
