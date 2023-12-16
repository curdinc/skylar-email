"use client";

import "allotment/dist/style.css";

import { EmailAccountNav } from "~/components/nav/email-account-nav";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow">
      <EmailAccountNav className="p-5" />
      <main className=" w-full">{children}</main>
    </div>
  );
}
