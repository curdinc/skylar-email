import { useInfiniteQuery } from "@tanstack/react-query";

import type { ThreadType } from "@skylar/parsers-and-types";

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
      args.uid,
      args.orderBy,
      args.sort,
      args.limit,
      args.userEmails,
      args.filters,
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
      if (lastPage.length < (args?.limit ?? 1)) {
        return undefined;
      }
      return { lastThread: lastPage.at(-1) };
    },
    initialPageParam: { lastThread: undefined as undefined | ThreadType },
    structuralSharing: false, // TODO: rewrite to use more granular filtering
  });
}
