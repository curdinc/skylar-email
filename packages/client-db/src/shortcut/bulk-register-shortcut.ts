import type {
  ShortcutIndexType,
  ShortcutInsertType,
  ShortcutType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { buildSearchableString } from "../utils/build-searchable-string";
import { bulkPutShortcut } from "./bulk-put-shortcuts";

export const bulkRegisterShortcut = async (shortcuts: ShortcutInsertType[]) => {
  const existingShortcuts = await Promise.all(
    shortcuts.map(async (shortcut) => {
      const existingValue = await clientDb.shortcut
        .where("label" satisfies keyof ShortcutIndexType)
        .equalsIgnoreCase(shortcut.label)
        .toArray();
      if (existingValue[0]) {
        return [existingValue[0].label, existingValue[0]];
      }
    }),
  );
  const filteredExistingShortcuts = existingShortcuts.filter(
    (shortcut) => !!shortcut,
  ) as [string, ShortcutIndexType][];
  const existingShortcutMap = new Map(filteredExistingShortcuts);

  const shortcutsToInsert: Omit<ShortcutType, "shortcut_id">[] = shortcuts
    .map((shortcut) => {
      const existingShortcut = existingShortcutMap.get(shortcut.label);
      if (existingShortcut) {
        return;
      }
      return {
        ...shortcut,
        label_search: buildSearchableString(shortcut.label),
        description_search: buildSearchableString(shortcut.description),
        created_at: Date.now(),
        updated_at: Date.now(),
      };
    })
    .filter((shortcut) => !!shortcut) as Omit<ShortcutType, "shortcut_id">[];
  return bulkPutShortcut({ shortcuts: shortcutsToInsert });
};
