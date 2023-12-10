import { getAllThreadsFromSenderEmailAddress } from "@skylar/client-db";

import { trashThreads } from "../thread/trash-threads";

export async function trashAll({
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

  await trashThreads({
    threads,
    email,
    accessToken,
    afterClientDbUpdate,
  });
}
