import { Letter } from "react-letter";

import { formatUnixTimestampToGmailReadableString } from "@skylar/message-manager";
import type { MessageType } from "@skylar/parsers-and-types";

import type { AttachmentListType } from "~/lib/store/attachment-list";
import { cn } from "~/lib/ui";
import { AttachmentList } from "../attachment/attachment-list/attachment-list";
import { AttachmentListFileSize } from "../attachment/attachment-list/attachment-list-file-size";
import { AttachmentListProvider } from "../attachment/attachment-list/attachment-list-provider";
import { SenderDisplay } from "../sender-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MessageInfoPopover } from "./message-info-popover";

export function MessageViewer({ message }: { message: MessageType }) {
  const dateUpdated = formatUnixTimestampToGmailReadableString(
    message.created_at,
  );
  const attachments = Object.values(message.attachments).map((attachment) => {
    return {
      fileName: attachment.filename,
      mimeType: attachment.mimeType,
      sizeInBytes: attachment.body.size,
      data: attachment.body.data,
    } satisfies AttachmentListType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col items-start @lg:flex-row @lg:items-center">
          <div className="flex items-center gap-1">
            <SenderDisplay
              displayType="just-email-address"
              className="font-heading text-xs font-semibold tracking-tighter @md:text-sm @lg:text-base"
              senderInfo={message.from}
            />
            <MessageInfoPopover message={message} />
          </div>
          <div className="text-xs text-muted-foreground @md:text-sm @lg:ml-auto">
            {dateUpdated}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <Letter
          className={cn(
            "overflow-x-auto",
            !message.content_html && "whitespace-pre-wrap",
          )}
          html={message.content_html ?? ""}
          text={message.content_text}
          // Leaving comments here to show that
          // we can rewrite external resources and links if needed in the future
          // rewriteExternalResources={(resource) => {
          //   console.log("resource", resource);
          //   return resource;
          // }}
          // rewriteExternalLinks={(link) => {
          //   console.log("link", link);
          //   return link;
          // }}
        />
      </CardContent>
      {!!message.attachment_names.length && (
        <CardFooter>
          <AttachmentListProvider attachments={attachments}>
            <div className="grid w-full gap-1">
              <AttachmentList
                onClickAttachment={({ attachment, index }) => {
                  return () => {
                    console.log("attachments", attachment, index);
                  };
                }}
              />
              <AttachmentListFileSize />
            </div>
          </AttachmentListProvider>
        </CardFooter>
      )}
    </Card>
  );
}
