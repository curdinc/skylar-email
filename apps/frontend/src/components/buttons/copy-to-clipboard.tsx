"use client";

import React, { useState } from "react";

import { Icons } from "../icons";
import type { ButtonProps } from "../ui/button";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";

export const CopyToClipboard = ({
  valueToCopy,
  ...props
}: { valueToCopy: string } & ButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const onClickCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCopied(true);
    navigator.clipboard.writeText(valueToCopy).catch(() => {
      toast({
        title: "Something went wrong",
        description: "Could not copy to clipboard. Please try again later",
      });
    });

    // Hack to show keep the tooltip open
    const target = e.currentTarget;
    if (!target) return;
    setTimeout(() => {
      target.blur();
      target.focus();
    }, 100);

    setTimeout(() => {
      setCopied(false);
    }, 1_000);
  };
  let ButtonBody = props.children;
  if (!ButtonBody) {
    ButtonBody = copied ? <Icons.copyChecked /> : <Icons.copy />;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={"icon-md"}
          variant={"ghost"}
          onClick={onClickCopy}
          {...props}
        >
          {ButtonBody}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : `Copy ${valueToCopy} to clipboard`}</p>
      </TooltipContent>
    </Tooltip>
  );
};
