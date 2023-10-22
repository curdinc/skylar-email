import { useCallback, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ThreadType } from "../../schema/thread";
import { clientDb } from "../db";
import { getThreadSnippets } from "../emails/get-thread-snippets";
import type { GetParameters } from "../types/extract-params";

export const THREAD_SNIPPETS_QUERY_KEY = "threadSnippets";

export function usePaginatedThreadSnippets(
  args: Omit<GetParameters<typeof getThreadSnippets>, "lastEntry">,
) {
  const [lastThreads, setLastThreads] = useState<ThreadType[]>([]);

  const { data: threads, isLoading } = useQuery({
    queryKey: [
      THREAD_SNIPPETS_QUERY_KEY,
      args.limit,
      args.sort,
      args.orderBy,
      args.filters,
      args.userEmails,
    ],
    queryFn: async () => {
      const threadSnippets = await getThreadSnippets({
        userEmails: args.userEmails,
        filters: args.filters,
        limit: args.limit,
        lastEntry: lastThreads.at(-1),
        sort: args.sort,
        orderBy: args.orderBy,
        db: clientDb,
      });
      return threadSnippets;
    },
    placeholderData: keepPreviousData,
    enabled: !!args.userEmails.length,
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
  return {
    threads,
    isLoading: isLoading || !args.userEmails.length,
    nextPage,
    prevPage,
  };
}
