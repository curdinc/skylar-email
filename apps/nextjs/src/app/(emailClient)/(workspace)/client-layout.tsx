"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { state$ } from "@skylar/logic";

import { api } from "~/lib/api";

export const ClientLayout = () => {
  const activeClientDbName = state$.EMAIL_CLIENT.activeClientDbName.use();
  const router = useRouter();
  const { data: emailProvider, isLoading: isLoadingEmailProvider } =
    api.me.getActiveEmailProvider.useQuery(undefined);

  useEffect(() => {
    if (isLoadingEmailProvider || activeClientDbName) return;
    if (!activeClientDbName && !emailProvider) {
      router.push("/onboarding/code");
    }
    if (!activeClientDbName && emailProvider) {
      state$.EMAIL_CLIENT.activeClientDbName.set(emailProvider.email);
    }
  }, [activeClientDbName, emailProvider, isLoadingEmailProvider, router]);

  return <></>;
};
