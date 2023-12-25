import {
  bulkPutMessages,
  getEmailSyncInfo,
  getProviderByEmailAddress,
  updateEmailSyncInfo,
} from "@skylar/client-db";

import { gmailApiWorker } from "../../client";
import { MESSAGES_PER_SYNC } from "./constants";
import { convertGmailEmailToClientDbEmail } from "./utils";

export async function backgroundSync({
  emailAddress,
}: {
  emailAddress: string;
}) {
  console.log("syncing in the background");
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

    const syncResult = await gmailApiWorker.sync.incrementalSync.mutate({
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
