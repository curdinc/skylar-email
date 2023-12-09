"use client";

import { useAllEmailProviders } from "@skylar/client-db";

import "allotment/dist/style.css";

import { Icons } from "~/components/icons";
import { EmailAccountNav } from "~/components/nav/email-account-nav";

export default function EmailClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: allEmailProviders, isLoading } = useAllEmailProviders();

  const allEmailProvidersProfileInfo = (allEmailProviders ?? []).map(
    (account) => ({
      href: `${account.provider_id}`,
      title: account.email,
      imageUri: account.image_uri,
      name: account.inbox_name,
    }),
  );
  console.log("allEmailProvidersProfileInfo", allEmailProvidersProfileInfo);

  return (
    <>
      {isLoading ? (
        <Icons.spinner className="h-10 w-10 animate-spin" />
      ) : (
        <div className="flex grow">
          <EmailAccountNav
            allEmailProvidersProfileInfo={allEmailProvidersProfileInfo}
            className="p-5"
          />
          <main className=" w-full">{children}</main>
        </div>
      )}
    </>
  );
}
