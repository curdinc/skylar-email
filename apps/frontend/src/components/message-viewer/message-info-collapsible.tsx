"use client";

import * as React from "react";

import { formatUnixTimestampToGmailReadableString } from "@skylar/message-manager";
import type { MessageType } from "@skylar/parsers-and-types";

import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { SenderDisplay } from "../sender-display";
import { RecipientListDisplay } from "../sender-display/recipient-list-display";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const MessageInfoCollapsible = ({
  message,
}: {
  message: MessageType;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: activeEmailAddress } = useActiveEmailAddress();
  if (!activeEmailAddress) {
    return null;
  }

  const dateUpdated = formatUnixTimestampToGmailReadableString(
    message.created_at,
  );

  const ToRecipient = message.delivered_to.length ? (
    <div className="flex items-center gap-2">
      <div>To: </div>
      <RecipientListDisplay
        recipientList={message.delivered_to}
        userEmailAddress={activeEmailAddress}
      />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <div>To: </div>
      <RecipientListDisplay
        recipientList={message.to}
        userEmailAddress={activeEmailAddress}
      />
    </div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex flex-col items-start @lg:flex-row @lg:items-center ">
        <div className="flex items-center gap-2">
          <SenderDisplay
            displayType="just-email-address"
            className="font-heading text-xs font-semibold tracking-tighter @md:text-sm @lg:text-base"
            senderInfo={message.from}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="toggle"
                  className={cn("transition-transform", isOpen && "rotate-180")}
                >
                  <Icons.chevronDown />
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show full message details</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-xs text-muted-foreground @md:text-sm @lg:ml-auto">
          {dateUpdated}
        </div>
      </div>

      <CollapsibleContent className="text-xs text-muted-foreground @md:space-y-1 @md:text-sm">
        {!!message.reply_to.length && (
          <div className="flex items-center gap-2">
            <div>Reply To: </div>
            <RecipientListDisplay
              recipientList={message.reply_to}
              userEmailAddress={activeEmailAddress}
            />
          </div>
        )}
        {ToRecipient}
        {!!message.cc.filter((recipient) => !!recipient.email_address)
          .length && (
          <div className="flex items-center gap-2">
            <div>Cc: </div>
            <RecipientListDisplay
              recipientList={message.cc}
              userEmailAddress={activeEmailAddress}
            />
          </div>
        )}
        {!!message.bcc?.email_address && (
          <div className="flex items-center gap-2">
            <div>Bcc: </div>
            <RecipientListDisplay
              recipientList={[message.bcc]}
              userEmailAddress={activeEmailAddress}
            />
          </div>
        )}
      </CollapsibleContent>
      <div className="flex gap-1">
        {message.email_provider_labels.map((label) => {
          return (
            <Badge variant={"secondary"} key={label}>
              {label}
            </Badge>
          );
        })}
      </div>
    </Collapsible>
  );
};
