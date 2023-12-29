import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { useThread } from "@skylar/client-db";
import { EMAIL_PROVIDER_LABELS } from "@skylar/parsers-and-types";

import { modifyThreadLabels } from "~/lib/inbox-toolkit/thread/modify-thread-labels";
import { useActiveItemRow } from "~/lib/store/label-tree-viewer/active-item";

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

      await modifyThreadLabels({
        threads: [activeItemRow.thread],
        emailAddress: activeItemRow.thread.user_email_address,
        labelsToRemove: [[EMAIL_PROVIDER_LABELS.GMAIL.UNREAD]],
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
