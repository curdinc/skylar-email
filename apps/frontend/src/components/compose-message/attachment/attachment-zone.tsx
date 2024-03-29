"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { useGlobalStore } from "@skylar/logic";

import { useHandleAcceptedFiles } from "./use-handle-accepted-files";

export const AttachmentZone = ({ children }: { children: React.ReactNode }) => {
  const { mutate: handleAcceptedFiles } = useHandleAcceptedFiles();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleAcceptedFiles({ acceptedFiles });
    },
    [handleAcceptedFiles],
  );

  const messageType = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.messageType,
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <>
      {isDragActive && messageType !== "none" && (
        <div
          className={
            "bg-background/70 pointer-events-none fixed inset-0 z-50 flex items-center justify-center font-heading text-4xl font-medium text-foreground backdrop-blur-sm"
          }
        >
          Drop files here...
        </div>
      )}
      <div {...getRootProps()} className="flex grow">
        <input {...getInputProps()} />
        {children}
      </div>
    </>
  );
};
