import { format } from "date-fns";

import type { SenderType } from "@skylar/parsers-and-types";

export const formatGmailForwardMessage = ({
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
  return `<br><br><div dir="ltr">---------- Forwarded message ---------<br>
  From: ${formattedFrom}<br>
  Date: ${formatDateToGmailReadableString(dateSent)}<br>
  Subject: ${subject}<br>
  To: ${formattedTo.join(", ")}<br>
</div><br><br>
${forwardContent}`;
};

export const formatGmailReplyMessage = ({
  dateSent,
  from,
  replyContent,
}: {
  dateSent: number;
  from: SenderType;
  replyContent: string;
}) => {
  const formattedFrom = formatSender({
    sender: from,
    formatEmail: formatEmailWIthHtml,
    formatName: (name) => formatNameWithHtml({ name, isBold: false }),
  });

  return `<br>
  <div class="gmail_quote">
     <div dir="ltr" class="gmail_attr">On ${formatDateToGmailReadableString(
       dateSent,
     )} ${formattedFrom} wrote:<br>
     </div>
     <blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">
        ${replyContent}
     </blockquote>
  </div>`;
};

const formatDateToGmailReadableString = (date: number) => {
  return format(new Date(date), "ccc, MMM dd, yyyy 'at' K:mm a");
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
