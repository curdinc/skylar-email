import { useRouter } from "next/navigation";

import { api } from "~/lib/api";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { isLoading } = api.onboarding.getUserOnboardStep.useQuery(undefined, {
    onSuccess(userOnboardStep) {
      switch (userOnboardStep) {
        case "invite-code":
          router.push("/onboarding/code");
          break;
        case "card":
          router.push("/onboarding/card");
          break;
        case "done":
          router.push("/inbox");
          break;
      }
    },
  });
  return { isLoading };
};
