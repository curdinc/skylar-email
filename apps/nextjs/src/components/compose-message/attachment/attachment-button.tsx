"use client";

import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { Icons } from "~/components/icons";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import { useHandleAcceptedFiles } from "./use-handle-accepted-files";

export const AttachmentButton = (props: ButtonProps) => {
  const { open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    noDrag: true,
  });
  const { mutate: handleAcceptedFiles } = useHandleAcceptedFiles();

  useEffect(() => {
    handleAcceptedFiles({
      acceptedFiles,
    });
  }, [acceptedFiles, handleAcceptedFiles]);

  return (
    <Button onClick={open} {...props}>
      <Icons.attachment />
    </Button>
  );
};
