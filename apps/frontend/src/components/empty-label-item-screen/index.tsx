import { useShortcut } from "@skylar/client-db";

import { SHORTCUT_KEYMAP_INFO } from "~/lib/shortcuts/kepmap-info";
import { Kbd } from "../ui/kbd";
import { Separator } from "../ui/separator";

export const EmptyLabelItemScreen = () => {
  const { data: goDown } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.down"].label,
  });
  const { data: goUp } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.up"].label,
  });
  const { data: goPrev } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.previous-label"].label,
  });
  const { data: goNext } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.next-label"].label,
  });
  const { data: replyAll } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.reply-all"].label,
  });
  const { data: compose } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.compose"].label,
  });
  const { data: forward } = useShortcut({
    shortcutLabel: SHORTCUT_KEYMAP_INFO["message.forward"].label,
  });
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex w-40 items-center justify-between gap-3">
        <div className="flex flex-col gap-4">
          <div className="text-secondary-foreground">Move Up</div>
          <div className="text-secondary-foreground">Move Down</div>
          <div className="text-secondary-foreground">Next Label</div>
          <div className="text-secondary-foreground">Previous Label</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Kbd>{goUp?.combo}</Kbd>
          <Kbd>{goDown?.combo}</Kbd>
          <Kbd>{goNext?.combo}</Kbd>
          <Kbd>{goPrev?.combo}</Kbd>
        </div>
      </div>
      <Separator className="w-56" />
      <div className="flex w-40 items-center justify-between gap-3">
        <div className="flex flex-col gap-4">
          <div className="text-secondary-foreground">Reply All</div>
          <div className="text-secondary-foreground">Compose</div>
          <div className="text-secondary-foreground">Forward</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Kbd>{replyAll?.combo}</Kbd>
          <Kbd>{compose?.combo}</Kbd>
          <Kbd>{forward?.combo}</Kbd>
        </div>
      </div>
    </div>
  );
};
