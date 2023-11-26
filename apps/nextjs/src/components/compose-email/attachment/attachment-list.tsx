import Image from "next/image";

import { setAttachments, useGlobalStore } from "@skylar/logic";

import { CopyToClipboard } from "~/components/buttons/copy-to-clipboard";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

export const AttachmentList = () => {
  const attachments = useGlobalStore(
    (state) => state.EMAIL_CLIENT.COMPOSING.attachments,
  );
  const removeAttachment = (index: number) => {
    return () =>
      setAttachments((prevAttachments) =>
        prevAttachments.filter((_, i) => i !== index),
      );
  };

  const files = attachments.map((attachment, index) => {
    let PreviewImage = <Icons.FileDefault className="h-10 w-10 p-1.5" />;
    if (attachment.file.type.startsWith("video/")) {
      PreviewImage = <Icons.FileVideo className="h-10 w-10 p-1.5" />;
    }
    if (attachment.preview) {
      PreviewImage = (
        <Image
          src={attachment.preview}
          alt={attachment.file.name}
          className="aspect-square rounded-md object-cover"
          height={40}
          width={40}
          onLoad={() => {
            if (attachment.preview) {
              URL.revokeObjectURL(attachment.preview);
            }
          }}
        />
      );
    }

    return (
      <li
        key={attachment.file.name}
        className="flex items-center rounded-md px-3 py-2 transition-colors hover:bg-muted"
      >
        <div className="flex w-full items-center gap-2">
          {PreviewImage}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-lg">
              {attachment.file.name}{" "}
              <CopyToClipboard
                valueToCopy={attachment.file.name}
                className="h-4 w-4"
              />
            </div>
            <div className="text-muted-foreground">
              {attachment.file.size} bytes
            </div>
          </div>
        </div>
        <Button
          size={"icon-sm"}
          variant={"ghost"}
          className="p-0.5"
          onClick={removeAttachment(index)}
        >
          <Icons.close />
        </Button>
      </li>
    );
  });
  return <div className="grid gap-1">{files}</div>;
};
