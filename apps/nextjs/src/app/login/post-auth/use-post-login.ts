import { useRouter, useSearchParams } from "next/navigation";

import { api } from "~/lib/api";

export const usePostLogin = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectToPath = searchParams.get("redirectTo") ?? "/inbox";

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
        router.push(redirectToPath);
        break;
      }
    }
  }
  return { isLoading };
};
