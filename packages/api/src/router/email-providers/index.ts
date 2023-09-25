import { getEmailProvidersByUserId } from "@skylar/db";

import { createTRPCRouter } from "../../trpc/factory";
import { protectedProcedure } from "../../trpc/procedures";

export const emailProviderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(
    async ({
      ctx: {
        db,
        session: { user },
      },
    }) => {
      const emailProviders = await getEmailProvidersByUserId({
        db,
        userId: user.userId,
      });

      return emailProviders;
    },
  ),
});
