"use client";

import { useEffect, useRef, useState } from "react";
import { ToastAction } from "@radix-ui/react-toast";
import { Check } from "lucide-react";

import type { ThreadType } from "@skylar/parsers-and-types";

import { useListLabels } from "~/app/(inbox)/(workspace)/use-list-labels";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { useToast } from "~/components/ui/use-toast";
import { GMAIL_IMMUTABLE_LABELS } from "~/lib/inbox-toolkit/constants";
import { useAccessToken } from "~/lib/provider/use-access-token";
import { useActiveEmailAddress } from "~/lib/provider/use-active-email-address";
import { cn } from "~/lib/ui";
import type { ConfigOption, MoveThreadArgs } from "../config-option-type";

export function EditLabels({
  thread,
  editLabelAction,
}: {
  thread: ThreadType;
  editLabelAction: ConfigOption<MoveThreadArgs>;
}) {
  // create a map of all labels with true/false values
  // when a label is selected, toggle the value
  const { data: labelData } = useListLabels();
  const { toast, dismiss } = useToast();
  const { data: activeEmailAddress } = useActiveEmailAddress();

  const [labels, setLabels] = useState<Record<string, boolean>>(
    thread.provider_message_labels.reduce(
      (acc, label) => {
        acc[label] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  if (!activeEmailAddress) throw new Error("No active email address");

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
    if (item.type !== "reversible-action") {
      return;
    }
    toast({
      title: item.undoToastConfig.title,
      duration: 10000,
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
      try {
        const undoFn = await action.applyFn(accessToken, ...args);
        if (undoFn) {
          showUndoToast(action, undoFn);
        }
      } catch (e) {
        // Show error here
      }
    };
  };

  const { mutateAsync: fetchGmailAccessTokenMutation } = useAccessToken();

  const fetchGmailAccessToken = async () => {
    const token = await fetchGmailAccessTokenMutation({
      email: activeEmailAddress,
    });
    if (!token) throw new Error("Error fetching access token.");
    return token;
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); // This is so that the function is not called before the component mounts
  }, []);

  return (
    <Command>
      <CommandInput ref={inputRef} placeholder="Search labels..." />
      {/* TODO: add create label? */}
      <CommandEmpty>A problem occured: no labels found.</CommandEmpty>
      <CommandGroup>
        <div className="max-h-60 overflow-auto">
          {labelData
            ? labelData[activeEmailAddress]
                ?.filter((label) => {
                  return GMAIL_IMMUTABLE_LABELS.indexOf(label.id) === -1;
                })
                .map((label) => (
                  <CommandItem
                    key={label.id}
                    value={label.name}
                    onSelect={(_) => {
                      setLabels((prev) => {
                        return {
                          ...prev,
                          [label.id]: !prev[label.id],
                        };
                      });
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        labels[label.id] ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {label.name}
                  </CommandItem>
                ))
            : null}
        </div>
        <div className="flex w-full justify-center p-1">
          <Button
            variant="ghost"
            className="w-full"
            onClick={async () => {
              if (!labelData) return;
              const selectedLabels = Object.keys(labels).filter(
                (label) => labels[label],
              );
              await runAction(editLabelAction, selectedLabels)();
            }}
          >
            Apply
          </Button>
        </div>
      </CommandGroup>
    </Command>
  );
}
