import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { useThread } from "@skylar/client-db";

import { markAsRead } from "~/lib/inbox-toolkit/thread/mark-as-read";
import { useLogger } from "~/lib/logger";
import { useActiveItemRow } from "~/lib/store/label-tree-viewer/active-item";

const THREAD_VIEWER_MARK_AS_READ_TIMEOUT = 400;
export function useThreadViewer() {
  const [activeItemRow] = useActiveItemRow();
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const { thread: messagesInThread, isLoading: isLoadingThread } = useThread({
    emailProviderThreadId:
      activeItemRow?.type === "labelItem"
        ? activeItemRow.thread.provider_thread_id
        : "",
  });
  const logger = useLogger();

  const { mutate: markThreadAsRead } = useMutation({
    mutationFn: async () => {
      if (activeItemRow?.type !== "labelItem") {
        return undefined;
      }
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
      timeOutRef.current = setTimeout(() => {
        markAsRead({
          threads: [activeItemRow.thread],
          emailAddress: activeItemRow.thread.user_email_address,
        }).catch((e: unknown) => {
          logger.error("Error marking thread as read", { error: e });
        });
      }, THREAD_VIEWER_MARK_AS_READ_TIMEOUT);
      return Promise.resolve();
    },
  });

  useEffect(() => {
    if (!isLoadingThread && messagesInThread?.length) {
      markThreadAsRead();
    }
  }, [messagesInThread, isLoadingThread, markThreadAsRead]);

  return { isLoadingThread, thread: messagesInThread };
}
