"use client";

import { useCallback, useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";

import { useGlobalStore } from "@skylar/logic";

import "easymde/dist/easymde.min.css";

import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useSendEmail } from "./use-send-mail";

const useReplyEmail = () => {
  const replyThread = useGlobalStore(
    (state) => state.EMAIL_CLIENT.threadToReplyTo,
  );
  const { sendEmail } = useSendEmail();

  const [replyString, setReplyString] = useState("");
  const onReplyStringChange = useCallback((value: string) => {
    setReplyString(value);
  }, []);
  const { toast } = useToast();

  const onClickSend = useCallback(async () => {
    if (!replyThread) {
      return;
    }
    console.log("replyThread.rfc822_message_id", replyThread.rfc822_message_id);
    await sendEmail({
      emailAddress: replyThread.to.slice(-1)[0] ?? "",
      emailConfig: {
        from: {
          email: replyThread.to.slice(-1)[0] ?? "",
        },
        subject: replyThread.subject,
        to: replyThread.from.slice(-1),
        attachments: [],
        text: replyString,
        replyConfig: {
          inReplyToRfcMessageId: replyThread.rfc822_message_id[0] ?? "",
          references: replyThread.rfc822_message_id,
          providerThreadId: replyThread.email_provider_thread_id,
          rootSubject: replyThread.subject,
        },
      },
    });
    toast({
      title: "Email sent",
      description: "Email sent",
    });
  }, [replyString, replyThread, sendEmail, toast]);

  return {
    replyString,
    onReplyStringChange,
    replyThread,
    onClickSend,
  };
};

export const ReplyEmail = () => {
  const { onReplyStringChange, replyString, onClickSend } = useReplyEmail();

  return (
    <div className="p-5">
      <SimpleMdeReact
        value={replyString}
        onChange={onReplyStringChange}
        className="z-50"
      />
      <div className="flex justify-end">
        <Button onClick={onClickSend}>Send</Button>
      </div>
    </div>
  );
};
