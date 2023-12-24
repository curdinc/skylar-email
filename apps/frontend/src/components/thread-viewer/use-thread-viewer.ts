import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { useThread } from "@skylar/client-db";
import { useGlobalStore } from "@skylar/logic";

import { markReadThreads } from "~/lib/inbox-toolkit/thread/mark-read-threads";

export function useThreadViewer() {
  const thread = useGlobalStore((state) => state.EMAIL_CLIENT.activeThread);

  const { thread: messagesInThread, isLoading: isLoadingThread } = useThread({
    emailProviderThreadId: thread?.provider_thread_id ?? "",
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async () => {
      if (!thread) {
        return undefined;
      }

      await markReadThreads({
        threads: [thread],
        email: thread.user_email_address,
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
