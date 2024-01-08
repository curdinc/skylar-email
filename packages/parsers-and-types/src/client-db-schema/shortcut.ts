export type ShortcutIndexType = {
  shortcut_id: string;
  combo: string;
  label: string;
  actionId: string;
  updated_at: number;
};

export type ShortcutType = ShortcutIndexType & {
  description: string;
  created_at: number;
  keepActiveDuringInput: boolean;
};

export type ShortcutInsertType = Omit<
  ShortcutType,
  "shortcut_id" | "created_at" | "updated_at" | "keepActiveDuringInput"
> &
  Partial<Pick<ShortcutType, "keepActiveDuringInput">>;

export const SHORTCUT_INDEX =
  `++shortcut_id, actionId, combo, &label, updated_at` as const;
