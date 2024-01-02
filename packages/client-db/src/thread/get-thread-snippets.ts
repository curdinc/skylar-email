import type { ThreadIndexType, ThreadType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { filterForEmails } from "../utils/thread-filters";

// A helper function we will use below.
// It will prevent the same results to be returned again for next page if we use a <= or >=
function _fastForward(
  lastRow: ThreadType,
  idProp: keyof ThreadIndexType,
  criterion: (item: ThreadType) => boolean,
) {
  let fastForwardComplete = false;
  return (item: ThreadType) => {
    if (fastForwardComplete) return criterion(item);
    if (item[idProp] === lastRow[idProp]) {
      fastForwardComplete = true;
    }
    return false;
  };
}

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
          .above(lastEntry[orderBy])
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
