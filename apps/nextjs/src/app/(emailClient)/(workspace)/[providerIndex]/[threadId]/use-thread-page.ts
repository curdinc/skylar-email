import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { bulkUpdateEmails, useEmailThread } from "@skylar/client-db";
import type { EmailType } from "@skylar/client-db/schema/email";
import { modifyLabels } from "@skylar/gmail-api";
import { useGlobalStore } from "@skylar/logic";

import { useAccessToken } from "~/lib/provider/use-access-token";

export function useThreadPage() {
  const threadId = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeThread?.email_provider_thread_id,
  );

  const { emailThread, isLoading: isLoadingThread } = useEmailThread({
    emailProviderThreadId: threadId ?? "",
  });

  const { mutateAsync: fetchGmailAccessToken } = useAccessToken();

  const { mutate: markAsRead } = useMutation({
    mutationFn: async ({
      addLabels,
      deleteLabels,
      email,
      emailAddress,
    }: {
      emailAddress: string;
      email: EmailType;
      addLabels: string[];
      deleteLabels: string[];
    }) => {
      if (email.email_provider_labels.includes("UNREAD")) {
        const accessToken = await fetchGmailAccessToken({
          email: emailAddress,
        });

        const labelData = await modifyLabels({
          accessToken,
          emailId: emailAddress,
          addLabels,
          deleteLabels,
          messageId: email.email_provider_message_id,
        });
        return labelData;
      }
    },
    onSuccess: async (labelData) => {
      if (!labelData) {
        return;
      }
      await bulkUpdateEmails({
        emails: [
          {
            email_provider_message_id: labelData.id,
            email_provider_labels: labelData.labelIds,
            email_provider_thread_id: labelData.threadId,
          },
        ],
      });
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    // TODO: why did we need to check for emailProviderInfos?.length?
    if (!isLoadingThread && emailThread?.length) {
      emailThread.map((email) => {
        markAsRead({
          email,
          emailAddress: email.user_email_address,
          addLabels: [],
          deleteLabels: ["UNREAD"],
        });
      });
    }
  }, [emailThread, isLoadingThread, markAsRead]);

  return { isLoadingThread, emailThread };
}
