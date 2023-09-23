import { useState } from "react";
import Link from "next/link";

import type { marketingConfig } from "~/lib/config";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { BrandIcons } from "../icons/brand-icons";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { DefaultNavCallToAction } from "./default-nav-call-to-action";

type MobileNavProps = {
  items?: (typeof marketingConfig)["mainNav"];
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
        {isOpen ? <Icons.close /> : <Icons.menu />}
      </SheetTrigger>

      <SheetContent side={"right"} className="flex flex-col">
        <SheetHeader>
          <BrandIcons.skylarIconWithText textClassName="inline-block" />
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
        {children ?? (
          <div className="flex grow items-end">
            <DefaultNavCallToAction />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
