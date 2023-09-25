"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useEmailSyncInfo } from "@skylar/client-db";
import { state$, useActiveEmailClientDb } from "@skylar/logic";

import { api } from "~/lib/api";

export const ClientLayout = () => {
  const activeClientDb = useActiveEmailClientDb();
  const router = useRouter();
  const { data: emailProviders, isLoading: isLoadingEmailProviders } =
    api.emailProvider.getAll.useQuery();

  const { emailSyncInfo, isLoading: isLoadingEmailSyncInfo } = useEmailSyncInfo(
    { db: activeClientDb },
  );

  useEffect(() => {
    if (isLoadingEmailProviders) {
      return;
    } else if (emailProviders) {
      state$.EMAIL_CLIENT.emailProviders.set(emailProviders);
      state$.EMAIL_CLIENT.initializeClientDbs();
    }
  }, [emailProviders, isLoadingEmailProviders]);

  useEffect(() => {
    if (!isLoadingEmailSyncInfo && !emailSyncInfo) {
      router.push("/onboarding/sync");
    }
  });

  return <></>;
};
