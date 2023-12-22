import type {
  ShortcutIndexType,
  ShortcutInsertType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";
import { bulkPutShortcut } from "./bulk-put-shortcuts";

export const registerShortcut = async (shortcut: ShortcutInsertType) => {
  const existingShortcut = await clientDb.shortcut
    .where("label" satisfies keyof ShortcutIndexType)
    .equalsIgnoreCase(shortcut.label)
    .first();
  if (existingShortcut) {
    return existingShortcut;
  }
  return bulkPutShortcut({ shortcuts: [shortcut] });
};
