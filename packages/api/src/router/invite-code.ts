import { TRPCError } from "@trpc/server";

import {
  createInviteCode,
  deleteInviteCode,
  getUserInviteCodes,
} from "@skylar/db";
import {
  DeleteInviteCodeSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { publicProcedure } from "../trpc/procedures";

export const inviteCodeRouter = createTRPCRouter({
  getInviteCodes: publicProcedure.query(
    async ({
      ctx: {
        db,
        session: { user },
      },
    }) => {
      const inviteCodes = await getUserInviteCodes({
        db,
        userObj: user,
      });
      return inviteCodes ?? [];
    },
  ),
  generateNewInviteCode: publicProcedure.mutation(
    async ({
      ctx: {
        db,
        session: { user },
      },
    }) => {
      const inviteCode = `skylar_alpha_${
        Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2)
      }`;

      const inviteCodes = await getUserInviteCodes({
        db,
        userObj: user,
      });
      if ((inviteCodes?.length ?? 0) > 10) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You can only have 10 invite codes at a time. Please delete any active ones before creating a new one.",
        });
      }

      return createInviteCode({
        db,
        userId: user.userId,
        inviteCode,
      });
    },
  ),
  deleteInviteCode: publicProcedure
    .input(validatorTrpcWrapper(DeleteInviteCodeSchema))
    .mutation(async ({ ctx: { db }, input: { inviteCodeId } }) => {
      await deleteInviteCode({
        db,
        inviteCodeId,
      });
    }),
});
