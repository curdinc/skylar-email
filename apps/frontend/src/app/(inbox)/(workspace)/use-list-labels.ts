import { useQuery } from "@tanstack/react-query";

import { useConnectedProviders } from "@skylar/client-db";
import { gmailApiWorker } from "@skylar/web-worker-logic";

export const LIST_LABEL_QUERY_KEY = "listLabels";
export function useListLabels() {
  const { data: connectedProviders } = useConnectedProviders();

  return useQuery({
    queryKey: [LIST_LABEL_QUERY_KEY, connectedProviders],
    queryFn: async () => {
      const labelPromise = (connectedProviders ?? []).map(async (provider) => {
        const labels = await gmailApiWorker.label.list.query({
          emailAddress: provider.user_email_address,
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
        Awaited<ReturnType<typeof gmailApiWorker.label.list.query>>
      >[];

      const labelsMap = labels.reduce((acc, label) => {
        return {
          ...acc,
          ...label,
        };
      }, {});
      return labelsMap;
    },
    enabled: !!connectedProviders,
  });
}
