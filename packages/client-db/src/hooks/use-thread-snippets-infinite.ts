import { useInfiniteQuery } from "@tanstack/react-query";

import type { ThreadType } from "../../../parsers-and-types/src/client-db-schema/threadd-types/src/client-db-schema/thread";
import { getThreadSnippets } from "../thread/get-thread-snippets";
import type { GetParameters } from "../types/extract-params";

export const THREAD_SNIPPETS_QUERY_KEY = "threadSnippets";

export function useThreadSnippetsInfinite(
  args: Omit<GetParameters<typeof getThreadSnippets>, "lastEntry"> & {
    uid?: string;
  },
) {
  return useInfiniteQuery({
    queryKey: [
      THREAD_SNIPPETS_QUERY_KEY,
      args.limit,
      args.sort,
      args.orderBy,
      args.filters,
      args.userEmails,
      args.uid,
    ],
    queryFn: async ({ pageParam }) => {
      const threadSnippets = await getThreadSnippets({
        userEmails: args.userEmails,
        filters: args.filters,
        limit: args.limit,
        lastEntry: pageParam.lastThread,
        sort: args.sort,
        orderBy: args.orderBy,
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
    refetchInterval: 2_000, // 2 seconds
    structuralSharing: false, // TODO: rewrite to use more granular filtering
  });
}
