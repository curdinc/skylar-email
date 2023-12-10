import { useQuery } from "@tanstack/react-query";

import { getAllProviders } from "../provider/get-all-providers";

const GET_EMAIL_PROVIDERS = "GET_EMAIL_PROVIDERS"; // FIXME: add to parsers and types

export function useAllEmailProviders() {
  return useQuery({
    queryKey: [GET_EMAIL_PROVIDERS],
    queryFn: async () => {
      const emailProviders = await getAllProviders();
      return emailProviders;
    },
  });
}
