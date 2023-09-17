"use client";

import Link from "next/link";

import { MainNav } from "~/components/nav/main-nav";
import { SiteFooter } from "~/components/nav/site-footer";
import { buttonVariants } from "~/components/ui/button";
import { dashboardConfig } from "~/lib/config";
import { cn } from "~/lib/ui";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={dashboardConfig.mainNav} />
          <nav>
            <Link href="/login" className={cn(buttonVariants())}>
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
