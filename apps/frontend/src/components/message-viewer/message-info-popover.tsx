import type { MessageType, SenderType } from "@skylar/parsers-and-types";

import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { Icons } from "../icons";
import { SenderDisplay } from "../sender-display";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const MessageInfoPopover = ({ message }: { message: MessageType }) => {
  const { data: activeEmailAddress } = useActiveEmailAddress();
  console.log("message", message);
  if (!activeEmailAddress) {
    return null;
  }
  const ToRecipient = message.delivered_to.length ? (
    <div className="flex items-center">
      <div className="w-20 text-sm text-muted-foreground">To: </div>
      <RecipientListDisplay
        recipientList={message.delivered_to}
        userEmailAddress={activeEmailAddress}
      />
    </div>
  ) : (
    <div className="flex items-center">
      <div className="w-20 text-sm text-muted-foreground">To: </div>
      <RecipientListDisplay
        recipientList={message.to}
        userEmailAddress={activeEmailAddress}
      />
    </div>
  );
  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size={"icon-xs"} aria-label="message-info">
              <Icons.info />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <p>Complete message info</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <SenderDisplay
            displayType="with-avatar-and-name"
            senderInfo={message.from}
          />
          <div className="grid">
            {ToRecipient}
            {!!message.reply_to.length && (
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground">
                  Reply To:{" "}
                </div>
                <RecipientListDisplay
                  recipientList={message.reply_to}
                  userEmailAddress={activeEmailAddress}
                />
              </div>
            )}
            {!!message.cc.length && (
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground">Cc: </div>
                <RecipientListDisplay
                  recipientList={message.cc}
                  userEmailAddress={activeEmailAddress}
                />
              </div>
            )}
            {message.bcc && (
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground">Bcc: </div>
                <RecipientListDisplay
                  recipientList={[message.bcc]}
                  userEmailAddress={activeEmailAddress}
                />
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const RecipientListDisplay = ({
  recipientList,
  userEmailAddress,
}: {
  recipientList: SenderType[];
  userEmailAddress: string;
}) => {
  const isUserPresent = recipientList.find(
    (recipient) =>
      recipient.email_address.toLowerCase() === userEmailAddress.toLowerCase(),
  );

  const isMoreThanOne = recipientList.length > 1;

  if (isUserPresent && isMoreThanOne) {
    return (
      <span>
        You and{" "}
        <Tooltip>
          <TooltipTrigger>
            <span>{recipientList.length - 1} others</span>
          </TooltipTrigger>
          <TooltipContent>
            {recipientList.map((recipient) => {
              return (
                <div key={recipient.email_address}>
                  <SenderDisplay
                    senderInfo={recipient}
                    displayType="with-avatar-and-name"
                  />
                </div>
              );
            })}
          </TooltipContent>
        </Tooltip>
      </span>
    );
  } else if (isUserPresent) {
    return <span>You</span>;
  } else if (isMoreThanOne) {
    const firstRecipient = recipientList[0];
    if (!firstRecipient) {
      return null;
    }
    return (
      <span>
        <SenderDisplay
          senderInfo={firstRecipient}
          displayType="just-email-address"
        />{" "}
        and{" "}
        <Tooltip>
          <TooltipTrigger>
            <span>{recipientList.length - 1} others</span>
          </TooltipTrigger>
          <TooltipContent>
            {recipientList.slice(1).map((recipient) => {
              return (
                <div key={recipient.email_address}>
                  <SenderDisplay
                    senderInfo={recipient}
                    displayType="with-avatar-and-name"
                  />
                </div>
              );
            })}
          </TooltipContent>
        </Tooltip>
      </span>
    );
  } else {
    const onlyRecipient = recipientList[0];
    if (!onlyRecipient) {
      return null;
    }
    return (
      <SenderDisplay
        senderInfo={onlyRecipient}
        displayType="just-email-address"
      />
    );
  }
};
