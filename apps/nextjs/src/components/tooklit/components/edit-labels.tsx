"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import type { ThreadType } from "@skylar/client-db/schema/thread";

import { useListLabels } from "~/app/(emailClient)/(workspace)/use-list-labels";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { api } from "~/lib/api";
import { getLabelModifications } from "~/lib/inbox-toolkit/utils";
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
  const email = "curdcorp@gmail.com";
  const [labels, setLabels] = useState<Record<string, boolean>>(
    thread.email_provider_labels.reduce(
      (acc, label) => {
        acc[label] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const { mutateAsync: fetchGmailAccessTokenMutation } =
    api.gmail.getAccessToken.useMutation();

  const fetchGmailAccessToken = async () => {
    const token = await fetchGmailAccessTokenMutation({
      email,
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
    }, 150); // This is so that the function is not called before the component mounts
  }, []);
  return (
    <Command>
      <CommandInput ref={inputRef} placeholder="Search labels..." />
      {/* TODO: add create label? */}
      <CommandEmpty>A problem occured: no labels found.</CommandEmpty>
      <CommandGroup>
        <div className="max-h-60 overflow-auto">
          {labelData
            ? labelData[email]?.map((label) => (
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
              console.log(labelData);
              const selectedLabels = Object.keys(labels).filter(
                (label) => labels[label],
              );
              console.log(selectedLabels);
              const { labelsToAdd, labelsToRemove } = getLabelModifications({
                newLabels: selectedLabels,
                currentLabels: thread.email_provider_labels,
              });
              const accessToken = await fetchGmailAccessToken();
              await editLabelAction.applyFn(
                accessToken,
                labelsToAdd,
                labelsToRemove,
              );
            }}
          >
            Apply
          </Button>
        </div>
      </CommandGroup>
    </Command>
  );
}
