import { TRPCError } from "@trpc/server";

import {
  applyInviteCode,
  getEmailProvidersByUserId,
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
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid code. Please try again." as const,
          });
        }

        if (inviteCode.usedBy) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Code already used. Please use another code." as const,
          });
        }
        if (userInviteCode) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Account already activated. You can start using your account today!" as const,
          });
        }

        await applyInviteCode({
          db,
          inviteCodeToUse: input.alphaCode,
          usedByUserId: user.userId,
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
      const emailProviders = await getEmailProvidersByUserId({
        db,
        userId: user.userId,
      });
      if (!emailProviders.length) {
        return "email-provider" as const;
      }

      // subscription
      const stripeCustomer = await getStripeCustomerByUserId({
        db,
        userId: user.userId,
      });
      if (!stripeCustomer?.paymentMethodAddedAt) {
        return "card" as const;
      }

      return "done" as const;
    },
  ),
});
