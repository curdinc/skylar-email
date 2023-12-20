import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  resetActiveThread,
  resetComposeMessage,
  setComposeMessageType,
  setIsSelecting,
  setReplyMessageType,
  useGlobalStore,
  useShortcuts,
} from "@skylar/logic";
import type { KeyBindingMap } from "@skylar/tinykeys";
import { tinyKeys } from "@skylar/tinykeys";

import { captureEvent } from "./analytics/capture-event";
import { TrackingEvents } from "./analytics/tracking-events";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.

const isEventTargetInputOrTextArea = (eventTarget: EventTarget | null) => {
  if (eventTarget === null) return false;

  const eventTargetTagName = (eventTarget as HTMLElement).tagName.toLowerCase();
  return ["input", "textarea"].includes(eventTargetTagName);
};

export function useInboxKeymaps() {
  const shortcut = useShortcuts();
  const router = useRouter();
  useEffect(() => {
    const goToInbox = (key: string) => {
      return () => router.push(`/${key}`);
    };
    const ALWAYS_ON_KEYS = [
      shortcut.openSpotlightSearch,
      shortcut.close,
      shortcut.inboxOne,
      shortcut.inboxTwo,
      shortcut.inboxThree,
      shortcut.inboxFour,
      shortcut.inboxFive,
      shortcut.inboxSix,
      shortcut.inboxSeven,
      shortcut.inboxEight,
      shortcut.inboxNine,
      shortcut.inboxTen,
    ];
    const keyMap: KeyBindingMap = {
      [shortcut.openSpotlightSearch]: (e) => {
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
        setComposeMessageType("new-email");
      },
      [shortcut.forward]: () => {
        const activeThread =
          useGlobalStore.getState().EMAIL_CLIENT.activeThread;
        if (activeThread) {
          captureEvent({
            event: TrackingEvents.composeForwardMessage,
            properties: {
              isShortcut: true,
              messageConversationLength:
                activeThread.provider_message_ids.length,
            },
          });

          setReplyMessageType({
            replyType: "forward",
            thread: activeThread,
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
          setReplyMessageType({
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
          setReplyMessageType({
            replyType: "reply-sender",
            thread: activeThread,
          });
        }
      },
      [shortcut.inboxOne]: goToInbox("1"),
      [shortcut.inboxTwo]: goToInbox("2"),
      [shortcut.inboxThree]: goToInbox("3"),
      [shortcut.inboxFour]: goToInbox("4"),
      [shortcut.inboxFive]: goToInbox("5"),
      [shortcut.inboxSix]: goToInbox("6"),
      [shortcut.inboxSeven]: goToInbox("7"),
      [shortcut.inboxEight]: goToInbox("8"),
      [shortcut.inboxNine]: goToInbox("9"),
      [shortcut.inboxTen]: goToInbox("10"),
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
    router,
    shortcut.close,
    shortcut.compose,
    shortcut.forward,
    shortcut.inboxEight,
    shortcut.inboxFive,
    shortcut.inboxFour,
    shortcut.inboxNine,
    shortcut.inboxOne,
    shortcut.inboxSeven,
    shortcut.inboxSix,
    shortcut.inboxTen,
    shortcut.inboxThree,
    shortcut.inboxTwo,
    shortcut.openSpotlightSearch,
    shortcut.replyAll,
    shortcut.replySender,
  ]);
}
