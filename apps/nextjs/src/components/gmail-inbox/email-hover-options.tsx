import { ToastAction } from "@radix-ui/react-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import { useActiveEmailClientDb } from "@skylar/logic";

import { api } from "~/lib/api";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import type { hoverOption } from "./hover-option-config";

function EmailHoverOptions({
  activeEmail,
  hoverOptions,
}: {
  activeEmail: string;
  hoverOptions: hoverOption[];
}) {
  const activeClientDb = useActiveEmailClientDb();
  const { toast, dismiss } = useToast();
  const { mutateAsync: fetchGmailAccessToken } =
    api.gmail.getAccessToken.useMutation();

  if (activeClientDb) {
    const showUndoSuccessToast = () => {
      toast({
        title: "Action Undone",
        duration: 10000,
        description: "Operation successfull!",
      });
    };

    const showUndoToast = (item: hoverOption) => {
      toast({
        title: item.undoToastConfig.title,
        duration: 10000,
        description: "Operation successfull!",
        action: (
          <ToastAction
            onClick={async (e) => {
              e.preventDefault();
              const accessToken = await fetchGmailAccessToken({
                email: activeEmail,
              });
              await item.undoFn(accessToken, activeClientDb);
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

    return (
      <>
        {hoverOptions.map((item, ind) => (
          <div
            className="group/archive flex flex-col items-center gap-2 group-hover:visible lg:invisible"
            key={ind}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="rounded-full p-1 hover:bg-slate-200"
                    variant={"ghost"}
                    size={"icon-md"}
                    onClick={async (e) => {
                      e.preventDefault();
                      const accessToken = await fetchGmailAccessToken({
                        email: activeEmail,
                      });
                      item
                        .applyFn(accessToken, activeClientDb)
                        .then((_) => {
                          showUndoToast(item);
                        })
                        .catch((e) => console.error(e));
                    }}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="invisible mb-2 rounded-md bg-black p-2 text-white group-hover/archive:visible">
                    {item.tooltipDescription}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </>
    );
  }
}

export default EmailHoverOptions;
