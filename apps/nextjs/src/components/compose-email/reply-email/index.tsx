"use client";

import type { Editor } from "codemirror";
import { useCallback, useEffect, useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";

import { Button } from "~/components/ui/button";
import { AttachmentButton, AttachmentList } from "../attachment";
import { useReplyEmail } from "./use-reply-email";

export const ReplyEmail = () => {
  const [codeMirrorInstance, setCodeMirrorInstance] = useState<Editor | null>(
    null,
  );
  const onSentEmail = useCallback(() => {
    codeMirrorInstance?.setValue("");
  }, [codeMirrorInstance]);

  const { onReplyStringChange, replyString, onClickSend, isSendingEmail } =
    useReplyEmail({
      onSentEmail,
    });

  const getCmInstanceCallback = useCallback((editor: Editor) => {
    setCodeMirrorInstance(editor);
  }, []);

  useEffect(() => {
    codeMirrorInstance?.focus();
  }, [codeMirrorInstance]);

  return (
    // TODO: make inline image better + make attachment image preview show in gmail
    <div className="p-5">
      <SimpleMdeReact
        value={replyString}
        onChange={onReplyStringChange}
        getCodemirrorInstance={getCmInstanceCallback}
        className="prose min-w-full"
      />
      <div className="flex items-center justify-between py-1">
        <AttachmentButton variant={"ghost"} size={"icon-lg"} className="p-2" />
        <Button onClick={onClickSend} isLoading={isSendingEmail}>
          Send
        </Button>
      </div>
      <AttachmentList />
    </div>
  );
};
