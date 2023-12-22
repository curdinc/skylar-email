"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useConnectedProviders } from "@skylar/client-db";

import { ROUTE_ONBOARDING_CONNECT } from "~/lib/routes";
import { Icons } from "../../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import type { ButtonProps } from "../../ui/button";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Skeleton } from "../../ui/skeleton";

export function EmailAccountSelect({ className, ...props }: ButtonProps) {
  const pathname = usePathname();
  const { data: connectedProviders, isLoading } = useConnectedProviders();

  const allProvidersProfileInfo = useMemo(() => {
    return (connectedProviders ?? []).map((account) => ({
      href: `/${account.provider_id}`,
      title: account.user_email_address,
      imageUri: account.image_uri,
      name: account.inbox_name,
      email: account.user_email_address,
    }));
  }, [connectedProviders]);
  const activeProviderInfo = useMemo(() => {
    return allProvidersProfileInfo.find(
      (providerInfo) => providerInfo.href === pathname,
    );
  }, [allProvidersProfileInfo, pathname]);

  let trigger = (
    <Button
      disabled
      variant={"ghost"}
      size="icon-md"
      className={className}
      {...props}
    >
      <Skeleton className="h-7 w-7 rounded-full" />
    </Button>
  );
  if (!isLoading && activeProviderInfo) {
    trigger = (
      <Button variant={"ghost"} size="icon-md" className={className} {...props}>
        <Avatar>
          <AvatarImage src={activeProviderInfo.imageUri} />
          <AvatarFallback>{activeProviderInfo.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Providers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allProvidersProfileInfo.map((providerInfo, idx) => (
          <DropdownMenuItem key={providerInfo.href}>
            <Link
              href={providerInfo.href}
              className="flex w-full items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={providerInfo.imageUri} />
                <AvatarFallback>{providerInfo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="flex-grow truncate">{providerInfo.email}</span>
              {idx < 8 && (
                <DropdownMenuShortcut className="whitespace-nowrap">
                  ALT {idx + 1}
                </DropdownMenuShortcut>
              )}
              {idx === 9 && (
                <DropdownMenuShortcut className="whitespace-nowrap">
                  ALT {0}
                </DropdownMenuShortcut>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem>
          <Link
            href={ROUTE_ONBOARDING_CONNECT}
            className="flex w-full items-center gap-2"
          >
            <Icons.add className="h-6 w-6" />
            <span>Add Provider</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
