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
          setAttachments((prevAttachments) => [
            ...prevAttachments,
            { file, data: binaryStr },
          ]);
          console.log(binaryStr);
        };
        reader.readAsBinaryString(file);
      });
    },
    [toast],
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
  });
  console.log("acceptedFiles", acceptedFiles);

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export const AttachmentButton = () => {
  const { toast } = useToast();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
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
        console.log(binaryStr);
      };
      reader.readAsBinaryString(file);
    });
  }, [acceptedFiles, toast]);

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here</p>
        <button type="button" onClick={open}>
          Open File Dialog
        </button>
      </div>
    </div>
  );
};

export const AttachmentList = () => {
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );

  const files = attachments.map((attachment) => (
    <li key={attachment.file.name}>
      {attachment.file.name} - {attachment.file.size} bytes
    </li>
  ));
  return <div>{files}</div>;
};
