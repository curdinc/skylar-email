import type { SenderType } from "@skylar/parsers-and-types";

import {
  formatEmailWIthHtml,
  formatNameWithHtml,
  formatSender,
} from "./format-sender";
import { formatUnixTimestampToGmailReadableString } from "./format-unix-timestamp-to-gmail-readable-string";

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
       <div dir="ltr" class="gmail_attr">On ${formatUnixTimestampToGmailReadableString(
         dateSent,
       )} ${formattedFrom} wrote:<br>
       </div>
       <blockquote class="gmail_quote" style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">
          ${replyContent}
       </blockquote>
    </div>`;
};
