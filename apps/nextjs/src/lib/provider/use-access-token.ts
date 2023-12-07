import { useMutation } from "@tanstack/react-query";

import { getRefreshTokenByEmail } from "@skylar/client-db";

import { api } from "../api";
import { ACCESS_TOKEN } from "../query-key-constants";

export function useAccessToken() {
  const { mutateAsync: fetchAccessToken } =
    api.gmail.getAccessToken.useMutation();
  return useMutation({
    mutationKey: [ACCESS_TOKEN], // TODO: add constant for this
    mutationFn: async ({ email }: { email: string }) => {
      // TODO: add error handling
      const refreshToken = await getRefreshTokenByEmail({
        emailAddress: email,
      });
      if (!refreshToken) throw new Error("No refresh token found");
      const accessToken = await fetchAccessToken({
        email: email,
        refreshToken,
      });
      return accessToken;
    },
  });
}
