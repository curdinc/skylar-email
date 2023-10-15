import type { ClientDb } from "@skylar/client-db";
import { bulkPutThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { modifyLabels } from "@skylar/gmail-api";

export async function trashThread({
  thread,
  email,
  accessToken,
  activeClientDb,
}: {
  thread: ThreadType;
  email: string;
  accessToken: string;
  activeClientDb: ClientDb;
}) {
  console.log(`Trash Thread`);

  const inboxIndex = thread.email_provider_labels.indexOf("INBOX");
  if (inboxIndex !== -1) {
    thread.email_provider_labels.splice(inboxIndex, 1);
  }

  const trashIndex = thread.email_provider_labels.indexOf("TRASH");
  if (trashIndex === -1) {
    thread.email_provider_labels.push("TRASH");
  }

  if (inboxIndex !== -1 || trashIndex === -1) {
    console.log("db change");
    await bulkPutThreads({
      db: activeClientDb,
      threads: [thread],
    });

    console.log("gmail change");
    const res = await modifyLabels({
      accessToken,
      addLabels: ["TRASH"],
      deleteLabels: ["INBOX"],
      emailId: email,
      messageId: thread.email_provider_thread_id,
    });
    console.log("res", res);
  }
}
