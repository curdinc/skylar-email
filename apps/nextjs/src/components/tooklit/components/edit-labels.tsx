"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { useListLabels } from "~/app/(emailClient)/(workspace)/use-list-labels";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { cn } from "~/lib/ui";

export function EditLabels() {
  // create a map of all labels with true/false values
  // when a label is selected, toggle the value
  const { data: labelData } = useListLabels();
  const email = "curdcorp@gmail.com";
  const [labels, setLabels] = useState<Record<string, boolean>>({});

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
      <CommandEmpty>No labels found.</CommandEmpty>
      <CommandGroup>
        {labelData[email]?.map((label) => (
          <CommandItem
            key={label.id}
            value={label.name}
            onSelect={(currentValue) => {
              setLabels((prev) => {
                return {
                  ...prev,
                  [currentValue.toLowerCase()]:
                    !prev[currentValue.toLowerCase()],
                };
              });
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                labels[label.name.toLowerCase()] ? "opacity-100" : "opacity-0",
              )}
            />
            {label.name}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
