import type { StripeElementsOptions } from "@stripe/stripe-js";

import type { MainNavItemType } from "~/components/nav/top-nav";

export const siteConfig = {
  name: "Skylar",
  description:
    "Your personal email manager that automatically categorizes and summarizes inboxes",
  url: "https://curdinc.com",
  ogImage: "https://curdinc.com/og.jpg",
  links: {
    twitter: "https://twitter.com/0x5kylar",
    github: "https://github.com/curdinc/skylar-email",
  },
} as const;

export const marketingConfig: {
  mainNav: MainNavItemType[];
} = {
  mainNav: [
    {
      title: "Why Skylar?",
      href: "/#why-skylar",
    },
  ],
};

export const dashboardConfig: {
  mainNav: MainNavItemType[];
} = {
  mainNav: [
    {
      title: "Screen",
      href: "/screen",
    },
    {
      title: "Important",
      href: "/inbox",
    },
    {
      title: "Readings",
      href: "/readings",
    },
    {
      title: "Receipts",
      href: "/receipts",
    },
  ],
};

export const UNAUTHENTICATED_ROUTES = ["/", "/login", "/login/post-auth"];

export const stripeConfig: StripeElementsOptions = {
  mode: "subscription",
  amount: 0,
  currency: "usd",
  appearance: {},
} as const;

export const GMAIL_SCOPES =
  "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/contacts" as const;
