"use client";

import { MainNav } from "~/components/nav/main-nav";
import { SiteFooter } from "~/components/nav/site-footer";
import { dashboardConfig } from "~/lib/config";
import { ClientLayout } from "./client-layout";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <MainNav items={dashboardConfig.mainNav} />
      </header>
      <ClientLayout />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
