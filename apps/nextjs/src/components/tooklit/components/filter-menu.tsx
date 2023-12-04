"use client";

import { useState } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export function FilterMenu({
  senderEmail,
  children,
  ...props
}: {
  senderEmail: string;
  children: React.ReactNode;
} & DialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // console.log("rendering filter menu");
  return (
    <Sheet
      // open={isOpen}
      // onOpenChange={(open) => {
      //   console.log(open);
      //   setIsOpen(open);
      // }}
      {...props}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent

      // onInteractOutside={(event) => {
      //   console.log("on interact outside");
      //   // event.preventDefault();
      // }}
      // onPointerDownOutside={() => console.log("on pointer down outside")}
      // onCloseAutoFocus={(event) => {
      //   console.log("on close auto focus");
      //   // setIsOpen(true);
      //   // event.preventDefault();
      // }}
      // onOpenAutoFocus={(event) => {
      //   console.log("on open auto focus");
      //   // event.preventDefault();
      //   // setIsOpen(false);
      // }}
      >
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure? {senderEmail}</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
