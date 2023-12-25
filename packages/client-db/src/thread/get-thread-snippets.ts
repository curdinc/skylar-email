import type { ThreadIndexType, ThreadType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { filterForEmails } from "../utils/thread-filters";

export async function getThreadSnippets({
  userEmails,
  sort = "DESC",
  orderBy = "updated_at",
  filters = [() => true],
  limit = 25,
  lastEntry,
}: {
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
      ? clientDb.thread
          .where(orderBy)
          .below(lastEntry[orderBy])
          .reverse()
          .and((thread) => actualFilters.every((f) => f(thread)))
          .limit(limit)
          .toArray()
      : clientDb.thread
          .where(orderBy)
          .below(lastEntry[orderBy])
          .and((thread) => actualFilters.every((f) => f(thread)))
          .limit(limit)
          .toArray();
  }

  return sort === "DESC"
    ? clientDb.thread
        .orderBy(orderBy)
        .reverse()
        .and((thread) => actualFilters.every((f) => f(thread)))
        .limit(limit)
        .toArray()
    : clientDb.thread
        .orderBy(orderBy)
        .and((thread) => actualFilters.every((f) => f(thread)))
        .limit(limit)
        .toArray();
}
