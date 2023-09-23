import { useRouter } from "next/navigation";

import { api } from "~/lib/api";

export const useUserOnboardingRouteGuard = () => {
  const router = useRouter();

  const { data: userOnboardStep, isLoading } =
    api.onboarding.getUserOnboardStep.useQuery(undefined);

  if (!isLoading) {
    switch (userOnboardStep) {
      case "invite-code": {
        router.push("/onboarding/code");
        break;
      }
      case "email-provider": {
        {
          router.push("/onboarding/connect");
          break;
        }
      }
      case "card": {
        router.push("/onboarding/card");
        break;
      }
      case "done": {
        router.push("/inbox");
        break;
      }
    }
  }
  return { isLoading };
};
