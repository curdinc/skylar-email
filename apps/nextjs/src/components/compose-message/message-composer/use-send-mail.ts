import { useMutation } from "@tanstack/react-query";

import { sendMail } from "@skylar/gmail-api";
import type { EmailConfigType } from "@skylar/parsers-and-types";

import { api } from "~/lib/api";
import { useAccessToken } from "~/lib/provider/use-access-token";

export function useSendEmail() {
  const { mutateAsync: composeEmail } =
    api.emailCompose.composeRfc822Email.useMutation();
  const { mutateAsync: fetchGmailAccessToken } = useAccessToken();

  const { mutateAsync: sendEmail, isPending: isSendingEmail } = useMutation({
    mutationFn: async ({
      emailAddress,
      emailConfig,
    }: {
      emailAddress: string;
      emailConfig: EmailConfigType;
    }) => {
      const accessToken = await fetchGmailAccessToken({
        email: emailAddress,
      });
      console.log("emailConfig", emailConfig);
      const composedEmail = await composeEmail(emailConfig);
      const sendMessageResponse = await sendMail({
        accessToken,
        emailId: emailAddress,
        rfc822Base64EncodedMessageData: composedEmail,
        replyToGmailThreadId: emailConfig.replyConfig?.providerThreadId,
      });

      console.log("sendMessageResponse", sendMessageResponse);
    },
    onSuccess: () => {
      console.log("email sent");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return { sendEmail, isSendingEmail };
}
