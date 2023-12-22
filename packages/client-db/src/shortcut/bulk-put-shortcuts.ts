import type {
  ShortcutInsertType,
  ShortcutType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { buildSearchableString } from "../utils/build-searchable-string";

export async function bulkPutShortcut({
  shortcuts,
}: {
  shortcuts: ShortcutInsertType[];
}) {
  const shortcutsToInsert: Omit<ShortcutType, "shortcut_id">[] = shortcuts.map(
    (shortcut) => {
      return {
        combo: shortcut.combo,
        description: shortcut.description,
        label: shortcut.label,
        label_search: buildSearchableString(shortcut.label, "."),
        description_search: buildSearchableString(shortcut.description),
        created_at: Date.now(),
        updated_at: Date.now(),
        keepActiveDuringInput: shortcut.keepActiveDuringInput ?? false,
      };
    },
  );
  return await clientDb.shortcut
    .bulkPut(shortcutsToInsert as ShortcutType[])
    .catch((error) => {
      // https://dexie.org/docs/Promise/Promise.catch() - transaction will not abort
      console.info(
        "Failed to add some shortcuts. Likely due to useEffect in dev mode. Nothing to be concerned about",
        error,
      );
    });
}
