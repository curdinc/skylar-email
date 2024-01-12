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
import { SHORTCUT_KEYMAP_INFO } from "./kepmap-info";
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
        "message.previous-label":
          closeLabelOrGoToPreviousLabel(activeEmailAddress),
        "message.next-label": openLabelOrGoToNextLabel(activeEmailAddress),
      },
      shortcuts: [
        {
          ...SHORTCUT_KEYMAP_INFO["message.delete"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-done"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-read"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-unread"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.down"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.down-alt"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.up"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.up-alt"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.previous-label"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.previous-label-alt"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.next-label"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.next-label-alt"],
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
        select: clickActiveItem(activeEmailAddress),
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
            closeLabelOrGoToPreviousLabel(activeEmailAddress)();
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
          ...SHORTCUT_KEYMAP_INFO["message.compose"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.forward"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.reply-all"],
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.reply-sender"],
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
