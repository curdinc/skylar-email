import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useThread } from "@skylar/client-db";

import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { useActiveItemRow } from "~/lib/store/label-tree-viewer/active-item";

export function useThreadViewer() {
  const [activeItemRow] = useActiveItemRow();
  const { thread: messagesInThread, isLoading: isLoadingThread } = useThread({
    emailProviderThreadId:
      activeItemRow?.type === "labelItem"
        ? activeItemRow.thread.provider_thread_id
        : "",
  });

  const { mutate: markThreadAsRead } = useMutation({
    mutationFn: async () => {
      if (activeItemRow?.type !== "labelItem") {
        return undefined;
      }

      await markAsRead({
        threads: [activeItemRow.thread],
        emailAddress: activeItemRow.thread.user_email_address,
      });
    },
  });

  useEffect(() => {
    if (!isLoadingThread && messagesInThread?.length) {
      markThreadAsRead();
    }
  }, [messagesInThread, isLoadingThread, markThreadAsRead]);

  return { isLoadingThread, thread: messagesInThread };
}
