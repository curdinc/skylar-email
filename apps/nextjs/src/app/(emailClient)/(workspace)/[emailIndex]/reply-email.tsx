"use client";

import { useCallback } from "react";
import SimpleMdeReact from "react-simplemde-editor";

import { setComposedEmail, useGlobalStore } from "@skylar/logic";

import "easymde/dist/easymde.min.css";

import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useSendEmail } from "./use-send-mail";

const useReplyEmail = () => {
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
    await sendEmail({
      emailAddress: replyThread.to.slice(-1)[0] ?? "",
      emailConfig: {
        from: {
          email: replyThread.to.slice(-1)[0] ?? "",
        },
        subject: replyThread.subject,
        to: replyThread.from.slice(-1),
        attachments: [],
        html: replyString,
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

export const ReplyEmail = () => {
  const { onReplyStringChange, replyString, onClickSend, isSendingEmail } =
    useReplyEmail();

  return (
    <div className="p-5">
      <SimpleMdeReact
        value={replyString}
        onChange={onReplyStringChange}
        className="z-50"
      />
      <div className="flex justify-end">
        <Button onClick={onClickSend} isLoading={isSendingEmail}>
          Send
        </Button>
      </div>
    </div>
  );
};
