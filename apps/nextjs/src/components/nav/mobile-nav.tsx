import { useState } from "react";
import Link from "next/link";

import type { marketingNavConfig } from "~/lib/utils/config";
import { siteConfig } from "~/lib/utils/config";
import { cn } from "~/lib/utils/ui";
import { Icons } from "../icons";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

type MobileNavProps = {
  items?: (typeof marketingNavConfig)["mainNav"];
  children?: React.ReactNode;
};

export function MobileNav({ items, children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <SheetTrigger className="flex grow justify-end md:hidden">
        {isOpen ? <Icons.close /> : <Icons.logo />}
      </SheetTrigger>

      <SheetContent side={"top"}>
        <SheetHeader>
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </SheetHeader>
        {items?.length ? (
          <nav className="grid grid-flow-row auto-rows-max text-sm">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
        {children}
      </SheetContent>
    </Sheet>
  );
}
