import type { MessageType } from "../../schema/message";
import { clientDb } from "../db";
import { buildThreadList } from "../utils/build-thread-list";

export async function bulkPutMessages({
  messages,
}: {
  messages: MessageType[];
}) {
  const threads = await buildThreadList(messages);
  await clientDb
    .transaction("rw", clientDb.message, clientDb.thread, async () => {
      await clientDb.message.bulkPut(messages).catch((error) => {
        console.error("error in bulk put emails", error);
      });
      await clientDb.thread.bulkPut(threads).catch((error) => {
        console.error("error in bulk put threads", error);
      });
    })
    .catch((error) => {
      console.error("error in bulkPutMessages transaction", error);
    });
}
