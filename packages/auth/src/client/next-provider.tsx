"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { cookieOptions } from "../constants";

export function SupabaseAuthClientProvider({
  children,
  initialSession,
  supabaseKey,
  supabaseUrl,
}: {
  supabaseKey: string;
  supabaseUrl: string;
  initialSession: Session | null;

  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() =>
    createClientComponentClient({
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
