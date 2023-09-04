"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import type { marketingConfig } from "~/lib/utils/config";
import { siteConfig } from "~/lib/utils/config";
import { cn } from "~/lib/utils/ui";
import { Icons } from "../icons";
import { MobileNav } from "./mobile-nav";

type MainNavProps = {
  items?: (typeof marketingConfig)["mainNav"];
  children?: React.ReactNode;
};

export function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "hover:text-foreground/80 flex items-center text-lg font-medium transition-colors sm:text-sm",
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
      <MobileNav items={items}>{children}</MobileNav>
    </div>
  );
}
