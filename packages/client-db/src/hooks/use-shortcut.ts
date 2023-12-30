import { useQuery } from "@tanstack/react-query";

import { getShortcutByLabel } from "../shortcut/get-shortcut-by-label";

const SHORTCUT_LABEL = "SHORTCUT_LABEL"; // FIXME: add to parsers and types

export function useShortcut({ shortcutLabel }: { shortcutLabel: string }) {
  return useQuery({
    queryKey: [SHORTCUT_LABEL, shortcutLabel],
    queryFn: async () => {
      const shortcut = await getShortcutByLabel(shortcutLabel);
      return shortcut;
    },
    gcTime: 0,
  });
}
