import type { Metadata } from "next";

import { AttachmentZone } from "~/components/compose-email/attachment";
import { SiteFooter } from "~/components/nav/site-footer";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Where productivity begins",
};

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ClientLayout />
      <main className="flex grow">
        <AttachmentZone>{children}</AttachmentZone>
      </main>
      <SiteFooter />
    </div>
  );
}
