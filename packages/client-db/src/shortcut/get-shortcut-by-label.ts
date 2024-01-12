import type { ShortcutIndexType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";

export const getShortcutByLabel = async (shortcutLabel: string) => {
  return clientDb.shortcut
    .where("label" satisfies keyof ShortcutIndexType)
    .equals(shortcutLabel)
    .first();
};
