import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import showdown from "showdown";

import { resetComposeMessage, useGlobalStore } from "@skylar/logic";
import type { EmailComposeType } from "@skylar/parsers-and-types";
import { EmailComposeSchema } from "@skylar/parsers-and-types";

import { useToast } from "~/components/ui/use-toast";
import {
  formatEmailAddresses,
  getSenderReplyToEmailAddresses,
  isAttachmentSizeValid,
} from "~/lib/email";
import { useSendEmail } from "./use-send-mail";

export const useMessageComposer = () => {
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const composeEmailType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.messageType,
  );
  const activeEmailAddress = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeEmailAddress,
  );
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const { sendEmail } = useSendEmail();

  const { toast } = useToast();

  const defaultFormValues = () => {
    const replyTo: string[] = [];
    const cc: string[] = [];
    switch (composeEmailType) {
      case "forward": {
        break;
      }
      case "new-email": {
        break;
      }
      case "reply-sender": {
        const senderEmailAddresses = getSenderReplyToEmailAddresses(
          replyThread?.from.at(-1),
          replyThread?.reply_to.at(-1),
        );
        replyTo.push(...senderEmailAddresses);
        break;
      }
      case "reply-all": {
        const senderEmailAddresses = getSenderReplyToEmailAddresses(
          replyThread?.from.at(-1),
          replyThread?.reply_to.at(-1),
        );
        replyTo.push(...senderEmailAddresses);
        replyTo.push(
          ...formatEmailAddresses(activeEmailAddress, replyThread?.to.at(-1)),
        );

        cc.push(
          ...formatEmailAddresses(activeEmailAddress, replyThread?.cc.at(-1)),
        );
        break;
      }
      default:
        break;
    }

    return {
      from: activeEmailAddress,
      to: replyTo,
      cc: cc,
      bcc: [],
      subject: replyThread?.subject ?? "",
      composeString: "",
    };
  };
  const form = useForm<EmailComposeType>({
    resolver: valibotResolver(EmailComposeSchema),
    defaultValues: defaultFormValues(),
  });

  const submitMutation = useMutation({
    mutationFn: async (values: EmailComposeType) => {
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
        emailAddress: values.from,
        emailConfig: {
          from: {
            email: values.from,
          },
          subject: values.subject,
          to: values.to,
          cc: values.cc,
          bcc: values.bcc,
          attachments: formattedAttachments,
          html: markdownToHtmlConverter.makeHtml(values.composeString),
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
      resetComposeMessage();
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    submitMutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    submitMutation,
    replyThread,
  };
};
