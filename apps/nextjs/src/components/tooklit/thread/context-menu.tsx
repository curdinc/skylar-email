import { ToastAction } from "@radix-ui/react-toast";

import type { ThreadType } from "@skylar/client-db/schema/thread";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import type { ThreadOptionConfig } from "./thread-option-config";
import { getThreadActions } from "./thread-option-config";

export function ThreadContextMenu({
  children,
  thread,
  refetch,
}: {
  children: React.ReactNode;
  thread: ThreadType;
  refetch: () => Promise<void>;
}) {
  const email = "curdcorp@gmail.com"; // TODO: change this to the active email
  const INBOX_TOOLKIT_THREAD_ACTIONS = getThreadActions(thread, email, [
    refetch,
  ]);

  const { toast, dismiss } = useToast();

  const { mutateAsync: fetchGmailAccessTokenMutation } =
    api.gmail.getAccessToken.useMutation();

  const fetchGmailAccessToken = async () => {
    const token = await fetchGmailAccessTokenMutation({
      email,
    });
    if (!token) throw new Error("Error fetching access token.");
    return token;
  };

  const showUndoSuccessToast = () => {
    toast({
      title: "Action Undone",
      duration: 10000,
      description: "Operation successfull!",
    });
  };

  const showUndoToast = (item: ThreadOptionConfig) => {
    toast({
      title: item.undoToastConfig.title,
      duration: 10000,
      description: "Operation successfull!",
      action: (
        <ToastAction
          onClick={async () => {
            const accessToken = await fetchGmailAccessToken();
            await item.undoFn(accessToken);
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

  const runAction = (action: ThreadOptionConfig) => {
    return async () => {
      const accessToken = await fetchGmailAccessToken();
      action
        .applyFn(accessToken)
        .then((_) => {
          showUndoToast(action);
        })
        .catch((e) => console.error(e));
    };
  };

  const displayContextOption = (option: ThreadOptionConfig) => {
    return (
      <ContextMenuItem inset onClick={runAction(option)}>
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
        <ContextMenuItem inset disabled>
          Reply
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Reply All
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
        </ContextMenuItem>
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
            <ContextMenuItem>
              Not supported yet
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Sender actions</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem disabled>Block all from sender</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Label as</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <div className="pl-2 text-sm">Label as:</div>
            <ContextMenuItem>Not supported yet</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
