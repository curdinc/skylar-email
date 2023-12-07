"use client";

import "allotment/dist/style.css";

import { Icons } from "~/components/icons";
import { EmailAccountNav } from "~/components/nav/email-account-nav";
import { useGetProviders } from "~/lib/provider/use-get-providers";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: emailAccounts, isLoading } = useGetProviders();

  return (
    <>
      {isLoading ? (
        <Icons.spinner className="h-10 w-10 animate-spin" />
      ) : (
        <div className="flex grow">
          <EmailAccountNav
            items={(emailAccounts ?? []).map((account) => ({
              href: `${account.provider_id}`,
              title: account.email,
            }))}
            className="p-5"
          />
          <main className=" w-full">{children}</main>
        </div>
      )}
    </>
  );
}
