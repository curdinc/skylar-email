"use client";

import { useState } from "react";

import { Icons } from "../icons";
import type { ButtonProps } from "../ui/button";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export const CopyToClipboard = ({
  valueToCopy,
  ...props
}: { valueToCopy: string } & ButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const onClickCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(valueToCopy).catch(() => {
      toast({
        title: "Something went wrong",
        description: "Could not copy to clipboard. Please try again later",
      });
    });
    setTimeout(() => {
      setCopied(false);
    }, 1_000);
  };

  return (
    <Button size={"icon-md"} variant={"ghost"} onClick={onClickCopy} {...props}>
      {copied ? <Icons.copyChecked /> : <Icons.copy />}
    </Button>
  );
};
