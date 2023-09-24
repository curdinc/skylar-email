import { useCallback } from "react";

import { state$ } from "@skylar/logic";

import { api } from "~/lib/api";

export function useInviteCodePage() {
  const util = api.useContext();
  const {
    data: userCreatedInviteCodes,
    isLoading: isLoadingUserCreatedInviteCodes,
    error: errorUserCreatedInviteCodes,
  } = api.inviteCode.getInviteCodes.useQuery(undefined);

  const inviteCodeIdBeingDeleted =
    state$.INVITE_CODE.inviteCodeIdBeingDeleted.use();
  const { mutate: deleteInviteCodeBase, isLoading: isDeletingInviteCode } =
    api.inviteCode.deleteInviteCode.useMutation({
      onSuccess: async () => {
        await util.inviteCode.getInviteCodes.invalidate();
      },
    });
  const deleteInviteCode = useCallback(
    ({ inviteCodeId }: { inviteCodeId: number }) => {
      state$.INVITE_CODE.inviteCodeIdBeingDeleted.set(inviteCodeId);
      deleteInviteCodeBase({ inviteCodeId });
    },
    [deleteInviteCodeBase],
  );

  const { mutate: generateNewInviteCode, isLoading: isGeneratingNewCode } =
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
