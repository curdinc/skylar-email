import Link from "next/link";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/lib/config";
import { MailingListForm } from "./mailing-list-form";

export const runtime = "edge";

const whySkylarList = [
  {
    title: "Perfect timing, everytime.",
    description: "Easily snooze, set reminders, and schedule emails.",
    icon: Icons.calendarClock,
  },
  {
    title: "Best-in-class search.",
    description:
      "Search across multiple inboxes. Search by labels, senders, regex, and more.",
    icon: Icons.search,
  },
  {
    title: "Your emails, your way.",
    description:
      "Shortcut first? Custom themes? Design your perfect inbox experience.",
    icon: Icons.palette,
  },
  {
    title: "Works with [Your App].",
    description:
      "Stay in the flow and easily integrated with your favorite applications via plugins.",
    icon: Icons.app,
  },
  {
    title: "Privacy first.",
    description:
      "Proxy image content, block tracking pixels, block remote content, and more.",
    icon: Icons.privacy,
  },
  {
    title: "Inbox management.",
    description:
      "Easily add filters, move all emails from a sender, create sub-inboxes, and more.",
    icon: Icons.inbox,
  },
];

export default function IndexPage() {
  return (
    <>
      <section className=" space-y-6 pb-8 pt-6 md:pb-12 md:pt-5 lg:py-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Emails,
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              {" "}
              how you want it.
            </span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Skylar is your extensible and customizable email manager. Do real
            work, not email.
          </p>
          <MailingListForm />
        </div>
      </section>

      <section
        id="why-skylar"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold  sm:text-4xl md:text-5xl">
            Why Skylar
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Skylar is built to give you all the tools needed to spend less time
            in your inbox.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {whySkylarList.map((item) => {
            return (
              <div
                key={item.title}
                className="flex h-[195px] flex-col justify-between overflow-hidden rounded-lg border bg-background p-6"
              >
                <item.icon className="h-12 w-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg">
            Skylar is built to empower you to take control and save time.
          </p>
        </div>
      </section>

      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl md:text-4xl">
            Stop feeling overwhelmed by your inbox.
          </h2>
          <MailingListForm />
        </div>
      </section>
    </>
  );
}
