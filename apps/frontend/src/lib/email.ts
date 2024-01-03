import type { State } from "@skylar/logic";
import type { SenderType } from "@skylar/parsers-and-types";

export const getSenderReplyToEmailAddresses = (
  fromAddresses?: SenderType[],
  replyToAddresses?: SenderType[],
): string[] => {
  if (replyToAddresses?.length) {
    return replyToAddresses.map(
      (replyToAddress) => replyToAddress.email_address,
    );
  }
  if (fromAddresses?.length) {
    return fromAddresses.map((fromAddress) => {
      return fromAddress.email_address;
    });
  }
  return [];
};

export const formatEmailSenderTypeAndRemoveUserEmail = (
  userEmailAddress?: string,
  emailAddresses?: SenderType[],
): string[] => {
  return (
    emailAddresses
      ?.map((emailAddress) => emailAddress.email_address)
      ?.filter((emailAddress) => {
        return emailAddress !== userEmailAddress;
      }) ?? []
  );
};

export const ATTACHMENT_SIZE_LIMIT_IN_BYTES = 25_000_000;
export const isAttachmentSizeValid = (
  attachments: State["EMAIL_CLIENT"]["COMPOSING"]["attachments"],
): boolean => {
  const totalSize = attachments.reduce((prev, current) => {
    return prev + current.file.size;
  }, 0);
  return totalSize < ATTACHMENT_SIZE_LIMIT_IN_BYTES;
};
