import { insertNewMailingList } from "@skylar/db";
import {
  JoinMailingListSchema,
  validatorTrpcWrapper,
} from "@skylar/parsers-and-types";

import { createTRPCRouter } from "../trpc/factory";
import { publicProcedure } from "../trpc/procedures";

export const mailingListRouter = createTRPCRouter({
  joinMailingList: publicProcedure
    .input(validatorTrpcWrapper(JoinMailingListSchema))
    .mutation(async ({ ctx: { db }, input }) => {
      const mailingList = await insertNewMailingList({
        db,
        email: input.email,
      });
      return mailingList;
    }),
});
