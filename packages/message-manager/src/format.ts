import { format } from "date-fns";

import type { SenderType } from "@skylar/parsers-and-types";

export const formatForwardMessage = ({
  dateSent,
  forwardContent,
  from,
  subject,
  to,
}: {
  from: SenderType;
  subject: string;
  dateSent: number;
  to: SenderType[];
  forwardContent: string;
}) => {
  const formattedFrom = formatSender({
    sender: from,
    formatEmail: formatEmailWIthHtml,
    formatName: (name) => formatNameWithHtml({ name, isBold: true }),
  });
  const formattedTo = to.map((sender) =>
    formatSender({
      sender,
      formatEmail: formatEmailWIthHtml,
      formatName: (name) => formatNameWithHtml({ name, isBold: false }),
    }),
  );
  return `<div dir="ltr">---------- Forwarded message ---------<br>
  From: ${formattedFrom}<br>
  Date: ${format(new Date(dateSent), "ccc, MMM dd, yyyy 'at' K:mm a")}<br>
  Subject: ${subject}<br>
  To: ${formattedTo.join(", ")}<br>
</div><br><br>
${forwardContent}`;
};

const formatEmailWIthHtml = (email: string) => {
  return `<span dir="auto">&lt;<a href="mailto:${email}">${email}</a>&gt;</span>`;
};
const formatNameWithHtml = ({
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
