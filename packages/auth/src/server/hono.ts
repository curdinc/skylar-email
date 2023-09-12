import { CookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
import { createClient } from "@supabase/supabase-js";
import type { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

import type { SupabaseUserType, UserType } from "@skylar/schema";
import { parse, SupabaseUserSchema } from "@skylar/schema";

import { mapSupabaseUserToUser } from "../helper";

class HonoMiddlewareAuthStorageAdapter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Context<any, "*", object>,
> extends CookieAuthStorageAdapter {
  c;
  constructor(c: T) {
    super();
    this.c = c;
  }

  protected getCookie(name: string): string | null | undefined {
    if (name.includes("sb") && name.includes("auth-token")) {
      const authHeader = this.c.req.headers.get("Authorization");
      return authHeader?.replace("Bearer ", "");
    }
    return getCookie(this.c, name);
  }
  protected setCookie(name: string, value: string): void {
    this._setCookie(name, value);
  }
  protected deleteCookie(name: string): void {
    this._setCookie(name, "", {
      maxAge: 0,
    });
  }

  private _setCookie(name: string, value: string, options?: CookieOptions) {
    setCookie(this.c, name, value, {
      ...options,
      // Allow supabase-js on the client to read the cookie as well
      httpOnly: false,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function honoAuthMiddleware<T extends Context<any, "*", object>>({
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  onNewUser,
}: {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  onNewUser?: (
    user: UserType,
  ) => Promise<Partial<SupabaseUserType["user_metadata"]> | undefined>;
}) {
  return async (c: T, next: Next) => {
    const storage = new HonoMiddlewareAuthStorageAdapter(c);
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage,
      },
    });
    const session = await supabase.auth.getSession();
    if (session.data.session?.user) {
      const supabaseUser = parse(SupabaseUserSchema, session.data.session.user);
      const user = mapSupabaseUserToUser(supabaseUser);
      if (!user.id) {
        const userProperties = await onNewUser?.(user);
        await supabase.auth.updateUser({
          data: { ...userProperties },
        });
        await supabase.auth.refreshSession();
      }
    }

    return await next();
  };
}
