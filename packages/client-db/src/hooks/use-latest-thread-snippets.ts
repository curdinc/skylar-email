import { getLatestThreadSnippets } from "../emails/get-latest-thread-snippets";
import type { MakeDbOptional } from "../types/use-client-db-helper-type";
import { useClientDb } from "./use-client-db";

export function useLatestThreadSnippets(
  args: MakeDbOptional<Parameters<typeof getLatestThreadSnippets>[0]>,
) {
  const { result: threads, isLoading } = useClientDb({
    db: args.db,
    query: async (db) => {
      const threadSnippets = await getLatestThreadSnippets({ ...args, db });
      return threadSnippets;
    },
    deps: [args.lastEntry, args.limit],
  });

  return { threads, isLoading };
}
