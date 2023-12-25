"use client";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/ui";
import { EmailAccountSelect } from "./email-account-select";

export function InboxSideNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex h-full flex-col gap-6 border-r", className)}
      {...props}
    >
      <Button variant="secondary" size="icon-md">
        <Icons.inbox className="h-5 w-5" />
      </Button>
      {/* <Button variant="ghost" size="icon-md">
        <Icons.search />
      </Button> */}

      <div className="flex flex-grow items-end">
        <EmailAccountSelect />
      </div>
    </nav>
  );
}
