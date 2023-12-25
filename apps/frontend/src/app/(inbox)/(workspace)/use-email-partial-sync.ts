import { useMutation } from "@tanstack/react-query";

import { partialSync } from "@skylar/gmail-api";

import { useLogger } from "~/lib/logger";
import { useAccessToken } from "~/lib/provider/use-access-token";

export const useEmailPartialSync = () => {
  const logger = useLogger();
  const { mutateAsync: fetchAccessToken } = useAccessToken();

  return useMutation({
    mutationFn: async ({
      emailAddressToSync,
      startHistoryId,
    }: {
      emailAddressToSync: string;
      startHistoryId: string;
    }) => {
      const accessToken = await fetchAccessToken({
        email: emailAddressToSync,
      });

      const emailData = await partialSync({
        accessToken,
        emailId: emailAddressToSync,
        startHistoryId,
      });
      return emailData;
    },
    onError: (error) => {
      logger.error("Error performing partial sync", { error });
    },
  });
};
