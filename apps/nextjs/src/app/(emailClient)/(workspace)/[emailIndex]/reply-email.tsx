"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "codemirror";
import SimpleMdeReact from "react-simplemde-editor";
import showdown from "showdown";

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

export const ReplyEmail = () => {
  const { onReplyStringChange, replyString, onClickSend, isSendingEmail } =
    useReplyEmail();

  const [codeMirrorInstance, setCodeMirrorInstance] = useState<Editor | null>(
    null,
  );
  const getCmInstanceCallback = useCallback((editor: Editor) => {
    setCodeMirrorInstance(editor);
  }, []);

  useEffect(() => {
    codeMirrorInstance?.focus();
  }, [codeMirrorInstance]);

  return (
    <div className="p-5">
      <SimpleMdeReact
        value={replyString}
        onChange={onReplyStringChange}
        getCodemirrorInstance={getCmInstanceCallback}
        className="prose min-w-full"
      />
      <div className="flex justify-end">
        <Button onClick={onClickSend} isLoading={isSendingEmail}>
          Send
        </Button>
      </div>
    </div>
  );
};
