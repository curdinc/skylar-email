import { createInviteCode, deleteInviteCode } from "@skylar/db";
import {
  DeleteInviteCodeSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { publicProcedure } from "../trpc/procedures";

export const inviteCodeRouter = createTRPCRouter({
  getInviteCodes: publicProcedure.query(() => {
    // TODO: Implement this

    return [];
  }),
  generateNewInviteCode: publicProcedure.mutation(async ({ ctx: { db } }) => {
    const inviteCode = `skylar_alpha_${
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2)
    }`;
    // TODO: Implement this

    // const inviteCodes = await getUserInviteCodes({
    //   db,
    //   userObj: user,
    // });
    // if ((inviteCodes?.length ?? 0) > 10) {
    //   throw new TRPCError({
    //     code: "BAD_REQUEST",
    //     message:
    //       "You can only have 10 invite codes at a time. Please delete any active ones before creating a new one.",
    //   });
    // }

    return createInviteCode({
      db,
      inviteCode,
    });
  }),
  deleteInviteCode: publicProcedure
    .input(validatorTrpcWrapper(DeleteInviteCodeSchema))
    .mutation(async ({ ctx: { db }, input: { inviteCodeId } }) => {
      await deleteInviteCode({
        db,
        inviteCodeId,
      });
    }),
});
