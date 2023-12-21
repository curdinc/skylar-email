import { useQuery } from "@tanstack/react-query";

import { getAllShortcuts } from "../shortcut/get-all-shortcuts";

const ALL_SHORTCUTS = "ALL_SHORTCUTS"; // FIXME: add to parsers and types

export function useAllShortcuts() {
  return useQuery({
    queryKey: [ALL_SHORTCUTS],
    queryFn: async () => {
      const shortcuts = await getAllShortcuts();
      return shortcuts;
    },
    gcTime: 0,
  });
}
