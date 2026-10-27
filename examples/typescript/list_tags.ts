// GET /tags: every tag places have: the standard favorite and wantToGo first, then the person's own.
import { pages, type PlaceTag } from "./anywhere.ts";

const tags: PlaceTag[] = [];
for await (const tag of pages<PlaceTag>("/tags", "tags")) tags.push(tag);
console.log(JSON.stringify(tags, null, 2));
