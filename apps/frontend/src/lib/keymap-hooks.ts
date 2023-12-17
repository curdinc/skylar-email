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
import type { KeyBindingMap } from "@skylar/tinykeys";
import { tinyKeys } from "@skylar/tinykeys";

import { captureEvent } from "./analytics/capture-event";
import { TrackingEvents } from "./analytics/tracking-events";
import { getMostRecentMessageFromThread } from "./email";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.

const isEventTargetInputOrTextArea = (eventTarget: EventTarget | null) => {
  if (eventTarget === null) return false;

  const eventTargetTagName = (eventTarget as HTMLElement).tagName.toLowerCase();
  return ["input", "textarea"].includes(eventTargetTagName);
};

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
    const ALWAYS_ON_KEYS = [shortcut.spotlight, shortcut.close];
    const keyMap: KeyBindingMap = {
      [shortcut.spotlight]: (e) => {
        console.warn("launch spotlight search", e.key, e.code);
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
        captureEvent({
          event: TrackingEvents.composeNewMessage,
          properties: {
            isShortcut: true,
          },
        });
        setComposeMessage("new-email");
      },
      [shortcut.forward]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          getMostRecentMessageFromThread(activeThread)
            .then((message) => {
              if (!message) return;
              captureEvent({
                event: TrackingEvents.composeForwardMessage,
                properties: {
                  isShortcut: true,
                  messageConversationLength:
                    activeThread.provider_message_ids.length,
                },
              });
              setReplyMessage({
                replyType: "forward",
                thread: activeThread,
                messageToForward: message,
              });
            })
            .catch((e) => {
              console.error(e);
            });
        }
      },
      [shortcut.replyAll]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          captureEvent({
            event: TrackingEvents.composeReplyAllMessage,
            properties: {
              isShortcut: true,
              messageConversationLength:
                activeThread.provider_message_ids.length,
            },
          });
          setReplyMessage({
            replyType: "reply-all",
            thread: activeThread,
          });
        }
      },
      [shortcut.replySender]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          captureEvent({
            event: TrackingEvents.composeReplySenderMessage,
            properties: {
              isShortcut: true,
              messageConversationLength:
                activeThread.provider_message_ids.length,
            },
          });
          setReplyMessage({
            replyType: "reply-sender",
            thread: activeThread,
          });
        }
      },
    };
    const wrappedBindings = Object.fromEntries(
      Object.entries(keyMap).map(([key, handler]) => [
        key,
        (event: KeyboardEvent) => {
          if (
            !isEventTargetInputOrTextArea(event.target) ||
            ALWAYS_ON_KEYS.includes(event.key)
          ) {
            handler(event);
          }
        },
      ]),
    );

    const unsubscribe = tinyKeys(window, wrappedBindings);
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
