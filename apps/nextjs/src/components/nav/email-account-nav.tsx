"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAllEmailProviders } from "@skylar/client-db";

import { cn } from "~/lib/ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export function EmailAccountNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { data: allEmailProviders, isLoading } = useAllEmailProviders();

  const allEmailProvidersProfileInfo = (allEmailProviders ?? []).map(
    (account) => ({
      href: `${account.provider_id}`,
      title: account.email,
      imageUri: account.image_uri,
      name: account.inbox_name,
    }),
  );

  let body = (
    <>
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </>
  );
  if (!isLoading) {
    body = (
      <>
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
      </>
    );
  }

  return (
    <nav className={cn("flex  flex-col gap-5", className)} {...props}>
      {body}
    </nav>
  );
}
