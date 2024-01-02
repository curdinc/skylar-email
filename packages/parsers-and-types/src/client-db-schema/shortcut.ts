export type ShortcutIndexType = {
  shortcut_id: string;
  label_search: string[];
  description_search: string[];
  combo: string;
  label: string;
  updated_at: number;
};

export type ShortcutType = ShortcutIndexType & {
  description: string;
  created_at: number;
  keepActiveDuringInput: boolean;
};

export type ShortcutInsertType = Omit<
  ShortcutType,
  | "shortcut_id"
  | "created_at"
  | "updated_at"
  | "label_search"
  | "description_search"
  | "keepActiveDuringInput"
> &
  Partial<Pick<ShortcutType, "keepActiveDuringInput">>;

export const SHORTCUT_INDEX =
  `++shortcut_id, *label_search, *description_search, combo, &label, updated_at` as const;
