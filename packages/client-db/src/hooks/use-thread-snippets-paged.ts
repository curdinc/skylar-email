import { useCallback, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { ThreadType } from "../../schema/thread";
import { getThreadSnippets } from "../thread/get-thread-snippets";
import type { GetParameters } from "../types/extract-params";

export const THREAD_SNIPPETS_QUERY_KEY = "threadSnippets";

export function useThreadSnippetsPaginated(
  args: Omit<GetParameters<typeof getThreadSnippets>, "lastEntry">,
) {
  const [lastThreads, setLastThreads] = useState<ThreadType[]>([]);

  const query = useQuery({
    queryKey: [
      THREAD_SNIPPETS_QUERY_KEY,
      lastThreads,
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
      });
      return threadSnippets;
    },
    placeholderData: keepPreviousData,
    enabled: !!args.userEmails.length,
    gcTime: 0,
  });
  const threads = query.data;

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
    ...query,
    threads,
    isLoading: query.isLoading || !args.userEmails.length,
    nextPage,
    prevPage,
  };
}
