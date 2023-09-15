import { TRPCError } from "@trpc/server";

import { getUserByProviderId, insertNewUser } from "@skylar/db";
import { parse, UserSchema } from "@skylar/parsers-and-types";

import { createMiddleware } from "../trpc/factory";

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
export const enforceUserIsAuthed = createMiddleware(
  async ({ ctx: { session, db }, next }) => {
    if (!session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const { user } = session;
    // TODO: Add caching for this and trim the return response
    let skylarUser = await getUserByProviderId({
      db,
      providerId: user.providerId,
    });
    if (!skylarUser) {
      // create new user
      await insertNewUser({
        db,
        newUser: user,
      });
      skylarUser = await getUserByProviderId({
        db,
        providerId: user.providerId,
      });
    }

    if (!skylarUser) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found.",
      });
    }

    return next({
      ctx: {
        // TODO: Assign additional information here, like email provider details etc.
        session: {
          user: {
            id: skylarUser.id,
            ...parse(UserSchema, skylarUser),
          },
        },
      },
    });
  },
);
