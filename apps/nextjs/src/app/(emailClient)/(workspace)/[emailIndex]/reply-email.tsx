"use client";

import { useCallback, useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";

import { useGlobalStore } from "@skylar/logic";

import "easymde/dist/easymde.min.css";

export const ReplyEmail = () => {
  const replyThreadId = useGlobalStore(
    (state) => state.EMAIL_CLIENT.threadToReplyTo,
  );

  const [value, setValue] = useState("");
  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  if (!replyThreadId) return <></>;

  return <SimpleMdeReact value={value} onChange={onChange} className="z-50" />;
};
