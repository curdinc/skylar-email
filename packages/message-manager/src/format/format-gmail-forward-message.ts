import type { SenderType } from "@skylar/parsers-and-types";

import {
  formatEmailWIthHtml,
  formatNameWithHtml,
  formatSender,
} from "./format-sender";
import { formatUnixTimestampToGmailReadableString } from "./format-unix-timestamp-to-gmail-readable-string";

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
    Date: ${formatUnixTimestampToGmailReadableString(dateSent)}<br>
    Subject: ${subject}<br>
    To: ${formattedTo.join(", ")}<br>
  </div><br><br>
  ${forwardContent}`;
};
