import { useMutation } from "@tanstack/react-query";
import { useLogger } from "next-axiom";

import { partialSync } from "@skylar/gmail-api";

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

      try {
        const emailData = await partialSync({
          accessToken,
          emailId: emailAddressToSync,
          startHistoryId,
        });
        return emailData;
      } catch (e) {
        logger.error("Error performing partial sync", { error: e });
        throw e;
      }
    },
  });
};
