"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

import { cn } from "~/lib/ui";
import { AvatarImage } from "../ui/avatar";

type SidebarNavProps = {
  allEmailProvidersProfileInfo: {
    href: string;
    title: string;
    imageUri: string;
    name: string;
  }[];
} & React.HTMLAttributes<HTMLElement>;

export function EmailAccountNav({
  className,
  allEmailProvidersProfileInfo,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex  flex-col gap-5", className)} {...props}>
      {allEmailProvidersProfileInfo.map((item) => (
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
            <AvatarImage src={item.imageUri} />
            <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </nav>
  );
}
