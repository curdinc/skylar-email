"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "~/lib/ui";

export function Step() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="relative">
      <div
        className="absolute left-0 top-2 h-0.5 w-full bg-muted"
        aria-hidden="true"
      >
        <div
          className={cn(
            "left absolute h-full w-1/4 bg-gradient-to-r from-primary",
            segment === "connect" && "w-4/5",
            (segment === "card" || segment === "confirm") &&
              "w-full bg-primary",
          )}
        />
      </div>
      <ul className="relative flex w-full justify-between">
        <li className="text-left">
          <a
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground",
              "bg-primary text-primary-foreground",
            )}
            href="/onboarding/code"
          >
            1
          </a>
        </li>
        <li className="text-left">
          <a
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ",
              (segment === "connect" || segment === "card") &&
                "bg-primary text-primary-foreground",
            )}
            href="/onboarding/connect"
          >
            2
          </a>
        </li>
        <li className="text-left">
          <a
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground",
              segment === "card" && "bg-primary text-primary-foreground",
            )}
            href="/onboarding/card"
          >
            3
          </a>
        </li>
      </ul>
    </div>
  );
}
