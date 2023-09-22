import { useLiveQuery } from "dexie-react-hooks";

import { getLatestThreadSnippets } from "../emails/get-latest-thread-snippets";

export function useLatestThreadSnippets(
  args: Parameters<typeof getLatestThreadSnippets>[0],
) {
  return useLiveQuery(async () => {
    const threadSnippets = await getLatestThreadSnippets(args);
    return threadSnippets;
  }, [args.lastEntry, args.limit]);
}
