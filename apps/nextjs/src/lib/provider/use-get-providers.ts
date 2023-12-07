import { useQuery } from "@tanstack/react-query";

import { getAllProviders } from "@skylar/client-db";

import { GET_EMAIL_PROVIDERS } from "../query-key-constants";

export function useGetProviders() {
  return useQuery({
    queryKey: [GET_EMAIL_PROVIDERS],
    queryFn: async () => {
      const emailProviders = await getAllProviders();
      return emailProviders;
    },
  });
}
