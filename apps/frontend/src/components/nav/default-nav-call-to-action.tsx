"use client";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Kbd } from "../ui/kbd";

export const DefaultNavCallToAction = () => {
  const router = useRouter();
  const goToSetting = () => {
    router.push("/settings");
  };

  // let navItem = (
  //   <Link href="/login" className={cn(buttonVariants())}>
  //     Login
  //   </Link>
  // );
  const navItem = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full gap-2" variant={"ghost"} size="lg">
          <div className="text-sm font-semibold">{"ANON"}</div>
          <Avatar>
            <AvatarFallback>{"PP"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={goToSetting}>
            Settings
            <Kbd>⌘S</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return <nav className="w-full">{navItem}</nav>;
};
