import { Letter } from "react-letter";

import { formatUnixTimestampToGmailReadableString } from "@skylar/message-manager";
import type { MessageType } from "@skylar/parsers-and-types";

import { cn } from "~/lib/ui";
import { SenderDisplay } from "../sender-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AttachmentList } from "./attachment-list";
import { MessageInfoPopover } from "./message-info-popover";

export function MessageViewer({ message }: { message: MessageType }) {
  const dateUpdated = formatUnixTimestampToGmailReadableString(
    message.created_at,
  );

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
          <AttachmentList attachments={Object.values(message.attachments)} />
        </CardFooter>
      )}
    </Card>
  );
}
