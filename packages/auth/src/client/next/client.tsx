"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { DEFAULT_COOKIE_OPTIONS } from "@supabase/auth-helpers-shared";

import { AUTH_TOKEN_COOKIE_NAME } from "../../constants";

export function SupabaseAuthClientProvider({
  children,
  initialSession,
  supabaseKey,
  supabaseUrl,
}: {
  supabaseKey: string;
  supabaseUrl: string;
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: {
        ...DEFAULT_COOKIE_OPTIONS,
        name: AUTH_TOKEN_COOKIE_NAME,
        secure: true,
      },
      supabaseKey,
      supabaseUrl,
    }),
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
