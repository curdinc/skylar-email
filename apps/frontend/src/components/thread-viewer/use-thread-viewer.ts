import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { bulkUpdateMessages, useThread } from "@skylar/client-db";
import { modifyLabels } from "@skylar/gmail-api";
import type { MessageType } from "@skylar/parsers-and-types";

import { useAccessToken } from "~/lib/provider/use-access-token";
import { useActiveItemRow } from "~/lib/store/labels-tree-viewer";

export function useThreadViewer() {
  const [activeItemRow] = useActiveItemRow();

  const { thread, isLoading: isLoadingThread } = useThread({
    emailProviderThreadId:
      activeItemRow?.type === "labelItem"
        ? activeItemRow.thread.provider_thread_id
        : "",
  });

  const { mutateAsync: fetchGmailAccessToken } = useAccessToken();

  const { mutate: markAsRead } = useMutation({
    mutationFn: async ({
      addLabels,
      deleteLabels,
      message,
      emailAddress,
    }: {
      emailAddress: string;
      message: MessageType;
      addLabels: string[];
      deleteLabels: string[];
    }) => {
      if (message.email_provider_labels.includes("UNREAD")) {
        const accessToken = await fetchGmailAccessToken({
          email: emailAddress,
        });

        const labelData = await modifyLabels({
          accessToken,
          emailId: emailAddress,
          addLabels,
          deleteLabels,
          messageId: message.provider_message_id,
        });
        return labelData;
      }
    },
    onSuccess: async (labelData) => {
      if (!labelData) {
        return;
      }
      await bulkUpdateMessages({
        messages: [
          {
            provider_message_id: labelData.id,
            email_provider_labels: labelData.labelIds,
            provider_thread_id: labelData.threadId,
          },
        ],
      });
    },
  });

  useEffect(() => {
    if (!isLoadingThread && thread?.length) {
      thread.map((message) => {
        markAsRead({
          message,
          emailAddress: message.user_email_address,
          addLabels: [],
          deleteLabels: ["UNREAD"],
        });
      });
    }
  }, [thread, isLoadingThread, markAsRead]);

  return { isLoadingThread, thread };
}
