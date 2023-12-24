import { useQuery } from "@tanstack/react-query";

import { useConnectedProviders } from "@skylar/client-db";
import type { listLabels } from "@skylar/gmail-api";
import { gmailApiWorker } from "@skylar/web-worker-logic";

export const LIST_LABEL_QUERY_KEY = "listLabels";
export function useListLabels() {
  const { data: allEmailProviders } = useConnectedProviders();

  return useQuery({
    queryKey: [LIST_LABEL_QUERY_KEY, allEmailProviders],
    queryFn: async () => {
      const labelPromise = (allEmailProviders ?? []).map(async (provider) => {
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
