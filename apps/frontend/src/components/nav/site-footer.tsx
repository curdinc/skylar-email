import * as React from "react";
import Link from "next/link";

import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/ui";
import { BrandIcons } from "../icons/brand-icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BrandIcons.skylarIcon />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href={"https://github.com/hansbhatia"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Hans
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/elasticbottle"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Winston
            </a>{" "}
            with 💗
          </p>
        </div>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="flex"
        >
          <div className="flex items-center">
            <div className="flex h-8 items-center rounded-md border border-muted bg-muted px-4 text-sm font-medium">
              Stars us on GitHub
            </div>
            <div className="h-3 w-3 border-y-8 border-l-8 border-r-0 border-solid border-muted border-y-transparent"></div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
            <BrandIcons.gitHub className="h-5 w-5 text-foreground" />
          </div>
        </Link>
      </div>
    </footer>
  );
}
