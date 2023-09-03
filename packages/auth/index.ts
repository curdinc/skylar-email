export {
  useSignInWithDiscord,
  useSignInWithGithub,
  useUser,
} from "./src/client/hooks";
export { AuthProvider } from "./src/client/next";
export { getSession } from "./src/server";
export { honoAuthMiddleware } from "./src/server/hono";
export type { Session } from "./src/types/session";
export type { User } from "./src/types/user";
