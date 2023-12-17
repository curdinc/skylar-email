import type { GmailBackgroundSyncParams } from "./types";
import { backgroundSync } from "./worker-background-sync";

onmessage = async (event: MessageEvent<GmailBackgroundSyncParams>) => {
  const params = event.data;
  await backgroundSync({
    emailAddress: params.emailAddress,
  });
};
