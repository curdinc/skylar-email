import Link from "next/link";

import { MainNav } from "~/components/nav/main-nav";
import { SiteFooter } from "~/components/nav/site-footer";
import { Button } from "~/components/ui/button";
import { marketingConfig } from "~/lib/utils/config";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
