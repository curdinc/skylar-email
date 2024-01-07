import {
  bulkPutMessages,
  getEmailSyncInfo,
  getProviderByEmailAddress,
  updateEmailSyncInfo,
} from "@skylar/client-db";
import { incrementalSync } from "@skylar/gmail-api";
import { convertGmailEmailToClientDbEmail } from "@skylar/parsers-and-types";

import { BACKGROUND_FULL_SYNC_BATCH_SIZE } from "./constants";

export async function backgroundFullSync({
  emailAddress,
  getAccessToken,
}: {
  emailAddress: string;
  getAccessToken: (emailAddress: string) => Promise<string>;
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

    const accessToken = await getAccessToken(emailAddress);

    const syncResult = await incrementalSync({
      emailId: provider.user_email_address,
      pageToken: nextPageToken,
      numberOfMessagesToFetch: BACKGROUND_FULL_SYNC_BATCH_SIZE,
      accessToken,
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
