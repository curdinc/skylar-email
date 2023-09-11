import type { Metadata } from "next";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/lib/utils/config";
import { Step } from "./step";

export const metadata: Metadata = {
  description: "Onboard to the next gen email manager - Skylar",
};

export default function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Icons.logo />
          {siteConfig.name}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Skylar has saved me countless hours of work and helped me
              deliver greater and more impactful work faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Larry SKy</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Step />
          {children}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By onboarding, you might start having too much free time.
          </p>
        </div>
      </div>
    </div>
  );
}
