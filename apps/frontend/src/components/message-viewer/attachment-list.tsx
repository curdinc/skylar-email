"use client";

import { CopyToClipboard } from "~/components/buttons/copy-to-clipboard";
import { Icons } from "~/components/icons";
import { formatBytes } from "~/lib/format";

export const AttachmentList = ({
  attachments,
}: {
  attachments: {
    mimeType: string;
    filename: string;
    body: {
      attachmentId: string;
      size: number;
      data?: string;
    };
  }[];
}) => {
  const totalAttachmentSize = attachments.reduce(
    (acc, attachment) => acc + attachment.body.size,
    0,
  );
  const AttachmentSize = (
    <div>Total Attachment size: {formatBytes(totalAttachmentSize)}</div>
  );

  const files = attachments.map((attachment, index) => {
    let PreviewImage = <Icons.fileDefault className="h-10 w-10 p-1.5" />;
    if (attachment.mimeType.startsWith("video/")) {
      PreviewImage = <Icons.fileVideo className="h-10 w-10 p-1.5" />;
    } else if (attachment.mimeType.startsWith("image/")) {
      PreviewImage = <Icons.fileImage className="h-10 w-10 p-1.5" />;
    }

    return (
      <li
        key={attachment.filename + index}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
      >
        {PreviewImage}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg">
            {attachment.filename}{" "}
            <CopyToClipboard
              valueToCopy={attachment.filename}
              className="h-4 w-4"
            />
          </div>
          <div className="text-muted-foreground">
            {formatBytes(attachment.body.size)}
          </div>
        </div>
      </li>
    );
  });
  return (
    <div className="grid gap-1">
      {files}
      {AttachmentSize}
    </div>
  );
};
