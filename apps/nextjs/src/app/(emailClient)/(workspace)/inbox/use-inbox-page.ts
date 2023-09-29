import { useLatestUnreadThreadSnippets } from "@skylar/client-db";
import { useActiveEmailClientDb } from "@skylar/logic";

export function useInboxPage() {
  const db = useActiveEmailClientDb();
  const {
    threads,
    isLoading: isLoadingThreads,
    nextPage,
    prevPage,
  } = useLatestUnreadThreadSnippets({
    db,
    limit: 10,
  });
  return { threads, isLoadingThreads, nextPage, prevPage };
}
