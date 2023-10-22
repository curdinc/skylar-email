import { useCallback } from "react";

import { setInviteCodeIdBeingDeleted, useGlobalStore } from "@skylar/logic";

import { api } from "~/lib/api";

export function useInviteCodePage() {
  const util = api.useUtils();
  const {
    data: userCreatedInviteCodes,
    isLoading: isLoadingUserCreatedInviteCodes,
    error: errorUserCreatedInviteCodes,
  } = api.inviteCode.getInviteCodes.useQuery(undefined);
  const inviteCodeIdBeingDeleted = useGlobalStore(
    (state) => state.SETTINGS.INVITE_CODE.inviteCodeIdBeingDeleted,
  );

  const { mutate: deleteInviteCodeBase, isPending: isDeletingInviteCode } =
    api.inviteCode.deleteInviteCode.useMutation({
      onSuccess: async () => {
        await util.inviteCode.getInviteCodes.invalidate();
      },
    });
  const deleteInviteCode = useCallback(
    ({ inviteCodeId }: { inviteCodeId: number }) => {
      setInviteCodeIdBeingDeleted(inviteCodeId);
      deleteInviteCodeBase({ inviteCodeId });
    },
    [deleteInviteCodeBase],
  );

  const { mutate: generateNewInviteCode, isPending: isGeneratingNewCode } =
    api.inviteCode.generateNewInviteCode.useMutation({
      onSuccess: async () => {
        await util.inviteCode.getInviteCodes.invalidate();
      },
    });
  const isGenerateNewCodeButtonDisabled =
    !isLoadingUserCreatedInviteCodes && userCreatedInviteCodes?.length === 10;

  return {
    userCreatedInviteCodes,
    isLoadingUserCreatedInviteCodes,
    errorUserCreatedInviteCodes,
    inviteCodeIdBeingDeleted,
    deleteInviteCode,
    isDeletingInviteCode,
    generateNewInviteCode,
    isGeneratingNewCode,
    isGenerateNewCodeButtonDisabled,
  };
}
