import type { SenderType } from "@skylar/parsers-and-types";

export const formatSender = ({
  sender,
  formatEmail = (email: string) => `<${email}>`,
  formatName = (name: string) => name,
}: {
  sender: SenderType;
  formatName?: (name: string) => string;
  formatEmail?: (email: string) => string;
}) => {
  if (sender.name) {
    return `${formatName(sender.name)} ${formatEmail(sender.email_address)}`;
  } else {
    return formatEmail(sender.email_address);
  }
};

export const formatEmailWIthHtml = (email: string) => {
  return `<span dir="auto">&lt;<a href="mailto:${email}">${email}</a>&gt;</span>`;
};
export const formatNameWithHtml = ({
  name,
  isBold,
}: {
  name: string;
  isBold: boolean;
}) => {
  return isBold
    ? `<strong class="gmail_sendername" dir="auto">${name}</strong>`
    : name;
};
