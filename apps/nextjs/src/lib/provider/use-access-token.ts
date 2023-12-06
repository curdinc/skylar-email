import { useMutation } from "@tanstack/react-query";

import { getRefreshTokenByEmail } from "@skylar/client-db";

import { api } from "../api";

export function useAccessToken() {
  const { mutateAsync: fetchAccessToken } =
    api.gmail.getAccessToken.useMutation();
  return useMutation({
    mutationKey: ["ACCESS_TOKEN"],
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
