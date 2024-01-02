import { Letter } from "react-letter";

import type { MessageType } from "@skylar/parsers-and-types";

import type { AttachmentListType } from "~/lib/store/attachment-list";
import { cn } from "~/lib/ui";
import { AttachmentList } from "../attachment/attachment-list/attachment-list";
import { AttachmentListFileSize } from "../attachment/attachment-list/attachment-list-file-size";
import { AttachmentListProvider } from "../attachment/attachment-list/attachment-list-provider";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { MessageInfoCollapsible } from "./message-info-collapsible";

export function MessageViewer({ message }: { message: MessageType }) {
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
        <MessageInfoCollapsible message={message} />
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
