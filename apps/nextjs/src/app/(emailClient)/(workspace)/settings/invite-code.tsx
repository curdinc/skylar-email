"use client";

import { CopyToClipboard } from "~/components/buttons/copy-to-clipboard";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useInviteCodePage } from "./use-invite-code-page";

export function InviteCodeForm() {
  const {
    inviteCodeIdBeingDeleted,
    deleteInviteCode,
    isDeletingInviteCode,
    generateNewInviteCode,
    isGeneratingNewCode,
    isGenerateNewCodeButtonDisabled,
    userCreatedInviteCodes,
    isLoadingUserCreatedInviteCodes,
    errorUserCreatedInviteCodes,
  } = useInviteCodePage();

  if (isLoadingUserCreatedInviteCodes) {
    return <div>Loading...</div>;
  }

  if (errorUserCreatedInviteCodes) {
    return <div>Error: {errorUserCreatedInviteCodes.message}</div>;
  }

  let InviteCodeBody = (
    <div className="flex w-full justify-center">
      Create a code to get started
    </div>
  );
  if (userCreatedInviteCodes?.length) {
    InviteCodeBody = (
      <div className="grid gap-6">
        {userCreatedInviteCodes?.map((inviteCode) => {
          let usedBy = "Active";
          if (inviteCode.usedBy) {
            usedBy = `Used by ${inviteCode.usedByUser?.email ?? "Unknown"}`;
          }

          return (
            <div
              key={inviteCode.inviteCode}
              className="flex items-center justify-between"
            >
              <div className="grid w-full gap-1">
                <div className="flex flex-wrap items-center space-x-2">
                  <p className="max-w-[160px] truncate font-semibold md:max-w-md">
                    {inviteCode.inviteCode}
                  </p>
                  <CopyToClipboard
                    valueToCopy={inviteCode.inviteCode}
                    className="h-5 w-5"
                  />
                </div>
                <p className="max-w-[160px] truncate text-sm text-muted-foreground md:max-w-md">
                  {usedBy}
                </p>
              </div>
              {!inviteCode.usedBy && (
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="text-destructive hover:text-destructive/80"
                  onClick={() =>
                    deleteInviteCode({ inviteCodeId: inviteCode.inviteCodeId })
                  }
                  disabled={
                    isDeletingInviteCode &&
                    inviteCodeIdBeingDeleted === inviteCode.inviteCodeId
                  }
                >
                  <Icons.trash />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="grid gap-3 md:flex md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Invite codes used: {userCreatedInviteCodes?.length} / 10
          </div>
          <Button
            variant="secondary"
            className="shrink-0"
            disabled={isGenerateNewCodeButtonDisabled}
            isLoading={isGeneratingNewCode}
            onClick={() => generateNewInviteCode()}
          >
            Generate Invite Code
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-6">
          <h4 className="text-sm font-medium">Existing Invite Codes</h4>
          {InviteCodeBody}
        </div>
      </CardContent>
    </Card>
  );
}
