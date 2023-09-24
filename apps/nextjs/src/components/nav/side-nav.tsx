"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/ui";
import { buttonVariants } from "../ui/button";

type SidebarNavProps = {
  items: {
    href: string;
    title: string;
  }[];
} & React.HTMLAttributes<HTMLElement>;

export function SideNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
