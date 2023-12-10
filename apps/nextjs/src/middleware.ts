import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = "app.posthog.com"; // or 'eu.posthog.com'

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("host", hostname);

  const url = request.nextUrl.clone();
  url.protocol = "https";
  url.hostname = hostname;
  url.port = "443";
  url.pathname = url.pathname.replace(/^\/ingest/, "");

  requestHeaders.delete("cookie");
  const cookie = requestHeaders.get("cookie");

  if (cookie) {
    console.log("Cookies sent to posthog:", parseCookie(cookie));
  }

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  });
}

export const config = {
  matcher: "/ingest/:path*",
};

const parseCookie = (cookie: string) => {
  return cookie
    .split(";")
    .map((chunk) => chunk.trim().split("=").map(decodeURIComponent))
    .reduce((obj, [key, value]) => ({ ...obj, [key!]: value }), {});
};
