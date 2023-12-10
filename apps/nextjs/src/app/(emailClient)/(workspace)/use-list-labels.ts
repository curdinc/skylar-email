import { useQuery } from "@tanstack/react-query";

import { useConnectedProviders } from "@skylar/client-db";
import { listLabels } from "@skylar/gmail-api";

import { useAccessToken } from "~/lib/provider/use-access-token";

export const LIST_LABEL_QUERY_KEY = "listLabels";
export function useListLabels() {
  const { data: allEmailProviders } = useConnectedProviders();
  const { mutateAsync: fetchAccessToken } = useAccessToken();

  return useQuery({
    queryKey: [LIST_LABEL_QUERY_KEY, allEmailProviders],
    queryFn: async () => {
      const labelPromise = (allEmailProviders ?? []).map(async (provider) => {
        const accessToken = await fetchAccessToken({
          email: provider.user_email_address,
        });

        const labels = await listLabels({
          accessToken,
          emailId: provider.user_email_address,
        });

        return { [provider.user_email_address]: labels };
      });

      const labelsResponse = await Promise.allSettled(labelPromise);
      const labels = labelsResponse
        .map((labelResponse) => {
          if (labelResponse.status === "fulfilled") {
            return labelResponse.value;
          }
        })
        .filter((label) => !!label) as Record<
        string,
        Awaited<ReturnType<typeof listLabels>>
      >[];

      const labelsMap = labels.reduce((acc, label) => {
        return {
          ...acc,
          ...label,
        };
      }, {});
      return labelsMap;
    },
  });
}
