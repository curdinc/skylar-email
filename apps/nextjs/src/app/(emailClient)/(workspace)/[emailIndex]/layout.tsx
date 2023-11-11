"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/ui";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // todo get email accounts
  return (
    <div className="flex grow">
      <EmailAccountNav
        items={[
          {
            href: "/0",
            title: "curdcord@gmail.com",
          },
        ]}
        className="p-5"
      />
      <main className="h-100vh w-full">{children}</main>
    </div>
  );
}

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
  const pathname = usePathname();

  return (
    <nav className={cn("flex  flex-col gap-5", className)} {...props}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Avatar
            className={cn(
              pathname === item.href
                ? "hover:cursor-default"
                : "transition-opacity hover:cursor-pointer hover:opacity-70",
            )}
          >
            <AvatarFallback>{item.title.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </nav>
  );
}
