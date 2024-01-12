import { useCallback, useEffect } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import showdown from "showdown";

import { resetComposeMessage, useGlobalStore } from "@skylar/logic";
import type {
  EmailComposeType,
  MessageConfigType,
  ThreadType,
} from "@skylar/parsers-and-types";
import { EmailComposeSchema } from "@skylar/parsers-and-types";
import { gmailApiWorker } from "@skylar/web-worker-logic";

import { useToast } from "~/components/ui/use-toast";
import { captureEvent } from "~/lib/analytics/capture-event";
import { TrackingEvents } from "~/lib/analytics/tracking-events";
import {
  formatEmailSenderTypeAndRemoveUserEmail,
  getSenderReplyToEmailAddresses,
  isAttachmentSizeValid,
} from "~/lib/email";
import { useLogger } from "~/lib/logger";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";

export const useMessageComposer = () => {
  const logger = useLogger();
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const respondingMessageContent = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingMessageString,
  );
  const composeEmailType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.messageType,
  );
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );

  const { toast } = useToast();

  const defaultFormValues = useCallback(
    (thread?: ThreadType) => {
      const replyTo: string[] = [];
      const cc: string[] = [];
      const subject = thread?.subject ?? "";
      switch (composeEmailType) {
        case "forward": {
          break;
        }
        case "new-email": {
          break;
        }
        case "reply-sender": {
          const senderEmailAddresses = getSenderReplyToEmailAddresses(
            thread?.from.at(-1),
            thread?.reply_to.at(-1),
          );
          replyTo.push(...senderEmailAddresses);
          break;
        }
        case "reply-all": {
          const senderEmailAddresses = getSenderReplyToEmailAddresses(
            thread?.from.at(-1),
            thread?.reply_to.at(-1),
          );
          replyTo.push(...senderEmailAddresses);
          replyTo.push(
            ...formatEmailSenderTypeAndRemoveUserEmail(
              activeEmailAddress,
              thread?.to.at(-1),
            ),
          );

          cc.push(
            ...formatEmailSenderTypeAndRemoveUserEmail(
              activeEmailAddress,
              thread?.cc.at(-1),
            ),
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
        subject,
        composeString: "",
      };
    },
    [composeEmailType, activeEmailAddress],
  );
  const form = useForm<EmailComposeType>({
    resolver: valibotResolver(EmailComposeSchema),
    defaultValues: defaultFormValues(replyThread),
  });

  useEffect(() => {
    form.reset(defaultFormValues(replyThread));
  }, [defaultFormValues, form, replyThread]);

  const submitMutation = useMutation({
    mutationFn: async (values: EmailComposeType) => {
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

      const messageConfig: MessageConfigType = {
        from: {
          emailAddress: values.from,
        },
        subject: values.subject,
        to: values.to,
        cc: values.cc,
        bcc: values.bcc,
        attachments: formattedAttachments,
        html: `${markdownToHtmlConverter.makeHtml(
          values.composeString,
        )}${respondingMessageContent}`,
        replyConfig: replyThread
          ? {
              inReplyToRfcMessageId: replyThread.rfc822_message_ids[0] ?? "",
              references: replyThread.rfc822_message_ids,
              providerThreadId: replyThread.provider_thread_id,
              rootSubject: replyThread.subject,
            }
          : undefined,
      };

      const { gmailApiWorker } = await import("@skylar/web-worker-logic");

      await gmailApiWorker.message.send.mutate({
        emailAddress: values.from,
        messageConfig,
      });
      toast({
        title: "Email sent!",
      });
      resetComposeMessage();
    },
    onError: (error) => {
      logger.error("Error sending email", { error });
      toast({
        title: "Error sending email",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    captureEvent({
      event: TrackingEvents.composeSendMessage,
      properties: {
        isShortcut: false,
        messageConversationLength:
          replyThread?.provider_message_ids.length ?? 0,
        wordCount: values.composeString.length,
      },
    });
    submitMutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    submitMutation,
    replyThread,
    respondingMessageContent,
  };
};
