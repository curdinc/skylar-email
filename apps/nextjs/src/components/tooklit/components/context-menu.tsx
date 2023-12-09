import { ToastAction } from "@radix-ui/react-toast";

import { getEmailThreadsFrom } from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { useGlobalStore } from "@skylar/logic";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useToast } from "~/components/ui/use-toast";
import { useAccessToken } from "~/lib/provider/use-access-token";
import type { ConfigOption } from "../config-option-type";
import { getSenderActions } from "../sender/sender-option-config";
import { getThreadActions } from "../thread/thread-option-config";
import { EditLabels } from "./edit-labels";

export function ThreadContextMenu({
  children,
  thread,
  refetch,
}: {
  children: React.ReactNode;
  thread: ThreadType;
  refetch: () => Promise<void>;
}) {
  const activeEmailAddress = useGlobalStore(
    (state) => state.EMAIL_CLIENT.activeEmailAddress,
  );

  if (!activeEmailAddress) throw new Error("No active email address");

  const INBOX_TOOLKIT_THREAD_ACTIONS = getThreadActions(
    async () => {
      return Promise.resolve([thread]);
    },
    activeEmailAddress,
    [refetch],
  );
  const INBOX_TOOLKIT_SENDER_ACTIONS = getSenderActions({
    activeEmail: activeEmailAddress,
    afterClientDbUpdate: [refetch],
    getThreads: () => {
      return getEmailThreadsFrom({
        // todo: fix this accessor
        senderEmail: thread.from[0]?.[0]?.email ?? "",
        clientEmail: activeEmailAddress,
      });
    },
  });

  const { toast, dismiss } = useToast();

  const { mutateAsync: fetchGmailAccessTokenMutation } = useAccessToken();

  const fetchGmailAccessToken = async () => {
    const token = await fetchGmailAccessTokenMutation({
      email: activeEmailAddress,
    });
    if (!token) throw new Error("Error fetching access token.");
    return token;
  };

  const showUndoSuccessToast = () => {
    toast({
      title: "Action Undone",
      duration: 10000,
      description: "Operation successful!",
    });
  };

  const showUndoToast = <T,>(
    item: ConfigOption<T>,
    undoFn: () => Promise<void>,
  ) => {
    if (!("undoToastConfig" in item)) {
      return;
    }

    toast({
      title: item.undoToastConfig.title,
      duration: 10_000,
      description: "Operation successful!",
      action: (
        <ToastAction
          onClick={async () => {
            await undoFn();
            dismiss();
            showUndoSuccessToast();
          }}
          altText="Undo"
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const runAction = <T,>(action: ConfigOption<T>, ...args: T[]) => {
    return async () => {
      const accessToken = await fetchGmailAccessToken();
      action
        .applyFn(accessToken, ...args)
        .then((undoFn) => {
          if (typeof undoFn !== "function") {
            return;
          }
          showUndoToast(action, undoFn);
        })
        .catch((e) => console.error(e));
    };
  };

  const displayContextOption = <T,>(option: ConfigOption<T>, ...args: T[]) => {
    return (
      <ContextMenuItem inset onClick={runAction(option, ...args)}>
        <div className="flex items-center gap-2">
          <option.icon className="h-4 w-4" />
          <div>{option.name}</div>
        </div>
      </ContextMenuItem>
    );
  };

  return (
    <ContextMenu>
      {/*  className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm" */}
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.replySender)}
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.replyAll)}
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.forward)}
        <ContextMenuSeparator />
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.archiveThread)}
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.trashThread)}
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.markReadThread)}
        {displayContextOption(INBOX_TOOLKIT_THREAD_ACTIONS.markUnreadThread)}
        <ContextMenuItem inset disabled>
          Snooze
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Move to</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <div className="pl-2 text-sm">Move to:</div>
            {displayContextOption(
              INBOX_TOOLKIT_THREAD_ACTIONS.modifyThreadLabels,
              ["CATEGORY_PERSONAL"],
              ["CATEGORY_SOCIAL"],
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Sender actions</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {displayContextOption(INBOX_TOOLKIT_SENDER_ACTIONS.trashFromSender)}
            {displayContextOption(
              INBOX_TOOLKIT_SENDER_ACTIONS.archiveFromSender,
            )}
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>Label as</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <EditLabels
                  thread={thread}
                  editLabelAction={INBOX_TOOLKIT_SENDER_ACTIONS.labelFromSender}
                />
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Label as</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <EditLabels
              thread={thread}
              editLabelAction={INBOX_TOOLKIT_THREAD_ACTIONS.modifyThreadLabels}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
