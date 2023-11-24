import { useCallback } from "react";
import showdown from "showdown";

import { setComposedEmail, useGlobalStore } from "@skylar/logic";

import { useSendEmail } from "~/app/(emailClient)/(workspace)/[emailIndex]/use-send-mail";
import { useToast } from "~/components/ui/use-toast";

export const useReplyEmail = () => {
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const replyString = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.composedEmail,
  );
  const { sendEmail, isSendingEmail } = useSendEmail();

  const onReplyStringChange = useCallback((value: string) => {
    setComposedEmail(value);
  }, []);
  const { toast } = useToast();

  const onClickSend = useCallback(async () => {
    if (!replyThread) {
      return;
    }
    const markdownToHtmlConverter = new showdown.Converter();
    await sendEmail({
      emailAddress: replyThread.to.slice(-1)[0] ?? "",
      emailConfig: {
        from: {
          email: replyThread.to.slice(-1)[0] ?? "",
        },
        subject: replyThread.subject,
        to: replyThread.from.slice(-1),
        attachments: [],
        html: markdownToHtmlConverter.makeHtml(replyString),
        replyConfig: {
          inReplyToRfcMessageId: replyThread.rfc822_message_id[0] ?? "",
          references: replyThread.rfc822_message_id,
          providerThreadId: replyThread.email_provider_thread_id,
          rootSubject: replyThread.subject,
        },
      },
    });
    toast({
      title: "Email sent!",
    });
  }, [replyString, replyThread, sendEmail, toast]);

  return {
    replyString,
    onReplyStringChange,
    replyThread,
    onClickSend,
    isSendingEmail,
  };
};
