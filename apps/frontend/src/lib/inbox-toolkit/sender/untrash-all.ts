import { getAllThreadsFromSenderEmailAddress } from "@skylar/client-db";

import { untrashThreads } from "../thread/untrash-threads";

export async function untrashAll({
  email,
  accessToken,
  afterClientDbUpdate,
  senderEmail,
}: {
  email: string;
  accessToken: string;
  afterClientDbUpdate: (() => Promise<unknown>)[];
  senderEmail: string;
}) {
  const threads = await getAllThreadsFromSenderEmailAddress({
    clientEmail: email,
    senderEmail,
  });

  await untrashThreads({
    threads,
    emailAddress: email,
    afterClientDbUpdate,
  });
}
