import type { Context } from "hono";
import { Hono } from "hono";
import { env } from "hono/adapter";
import type { LambdaContext, LambdaEvent } from "hono/aws-lambda";
import { handle } from "hono/aws-lambda";

import { appRouter, createTRPCContext } from "@skylar/api";
import { getDb } from "@skylar/db";
import { getServerLogger } from "@skylar/logger";
import {
  BackendEnvSchema,
  formatValidatorError,
  parse,
} from "@skylar/parsers-and-types";

import { trpcServer } from "./trpc-middleware";

type Bindings = {
  JWT_SECRET: string;
  context: LambdaContext;
  event: LambdaEvent;
};

const app = new Hono<{ Bindings: Bindings }>();

function getEnvVars(
  c: Context<
    {
      Bindings: Bindings;
    },
    "*",
    object
  >,
) {
  try {
    const envVars = parse(BackendEnvSchema, env(c));
    return envVars;
  } catch (e) {
    console.log(JSON.stringify(formatValidatorError(e), null, 2));
    throw e;
  }
}

// Enable CORS
app.options("/trpc/*", (c) => {
  return c.body(null, 204);
});

app.use("/trpc/*", async (c, next) => {
  const envVars = getEnvVars(c);

  const db = getDb(envVars.DATABASE_URL);
  const logger = getServerLogger({
    req: c.req.raw,
    token: envVars.NEXT_PUBLIC_AXIOM_TOKEN,
    dataset: envVars.NEXT_PUBLIC_AXIOM_DATASET,
    orgId: envVars.AXIOM_ORG_ID,
    url: envVars.AXIOM_URL,
  });

  const response = await trpcServer({
    router: appRouter,
    endpoint: "/trpc",
    onError({ error, path }) {
      logger.error(`>>> tRPC Error on '${path}'`, { ...error });
    },
    createContext: () => {
      return createTRPCContext({
        req: c.req.raw,
        env: {
          GOOGLE_PROVIDER_CLIENT_ID:
            envVars.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID,
          GOOGLE_PROVIDER_CLIENT_SECRET: envVars.GOOGLE_PROVIDER_CLIENT_SECRET,
        },
        db,
        logger,
      });
    },
  })(c, next);

  await logger.flush();
  return response;
});

// checking for alive-ness
app.get("/", (c) => {
  return c.json({
    message: "OK",
  });
});

export const handler = handle(app);
