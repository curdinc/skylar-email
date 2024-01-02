import { Letter } from "react-letter";

import type { MessageType } from "@skylar/parsers-and-types";

import { cn } from "~/lib/ui";
import { Card, CardContent, CardHeader } from "../ui/card";
import { MessageInfoCollapsible } from "./message-info-collapsible";

export function MessageViewer({ message }: { message: MessageType }) {
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
    </Card>
  );
}
