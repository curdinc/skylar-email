"use client";

import Link from "next/link";

import { useLogOut, useUser } from "@skylar/auth/client";

import { cn } from "~/lib/ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const DefaultNavCallToAction = () => {
  const user = useUser();
  const signOut = useLogOut();

  let navItem = (
    <Link href="/login" className={cn(buttonVariants())}>
      Login
    </Link>
  );
  if (user) {
    navItem = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full gap-2" variant={"ghost"} size="lg">
            <div className="text-sm font-semibold">{user.name}</div>
            <Avatar>
              <AvatarImage src={user.imageUri} />
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <nav className="w-full">{navItem}</nav>;
};
