"use client";

import Image from "next/image";

import { setAttachments, useGlobalStore } from "@skylar/logic";

import { CopyToClipboard } from "~/components/buttons/copy-to-clipboard";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  ATTACHMENT_SIZE_LIMIT_IN_BYTES,
  isAttachmentSizeValid,
} from "~/lib/email";
import { formatBytes } from "~/lib/format";

export const AttachmentList = () => {
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const removeAttachment = (index: number) => {
    return () =>
      setAttachments((prevAttachments) => {
        if (prevAttachments[index]?.preview) {
          URL.revokeObjectURL(prevAttachments[index]?.preview ?? "");
        }
        return prevAttachments.filter((_, i) => i !== index);
      });
  };

  const totalAttachmentSize = attachments.reduce(
    (acc, attachment) => acc + attachment.file.size,
    0,
  );
  let AttachmentSizeWarning = (
    <div>Total Attachment size: {formatBytes(totalAttachmentSize)}</div>
  );
  if (!isAttachmentSizeValid(attachments)) {
    AttachmentSizeWarning = (
      <div className="text-red-500">
        Total Attachment size: {formatBytes(totalAttachmentSize)} (Max:{" "}
        {formatBytes(ATTACHMENT_SIZE_LIMIT_IN_BYTES)})
      </div>
    );
  }

  const files = attachments.map((attachment, index) => {
    let PreviewImage = <Icons.fileDefault className="h-10 w-10 p-1.5" />;
    if (attachment.file.type.startsWith("video/")) {
      PreviewImage = <Icons.fileVideo className="h-10 w-10 p-1.5" />;
    }
    if (attachment.preview) {
      PreviewImage = (
        <Image
          src={attachment.preview}
          alt={attachment.file.name}
          className="aspect-square rounded-md object-cover"
          height={40}
          width={40}
        />
      );
    }

    return (
      <li
        key={attachment.file.name + index}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
      >
        {PreviewImage}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg">
            {attachment.file.name}{" "}
            <CopyToClipboard
              valueToCopy={attachment.file.name}
              className="h-4 w-4"
            />
            <Button
              size={"icon-sm"}
              variant={"ghost"}
              className="p-0.5 hover:text-destructive"
              onClick={removeAttachment(index)}
            >
              <Icons.trash />
            </Button>
          </div>
          <div className="text-muted-foreground">
            {formatBytes(attachment.file.size)}
          </div>
        </div>
      </li>
    );
  });
  return (
    <div className="grid gap-1">
      {files}
      {AttachmentSizeWarning}
    </div>
  );
};
