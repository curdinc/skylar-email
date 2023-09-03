import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {},
  client: {},

  runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
