import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  resetActiveThread,
  resetComposeMessage,
  setComposeMessageType,
  setIsSelecting,
  setReplyMessageType,
  useGlobalStore,
} from "@skylar/logic";

import {
  closeCurrentOrGoToPreviousLabel,
  goDownMessageList,
  goUpMessageList,
  openLabelOrGoToNextLabel,
} from "~/components/label-accordion-menu/utils";
import { captureEvent } from "../analytics/capture-event";
import { TrackingEvents } from "../analytics/tracking-events";
import { registerShortcuts } from "./register-shortcuts";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.
export const useNavigateMessagesKeymap = () => {
  useEffect(() => {
    const unsubscribe = registerShortcuts([
      {
        combo: "j",
        description: "Go down the message list",
        label: "message.down",
        onKeyDown: goDownMessageList,
      },
      {
        combo: "ArrowDown",
        description: "Go down the next message list",
        label: "message.down-alt",
        onKeyDown: goDownMessageList,
      },
      {
        combo: "k",
        description: "Go to up the message list",
        label: "message.up",
        onKeyDown: goUpMessageList,
      },
      {
        combo: "ArrowUp",
        description: "Go to up the message list",
        label: "message.up-alt",
        onKeyDown: goUpMessageList,
      },
      {
        combo: "h",
        description: "Close current label or go previous label",
        label: "message.previous-label",
        onKeyDown: closeCurrentOrGoToPreviousLabel,
      },
      {
        combo: "ArrowLeft",
        description: "Close current label or go previous label",
        label: "message.previous-label-alt",
        onKeyDown: closeCurrentOrGoToPreviousLabel,
      },
      {
        combo: "l",
        description: "Open current label or go next label",
        label: "message.next-label",
        onKeyDown: openLabelOrGoToNextLabel,
      },
      {
        combo: "ArrowRight",
        description: "Open current label or go next label",
        label: "message.next-label-alt",
        onKeyDown: openLabelOrGoToNextLabel,
      },
    ]);
    return unsubscribe;
  });
};

export const useGlobalKeymap = () => {
  const router = useRouter();
  useEffect(() => {
    const goToInbox = (key: string) => {
      return () => router.push(`/${key}`);
    };
    const unsubscribe = registerShortcuts([
      {
        combo: "Escape",
        description: "Default key to close things",
        keepActiveDuringInput: true,
        label: "close",
        onKeyDown: () => {
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
      },
      {
        combo: "c",
        description: "Compose new message",
        label: "message.compose",
        onKeyDown: () => {
          captureEvent({
            event: TrackingEvents.composeNewMessage,
            properties: {
              isShortcut: true,
            },
          });
          setComposeMessageType("new-email");
        },
      },
      {
        combo: "f",
        description: "Forward message",
        label: "message.forward",
        onKeyDown: () => {
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
      },
      {
        combo: "r",
        description: "Reply to everyone on the message",
        label: "message.reply-all",
        onKeyDown: () => {
          console.log("key fired");
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
      },
      {
        combo: "Shift+R",
        description: "Reply to the sender of the message",
        label: "message.reply-sender",
        onKeyDown: () => {
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
      },
      {
        combo: "Alt+1",
        description: "Go to inbox 1",
        label: "inbox.go-to-inbox-1",
        onKeyDown: goToInbox("1"),
      },
      {
        combo: "Alt+2",
        description: "Go to inbox 2",
        label: "inbox.go-to-inbox-2",
        onKeyDown: goToInbox("2"),
      },
      {
        combo: "Alt+3",
        description: "Go to inbox 3",
        label: "inbox.go-to-inbox-3",
        onKeyDown: goToInbox("3"),
      },
      {
        combo: "Alt+4",
        description: "Go to inbox 4",
        label: "inbox.go-to-inbox-4",
        onKeyDown: goToInbox("4"),
      },
      {
        combo: "Alt+5",
        description: "Go to inbox 5",
        label: "inbox.go-to-inbox-5",
        onKeyDown: goToInbox("5"),
      },
      {
        combo: "Alt+6",
        description: "Go to inbox 6",
        label: "inbox.go-to-inbox-6",
        onKeyDown: goToInbox("6"),
      },
      {
        combo: "Alt+7",
        description: "Go to inbox 7",
        label: "inbox.go-to-inbox-7",
        onKeyDown: goToInbox("7"),
      },
      {
        combo: "Alt+8",
        description: "Go to inbox 8",
        label: "inbox.go-to-inbox-8",
        onKeyDown: goToInbox("8"),
      },
      {
        combo: "Alt+9",
        description: "Go to inbox 9",
        label: "inbox.go-to-inbox-9",
        onKeyDown: goToInbox("9"),
      },
      {
        combo: "Alt+0",
        description: "Go to inbox 10",
        label: "inbox.go-to-inbox-10",
        onKeyDown: goToInbox("10"),
      },
    ]);

    return unsubscribe;
  }, [router]);
};
