import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import { Button } from "../ui/button";
import type { hoverOption } from "./hover-option-config";

function EmailHoverOptions({ hoverOptions }: { hoverOptions: hoverOption[] }) {
  return (
    <>
      {hoverOptions.map((item, ind) => (
        <div
          className="group/archive invisible flex flex-col items-center gap-2 group-hover:visible"
          key={ind}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  className="rounded-full p-1 hover:bg-slate-200"
                  variant={"ghost"}
                  size={"icon-md"}
                  onClick={item.onClick}
                >
                  {item.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="invisible mb-2 rounded-md bg-black p-2 text-white group-hover/archive:visible">
                  {item.desc}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </>
  );
}

export default EmailHoverOptions;
