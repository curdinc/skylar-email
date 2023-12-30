import { useEffect, useTransition } from "react";
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
      shortcuts: [
        {
          ...SHORTCUT_KEYMAP_INFO["message.delete"],
          onKeyDown: () => deleteCurrentListItem(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-done"],
          onKeyDown: () => markCurrentListItemAsDone(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-read"],
          onKeyDown: () => markCurrentListItemAsRead(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.mark-as-unread"],
          onKeyDown: () => markCurrentListItemAsUnread(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.down"],
          onKeyDown: goDownLabelTree(startTransition),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.down-alt"],
          onKeyDown: goDownLabelTree(startTransition),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.up"],
          onKeyDown: goUpLabelTree(startTransition),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.up-alt"],
          onKeyDown: goUpLabelTree(startTransition),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.previous-label"],
          onKeyDown: closeLabelOrGoToPreviousLabel(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.previous-label-alt"],
          onKeyDown: closeLabelOrGoToPreviousLabel(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.next-label"],
          onKeyDown: openLabelOrGoToNextLabel(activeEmailAddress),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.next-label-alt"],
          onKeyDown: openLabelOrGoToNextLabel(activeEmailAddress),
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
              if (activeEmailAddress) {
                closeLabelOrGoToPreviousLabel(activeEmailAddress)();
              }
            }
          },
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.compose"],
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
          ...SHORTCUT_KEYMAP_INFO["message.forward"],
          onKeyDown: startResponseToCurrentItem("forward"),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.reply-all"],
          onKeyDown: startResponseToCurrentItem("reply-all"),
        },
        {
          ...SHORTCUT_KEYMAP_INFO["message.reply-sender"],
          onKeyDown: startResponseToCurrentItem("reply-sender"),
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
  }, [
    activeEmailAddress,
    existingShortcuts,
    isLoadingExistingShortcuts,
    logger,
    router,
  ]);
};
