import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useThread } from "@skylar/client-db";

import { markReadThreads } from "~/lib/inbox-toolkit/thread/mark-read-threads";
import { useActiveItemRow } from "~/lib/store/labels-tree-viewer";

export function useThreadViewer() {
  const [activeItemRow] = useActiveItemRow();

  const { thread: messagesInThread, isLoading: isLoadingThread } = useThread({
    emailProviderThreadId:
      activeItemRow?.type === "labelItem"
        ? activeItemRow.thread.provider_thread_id
        : "",
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async () => {
      if (activeItemRow?.type !== "labelItem") {
        return undefined;
      }

      await markReadThreads({
        threads: [activeItemRow.thread],
        email: activeItemRow.thread.user_email_address,
        afterClientDbUpdate: [], //FIXME: add refetch
      });
    },
  });

  useEffect(() => {
    if (!isLoadingThread && messagesInThread?.length) {
      markAsRead();
    }
  }, [messagesInThread, isLoadingThread, markAsRead]);

  return { isLoadingThread, thread: messagesInThread };
}
