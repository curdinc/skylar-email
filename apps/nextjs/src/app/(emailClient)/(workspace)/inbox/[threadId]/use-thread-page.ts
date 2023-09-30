import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { bulkUpdateEmails, useEmailThread } from "@skylar/client-db";
import type { EmailType } from "@skylar/client-db/schema/email";
import { modifyLabels } from "@skylar/gmail-api";
import { useActiveEmailClientDb, useActiveEmailProvider } from "@skylar/logic";

import { api } from "~/lib/api";

export function useThreadPage() {
  const router = useRouter();
  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
        document.removeEventListener("keydown", escFunction, false);
      }
    };
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [router]);

  const { threadId } = useParams();
  if (typeof threadId !== "string") throw new Error("Invalid threadId");
  const activeDb = useActiveEmailClientDb();
  const emailProviderInfo = useActiveEmailProvider();
  const { emailThread, isLoading: isLoadingThread } = useEmailThread({
    emailProviderThreadId: threadId,
    db: activeDb,
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
      if (!labelData || !activeDb) {
        return;
      }
      await bulkUpdateEmails({
        db: activeDb,
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
    if (!isLoadingThread && emailThread?.length && emailProviderInfo?.email) {
      emailThread.map((email) => {
        markAsRead({
          email,
          emailAddress: emailProviderInfo.email,
          addLabels: [],
          deleteLabels: ["UNREAD"],
        });
      });
    }
  }, [emailProviderInfo?.email, emailThread, isLoadingThread, markAsRead]);

  return { isLoadingThread, emailThread };
}
