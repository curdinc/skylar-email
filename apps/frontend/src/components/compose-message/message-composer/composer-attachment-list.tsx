"use client";

import { setAttachments, useGlobalStore } from "@skylar/logic";

import { AttachmentList } from "~/components/attachment/attachment-list/attachment-list";
import {
  AttachmentListFileSize,
  withWarning,
} from "~/components/attachment/attachment-list/attachment-list-file-size";
import { AttachmentListProvider } from "~/components/attachment/attachment-list/attachment-list-provider";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import type { AttachmentListType } from "~/lib/store/attachment-list";

export const ComposerAttachmentList = () => {
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const formattedAttachments = attachments.map((attachment) => {
    return {
      fileName: attachment.file.name,
      mimeType: attachment.file.type,
      sizeInBytes: attachment.file.size,
      data: attachment.data,
      preview: attachment.preview,
    } satisfies AttachmentListType;
  });
  const removeAttachment = (index: number) => {
    return () =>
      setAttachments((prevAttachments) => {
        if (prevAttachments[index]?.preview) {
          URL.revokeObjectURL(prevAttachments[index]?.preview ?? "");
        }
        return prevAttachments.filter((_, i) => i !== index);
      });
  };

  const attachmentActions = [
    ({ index }) => {
      return (
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className="p-0.5 hover:text-destructive"
          onClick={removeAttachment(index)}
        >
          <Icons.trash />
        </Button>
      );
    },
  ] satisfies Parameters<typeof AttachmentList>[0]["actions"];

  return (
    <AttachmentListProvider attachments={formattedAttachments}>
      <div className="grid gap-1">
        <AttachmentList actions={attachmentActions} />
        <AttachmentListFileSize customRender={withWarning} />
      </div>
    </AttachmentListProvider>
  );
};
