import type { HtmlHTMLAttributes } from "react";

import type { SenderType } from "@skylar/parsers-and-types";

import { cn } from "~/lib/ui";
import { CopyToClipboard } from "../buttons/copy-to-clipboard";

export const SenderDisplay = ({
  senderInfo,
  className,
  ...props
}: { senderInfo: SenderType } & Omit<
  HtmlHTMLAttributes<HTMLSpanElement>,
  "children"
>) => {
  if (senderInfo.name) {
    return (
      <div {...props} className={cn("", className)}>
        {senderInfo.name} &lt;
        <CopyToClipboard
          variant={"link"}
          className={cn("w-fit", className)}
          valueToCopy={senderInfo.email_address}
        >
          {senderInfo.email_address}
        </CopyToClipboard>
        &gt;
      </div>
    );
  }
  return (
    <span {...props} className={cn("", className)}>
      <CopyToClipboard
        variant={"link"}
        className={cn("w-fit", className)}
        valueToCopy={senderInfo.email_address}
      >
        {senderInfo.email_address}
      </CopyToClipboard>
    </span>
  );
};
