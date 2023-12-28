import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAllShortcuts } from "@skylar/client-db";
import {
  resetActiveThread,
  resetComposeMessage,
  setComposeMessageType,
  setIsSelecting,
  setReplyMessageType,
  useGlobalStore,
} from "@skylar/logic";

import { closeCurrentOrGoToPreviousLabel } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/close-label";
import { goDownLabelTree } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/go-down";
import { goUpLabelTree } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/go-up";
import { openLabelOrGoToNextLabel } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/open-label";
import { captureEvent } from "../analytics/capture-event";
import { TrackingEvents } from "../analytics/tracking-events";
import { useLogger } from "../logger";
import { registerShortcuts } from "./register-shortcuts";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.
export const useNavigateMessagesKeymap = () => {
  const { data: existingShortcuts, isLoading: isLoadingExistingShortcuts } =
    useAllShortcuts();
  const logger = useLogger();
  useEffect(() => {
    if (isLoadingExistingShortcuts) {
      return;
    }
    const unsubscribe = registerShortcuts({
      shortcuts: [
        {
          combo: "j",
          description: "Go down the message list",
          label: "message.down",
          onKeyDown: goDownLabelTree,
        },
        {
          combo: "ArrowDown",
          description: "Go down the next message list",
          label: "message.down-alt",
          onKeyDown: goDownLabelTree,
        },
        {
          combo: "k",
          description: "Go to up the message list",
          label: "message.up",
          onKeyDown: goUpLabelTree,
        },
        {
          combo: "ArrowUp",
          description: "Go to up the message list",
          label: "message.up-alt",
          onKeyDown: goUpLabelTree,
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
      ],
      existingShortcuts,
      onError: (error) => {
        logger.error("Error in register navigating message shortcuts", {
          error,
        });
      },
    });
    return unsubscribe;
  }, [existingShortcuts, isLoadingExistingShortcuts, logger]);
};

export const useGlobalKeymap = () => {
  const router = useRouter();
  const { data: existingShortcuts, isLoading: isLoadingExistingShortcuts } =
    useAllShortcuts();
  const logger = useLogger();
  useEffect(() => {
    if (isLoadingExistingShortcuts) {
      return;
    }
    const goToInbox = (key: string) => {
      return () => router.push(`/${key}`);
    };
    const unsubscribe = registerShortcuts({
      shortcuts: [
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
      ],
      existingShortcuts,
      onError: (error) => {
        logger.error("Error in registering global shortcuts", {
          error,
        });
      },
    });

    return unsubscribe;
  }, [existingShortcuts, isLoadingExistingShortcuts, logger, router]);
};
