import jwt from "@tsndr/cloudflare-worker-jwt";

import type { Session } from "../types/session";
import type { User } from "../types/user";

export async function getSession(
  authHeader?: string,
  JWT_VERIFICATION_KEY?: string,
): Promise<Session | undefined> {
  const user = await getUser(authHeader, JWT_VERIFICATION_KEY);
  return { user };
}

async function getUser(
  authHeader?: string,
  JWT_VERIFICATION_KEY?: string,
): Promise<User | undefined> {
  const sessionToken = authHeader?.split(" ")[1];

  if (sessionToken) {
    if (!JWT_VERIFICATION_KEY) {
      console.error("JWT_VERIFICATION_KEY is not set");
      return;
    }

    try {
      const authorized = await jwt.verify(sessionToken, JWT_VERIFICATION_KEY, {
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
