"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { posthogInstance } from "~/lib/analytics/posthog-instance";

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthogInstance().capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}
