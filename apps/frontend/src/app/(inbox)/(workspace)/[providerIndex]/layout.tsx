"use client";

import "allotment/dist/style.css";

import { InboxSideNav } from "~/components/nav/inbox/side-nav";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow">
      <InboxSideNav className="p-5" />
      <main className=" w-full">{children}</main>
    </div>
  );
}
