import { trpcServer } from "@hono/trpc-server";
import type { Context } from "hono";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

import { appRouter, createTRPCContext } from "@skylar/api";
import { getDb } from "@skylar/db";
import { getServerLogger } from "@skylar/logger";
import { BackendEnvSchema, formatValidatorError, parse } from "@skylar/schema";

type Bindings = {
  JWT_SECRET: string;
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

app.options("/trpc/*", (c) => {
  const response = c.newResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Request-Method", "*");
  response.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
});

app.use("/trpc/*", async (c, next) => {
  const envVars = getEnvVars(c);
  return await cors({
    origin: [envVars.APP_URL],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })(c, next);
});

app.use("/trpc/*", async (c, next) => {
  const envVars = getEnvVars(c);
  console.log(JSON.stringify(c.req.headers.get("Content-Type"), null, 2));

  const db = getDb(envVars.DATABASE_URL);
  const logger = getServerLogger({
    req: c.req.raw,
    token: envVars.AXIOM_TOKEN,
    dataset: envVars.AXIOM_DATASET,
    orgId: envVars.AXIOM_ORG_ID,
    url: envVars.AXIOM_URL,
  });
  // console.log("await c.req.raw.text()", await c.req.raw.text());

  const response = await trpcServer({
    router: appRouter,
    endpoint: "/trpc",
    onError({ error, path }) {
      console.error(
        `>>> tRPC Error on '${path}'`,
        error,
        JSON.stringify(formatValidatorError(error.cause), null, 2),
      );
    },
    createContext: () => {
      // console.log(
      //   "trpc_context_req",
      //   JSON.stringify(await req.json(), null, 2),
      // );
      return createTRPCContext({
        req: c.req.raw,
        env: {
          JWT_SECRET: envVars.SUPABASE_JWT_SECRET,
          GOOGLE_PROVIDER_CLIENT_ID: envVars.GOOGLE_PROVIDER_CLIENT_ID,
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

export default app;
