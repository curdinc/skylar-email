import { useMutation } from "@tanstack/react-query";

import { sendMail } from "@skylar/gmail-api";
import type { EmailConfigType } from "@skylar/parsers-and-types";

import { api } from "~/lib/api";

export function useSendEmail() {
  const { mutateAsync: composeEmail } =
    api.emailCompose.composeRfc822Email.useMutation();
  const { mutateAsync: fetchGmailAccessToken } =
    api.gmail.getAccessToken.useMutation();

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

      const composedEmail = await composeEmail(emailConfig);
      console.log("composedEmail", composedEmail);
      const sendMessageResponse = await sendMail({
        accessToken,
        emailId: emailAddress,
        rfc822Base64EncodedMessageData: composedEmail,
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
