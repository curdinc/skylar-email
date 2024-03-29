import { bulkRegisterShortcut } from "@skylar/client-db";
import type { ShortcutInsertType } from "@skylar/parsers-and-types";
import type { KeyBindingMap } from "@skylar/tinykeys";
import { tinyKeys } from "@skylar/tinykeys";

const isEventTargetInputOrTextArea = (eventTarget: EventTarget | null) => {
  if (eventTarget === null) return false;

  const eventTargetTagName = (eventTarget as HTMLElement).tagName.toLowerCase();
  return ["input", "textarea"].includes(eventTargetTagName);
};

export const registerShortcuts = ({
  onkeyDownMapping,
  shortcuts,
  existingShortcuts,
  onError,
}: {
  shortcuts: ShortcutInsertType[];
  onkeyDownMapping: Record<string, (event: KeyboardEvent) => void>;
  existingShortcuts?: ShortcutInsertType[];
  onError?: (error: unknown) => void;
}) => {
  bulkRegisterShortcut(shortcuts).catch((e) => {
    onError?.(e);
  });

  const existingKeyMap = Object.fromEntries(
    existingShortcuts?.map((shortcut) => [shortcut.label, shortcut.combo]) ??
      [],
  );

  const keyMap: KeyBindingMap = {};
  const activeDuringInput: string[] = [];
  shortcuts.forEach((shortcut) => {
    const existingCombo = existingKeyMap[shortcut.label];
    const onKeyDown = onkeyDownMapping[shortcut.actionId];
    if (!onKeyDown) {
      throw new Error(`Missing onKeyDown for ${shortcut.actionId}`);
    }
    keyMap[existingCombo ?? shortcut.combo] = onKeyDown;
    if (shortcut?.keepActiveDuringInput) {
      activeDuringInput.push(shortcut.combo);
    }
  });

  const wrappedBindings = Object.fromEntries(
    Object.entries(keyMap).map(([key, handler]) => [
      key,
      (event: KeyboardEvent) => {
        if (
          !isEventTargetInputOrTextArea(event.target) ||
          activeDuringInput.includes(event.key)
        ) {
          handler(event);
        }
      },
    ]),
  );
  return tinyKeys(window, wrappedBindings);
};
