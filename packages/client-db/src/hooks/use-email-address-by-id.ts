import { useQuery } from "@tanstack/react-query";

import { getProviderById } from "../provider/get-provider-by-id";

const GET_ACTIVE_EMAIL_ADDRESS = "GET_ACTIVE_EMAIL_ADDRESS"; // FIXME: add to parsers and types
export const useEmailAddressById = (id?: number) => {
  return useQuery({
    queryKey: [GET_ACTIVE_EMAIL_ADDRESS, id],
    queryFn: async () => {
      if (!id) return undefined;
      const emailProvider = await getProviderById({ id });
      return emailProvider?.email;
    },
    gcTime: 0,
  });
};
