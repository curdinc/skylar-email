import { useQuery } from "@tanstack/react-query";

import { getMessagesFromThreadId } from "../message/get-messages-from-thread-id";
import type { GetParameters } from "../types/extract-params";

export const EMAIL_THREAD_QUERY_KEY = "emailThread";

export function useThread(args: GetParameters<typeof getMessagesFromThreadId>) {
  const query = useQuery({
    queryKey: [EMAIL_THREAD_QUERY_KEY, args.emailProviderThreadId],
    queryFn: async () => {
      const emailThread = await getMessagesFromThreadId({
        emailProviderThreadId: args.emailProviderThreadId,
      });
      return emailThread;
    },
  });

  return { ...query, thread: query.data };
}
