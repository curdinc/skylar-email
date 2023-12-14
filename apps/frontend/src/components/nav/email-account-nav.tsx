"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useConnectedProviders } from "@skylar/client-db";

import { ROUTE_ONBOARDING_CONNECT } from "~/lib/routes";
import { cn } from "~/lib/ui";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export function EmailAccountNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { data: allEmailProviders, isLoading } = useConnectedProviders();

  const allEmailProvidersProfileInfo = (allEmailProviders ?? []).map(
    (account) => ({
      href: `/${account.provider_id}`,
      title: account.user_email_address,
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
        {allEmailProvidersProfileInfo.map((providerInfo) => (
          <Link
            key={providerInfo.href}
            href={providerInfo.href}
            className={cn(
              pathname === providerInfo.href
                ? "hover:cursor-default"
                : "transition-opacity hover:cursor-pointer hover:opacity-70",
            )}
          >
            <Avatar>
              <AvatarImage src={providerInfo.imageUri} />
              <AvatarFallback>{providerInfo.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
        ))}
        <Link
          href={ROUTE_ONBOARDING_CONNECT}
          className={cn(
            "transition-opacity hover:cursor-pointer hover:opacity-70",
          )}
        >
          <Avatar>
            <AvatarFallback>
              <Icons.add className="opacity-70" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <nav className={cn("flex  flex-col gap-5", className)} {...props}>
      {body}
    </nav>
  );
}
