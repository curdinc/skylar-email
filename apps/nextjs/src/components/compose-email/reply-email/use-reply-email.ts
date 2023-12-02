import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import showdown from "showdown";

import {
  setAttachments,
  setComposedEmail,
  setThreadToReplyTo,
  useGlobalStore,
} from "@skylar/logic";
import type { EmailComposeType } from "@skylar/parsers-and-types";
import { EmailComposeSchema } from "@skylar/parsers-and-types";

import { useSendEmail } from "~/app/(emailClient)/(workspace)/[emailIndex]/use-send-mail";
import { useToast } from "~/components/ui/use-toast";
import { isAttachmentSizeValid } from "~/lib/email";

export const useReplyEmail = () => {
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const codeMirrorInstance = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance,
  );

  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const { sendEmail } = useSendEmail();

  const { toast } = useToast();

  const form = useForm<EmailComposeType>({
    resolver: valibotResolver(EmailComposeSchema),
    defaultValues: {
      from: replyThread?.from.at(-1)?.[0]?.email ?? "",
      to: replyThread?.to.at(-1)?.map((to) => to.email) ?? [],
      cc:
        replyThread?.cc
          .at(-1)
          ?.filter((cc) => !!cc)
          .map((cc) => cc.email) ?? [],
      bcc:
        replyThread?.bcc
          .at(-1)
          ?.filter((bcc) => !!bcc)
          .map((bcc) => bcc.email) ?? [],
      subject: replyThread?.subject ?? "",
      composeString: "",
    },
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
      setThreadToReplyTo(undefined);
      setComposedEmail("");
      setAttachments(() => []);
      attachments.forEach((attachment) => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
      codeMirrorInstance?.setValue("");
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
