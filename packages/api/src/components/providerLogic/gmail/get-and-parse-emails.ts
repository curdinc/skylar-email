import type { DbType } from "@skylar/db";
import type { Logger } from "@skylar/logger";

import { getInboxHistory, getMessage } from "./api";
import { getEmailBody, getEmailMetadata } from "./messageUtils";

export async function getAndParseEmails({
  emailId,
  startHistoryId,
  accessToken,
  logger,
  db,
}: {
  emailId: string;
  startHistoryId: string;
  accessToken: string;
  logger: Logger;
  db: DbType;
}) {
  const inboxHistory = await getInboxHistory({
    emailId,
    startHistoryId,
    accessToken,
  });

  const messageIds = inboxHistory.history
    .map((historyItem) => historyItem.messagesAdded)
    .flat(1)
    .map((messageMetadata) => messageMetadata.message);

  // todo: filter if they are unique
  const messageDataResponse = await Promise.allSettled(
    messageIds.map(async (mid) => {
      const msg = await getMessage({
        accessToken: accessToken,
        emailId: emailId,
        messageId: mid.id,
      });
      const emailMetadata = getEmailMetadata(msg.payload.headers);
      const emailData = getEmailBody({
        payloads: [msg.payload],
        mid: mid.id,
        emailId,
        logger,
      });
      return { emailMetadata, emailData };
    }),
  );

  const messageData = messageDataResponse
    .map((m) => {
      if (m.status === "fulfilled") {
        return m.value;
      }
      console.log(m.reason);
    })
    .filter((m) => !!m) as {
    emailMetadata: {
      from: string;
      subject: string;
      name: string;
      timestamp: Date;
    };
    emailData: {
      html: string[];
      plain: string[];
      attachments: string[];
    };
  }[];

  messageData.map((m, ind) =>
    logger.debug(`message: ${ind}`, {
      m,
      ind,
    }),
  );

  // db
  //   .insert(schema.email)
  //   .values({
  //     provider: input.provider,
  //     refreshToken: parsedResponse.refresh_token,
  //     userId: uid,
  //     email: email,
  //     name: name,
  //     lastCheckedHistoryId: historyId,
  //   })
  //   .onConflictDoUpdate({
  //     target: [
  //       schema.providerAuthDetails.userId,
  //       schema.providerAuthDetails.provider,
  //       schema.providerAuthDetails.email,
  //     ],
  //     set: {
  //       refreshToken: parsedResponse.refresh_token,
  //       name: name,
  //     },
  //   })
  // test single
  // const msg = await getMessage({
  //   accessToken: accessToken,
  //   emailId: emailId,
  //   messageId: "18a8c53d904b309a",
  // });
  // const emailMetadata = getEmailMetadata(msg.payload.headers);
  // const emailData = getEmailBody({
  //   payloads: [msg.payload],
  //   mid: "18a8c53d904b309a",
  //   emailId,
  //   logger,
  // });
  // console.log(emailMetadata, emailData);
  return;
}
