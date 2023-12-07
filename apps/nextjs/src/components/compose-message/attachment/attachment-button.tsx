"use client";

import { forwardRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { Icons } from "~/components/icons";
import type { ButtonProps } from "~/components/ui/button";
import { Button } from "~/components/ui/button";
import { useHandleAcceptedFiles } from "./use-handle-accepted-files";

const AttachmentButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
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
      <Button onClick={open} {...props} ref={ref}>
        <Icons.attachment />
      </Button>
    );
  },
);
AttachmentButton.displayName = "AttachmentButton";
export { AttachmentButton };
