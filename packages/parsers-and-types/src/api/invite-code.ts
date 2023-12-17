import { number, object } from "valibot";

export const DeleteInviteCodeSchema = object({
  inviteCodeId: number(),
});
