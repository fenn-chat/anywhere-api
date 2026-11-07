// List every chat; optionally pass a person_id to filter by member.
import { pages, type Query } from "./anywhere.ts";
const query: Query = process.argv[2] ? { person_id: process.argv[2] } : {};
const conversations = [];
for await (const conversation of pages<unknown>("/conversations", "conversations", query)) conversations.push(conversation);
console.log(JSON.stringify(conversations, null, 2));
