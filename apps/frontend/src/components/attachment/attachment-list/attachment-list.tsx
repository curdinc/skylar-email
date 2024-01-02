import React from "react";
import Image from "next/image";

import { CopyToClipboard } from "~/components/buttons/copy-to-clipboard";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { formatBytes } from "~/lib/format";
import type { AttachmentListType } from "~/lib/store/attachment-list";
import { useAttachmentList } from "~/lib/store/attachment-list";
import { cn } from "~/lib/ui";

export const AttachmentList = ({
  actions,
  onClickAttachment,
}: {
  actions?: ((args: {
    attachment: AttachmentListType;
    index: number;
  }) => React.ReactNode)[];
  onClickAttachment?: (args: {
    attachment: AttachmentListType;
    index: number;
  }) => (e: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => void;
}) => {
  const [attachments] = useAttachmentList();
  const ItemComponent = onClickAttachment ? Button : "li";
  const files = attachments.map((attachment, index) => {
    let PreviewImage = <Icons.fileDefault className="h-10 w-10 p-1.5" />;
    if (attachment.mimeType.startsWith("video/")) {
      PreviewImage = <Icons.fileVideo className="h-10 w-10 p-1.5" />;
    }
    if (attachment.mimeType.startsWith("image/")) {
      PreviewImage = <Icons.fileImage className="h-10 w-10 p-1.5" />;
    }
    if (attachment.preview) {
      PreviewImage = (
        <Image
          src={attachment.preview}
          alt={attachment.fileName}
          className="aspect-square rounded-md object-cover"
          height={40}
          width={40}
        />
      );
    }

    return (
      <ItemComponent
        {...(onClickAttachment
          ? {
              onClick: onClickAttachment({
                attachment,
                index,
              }),
              variant: "ghost",
              size: "lg",
            }
          : {})}
        key={attachment.fileName + index}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2",
          onClickAttachment && "h-fit justify-start",
        )}
      >
        {PreviewImage}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 text-lg">
            {attachment.fileName}{" "}
            <CopyToClipboard
              valueToCopy={attachment.fileName}
              className="h-4 w-4"
            />
            {actions?.map((action) =>
              action({
                attachment,
                index,
              }),
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatBytes(attachment.sizeInBytes)}
          </div>
        </div>
      </ItemComponent>
    );
  });

  return files;
};
