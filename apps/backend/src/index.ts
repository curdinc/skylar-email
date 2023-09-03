import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

import { appRouter, createTRPCContext } from "@skylar/api";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Bindings = {
  APP_URL: string;
  SUPABASE_JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/trpc/*", async (c, next) => {
  return await cors({
    origin: [c.env.APP_URL],
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

app.use("/trpc/*", (c, next) => {
  return trpcServer({
    router: appRouter,
    endpoint: "/trpc",
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
    createContext: ({ req }) =>
      createTRPCContext({
        req: req,
        JWT_SECRET: env(c).SUPABASE_JWT_SECRET,
      }),
  })(c, next);
});

export default app;
