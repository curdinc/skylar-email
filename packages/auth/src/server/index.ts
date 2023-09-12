import jwt from "@tsndr/cloudflare-worker-jwt";

import type { UserType } from "@skylar/schema";
import { AuthCookieSchema, parse, SupabaseUserSchema } from "@skylar/schema";

import { mapSupabaseUserToUser } from "../helper";
import type { Session } from "../types/session";

export async function getSession({
  JWT_SECRET,
  authHeader,
}: {
  JWT_SECRET: string;
  authHeader?: string;
}): Promise<Session | undefined> {
  const user = await getUser({ JWT_SECRET, authHeader });
  
  return { user };
}

export async function getUser({
  JWT_SECRET,
  authHeader,
}: {
  JWT_SECRET: string;
  authHeader?: string;
}): Promise<UserType | undefined> {
  const sessionToken = authHeader?.split(" ")[1];

  if (sessionToken) {
    const jwtCookie =
      parse(AuthCookieSchema, JSON.parse(sessionToken))[0] ?? "";
    const authorized = await jwt.verify(jwtCookie, JWT_SECRET, {
      algorithm: "HS256",
    });
    if (!authorized) {
      return;
    }

    const decodedToken = jwt.decode(sessionToken);

    // Check if token is expired
    const expirationTimestamp = decodedToken.payload.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (!expirationTimestamp || expirationTimestamp < currentTimestamp) {
      return;
    }

    const supabaseUser = parse(SupabaseUserSchema, decodedToken.payload);
    return mapSupabaseUserToUser(supabaseUser);
  }
}
