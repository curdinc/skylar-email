import { useEffect, useTransition } from "react";
import error from "next/error";
import { useRouter } from "next/navigation";

import { useAllShortcuts } from "@skylar/client-db";
import {
  resetComposeMessage,
  setComposeMessageType,
  setIsSelecting,
  useGlobalStore,
} from "@skylar/logic";

import { closeLabelOrGoToPreviousLabel } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/close-label";
import { goDownLabelTree } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/go-down";
import { goUpLabelTree } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/go-up";
import { openLabelOrGoToNextLabel } from "~/components/label-tree-viewer/label-accordion-keyboard-navigation/open-label";
import { captureEvent } from "../analytics/capture-event";
import { TrackingEvents } from "../analytics/tracking-events";
import { useLogger } from "../logger";
import { useActiveEmailAddress } from "../provider/use-active-email-address";
import { startResponseToCurrentItem } from "../store/compose/respond-to-current-item";
import { clickActiveItem } from "../store/label-tree-viewer/active-item";
import {
  deleteCurrentListItem,
  markCurrentListItemAsDone,
  markCurrentListItemAsRead,
  markCurrentListItemAsUnread,
} from "../store/label-tree-viewer/update-current-list-item";
import { registerShortcuts } from "./register-shortcuts";

// ! Note that shortcuts should not overlap
// ! For example, if you have a shortcut for "Escape" in one component, you should not have a shortcut for "Escape" in another component.
// ! This will result in both shortcuts being called when "Escape" is pressed. Probably not what you want.
export const useNavigateMessagesKeymap = () => {
  const { data: existingShortcuts, isLoading: isLoadingExistingShortcuts } =
    useAllShortcuts();
  const { data: activeEmailAddress } = useActiveEmailAddress();
  const [, startTransition] = useTransition();
  const logger = useLogger();
  useEffect(() => {
    if (isLoadingExistingShortcuts || !activeEmailAddress) {
      return;
    }
    const unsubscribe = registerShortcuts({
      onkeyDownMapping: {
        "message.delete": () => {
          deleteCurrentListItem(activeEmailAddress).catch((e: unknown) => {
            logger.error("Something went wrong deleteCurrentListItem", {
              error: e,
            });
          });
        },
        "message.mark-as-done": () => {
          markCurrentListItemAsDone(activeEmailAddress).catch((e: unknown) => {
            logger.error("Something went wrong markCurrentListItemAsDone", {
              error: e,
            });
          });
        },
        "message.mark-as-read": () => {
          markCurrentListItemAsRead(activeEmailAddress).catch((e: unknown) => {
            logger.error("Something went wrong markCurrentListItemAsRead", {
              error: e,
            });
          });
        },
        "message.mark-as-unread": () => {
          markCurrentListItemAsUnread(activeEmailAddress).catch(
            (e: unknown) => {
              logger.error("Something went wrong markCurrentListItemAsUnread", {
                error: e,
              });
            },
          );
        },
        "message.down": goDownLabelTree(startTransition),
        "message.up": goUpLabelTree(startTransition),
        "message.previous-label": () => {
          closeLabelOrGoToPreviousLabel(activeEmailAddress).catch(
            (e: unknown) => {
              logger.error("Error closeLabelOrGoToPreviousLabel", {
                error: e,
              });
            },
          );
        },
        "message.next-label": () => {
          openLabelOrGoToNextLabel(activeEmailAddress).catch((e: unknown) => {
            logger.error("Error openLabelOrGoToNextLabel", { error: e });
          });
        },
      },
      shortcuts: [
        {
          combo: "Delete",
          description: "Delete a given item in the list",
          label: "message.delete",
          actionId: "message.delete",
        },
        {
          combo: "e",
          description: "Mark a given item in the list as done",
          label: "message.mark-as-done",
          actionId: "message.mark-as-done",
        },
        {
          combo: "Shift+U",
          description: "Mark a given item in the list as read",
          label: "message.mark-as-read",
          actionId: "message.mark-as-read",
        },
        {
          combo: "u",
          description: "Mark a given item in the list as unread",
          label: "message.mark-as-unread",
          actionId: "message.mark-as-unread",
        },
        {
          combo: "j",
          description: "Go down the message list",
          label: "message.down",
          actionId: "message.down",
        },
        {
          combo: "ArrowDown",
          description: "Go down the next message list",
          label: "message.down-alt",
          actionId: "message.down",
        },
        {
          combo: "k",
          description: "Go to up the message list",
          label: "message.up",
          actionId: "message.up",
        },
        {
          combo: "ArrowUp",
          description: "Go to up the message list",
          label: "message.up-alt",
          actionId: "message.up",
        },
        {
          combo: "h",
          description: "Close current label or go previous label",
          label: "message.previous-label",
          actionId: "message.previous-label",
        },
        {
          combo: "ArrowLeft",
          description: "Close current label or go previous label",
          label: "message.previous-label-alt",
          actionId: "message.previous-label",
        },
        {
          combo: "l",
          description: "Open current label or go next label",
          label: "message.next-label",
          actionId: "message.next-label",
        },
        {
          combo: "ArrowRight",
          description: "Open current label or go next label",
          label: "message.next-label-alt",
          actionId: "message.next-label",
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
  }, [
    activeEmailAddress,
    existingShortcuts,
    isLoadingExistingShortcuts,
    logger,
  ]);
};

export const useGlobalKeymap = () => {
  const router = useRouter();
  const { data: existingShortcuts, isLoading: isLoadingExistingShortcuts } =
    useAllShortcuts();
  const { data: activeEmailAddress } = useActiveEmailAddress();

  const logger = useLogger();
  useEffect(() => {
    if (isLoadingExistingShortcuts || !activeEmailAddress) {
      return;
    }
    const goToInbox = (key: string) => {
      return () => router.push(`/${key}`);
    };
    const unsubscribe = registerShortcuts({
      onkeyDownMapping: {
        select: () => {
          clickActiveItem(activeEmailAddress).catch((e: unknown) => {
            logger.error("Error clicking active item", { error: e });
          });
        },
        close: () => {
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
            closeLabelOrGoToPreviousLabel(activeEmailAddress).catch(
              (e: unknown) => {
                logger.error("Error closing label", { error: e });
              },
            );
          }
        },
        "message.forward": () => {
          startResponseToCurrentItem("forward").catch((e: unknown) => {
            logger.error("Error forwarding message", { error, e });
          });
        },
        "message.reply-all": () => {
          startResponseToCurrentItem("reply-all").catch((e: unknown) => {
            logger.error("Error reply-all current message", { error, e });
          });
        },
        "message.reply-sender": () => {
          startResponseToCurrentItem("reply-sender").catch((e: unknown) => {
            logger.error("Error reply-sender current message", { error, e });
          });
        },
        "message.compose": () => {
          captureEvent({
            event: TrackingEvents.composeNewMessage,
            properties: {
              isShortcut: true,
            },
          });
          setComposeMessageType("new-email");
        },
        "inbox.go-to-inbox-1": goToInbox("1"),
        "inbox.go-to-inbox-2": goToInbox("2"),
        "inbox.go-to-inbox-3": goToInbox("3"),
        "inbox.go-to-inbox-4": goToInbox("4"),
        "inbox.go-to-inbox-5": goToInbox("5"),
        "inbox.go-to-inbox-6": goToInbox("6"),
        "inbox.go-to-inbox-7": goToInbox("7"),
        "inbox.go-to-inbox-8": goToInbox("8"),
        "inbox.go-to-inbox-9": goToInbox("9"),
        "inbox.go-to-inbox-10": goToInbox("10"),
      },
      shortcuts: [
        {
          combo: "Enter",
          description: "Default key to select an active item",
          label: "select",
          actionId: "select",
        },
        {
          combo: "Space",
          description: "Alternative key to select an active item",
          label: "select-alt",
          actionId: "select",
        },
        {
          combo: "Escape",
          description: "Default key to close things",
          keepActiveDuringInput: true,
          label: "close",
          actionId: "close",
        },
        {
          combo: "c",
          description: "Compose new message",
          label: "message.compose",
          actionId: "message.compose",
        },
        {
          combo: "f",
          description: "Forward message",
          label: "message.forward",
          actionId: "message.forward",
        },
        {
          combo: "r",
          description: "Reply to everyone on the message",
          label: "message.reply-all",
          actionId: "message.reply-all",
        },
        {
          combo: "Shift+R",
          description: "Reply to the sender of the message",
          label: "message.reply-sender",
          actionId: "message.reply-sender",
        },
        {
          combo: "Alt+1",
          description: "Go to inbox 1",
          label: "inbox.go-to-inbox-1",
          actionId: "inbox.go-to-inbox-1",
        },
        {
          combo: "Alt+2",
          description: "Go to inbox 2",
          label: "inbox.go-to-inbox-2",
          actionId: "inbox.go-to-inbox-2",
        },
        {
          combo: "Alt+3",
          description: "Go to inbox 3",
          label: "inbox.go-to-inbox-3",
          actionId: "inbox.go-to-inbox-3",
        },
        {
          combo: "Alt+4",
          description: "Go to inbox 4",
          label: "inbox.go-to-inbox-4",
          actionId: "inbox.go-to-inbox-4",
        },
        {
          combo: "Alt+5",
          description: "Go to inbox 5",
          label: "inbox.go-to-inbox-5",
          actionId: "inbox.go-to-inbox-5",
        },
        {
          combo: "Alt+6",
          description: "Go to inbox 6",
          label: "inbox.go-to-inbox-6",
          actionId: "inbox.go-to-inbox-6",
        },
        {
          combo: "Alt+7",
          description: "Go to inbox 7",
          label: "inbox.go-to-inbox-7",
          actionId: "inbox.go-to-inbox-7",
        },
        {
          combo: "Alt+8",
          description: "Go to inbox 8",
          label: "inbox.go-to-inbox-8",
          actionId: "inbox.go-to-inbox-8",
        },
        {
          combo: "Alt+9",
          description: "Go to inbox 9",
          label: "inbox.go-to-inbox-9",
          actionId: "inbox.go-to-inbox-9",
        },
        {
          combo: "Alt+0",
          description: "Go to inbox 10",
          label: "inbox.go-to-inbox-10",
          actionId: "inbox.go-to-inbox-10",
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
  }, [
    activeEmailAddress,
    existingShortcuts,
    isLoadingExistingShortcuts,
    logger,
    router,
  ]);
};
