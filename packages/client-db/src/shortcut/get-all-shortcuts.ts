import type { ShortcutIndexType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";

export const getAllShortcuts = async () => {
  return clientDb.shortcut
    .orderBy("label" satisfies keyof ShortcutIndexType)
    .toArray();
};
