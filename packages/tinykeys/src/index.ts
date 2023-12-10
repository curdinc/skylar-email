// Full credit goes to https://github.com/jamiebuilds/tinykeys.
// This is a fork that waits till user finishes pressing keys before decide the best keymap to call.

/**
 * A map of keybinding strings to event handlers.
 */
export type KeyBindingMap = Record<string, (event: KeyboardEvent) => void>;

export type KeyBindingHandlerOptions = {
  /**
   * Keybinding sequences will wait this long between key presses before
   * cancelling (default: 1000).
   *
   * **Note:** Setting this value too low (i.e. `300`) will be too fast for many
   * of your users.
   */
  timeout?: number;
};

/**
 * Options to configure the behavior of keybindings.
 */
export type KeyBindingOptions = {
  /**
   * Key presses will listen to this event (default: "keydown").
   */
  event?: "keydown" | "keyup";
} & KeyBindingHandlerOptions;

/**
 * These are the modifier keys that change the meaning of keybindings.
 *
 * Note: Ignoring "AltGraph" because it is covered by the others.
 */
const KEYBINDING_MODIFIER_KEYS = ["Shift", "Meta", "Alt", "Control"];

/**
 * Keybinding sequences should timeout if individual key presses are more than
 * 1s apart by default.
 */
const DEFAULT_TIMEOUT = 750;

/**
 * Keybinding sequences should bind to this event by default.
 */
const DEFAULT_EVENT = "keydown";

/**
 * Platform detection code.
 * @see https://github.com/jamiebuilds/tinykeys/issues/184
 */
const PLATFORM = typeof navigator === "object" ? navigator.platform : "";
const APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM);

/**
 * An alias for creating platform-specific keybinding aliases.
 */
const MOD = APPLE_DEVICE ? "Meta" : "Control";

/**
 * Meaning of `AltGraph`, from MDN:
 * - Windows: Both Alt and Ctrl keys are pressed, or AltGr key is pressed
 * - Mac: ⌥ Option key pressed
 * - Linux: Level 3 Shift key (or Level 5 Shift key) pressed
 * - Android: Not supported
 * @see https://github.com/jamiebuilds/tinykeys/issues/185
 */
const ALT_GRAPH_ALIASES =
  PLATFORM === "Win32" ? ["Control", "Alt"] : APPLE_DEVICE ? ["Alt"] : [];

/**
 * There's a bug in Chrome that causes event.getModifierState not to exist on
 * KeyboardEvent's for F1/F2/etc keys.
 */
function getModifierState(event: KeyboardEvent, mod: string) {
  return typeof event.getModifierState === "function"
    ? event.getModifierState(mod) ||
        (ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState("AltGraph"))
    : false;
}

/**
 * Parses a "Key Binding String" into its parts
 *
 * grammar    = `<sequence>`
 * <sequence> = `<press> <press> <press> ...`
 * <press>    = `<key>` or `<mods>+<key>`
 * <mods>     = `<mod>+<mod>+...`
 *
 * Given the key binding string of "$mod+Alt+s Shift+a" on
 * a macOS computer:
 * - [{ mods: ["Meta", "Alt"], key: "s" }, { mods: ["Shift"], key: "a" }]
 */
export function parseKeybinding(binding: string) {
  return binding
    .trim()
    .split(" ")
    .map((press) => {
      let mods = press.split(/\b\+/);
      const key = mods.pop();
      mods = mods.map((mod) => (mod === "$mod" ? MOD : mod));
      return { mods, key };
    });
}

function arraysAreEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;

  return a.every((c) => b.includes(c));
}

/**
 * Creates an event listener for handling keybindings.
 *
 * @example
 * ```js
 * import { createKeybindingsHandler } from "../src/keybindings"
 *
 * let handler = createKeybindingsHandler({
 * 	"Shift+d": () => {
 * 		alert("The 'Shift' and 'd' keys were pressed at the same time")
 * 	},
 * 	"y e e t": () => {
 * 		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
 * 	},
 * 	"$mod+d": () => {
 * 		alert("Either 'Control+d' or 'Meta+d' were pressed")
 * 	},
 * })
 *
 * window.addEvenListener("keydown", handler)
 * ```
 */
export function createKeybindingsHandler(
  keyBindingMap: KeyBindingMap,
  options: KeyBindingHandlerOptions = {},
): EventListener {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  const keyBindings = Object.entries(keyBindingMap).map(
    ([key, entry]) => [parseKeybinding(key), entry] as const,
  );

  const timeoutsStore = new Set<number>();

  // To support sequence-style hotkeys, every time the user
  // presses a key we parse that key and add it to the
  // currentSequence.
  //
  // Example:
  // 1. User presses "g"
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  // 2. 500ms later user presses and holds "Alt".
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt"], key: "Alt", code: "AltLeft" }
  // 3. 500ms later user presses and holds "Meta".
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt", "Meta"], key: "Meta", code: "MetaLeft" }
  // 4. 200ms later user releases "Alt"
  // 5. 500ms later user presses "s"
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt", "Meta"], key: "Meta", code: "MetaLeft" }
  //    - { mods: ["Meta"], key: "s", code: "KeyS" }
  // 6. 500ms later user presses "a"
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt", "Meta"], key: "Meta", code: "MetaLeft" }
  //    - { mods: ["Meta"], key: "s", code: "KeyS" }
  //    - { mods: ["Meta"], key: "a", code: "KeyA" }
  // 7. 200ms later user releases "Meta"
  // 8. 500ms later user presses (and releases) "Meta"
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt", "Meta"], key: "Meta", code: "MetaLeft" }
  //    - { mods: ["Meta"], key: "s", code: "KeyS" }
  //    - { mods: ["Meta"], key: "a", code: "KeyA" }
  //    - { mods: ["Meta"], key: "Meta", code: "MetaLeft" }
  // 9. 500ms later user presses "a"
  //    - currentSequence is an array containing:
  //    - { mods: [], key: "g", code: "KeyG" }
  //    - { mods: ["Alt", "Meta"], key: "Meta", code: "MetaLeft" }
  //    - { mods: ["Meta"], key: "s", code: "KeyS" }
  //    - { mods: ["Meta"], key: "a", code: "KeyA" }
  //    - { mods: ["Meta"], key: "Meta", code: "MetaLeft" }
  //    - { mods: [], key: "a", code: "KeyA" }
  // 10. 1000ms later user hasn't pressed anything else so
  //     the currentSequence is reset by a `setTimeout()`.
  //    - currentSequence === []
  let currentSequence: {
    mods: string[];
    key: string;
    code: string;
  }[] = [];

  return (event) => {
    // Ensure and stop any event that isn't a full keyboard event.
    // Autocomplete option navigation and selection would fire a instanceof Event,
    // instead of the expected KeyboardEvent
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    timeoutsStore.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutsStore.clear();

    const currentMods = KEYBINDING_MODIFIER_KEYS.filter((key) =>
      getModifierState(event, key),
    );

    const prevKeypressInSequence = currentSequence.at(-1);

    const wasPrevKeyAModifier = prevKeypressInSequence
      ? KEYBINDING_MODIFIER_KEYS.includes(prevKeypressInSequence.key)
      : false;

    if (
      wasPrevKeyAModifier &&
      prevKeypressInSequence?.mods.every((key) => currentMods.includes(key))
    ) {
      // in this case, we'll replace the previous entry with
      // the current one.
      currentSequence.pop();
    }

    currentSequence.push({
      mods: currentMods,
      key: event.key,
      code: event.code,
    });

    const matchedBindings: typeof keyBindings = [];

    /**
     * A keybinding is *one of* "matched" or "possibly matched"
     * or "not matched".
     */
    const possibleMatchedBindings: typeof keyBindings = [];

    keyBindings.forEach((keyBinding) => {
      const [bindingSequence] = keyBinding;

      const isPotentialMatch = currentSequence.every(
        (currentSequencePart, index) => {
          const keyBindingPart = bindingSequence.at(index);

          if (
            !keyBindingPart ||
            !arraysAreEqual(keyBindingPart.mods, currentSequencePart.mods)
          ) {
            return false;
          }

          return (
            keyBindingPart.key === currentSequencePart.key ||
            keyBindingPart.key === currentSequencePart.code
          );
        },
      );

      if (!isPotentialMatch) return;

      if (currentSequence.length !== bindingSequence.length) {
        possibleMatchedBindings.push(keyBinding);
      } else {
        matchedBindings.push(keyBinding);
      }
    });

    if (possibleMatchedBindings.length === 0) {
      currentSequence = [];

      matchedBindings.forEach((keyBinding) => {
        const [, callback] = keyBinding;
        callback(event);
      });

      return;
    }
    matchedBindings.forEach((keyBinding) => {
      const [, callback] = keyBinding;

      const timeoutId = window.setTimeout(callback, timeout, event);

      timeoutsStore.add(timeoutId);
    });

    window.setTimeout(() => {
      currentSequence = [];
      timeoutsStore.clear();
    }, timeout);
  };
}

/**
 * Subscribes to keybindings.
 *
 * Returns an unsubscribe method.
 *
 * @example
 * ```js
 * tinyKeys(window, {
 * 	"Shift+d": () => {
 * 		alert("The 'Shift' and 'd' keys were pressed at the same time")
 * 	},
 * 	"y e e t": () => {
 * 		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
 * 	},
 * 	"$mod+d": () => {
 * 		alert("Either 'Control+d' or 'Meta+d' were pressed")
 * 	},
 * })
 * ```
 */
export function tinyKeys(
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  options: KeyBindingOptions = {},
): () => void {
  const event = options.event ?? DEFAULT_EVENT;
  const onKeyEvent = createKeybindingsHandler(keyBindingMap, options);

  target.addEventListener(event, onKeyEvent);

  return () => {
    target.removeEventListener(event, onKeyEvent);
  };
}
