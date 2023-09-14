import { TRPCError } from "@trpc/server";

import {
  applyInviteCode,
  getInviteCodeByInviteCode,
  getInviteCodeUsedByUser,
} from "@skylar/db";
import { AlphaCodeCheckerSchema, validatorTrpcWrapper } from "@skylar/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const onboardingRouter = createTRPCRouter({
  applyAlphaCode: protectedProcedure
    .input(validatorTrpcWrapper(AlphaCodeCheckerSchema))
    .mutation(
      async ({
        ctx: {
          logger,
          db,
          session: { user },
        },
        input,
      }) => {
        const inviteCode = await getInviteCodeByInviteCode({
          db,
          inviteCodeToFind: input.alphaCode,
        });
        const userInviteCode = await getInviteCodeUsedByUser({
          db,
          userObj: user,
        });

        if (!inviteCode) {
          logger.debug(`User code ${input.alphaCode} is not valid`);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid code. Please try again." as const,
          });
        }

        if (inviteCode.usedByUserId) {
          logger.debug(
            `inviteCode ${inviteCode.inviteCode} has already been used by ${inviteCode.usedByUserId}`,
          );
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Code already used. Please use another code." as const,
          });
        }
        if (userInviteCode) {
          logger.debug(
            `User ${user.providerId} already has used code ${userInviteCode} to activate account`,
          );
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Account already activated. You can start using your account today!" as const,
          });
        }

        await applyInviteCode({
          db,
          inviteCodeToUse: input.alphaCode,
          usedByUserId: user.id,
        });

        return "OK" as const;
      },
    ),
  getUserOnboardStep: protectedProcedure.query(
    async ({
      ctx: {
        db,
        session: { user },
      },
    }) => {
      const inviteCode = await getInviteCodeUsedByUser({ db, userObj: user });
      if (!inviteCode) {
        return "invite-code" as const;
      }

      // email provider

      // subscription

      return "done" as const;
    },
  ),
});
