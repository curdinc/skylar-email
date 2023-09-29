import { getEmailThread } from "../emails/get-email-thread";
import type { MakeDbOptional } from "../types/use-client-db-helper-type";
import { useClientDb } from "./use-client-db";

export function useEmailThread(
  args: MakeDbOptional<Parameters<typeof getEmailThread>[0]>,
) {
  const { result: emailThread, isLoading } = useClientDb({
    db: args.db,
    deps: [],
    query: async (db) => {
      const emailThread = await getEmailThread({ ...args, db });
      return emailThread;
    },
  });

  return { emailThread, isLoading };
}
