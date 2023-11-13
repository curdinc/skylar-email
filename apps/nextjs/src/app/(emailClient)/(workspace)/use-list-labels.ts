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
      return {
        "curdcorp@gmail.com": [
          {
            id: "CHAT",
            name: "CHAT",
          },
          {
            id: "SENT",
            name: "SENT",
          },
          {
            id: "INBOX",
            name: "INBOX",
          },
          {
            id: "IMPORTANT",
            name: "IMPORTANT",
          },
          {
            id: "TRASH",
            name: "TRASH",
          },
          {
            id: "DRAFT",
            name: "DRAFT",
          },
          {
            id: "SPAM",
            name: "SPAM",
          },
          {
            id: "CATEGORY_FORUMS",
            name: "CATEGORY_FORUMS",
          },
          {
            id: "CATEGORY_UPDATES",
            name: "CATEGORY_UPDATES",
          },
          {
            id: "CATEGORY_PERSONAL",
            name: "CATEGORY_PERSONAL",
          },
          {
            id: "CATEGORY_PROMOTIONS",
            name: "CATEGORY_PROMOTIONS",
          },
          {
            id: "CATEGORY_SOCIAL",
            name: "CATEGORY_SOCIAL",
          },
          {
            id: "STARRED",
            name: "STARRED",
          },
          {
            id: "UNREAD",
            name: "UNREAD",
          },
          {
            id: "Label_2487063905667858627",
            name: "Test",
          },
        ],
      };
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
