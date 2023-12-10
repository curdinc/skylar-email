import { useQuery } from "@tanstack/react-query";

import { getEmailThread } from "../email/get-email-thread";
import type { GetParameters } from "../types/extract-params";

export const EMAIL_THREAD_QUERY_KEY = "emailThread";

export function useEmailThread(args: GetParameters<typeof getEmailThread>) {
  const { data: emailThread, isLoading } = useQuery({
    queryKey: [EMAIL_THREAD_QUERY_KEY, args.emailProviderThreadId],
    queryFn: async () => {
      const emailThread = await getEmailThread({
        emailProviderThreadId: args.emailProviderThreadId,
      });
      return emailThread;
    },
    gcTime: 0,
  });

  return { emailThread, isLoading };
}
