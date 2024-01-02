import type {
  ShortcutIndexType,
  ShortcutType,
} from "@skylar/parsers-and-types";

import { clientDb } from "../db";

export async function updateMessages({
  shortcut,
}: {
  shortcut: Partial<ShortcutType> & Pick<ShortcutIndexType, "shortcut_id">;
}) {
  return await clientDb.shortcut.update(shortcut.shortcut_id, shortcut);
}
