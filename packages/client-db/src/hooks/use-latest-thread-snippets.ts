import { useCallback, useState } from "react";

import type { ThreadType } from "../../schema/thread";
import { getLatestUnreadThreadSnippets } from "../emails/get-latest-thread-snippets";
import type { MakeDbOptional } from "../types/use-client-db-helper-type";
import { useClientDb } from "./use-client-db";

export function useLatestUnreadThreadSnippets(
  args: Omit<
    MakeDbOptional<Parameters<typeof getLatestUnreadThreadSnippets>[0]>,
    "lastEntry"
  >,
) {
  const [lastThreads, setLastThreads] = useState<ThreadType[]>([]);

  const { result: threads, isLoading } = useClientDb({
    db: args.db,
    query: async (db) => {
      const threadSnippets = await getLatestUnreadThreadSnippets({
        ...args,
        lastEntry: lastThreads.slice(-1)[0],
        db,
      });
      return threadSnippets;
    },
    deps: [lastThreads, args.limit],
  });

  const nextPage = useCallback(() => {
    if (threads) {
      setLastThreads((prev) => {
        return prev.concat(threads.slice(-1));
      });
    }
  }, [threads]);
  const prevPage = useCallback(() => {
    lastThreads.pop();
    setLastThreads([...lastThreads]);
  }, [lastThreads]);

  return { threads, isLoading, nextPage, prevPage };
}
