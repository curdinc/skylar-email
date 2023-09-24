import type { Metadata } from "next";

import { SiteFooter } from "~/components/nav/site-footer";
import { TopNav } from "~/components/nav/top-nav";
import { dashboardConfig } from "~/lib/config";
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
      <header className="container z-40 bg-background">
        <TopNav items={dashboardConfig.mainNav} />
      </header>
      <ClientLayout />
      <main className="container flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
