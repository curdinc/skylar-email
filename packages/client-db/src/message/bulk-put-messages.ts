import type { MessageType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { buildThreadList } from "../utils/build-thread-list";

export async function bulkPutMessages({
  messages,
}: {
  messages: MessageType[];
}) {
  const threads = await buildThreadList(messages);
  await clientDb.transaction(
    "rw",
    clientDb.message,
    clientDb.thread,
    async () => {
      // https://dexie.org/docs/Promise/Promise.catch() - transaction will not abort
      await clientDb.message.bulkPut(messages).catch((error) => {
        console.info("failed to add some messages", error);
      });
      await clientDb.thread.bulkPut(threads).catch((error) => {
        console.info("failed to add some threads", error);
      });
    },
  );
}
