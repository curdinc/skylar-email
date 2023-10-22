import type { ThreadIndexType, ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";
import { filterForInbox, filterForUnread } from "../lib/thread-filters";

export async function getThreadSnippets({
  db,
  sort = "DESC",
  orderBy = "updated_at",
  filters = [() => true],
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  sort?: "ASC" | "DESC";
  orderBy?: keyof ThreadIndexType;
  filters?: ((thread: ThreadType) => boolean)[];
  limit?: number;
  lastEntry?: ThreadType;
}) {
  if (lastEntry) {
    return sort === "DESC"
      ? db.thread
          .where(orderBy)
          .below(lastEntry.updated_at)
          .reverse()
          .and((thread) => filters.every((f) => f(thread)))
          .limit(limit)
          .toArray()
      : db.thread
          .where(orderBy)
          .below(lastEntry.updated_at)
          .and((thread) => filters.every((f) => f(thread)))
          .limit(limit)
          .toArray();
  }

  return sort === "DESC"
    ? db.thread
        .orderBy(orderBy)
        .reverse()
        .and((thread) => filters.every((f) => f(thread)))
        .limit(limit)
        .toArray()
    : db.thread
        .orderBy(orderBy)
        .and((thread) => filters.every((f) => f(thread)))
        .limit(limit)
        .toArray();
}

export async function getLatestUnreadThreadSnippets({
  db,
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  limit?: number;
  lastEntry?: ThreadType;
}) {
  return getThreadSnippets({
    db,
    limit,
    lastEntry,
    filters: [filterForInbox(), filterForUnread()],
    orderBy: "updated_at",
    sort: "DESC",
  });
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
  return getThreadSnippets({
    db,
    limit,
    lastEntry,
    filters: [filterForInbox(), filterForUnread({ invert: true })],
    orderBy: "updated_at",
    sort: "DESC",
  });
}
