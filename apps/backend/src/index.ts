import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

import { appRouter, createTRPCContext } from "@skylar/api";
import { getDb } from "@skylar/db";
import { getServerLogger } from "@skylar/logger";
import { BackendEnvSchema, parse } from "@skylar/schema";

type Bindings = {
  APP_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/trpc/*", async (c, next) => {
  const envVars = parse(BackendEnvSchema, env(c));

  return await cors({
    origin: [envVars.APP_URL],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })(c, next);
});

app.options("/trpc/*", (c) => {
  const response = c.newResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Request-Method", "*");
  response.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
});

app.use("/trpc/*", async (c, next) => {
  const envVars = parse(BackendEnvSchema, env(c));
  const db = getDb(envVars.DATABASE_URL);
  const logger = getServerLogger({
    req: c.req.raw,
    token: envVars.AXIOM_TOKEN,
    dataset: envVars.AXIOM_DATASET,
  });

  await trpcServer({
    router: appRouter,
    endpoint: "/trpc",
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
    createContext: ({ req }) =>
      createTRPCContext({
        req,
        env: { JWT_SECRET: envVars.SUPABASE_JWT_SECRET },
        db,
        logger,
      }),
  })(c, next);

  await logger.flush();
});

export default app;
