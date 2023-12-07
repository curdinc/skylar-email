import "allotment/dist/style.css";

import { EmailAccountNav } from "~/components/nav/email-account-nav";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // todo get email accounts
  return (
    <div className="flex grow">
      <EmailAccountNav
        items={[
          {
            href: "/0",
            title: "hansbhatia0342@gmail.com",
          },
        ]}
        className="p-5"
      />
      <main className=" w-full">{children}</main>
    </div>
  );
}
