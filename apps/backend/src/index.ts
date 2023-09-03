import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "@skylar/api";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Bindings = {
  APP_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/trpc/*", async (c, next) => {
  return await cors({
    origin: [c.env.APP_URL],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })(c, next);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

export default app;
