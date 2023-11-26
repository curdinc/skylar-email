"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { setAttachments, useGlobalStore } from "@skylar/logic";

import { useToast } from "~/components/ui/use-toast";

export const AttachmentZone = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () =>
          toast({
            title: "Unable to add attachment",
            description: "The file reading process was aborted",
          });
        reader.onerror = () =>
          toast({
            title: "Unable to add attachment",
            description: "The file reading process failed",
          });
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          if (typeof binaryStr !== "string") {
            toast({
              title: "Unable to add attachment",
              description: "The file reading process failed",
            });
            return;
          }
          console.log("file.type", file.type);
          setAttachments((prevAttachments) => [
            ...prevAttachments,
            {
              file,
              data: binaryStr,
              preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : undefined,
            },
          ]);
        };
        reader.readAsBinaryString(file);
      });
    },
    [toast],
  );

  const replyingTo = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.respondingThread,
  );
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      onDrop,
      noClick: true,
    });
  console.log("acceptedFiles", acceptedFiles);

  return (
    <>
      {isDragActive && replyingTo && (
        <div
          className={
            "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/70 font-heading text-4xl font-medium text-foreground backdrop-blur-sm"
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

export const AttachmentButton = () => {
  const { toast } = useToast();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    noDrag: true,
  });
  useEffect(() => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () =>
        toast({
          title: "Unable to add attachment",
          description: "The file reading process was aborted",
        });
      reader.onerror = () =>
        toast({
          title: "Unable to add attachment",
          description: "The file reading process failed",
        });
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        if (typeof binaryStr !== "string") {
          toast({
            title: "Unable to add attachment",
            description: "The file reading process failed",
          });
          return;
        }
        setAttachments((prevAttachments) => [
          ...prevAttachments,
          { file, data: binaryStr },
        ]);
      };
      reader.readAsBinaryString(file);
    });
  }, [acceptedFiles, toast]);

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <button type="button" onClick={open}>
        Open File Dialog
      </button>
    </div>
  );
};
