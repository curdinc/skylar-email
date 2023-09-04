import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import { SupabaseAuthClientProvider } from "./client";

export async function NextAuthProvider({
  children,
  supabaseKey,
  supabaseUrl,
}: {
  children: React.ReactNode;
  supabaseKey: string;
  supabaseUrl: string;
}) {
  const supabase = createRouteHandlerClient({ cookies });
  const session = await supabase.auth.getSession();

  return (
    <SupabaseAuthClientProvider
      initialSession={session.data.session}
      supabaseKey={supabaseKey}
      supabaseUrl={supabaseUrl}
    >
      {children}
    </SupabaseAuthClientProvider>
  );
}
