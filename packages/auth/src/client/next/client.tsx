"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { cookieOptions } from "../../constants";

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
      cookieOptions,
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
