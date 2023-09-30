import {
  useLatestReadThreadSnippets,
  useLatestUnreadThreadSnippets,
} from "@skylar/client-db";
import { useActiveEmailClientDb } from "@skylar/logic";

export function useInboxPage() {
  const db = useActiveEmailClientDb();
  const {
    threads: unreadThreads,
    isLoading: isLoadingUnreadThreads,
    nextPage: nextUnreadPage,
    prevPage: prevUnreadPage,
  } = useLatestUnreadThreadSnippets({
    db,
    limit: 10,
  });
  const {
    threads: readThreads,
    isLoading: isLoadingReadThreads,
    nextPage: nextReadPage,
    prevPage: prevReadPage,
  } = useLatestReadThreadSnippets({
    db,
    limit: 10,
  });

  return {
    unreadThreads,
    isLoadingUnreadThreads,
    nextUnreadPage,
    prevUnreadPage,
    readThreads,
    isLoadingReadThreads,
    nextReadPage,
    prevReadPage,
  };
}
