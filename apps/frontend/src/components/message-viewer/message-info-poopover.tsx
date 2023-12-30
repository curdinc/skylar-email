import type { MessageType } from "@skylar/parsers-and-types";

import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function MessageInfoPopover({ message }: { message: MessageType }) {
  console.log("message", message);
  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size={"icon-xs"} aria-label="message-info">
              <Icons.info />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <p>Complete message info</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2"></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
