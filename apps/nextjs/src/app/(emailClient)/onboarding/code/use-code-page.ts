import { useRouter } from "next/navigation";

import { state$ } from "@skylar/logic";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";

export function useCodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useContext();
  const { isLoading: isCheckingOnboardStep } = useUserOnboardingRouteGuard();

  const code = state$.ONBOARDING.alphaCode.use();
  const { mutate: applyCode, isLoading: isSubmittingCode } =
    api.onboarding.applyAlphaCode.useMutation({
      async onSuccess() {
        await utils.onboarding.invalidate();
        router.push(`/onboarding/connect`);
      },
      onError(error) {
        toast({
          title: "Something went wrong.",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const onSubmitCode = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    applyCode({ alphaCode: code });
  };

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    state$.ONBOARDING.alphaCode.set(e.target.value);
  };

  return {
    onSubmitCode,
    isSubmittingCode,
    isCheckingOnboardStep,
    onCodeChange,
    code,
  };
}