import { useQuery } from "@tanstack/react-query";

import { listLabels } from "@skylar/gmail-api";
import { useActiveEmails } from "@skylar/logic";

import { api } from "~/lib/api";

export const LIST_LABEL_QUERY_KEY = "listLabels";
export function useListLabels() {
  const activeEmails = useActiveEmails();
  const { mutateAsync: fetchAccessToken } =
    api.gmail.getAccessToken.useMutation();

  return useQuery({
    queryKey: [LIST_LABEL_QUERY_KEY, activeEmails],
    queryFn: async () => {
      const labelPromise = activeEmails.map(async (email) => {
        const accessToken = await fetchAccessToken({
          email: email,
        });

        const { labels } = await listLabels({
          accessToken,
          emailId: email,
        });

        return { [email]: labels };
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
        Awaited<ReturnType<typeof listLabels>>["labels"]
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
