import jwt from "@tsndr/cloudflare-worker-jwt";

import type { Session } from "../types/session";
import type { User } from "../types/user";

export async function getSession(
  authHeader?: string,
  JWT_SECRET?: string,
): Promise<Session | undefined> {
  const user = await getUser(authHeader, JWT_SECRET);
  return { user };
}

export async function getUser(
  authHeader?: string,
  JWT_SECRET?: string,
): Promise<User | undefined> {
  const sessionToken = authHeader?.split(" ")[1];

  if (sessionToken) {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return;
    }

    try {
      const authorized = await jwt.verify(sessionToken, JWT_SECRET, {
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
      console.log("decodedToken", decodedToken);

      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  return;
}
