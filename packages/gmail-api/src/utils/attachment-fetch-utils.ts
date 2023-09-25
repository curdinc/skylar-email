import type { messageDetailsType } from "@skylar/parsers-and-types";

import { getAttachmentUnbouned } from "../unbounded-core-api";

export async function resolveAttachements({
  messageDetailList,
  accessToken,
  emailId,
}: {
  messageDetailList: messageDetailsType[];
  accessToken: string;
  emailId: string;
}) {
  const attachmentIdPromises = messageDetailList.map(async (messageDetail) => {
    const attachments = await getAttachmentUnbouned({
      accessToken,
      attachmentIds: messageDetail.emailData.attachments.map(
        (a) => a.body.attachmentId,
      ),
      emailId,
      messageId: messageDetail.emailProviderMessageId,
    });

    messageDetail.emailData.attachments =
      messageDetail.emailData.attachments.map((a, ind) => {
        a.body.data = attachments[ind]?.data;
        return a;
      });

    return messageDetail;
  });

  const attachmentIds = await Promise.allSettled(attachmentIdPromises);

  const parseAttachmentIds = attachmentIds.map((m, ind) => {
    if (m.status === "fulfilled") {
      return m.value;
    }
    console.error(`Failed to retrieve message batch. Error: ${m.reason} `);
    return messageDetailList[ind]!;
  });

  return parseAttachmentIds.flat();
}
