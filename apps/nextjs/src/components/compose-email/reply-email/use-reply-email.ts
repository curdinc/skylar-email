import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import showdown from "showdown";

import {
  setAttachments,
  setComposedEmail,
  setThreadToReplyTo,
  useActiveEmails,
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
  const composeEmailType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.emailType,
  );
  const codeMirrorInstance = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.codeMirrorInstance,
  );
  const activeEmails = useActiveEmails();
  const currentEmail = activeEmails[0];
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const { sendEmail } = useSendEmail();

  const { toast } = useToast();

  const defaultFormValues = () => {
    let replyTo: string[] = [];
    let cc: string[] = [];
    switch (composeEmailType) {
      case "forward": {
        replyTo = [];
        cc = [];
        break;
      }
      case "new-email": {
        replyTo = [];
        cc = [];
        break;
      }
      case "reply-sender": {
        // TODO: check for reply to value before setting from
        const senderEmail = replyThread?.from.at(-1)?.[0]?.email;
        replyTo = senderEmail ? [senderEmail] : [];
        cc = [];
        break;
      }
      case "reply-all": {
        const senderEmail = replyThread?.from.at(-1)?.[0]?.email;

        replyTo =
          replyThread?.to
            .at(-1)
            ?.map((to) => to.email)
            .filter((email) => email !== currentEmail) ?? [];
        if (senderEmail) {
          replyTo.push(senderEmail);
        }
        cc =
          replyThread?.cc
            .at(-1)
            ?.map((cc) => cc.email)
            .filter((email) => email !== currentEmail) ?? [];
        break;
      }
      default:
        break;
    }

    return {
      from: currentEmail,
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
