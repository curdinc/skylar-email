import type { SenderType } from "@skylar/parsers-and-types";

import { SenderDisplay } from ".";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
