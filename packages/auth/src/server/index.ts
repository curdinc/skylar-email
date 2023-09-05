import jwt from "@tsndr/cloudflare-worker-jwt";

import { AuthCookieSchema, parse, SupabaseUserSchema } from "@skylar/schema";

import type { Session } from "../types/session";
import type { User } from "../types/user";

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
}): Promise<User | undefined> {
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
    return {
      name:
        supabaseUser.user_metadata.full_name ??
        supabaseUser.user_metadata.name ??
        supabaseUser.user_metadata.preferred_username ??
        supabaseUser.user_metadata.user_name ??
        supabaseUser.user_metadata.nickname ??
        "",
      imageUri:
        supabaseUser.user_metadata.picture ??
        supabaseUser.user_metadata.avatar_url ??
        "",
      email: supabaseUser.email ?? supabaseUser.user_metadata.email,
      phone: supabaseUser.phone,
      providers: supabaseUser.app_metadata.providers,
      providerId: supabaseUser.user_metadata.sub,
    };
  }

  return;
}
