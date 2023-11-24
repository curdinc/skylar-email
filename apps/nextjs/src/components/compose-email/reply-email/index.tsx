"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "codemirror";
import SimpleMdeReact from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";

import { Button } from "~/components/ui/button";
import { useReplyEmail } from "./use-reply-email";

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
    // TODO: Handle attachments + make inline image better
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
