import { useThreadSnippetsPaginated } from "@skylar/client-db";
import { useActiveEmails } from "@skylar/logic";

export function useInboxPage() {
  const userEmails = useActiveEmails();

  const {
    threads,
    isLoading: isLoadingThreads,
    nextPage,
    prevPage,
  } = useThreadSnippetsPaginated({
    userEmails,
    limit: 10,
  });

  return {
    threads,
    isLoadingThreads,
    nextPage,
    prevPage,
  };
}
