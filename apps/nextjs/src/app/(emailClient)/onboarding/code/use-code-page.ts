import { state$ } from "@skylar/logic";

import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { useLogger } from "~/lib/logger";
import { useUserOnboardingRouteGuard } from "../use-user-onboarding-route-guard";

export function useCodePage() {
  const logger = useLogger();
  const { toast } = useToast();
  const { isLoading: isCheckingOnboardStep } = useUserOnboardingRouteGuard();

  const code = state$.ONBOARDING.alphaCode.use();
  const utils = api.useUtils();
  const { mutate: applyCode, isPending: isSubmittingCode } =
    api.onboarding.applyAlphaCode.useMutation({
      onSuccess() {
        utils.onboarding.getUserOnboardStep.invalidate().catch((e) => {
          logger.error("Error invalidating user onboarding step", { error: e });
        });
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
