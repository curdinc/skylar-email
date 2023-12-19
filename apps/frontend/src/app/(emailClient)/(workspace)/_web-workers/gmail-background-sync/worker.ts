import type { GmailBackgroundSyncParams } from "./types";
import { backgroundSync } from "./worker-background-sync";

let syncing = false;

const ctx: SharedWorker = self as unknown as SharedWorker;

ctx.addEventListener("connect", (_e: unknown) => {
  const event: MessageEvent = _e as MessageEvent;
  const port: MessagePort = event.ports[0] as unknown as MessagePort;
  if (!syncing) {
    syncing = true;
    port.onmessage = async (event: MessageEvent<GmailBackgroundSyncParams>) => {
      const params = event.data;
      syncing = true;
      await backgroundSync({
        emailAddress: params.emailAddress,
      });
    };
  }
});
