import { getLatestThreadSnippets } from "../emails/get-latest-thread-snippets";
import type { ClientDbHookOptionType } from "../types/base-client-db-hook-types";
import { useClientDb } from "./use-client-db";

export function useLatestThreadSnippets(
  args: Parameters<typeof getLatestThreadSnippets>[0] & {
    options?: ClientDbHookOptionType;
  },
) {
  return useClientDb({
    query: async () => {
      const threadSnippets = await getLatestThreadSnippets(args);
      return threadSnippets;
    },
    deps: [args.lastEntry, args.limit],
    options: args.options,
  });
}
