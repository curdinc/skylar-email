"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "~/lib/ui";
import { BrandIcons } from "../icons/brand-icons";
import { DefaultNavCallToAction } from "./default-nav-call-to-action";
import { MobileNav } from "./mobile-nav";

export type MainNavItemType = {
  title: string;
  href: string;
  disabled?: boolean;
};

type MainNavProps = {
  items?: MainNavItemType[];
  children?: React.ReactNode;
};

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex h-20 items-center justify-between py-6 ">
      <div className="flex gap-6 md:gap-10">
        <BrandIcons.skylarIconWithText />
        {items?.length ? (
          <nav className="hidden gap-6 md:flex">
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  item.href.startsWith(`/${segment}`)
                    ? "text-foreground"
                    : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
      <MobileNav items={items}>{children}</MobileNav>
      <div className="hidden md:flex md:items-center">
        {children ?? <DefaultNavCallToAction />}
      </div>
    </div>
  );
}
