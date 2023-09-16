import { TRPCError } from "@trpc/server";

import {
  applyInviteCode,
  getInviteCodeByInviteCode,
  getInviteCodeUsedByUser,
  getStripeCustomerByUserId,
} from "@skylar/db";
import {
  AlphaCodeCheckerSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { protectedProcedure } from "../trpc/procedures";

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

        if (inviteCode.used_by) {
          logger.debug(
            `inviteCode ${inviteCode.invite_code} has already been used by ${inviteCode.used_by}`,
          );
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Code already used. Please use another code." as const,
          });
        }
        if (userInviteCode) {
          logger.debug(
            `User ${user.providerId} already has used code to activate account`, //  FIXME: ${}userInviteCode
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
          usedByUserId: parseInt(user.id),
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
      const stripeCustomer = await getStripeCustomerByUserId({
        db,
        userId: parseInt(user.id),
      });
      if (!stripeCustomer?.payment_method_added_at) {
        return "card" as const;
      }

      return "done" as const;
    },
  ),
});
