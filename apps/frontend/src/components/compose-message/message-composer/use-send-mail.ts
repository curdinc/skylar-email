import { useMutation } from "@tanstack/react-query";

import type { EmailConfigType } from "@skylar/parsers-and-types";
import { composeRfc822Message } from "@skylar/rfc2822-message-composer";
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
      const rfcEncoded = composeRfc822Message(emailConfig);
      await gmailApiWorker.message.send.mutate({
        emailAddress,
        rfc822Base64EncodedMessageData: rfcEncoded,
        replyToGmailThreadId: emailConfig.replyConfig?.providerThreadId,
      });
    },
  });

  return { sendEmail, isSendingEmail };
}
