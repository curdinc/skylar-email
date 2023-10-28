import { useCallback, useState } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import type { ThreadType } from "../../schema/thread";
import { clientDb } from "../db";
import { getThreadSnippets } from "../emails/get-thread-snippets";
import type { GetParameters } from "../types/extract-params";

export const THREAD_SNIPPETS_QUERY_KEY = "threadSnippets";

export function useThreadSnippetsPaginated(
  args: Omit<GetParameters<typeof getThreadSnippets>, "lastEntry">,
) {
  const [lastThreads, setLastThreads] = useState<ThreadType[]>([]);

  const {
    data: threads,
    isLoading,
    refetch,
  } = useQuery({
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
    refetch,
    isLoading: isLoading || !args.userEmails.length,
    nextPage,
    prevPage,
  };
}

export function useThreadSnippetsInfinite(
  args: Omit<GetParameters<typeof getThreadSnippets>, "lastEntry">,
) {
  const {
    data: threads,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      THREAD_SNIPPETS_QUERY_KEY,
      args.limit,
      args.sort,
      args.orderBy,
      args.filters,
      args.userEmails,
    ],
    queryFn: async ({ pageParam }) => {
      const threadSnippets = await getThreadSnippets({
        userEmails: args.userEmails,
        filters: args.filters,
        limit: args.limit,
        lastEntry: pageParam.lastThread,
        sort: args.sort,
        orderBy: args.orderBy,
        db: clientDb,
      });
      return threadSnippets;
    },
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return { lastThread: lastPage.at(-1) };
    },
    initialPageParam: { lastThread: undefined as undefined | ThreadType },
  });

  return {
    threads,
    isLoading: isLoading || !args.userEmails.length,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
