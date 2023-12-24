import { useMutation } from "@tanstack/react-query";

import type { EmailConfigType } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

export function useSendEmail() {
  const { mutateAsync: sendEmail, isPending: isSendingEmail } = useMutation({
    mutationFn: async ({
      emailAddress,
      emailConfig,
    }: {
      emailAddress: string;
      emailConfig: EmailConfigType;
    }) => {
      await gmailApiWorker.message.send.mutate({
        emailAddress,
        emailConfig: emailConfig,
        replyToGmailThreadId: emailConfig.replyConfig?.providerThreadId,
      });
    },
  });

  return { sendEmail, isSendingEmail };
}
