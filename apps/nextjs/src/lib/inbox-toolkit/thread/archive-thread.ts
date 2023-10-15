import type { ClientDb } from "@skylar/client-db";
import { bulkPutThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { modifyLabels } from "@skylar/gmail-api";

export async function archiveThread({
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
  console.log("Archive Thread");

  const inboxIndex = thread.email_provider_labels.indexOf("INBOX");

  if (inboxIndex !== -1) {
    thread.email_provider_labels.splice(inboxIndex, 1);

    console.log("db change");
    await bulkPutThreads({
      db: activeClientDb,
      threads: [thread],
    });

    console.log("gmail change");
    const res = await modifyLabels({
      accessToken,
      addLabels: [],
      deleteLabels: ["INBOX"],
      emailId: email,
      messageId: thread.email_provider_thread_id,
    });
    console.log("res", res);
  }
}
