import { useCallback } from "react";
import showdown from "showdown";

import {
  setAttachments,
  setComposedEmail,
  setThreadToReplyTo,
  useGlobalStore,
} from "@skylar/logic";

import { useSendEmail } from "~/app/(emailClient)/(workspace)/[emailIndex]/use-send-mail";
import { useToast } from "~/components/ui/use-toast";
import { isAttachmentSizeValid } from "~/lib/email";

export const useReplyEmail = ({
  onSentEmail,
}: {
  onSentEmail?: () => void;
}) => {
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const replyString = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.composedEmail,
  );
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
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
    const isValidAttachmentSize = isAttachmentSizeValid(attachments);
    if (!isValidAttachmentSize) {
      toast({
        title: "Attachment size is too large",
        description:
          "Please make sure your total attachment size less than 25MB",
        variant: "destructive",
      });
      return;
    }
    const formattedAttachments = attachments.map((attachment) => {
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return {
        filename: attachment.file.name,
        data: attachment.data,
        contentType: attachment.file.type,
        encoding: "binary",
        inline: false,
      } as const;
    });
    const markdownToHtmlConverter = new showdown.Converter();
    await sendEmail({
      emailAddress: replyThread.to.slice(-1)[0] ?? "",
      emailConfig: {
        from: {
          email: replyThread.to.slice(-1)[0] ?? "",
        },
        subject: replyThread.subject,
        to: replyThread.from.slice(-1),
        attachments: formattedAttachments,
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
    setThreadToReplyTo(undefined);
    setAttachments(() => []);
    onSentEmail?.();
  }, [attachments, onSentEmail, replyString, replyThread, sendEmail, toast]);

  return {
    replyString,
    onReplyStringChange,
    replyThread,
    onClickSend,
    isSendingEmail,
  };
};
