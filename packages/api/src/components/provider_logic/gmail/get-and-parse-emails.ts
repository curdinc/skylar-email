import type { DbType } from "@skylar/db";
import type { Logger } from "@skylar/logger";

import { getMessages } from "./message-utils";

// specifically for gmail
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
  // get the relevant message contents
  const messageData = await getMessages({
    accessToken,
    emailId,
    logger,
    startHistoryId,
  });

  console.log(messageData);
  // filter

  // messageData.map((m, ind) =>
  //   logger.debug(`message: ${ind}`, {
  //     m,
  //     ind,
  //   }),
  // );

  console.log(db);
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
