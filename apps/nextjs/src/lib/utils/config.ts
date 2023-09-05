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
  mainNav: { title: string; href: string; disabled?: boolean }[];
} = {
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
  ],
};
