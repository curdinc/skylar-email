import type { ClientDb } from "@skylar/client-db";
import { bulkPutThreads } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { modifyLabels } from "@skylar/gmail-api";

export async function untrashThread({
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
  console.log(`Untrash Thread`);

  const inboxIndex = thread.email_provider_labels.indexOf("INBOX");
  if (inboxIndex === -1) {
    thread.email_provider_labels.push("INBOX");
  }

  const trashIndex = thread.email_provider_labels.indexOf("TRASH");
  if (trashIndex !== -1) {
    thread.email_provider_labels.splice(trashIndex, 1);
  }

  console.log(" thread.email_provider_labels", thread.email_provider_labels);
  if (inboxIndex === -1 || trashIndex !== -1) {
    console.log("db change");
    await bulkPutThreads({
      db: activeClientDb,
      threads: [thread],
    });
    console.log(" thread.email_provider_labels", thread.email_provider_labels);
    console.log("gmail change");
    const res = await modifyLabels({
      accessToken,
      addLabels: ["INBOX"],
      deleteLabels: ["TRASH"],
      emailId: email,
      messageId: thread.email_provider_thread_id,
    });
    console.log("res", res);
  }
}
