import type { HtmlHTMLAttributes } from "react";

import type { SenderType } from "@skylar/parsers-and-types";

import { cn } from "~/lib/ui";
import { CopyToClipboard } from "../buttons/copy-to-clipboard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const SenderDisplay = ({
  senderInfo,
  displayType,
  className,
  ...props
}: {
  senderInfo: SenderType;
  displayType: "just-email-address" | "with-avatar-and-name" | "with-name";
} & Omit<HtmlHTMLAttributes<HTMLSpanElement>, "children">) => {
  switch (displayType) {
    case "with-name": {
      if (senderInfo.name) {
        return (
          <div {...props} className={cn("", className)}>
            {senderInfo.name} &lt;
            <CopyToClipboard
              variant={"link"}
              className={cn("w-fit", className)}
              valueToCopy={senderInfo.email_address}
            >
              {senderInfo.email_address}
            </CopyToClipboard>
            &gt;
          </div>
        );
      }
      return (
        <SenderDisplay
          senderInfo={senderInfo}
          displayType="just-email-address"
          {...props}
        />
      );
    }
    case "just-email-address": {
      return (
        <span {...props} className={cn("", className)}>
          <CopyToClipboard
            variant={"link"}
            className={cn("w-fit", className)}
            valueToCopy={senderInfo.email_address}
          >
            {senderInfo.email_address}
          </CopyToClipboard>
        </span>
      );
    }
    case "with-avatar-and-name": {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage alt={senderInfo.name} />
            <AvatarFallback>
              {senderInfo.name
                ? senderInfo.name
                    ?.split(" ")
                    .map((namePart) => namePart[0])
                    .join("")
                : senderInfo.email_address.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {senderInfo.name && (
              <div className="text-sm font-semibold">{senderInfo.name}</div>
            )}
            <SenderDisplay
              senderInfo={senderInfo}
              displayType="just-email-address"
              className={cn(
                senderInfo.name && "text-xs text-muted-foreground",
                !senderInfo.name && "text-sm font-semibold",
              )}
            />
          </div>
        </div>
      );
    }
  }
};
