import {
  bulkPutMessages,
  getEmailSyncInfo,
  getProviderByEmailAddress,
  updateEmailSyncInfo,
} from "@skylar/client-db";
import { fullSync } from "@skylar/gmail-api";

import { convertGmailEmailToClientDbEmail } from "~/lib/email";

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
  console.log(syncInfo);

  const syncAction = async (nextPageToken?: string) => {
    if (!nextPageToken) {
      return;
    }
    const startTime = performance.now();
    //FIXME: propagate errors to the main thread
    const syncResult = await fullSync({
      accessToken: provider.access_token, //FIXME: make sure this is fresh
      emailId: provider.user_email_address,
      pageToken: nextPageToken,
      onError: (error) => console.error("error", error),
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
    const endTime = performance.now();
    console.log("single background sync took", endTime - startTime, "ms");
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

  console.log("background sync completed");

  self.close();
}
