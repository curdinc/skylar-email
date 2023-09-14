import type { Session } from "@skylar/auth";
import { getSession } from "@skylar/auth";
import type { DbType } from "@skylar/db";
import type { Logger } from "@skylar/logger";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
type CreateContextOptions = {
  session?: Session;
  env: { JWT_SECRET: string };
  logger: Logger;
  db: DbType;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    env: opts.env,
    db: opts.db,
    logger: opts.logger,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async ({
  req,
  env,
  logger,
  db,
}: {
  req: Request;
  logger: Logger;
  env: CreateContextOptions["env"];
  db: DbType;
}) => {
  const authHeader = req?.headers.get("Authorization") ?? undefined;
  const session = await getSession({
    JWT_SECRET: env.JWT_SECRET,
    authHeader,
  });
  const source = req?.headers.get("x-trpc-source") ?? "unknown";

  logger.info(`>>> tRPC Request from ${source} by ${session?.user?.name}`);

  return createInnerTRPCContext({
    logger,
    session,
    env,
    db,
  });
};
