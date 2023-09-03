import { CookieAuthStorageAdapter } from "@supabase/auth-helpers-shared";
import { createClient } from "@supabase/supabase-js";
import type { Context, Env, Next } from "hono";
import { env } from "hono/adapter";
import { getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

class HonoMiddlewareAuthStorageAdapter extends CookieAuthStorageAdapter {
  c;
  constructor(c: Context<Env, "*", object>) {
    super();
    this.c = c;
  }

  protected getCookie(name: string): string | null | undefined {
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
function getSupabaseEnvVars(c: Context<Env, "*", object>) {
  const { NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL } = env<{
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  }>(c);

  if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  if (!NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  return {
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL,
  };
}
export async function honoAuthMiddleware(
  c: Context<Env, "*", object>,
  next: Next,
) {
  const { NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL } =
    getSupabaseEnvVars(c);
  const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storage: new HonoMiddlewareAuthStorageAdapter(c),
      },
    },
  );
  await supabase.auth.getSession();
  await next();
}
