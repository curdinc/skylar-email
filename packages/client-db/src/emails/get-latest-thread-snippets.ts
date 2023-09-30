import type { ThreadIndexType, ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function getLatestUnreadThreadSnippets({
  db,
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  limit?: number;
  lastEntry?: ThreadType;
}) {
  if (lastEntry) {
    return db.thread
      .where("updated_at")
      .below(lastEntry.updated_at)
      .reverse()
      .and((thread) => {
        return ["UNREAD", "INBOX"].every((label) =>
          thread.email_provider_labels.includes(label),
        );
      })
      .limit(limit)
      .toArray();
  }

  return db.thread
    .orderBy("updated_at" satisfies keyof ThreadIndexType)
    .reverse()
    .and((thread) => {
      return ["UNREAD", "INBOX"].every((label) =>
        thread.email_provider_labels.includes(label),
      );
    })
    .limit(limit)
    .toArray();
}

export async function getLatestReadThreadSnippets({
  db,
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  limit?: number;
  lastEntry?: ThreadType;
}) {
  if (lastEntry) {
    return db.thread
      .where("updated_at")
      .below(lastEntry.updated_at)
      .reverse()
      .and((thread) => {
        return (
          thread.email_provider_labels.includes("INBOX") &&
          !thread.email_provider_labels.includes("UNREAD")
        );
      })
      .limit(limit)
      .toArray();
  }

  return db.thread
    .orderBy("updated_at" satisfies keyof ThreadIndexType)
    .reverse()
    .and((thread) => {
      return (
        thread.email_provider_labels.includes("INBOX") &&
        !thread.email_provider_labels.includes("UNREAD")
      );
    })
    .limit(limit)
    .toArray();
}
