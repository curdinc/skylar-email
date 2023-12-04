import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import { PATHNAME_HEADER, QUERY_HEADER } from "../constants";

export async function NextAuthMiddleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set(PATHNAME_HEADER, req.nextUrl.pathname);
  requestHeaders.set(QUERY_HEADER, req.nextUrl.search);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  return res;
}
