import { Letter } from "react-letter";

import { formatUnixTimestampToGmailReadableString } from "@skylar/message-manager";
import type { MessageType } from "@skylar/parsers-and-types";

import { cn } from "~/lib/ui";
import { SenderDisplay } from "../sender-display";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MessageInfoPopover } from "./message-info-poopover";

export function MessageViewer({ message }: { message: MessageType }) {
  const dateUpdated = formatUnixTimestampToGmailReadableString(
    message.created_at,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="@md:flex-row @md:items-center flex flex-col gap-1">
          <SenderDisplay
            className="@lg:text-base font-heading text-sm font-semibold tracking-tighter"
            senderInfo={message.from}
          />
          <MessageInfoPopover message={message} />
          <div className="@md:ml-auto @md:text-sm text-xs text-muted-foreground">
            {dateUpdated}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Letter
          className={cn(
            "w-full overflow-x-auto",
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
    </Card>
  );
}
