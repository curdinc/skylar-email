import type { MainNavItemType } from "~/types/main-nav";

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
      title: "Features",
      href: "/#features",
    },
  ],
};

export const dashboardConfig: {
  mainNav: MainNavItemType[];
} = {
  mainNav: [
    {
      title: "Review",
      href: "review",
    },
    {
      title: "Important",
      href: "important",
    },
    {
      title: "Readings",
      href: "readings",
    },
    {
      title: "Receipts",
      href: "receipts",
    },
  ],
};
