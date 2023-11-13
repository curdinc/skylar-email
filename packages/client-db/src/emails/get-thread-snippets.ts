import type { ThreadIndexType, ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";
import { filterForEmails } from "../lib/thread-filters";

export async function getThreadSnippets({
  db,
  userEmails,
  sort = "DESC",
  orderBy = "updated_at",
  filters = [() => true],
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  userEmails: string[];
  sort?: "ASC" | "DESC";
  orderBy?: keyof ThreadIndexType;
  filters?: ((thread: ThreadType) => boolean)[];
  limit?: number;
  lastEntry?: ThreadType;
}): Promise<ThreadType[]> {
  const actualFilters = [
    ...filters,
    filterForEmails({
      emails: userEmails,
    }),
  ];
  if (lastEntry) {
    return sort === "DESC"
      ? db.thread
          .where(orderBy)
          .below(lastEntry.updated_at)
          .reverse()
          .and((thread) => actualFilters.every((f) => f(thread)))
          .limit(limit)
          .toArray()
      : db.thread
          .where(orderBy)
          .below(lastEntry.updated_at)
          .and((thread) => actualFilters.every((f) => f(thread)))
          .limit(limit)
          .toArray();
  }

  return sort === "DESC"
    ? db.thread
        .orderBy(orderBy)
        .reverse()
        .and((thread) => actualFilters.every((f) => f(thread)))
        .limit(limit)
        .toArray()
    : db.thread
        .orderBy(orderBy)
        .and((thread) => actualFilters.every((f) => f(thread)))
        .limit(limit)
        .toArray();
}
