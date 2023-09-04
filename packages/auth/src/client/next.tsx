"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { DEFAULT_COOKIE_OPTIONS } from "@supabase/auth-helpers-shared";

import { AUTH_TOKEN_COOKIE_NAME } from "../constants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: {
        ...DEFAULT_COOKIE_OPTIONS,
        name: AUTH_TOKEN_COOKIE_NAME,
        secure: true,
      },
    }),
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
