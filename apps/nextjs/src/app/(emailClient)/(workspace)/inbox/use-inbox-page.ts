import { useLatestThreadSnippets } from "@skylar/client-db";
import { useActiveEmailClientDb } from "@skylar/logic";

export function useInboxPage() {
  const db = useActiveEmailClientDb();
  const { threads, isLoading: isLoadingThreads } = useLatestThreadSnippets({
    db,
    limit: 25,
  });
  return { threads, isLoadingThreads };
}
