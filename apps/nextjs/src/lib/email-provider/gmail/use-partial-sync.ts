import { useCallback } from "react";

import { partialSync } from "@skylar/gmail-api";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { api } from "~/lib/api";
import { useLogger } from "~/lib/logger";

export const usePartialSync = (startHistoryId: string) => {
  const logger = useLogger();
  const { mutateAsync: fetchAccessToken, isLoading } =
    api.gmail.getAccessToken.useMutation();

  const fetchData = useCallback(
    async (emailToSync: string) => {
      const accessToken = await fetchAccessToken({
        email: emailToSync,
      });

      if (accessToken) {
        try {
          const emailData = await partialSync({
            accessToken,
            emailId: emailToSync,
            logger,
            startHistoryId,
          });
          console.log("emailData", emailData);
        } catch (e) {
          console.log("client side: operation failed");
          console.log(JSON.stringify(formatValidatorError(e), null, 2));
          throw e;
        }
      }
    },
    [fetchAccessToken, logger, startHistoryId],
  );

  return {
    fetch: fetchData,
    isFetching: isLoading,
  };
};
