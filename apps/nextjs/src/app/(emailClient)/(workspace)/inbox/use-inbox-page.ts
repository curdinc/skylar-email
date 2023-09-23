import { useLatestThreadSnippets } from "@skylar/client-db";
import { state$ } from "@skylar/logic";

export function useInboxPage() {
  const activeClientDbName = state$.EMAIL_CLIENT.activeClientDbName.use();
  const threads = useLatestThreadSnippets({
    getDb: () => state$.EMAIL_CLIENT.getActiveClientDb(),
    limit: 25,
    options: {
      enabled: !!activeClientDbName,
    },
  });
  console.log('threads', threads)
  return {};
}
