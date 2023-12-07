"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

import { setActiveThread } from "@skylar/logic";

import { cn } from "~/lib/ui";

type SidebarNavProps = {
  items: {
    href: string;
    title: string;
  }[];
} & React.HTMLAttributes<HTMLElement>;

export function EmailAccountNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { emailIndex } = useParams();
  const pathname = usePathname();

  useEffect(() => {
    setActiveThread(undefined);
  }, [emailIndex]);

  return (
    <nav className={cn("flex  flex-col gap-5", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href
              ? "hover:cursor-default"
              : "transition-opacity hover:cursor-pointer hover:opacity-70",
          )}
        >
          <Avatar>
            <AvatarFallback>{item.title.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </nav>
  );
}
