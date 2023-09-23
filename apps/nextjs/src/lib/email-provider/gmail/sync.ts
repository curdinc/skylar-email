import { useCallback } from "react";

import { fullSync } from "@skylar/gmail-api";
import { formatValidatorError } from "@skylar/parsers-and-types";

import { api } from "~/lib/api";
import { useLogger } from "~/lib/logger";

export const useFullSync = () => {
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
        const emailData = await fullSync({
          accessToken,
          emailId: "hansbhatia0342@gmail.com",
          logger,
        });
        console.log("emailData", emailData);
      } catch (e) {
        console.log(JSON.stringify(formatValidatorError(e), null, 2));
        throw e;
      }
    }
  }, [fetchAccessToken, logger]);

  return {
    fetch: fetchData,
    isFetching,
  };
};
