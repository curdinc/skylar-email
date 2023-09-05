export {
  useSignInWithDiscord,
  useSignInWithFacebook,
  useSignInWithGithub,
  useSignOut,
  useUser,
} from "./src/client/hooks";
export { NextAuthProvider } from "./src/client/next/server";
export { getSession } from "./src/server";
export { honoAuthMiddleware } from "./src/server/hono";
export type { Session } from "./src/types/session";
export type { User } from "./src/types/user";
