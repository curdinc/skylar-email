import { useEffect } from "react";

import {
  resetActiveThread,
  resetComposeMessage,
  setComposeMessage,
  setIsSelecting,
  setReplyMessage,
  useGlobalStore,
  useOptimizedGlobalStore,
} from "@skylar/logic";
import { tinyKeys } from "@skylar/tinykeys";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.

export function useInboxKeymaps() {
  const shortcut = useOptimizedGlobalStore((state) => ({
    spotlight: state.SHORTCUT.openSpotlightSearch,
    compose: state.SHORTCUT.compose,
    forward: state.SHORTCUT.forward,
    replyAll: state.SHORTCUT.replyAll,
    replySender: state.SHORTCUT.replySender,
    goNextThread: state.SHORTCUT.goNextThread,
    goPreviousThread: state.SHORTCUT.goPreviousThread,
    close: state.SHORTCUT.close,
  }));
  useEffect(() => {
    const unsubscribe = tinyKeys(window, {
      [shortcut.spotlight]: (e) => {
        e.preventDefault();
        console.log("launch spotlight search", e.key, e.code);
      },
      [shortcut.close]: () => {
        const currentMessageType =
          useGlobalStore.getState().EMAIL_CLIENT.COMPOSING.messageType;
        if (currentMessageType !== "none") {
          const isMultiSelecting =
            useGlobalStore.getState().EMAIL_CLIENT.COMPOSING.isSelecting;
          if (isMultiSelecting) {
            setIsSelecting(false);
          } else {
            resetComposeMessage();
          }
        } else {
          const activeThread =
            useGlobalStore.getState().EMAIL_CLIENT.activeThread;
          if (activeThread) {
            resetActiveThread();
          }
        }
      },
      [shortcut.compose]: () => {
        setComposeMessage("new-email");
      },
      [shortcut.forward]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          setReplyMessage(activeThread, "forward");
        }
      },
      [shortcut.replyAll]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          setReplyMessage(activeThread, "reply-all");
        }
      },
      [shortcut.replySender]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          setReplyMessage(activeThread, "reply-sender");
        }
      },
    });
    return unsubscribe;
  }, [
    shortcut.close,
    shortcut.compose,
    shortcut.forward,
    shortcut.replyAll,
    shortcut.replySender,
    shortcut.spotlight,
  ]);
}
