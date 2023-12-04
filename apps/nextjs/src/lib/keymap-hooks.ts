import { useEffect } from "react";

import {
  setActiveThread,
  setComposingEmailType,
  setThreadToReplyTo,
  useGlobalStore,
  useOptimizedGlobalStore,
} from "@skylar/logic";
import { tinyKeys } from "@skylar/tinykeys";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.

export function useEmailThreadPageKeymaps() {
  const shortcut = useOptimizedGlobalStore((state) => ({
    reply: state.SHORTCUT.reply,
    goNextThread: state.SHORTCUT.goNextThread,
    goPreviousThread: state.SHORTCUT.goPreviousThread,
    close: state.SHORTCUT.close,
  }));
  useEffect(() => {
    const unsubscribe = tinyKeys(window, {
      [shortcut.close]: () => {
        const replyThread =
          useGlobalStore.getState().EMAIL_CLIENT.COMPOSING.respondingThread;
        if (replyThread) {
          setThreadToReplyTo(undefined);
        } else {
          const activeThread =
            useGlobalStore.getState().EMAIL_CLIENT.activeThread;
          if (activeThread) {
            setActiveThread(undefined);
          }
        }
      },
      [shortcut.reply]: () => {
        setThreadToReplyTo(useGlobalStore.getState().EMAIL_CLIENT.activeThread);
        setComposingEmailType("reply-sender");
      },
      [shortcut.goNextThread]: (e) => {
        console.log("arrow right key called", e.key, e.code);
      },
      [shortcut.goPreviousThread]: (e) => {
        console.log("arrow left key called", e.key, e.code);
      },
    });
    return unsubscribe;
  });
}

export function useInboxKeymaps() {
  const shortcut = useOptimizedGlobalStore((state) => ({
    spotlight: state.SHORTCUT.openSpotlightSearch,
  }));
  useEffect(() => {
    const unsubscribe = tinyKeys(window, {
      [shortcut.spotlight]: (e) => {
        e.preventDefault();
        console.log("launch spotlight search", e.key, e.code);
      },
    });
    return unsubscribe;
  });
}
