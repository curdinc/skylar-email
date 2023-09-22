import { useQuery } from "@tanstack/react-query";

export function useInboxPage() {
  useQuery({
    queryKey: ["inbox-set-up"],
    queryFn: async () => {
      return Promise.resolve("OK");
    },
  });
  return {};
}
