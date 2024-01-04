import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";

import {
  bulkPutMessages,
  getEmailSyncInfo,
  getProviderByEmailAddress,
  updateEmailSyncInfo,
} from "@skylar/client-db";
import { convertGmailEmailToClientDbEmail } from "@skylar/parsers-and-types";
import { workerLink } from "@skylar/trpc-web-workers";

import type { GmailWorkerRouterType } from "../../../gmail-api/root";
import { loggerLinkConfig } from "../../../lib/logger-config";

const MESSAGES_PER_SYNC = 50;
export async function backgroundSync({
  emailAddress,
}: {
  emailAddress: string;
}) {
  const provider = await getProviderByEmailAddress({ emailAddress });
  if (!provider) {
    return;
  }
  const syncInfo = await getEmailSyncInfo({
    emailAddress: provider.user_email_address,
  });

  const syncAction = async (nextPageToken?: string) => {
    if (!nextPageToken) {
      return;
    }

    const worker = createTRPCClient<GmailWorkerRouterType>({
      transformer: superjson,
      links: [
        loggerLinkConfig,
        workerLink({
          createWorker: () => {
            return new SharedWorker(
              new URL("../../../gmail-api/worker.ts", import.meta.url),
              {
                name: "gmail-api-worker",
              },
            );
          },
        }),
      ],
    });

    const syncResult = await worker.sync.incrementalSync.mutate({
      emailAddress: provider.user_email_address,
      pageToken: nextPageToken,
      numberOfMessagesToFetch: MESSAGES_PER_SYNC,
    });

    const messagesToSave = convertGmailEmailToClientDbEmail(
      provider.user_email_address,
      syncResult.newMessages,
    );

    await bulkPutMessages({
      messages: messagesToSave,
    });

    await updateEmailSyncInfo({
      syncEmailAddressToUpdate: provider.user_email_address,
      emailSyncInfo: {
        next_page_token: syncResult.nextPageToken,
      },
    });
    // TODO: add perf to posthog?

    // schedule next sync
    await syncAction(syncResult.nextPageToken);
  };

  await syncAction(syncInfo?.next_page_token);

  // full sync is done
  await updateEmailSyncInfo({
    syncEmailAddressToUpdate: provider.user_email_address,
    emailSyncInfo: {
      full_sync_completed_on: new Date().getTime(),
    },
  });

  self.close();
}
