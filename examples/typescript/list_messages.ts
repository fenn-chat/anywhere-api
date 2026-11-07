// Read all retained messages in the conversation passed as the first argument.
import { pages } from "./anywhere.ts";
const id = process.argv[2];
if (!id) throw new Error("Pass a conversation id from list_conversations");
const messages = [];
for await (const message of pages<unknown>(`/conversations/${encodeURIComponent(id)}/messages`, "messages")) messages.push(message);
console.log(JSON.stringify(messages, null, 2));
