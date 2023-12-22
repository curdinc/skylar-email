import { bulkRegisterShortcut } from "@skylar/client-db";
import type { ShortcutInsertType } from "@skylar/parsers-and-types";
import type { KeyBindingMap } from "@skylar/tinykeys";
import { tinyKeys } from "@skylar/tinykeys";

const isEventTargetInputOrTextArea = (eventTarget: EventTarget | null) => {
  if (eventTarget === null) return false;

  const eventTargetTagName = (eventTarget as HTMLElement).tagName.toLowerCase();
  return ["input", "textarea"].includes(eventTargetTagName);
};

export const registerShortcuts = (
  shortcuts: (ShortcutInsertType & { onKeyDown: () => void })[],
) => {
  bulkRegisterShortcut(shortcuts).catch((e) => {
    console.error("Something went wrong saving shortcuts to clientDb", e);
  });

  const keyMap: KeyBindingMap = {};
  const activeDuringInput: string[] = [];
  shortcuts.forEach((shortcut) => {
    keyMap[shortcut.combo] = shortcut.onKeyDown;
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
