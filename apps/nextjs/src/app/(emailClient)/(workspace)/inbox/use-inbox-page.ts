import { useThreadSnippetsPaginated } from "@skylar/client-db";
import { useActiveEmails } from "@skylar/logic";

export function useInboxPage() {
  const userEmails = useActiveEmails();

  const {
    threads,
    isLoading: isLoadingThreads,
    nextPage,
    prevPage,
    refetch,
  } = useThreadSnippetsPaginated({
    userEmails,
    filters: [(thread) => thread.email_provider_labels.indexOf("INBOX") !== -1],
    limit: 10,
  });

  return {
    threads,
    refetch,
    isLoadingThreads,
    nextPage,
    prevPage,
  };
}
