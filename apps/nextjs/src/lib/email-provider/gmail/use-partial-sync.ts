import { useCallback } from "react";

import { partialSync } from "@skylar/gmail-api";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { api } from "~/lib/api";
import { useLogger } from "~/lib/logger";

export const usePartialSync = (startHistoryId: string) => {
  const logger = useLogger();
  const { refetch: fetchAccessToken, isFetching } =
    api.gmail.getAccessToken.useQuery(undefined, {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const fetchData = useCallback(async () => {
    const { data: accessToken } = await fetchAccessToken();

    if (accessToken) {
      try {
        const emailData = await partialSync({
          accessToken,
          emailId: "hansbhatia0342@gmail.com",
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
  }, [fetchAccessToken, logger, startHistoryId]);

  return {
    fetch: fetchData,
    isFetching,
  };
};
