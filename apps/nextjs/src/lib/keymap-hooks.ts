import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { state$ } from "@skylar/logic";
import { tinyKeys } from "@skylar/tinykeys";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.

export function useEmailThreadPageKeymaps() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = tinyKeys(window, {
      [state$.SHORTCUT.goBack.get()]: (e) => {
        e.preventDefault();
        router.back();
      },
      [state$.SHORTCUT.goNextThread.get()]: (e) => {
        console.log("arrow right key called", e.key, e.code);
      },
      [state$.SHORTCUT.goPreviousThread.get()]: (e) => {
        console.log("arrow left key called", e.key, e.code);
      },
    });
    return unsubscribe;
  });
}

export function useInboxKeymaps() {
  useEffect(() => {
    const unsubscribe = tinyKeys(window, {
      [state$.SHORTCUT.openSpotlightSearch.get()]: (e) => {
        e.preventDefault();
        console.log("launch spotlight search", e.key, e.code);
      },
    });
    return unsubscribe;
  });
}
