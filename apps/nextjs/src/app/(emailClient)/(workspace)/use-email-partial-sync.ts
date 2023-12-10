import { useMutation } from "@tanstack/react-query";

import { partialSync } from "@skylar/gmail-api";
import { formatValidatorError } from "@skylar/parsers-and-types";

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

      try {
        const emailData = await partialSync({
          accessToken,
          emailId: emailAddressToSync,
          startHistoryId,
        });
        return emailData;
      } catch (e) {
        logger.info(JSON.stringify(formatValidatorError(e), null, 2));
        throw e;
      }
    },
  });
};
