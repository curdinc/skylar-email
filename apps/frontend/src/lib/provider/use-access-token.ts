import { useMutation } from "@tanstack/react-query";

import { getRefreshTokenByEmailAddress } from "@skylar/client-db";

import { api } from "../api";
import { ACCESS_TOKEN } from "../query-key-constants";

export function useAccessToken() {
  const { mutateAsync: fetchAccessToken } =
    api.gmail.getAccessToken.useMutation();
  return useMutation({
    mutationKey: [ACCESS_TOKEN],
    mutationFn: async ({ email }: { email: string }) => {
      const refreshToken = await getRefreshTokenByEmailAddress({
        emailAddress: email,
      });

      const accessToken = await fetchAccessToken({
        email: email,
        refreshToken,
      });
      return accessToken;
    },
  });
}
