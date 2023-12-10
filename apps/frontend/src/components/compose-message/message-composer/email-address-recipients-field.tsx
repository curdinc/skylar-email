import { ReactMultiEmail } from "react-multi-email";

import { Icons } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InputBaseStyle } from "~/components/ui/input";
import { cn } from "~/lib/ui";

export const EmailAddressRecipientsField = (
  args: Partial<Parameters<typeof ReactMultiEmail>[0]>,
) => {
  return (
    <ReactMultiEmail
      {...args}
      className={cn("flex items-center gap-2", InputBaseStyle, args.className)}
      autoComplete="email"
      getLabel={(email, index, removeEmail) => {
        return (
          <Badge key={index} className="gap-1" variant={"secondary"}>
            <div>{email}</div>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              onClick={() => removeEmail(index)}
            >
              <Icons.close />
            </Button>
          </Badge>
        );
      }}
      inputClassName={cn("focus-visible:outline-none", args.inputClassName)}
    />
  );
};
