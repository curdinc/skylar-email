import { useMutation } from "@tanstack/react-query";

import {
  getRefreshTokenDetailsByEmailAddress,
  updateAccessTokenByEmailAddress,
} from "@skylar/client-db";

import { api } from "../api";
import { useLogger } from "../logger";
import { ACCESS_TOKEN } from "../query-key-constants";

export function useAccessToken() {
  const logger = useLogger();
  const { mutateAsync: fetchAccessToken } =
    api.gmail.getAccessToken.useMutation();
  // sped this up with db (useMutation cannot be cached (https://github.com/TanStack/query/issues/5058)
  return useMutation({
    mutationKey: [ACCESS_TOKEN],
    mutationFn: async ({ email }: { email: string }) => {
      const { access_token, access_token_expires_at, refresh_token } =
        await getRefreshTokenDetailsByEmailAddress({
          emailAddress: email,
        });
      const currentTime = Date.now();

      // "memoize" access token
      if (currentTime < access_token_expires_at) {
        return access_token;
      }

      const { accessToken } = await fetchAccessToken({
        email: email,
        refreshToken: refresh_token,
      });

      await updateAccessTokenByEmailAddress({
        emailAddress: email,
        accessToken,
      });

      return accessToken;
    },
    onError: (error) => {
      logger.error("Error fetching access token", { error });
    },
  });
}
