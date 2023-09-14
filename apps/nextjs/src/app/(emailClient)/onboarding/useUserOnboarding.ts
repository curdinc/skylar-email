import { useRouter } from "next/navigation";

import { api } from "~/lib/api";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { isLoading } = api.onboarding.getUserOnboardStep.useQuery(undefined, {
    onSuccess(data) {
      if (data === "invite-code") {
        router.replace("/onboarding/code");
      }
      if (data === "done") {
        router.replace("/inbox");
      }
    },
    onError() {
      router.replace("/onboarding/code");
    },
  });
  return { isLoading };
};
