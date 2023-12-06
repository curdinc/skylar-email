import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { bulkUpdateEmails, useEmailThread } from "@skylar/client-db";
import type { EmailType } from "@skylar/client-db/schema/email";
import { modifyLabels } from "@skylar/gmail-api";
import { useActiveEmailProviders, useGlobalStore } from "@skylar/logic";

import { api } from "~/lib/api";

export function useThreadPage() {
  const threadId = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeThread?.email_provider_thread_id,
  );
  const emailProviderInfos = useActiveEmailProviders();

  const { emailThread, isLoading: isLoadingThread } = useEmailThread({
    emailProviderThreadId: threadId ?? "",
  });

  const { mutateAsync: fetchGmailAccessToken } =
    api.gmail.getAccessToken.useMutation();

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
    if (!isLoadingThread && emailThread?.length && emailProviderInfos?.length) {
      emailThread.map((email) => {
        markAsRead({
          email,
          emailAddress: email.user_email_address,
          addLabels: [],
          deleteLabels: ["UNREAD"],
        });
      });
    }
  }, [emailProviderInfos?.length, emailThread, isLoadingThread, markAsRead]);

  return { isLoadingThread, emailThread };
}
