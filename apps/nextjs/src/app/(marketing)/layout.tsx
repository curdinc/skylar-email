import { SiteFooter } from "~/components/nav/site-footer";
import { TopNav } from "~/components/nav/top-nav";
import { marketingConfig } from "~/lib/config";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <TopNav items={marketingConfig.mainNav} />
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
