import { useQuery } from "@tanstack/react-query";

import { getEmailThread } from "../emails/get-email-thread";
import type { GetParameters } from "../types/extract-params";

export const EMAIL_THREAD_QUERY_KEY = "emailThread";

export function useEmailThread(args: GetParameters<typeof getEmailThread>) {
  const {
    data: emailThread,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [EMAIL_THREAD_QUERY_KEY, args.emailProviderThreadId],
    queryFn: async () => {
      const emailThread = await getEmailThread({
        emailProviderThreadId: args.emailProviderThreadId,
      });
      return emailThread;
    },
  });

  return { emailThread, isLoading, refetch };
}
