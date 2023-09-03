import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { headers } from "next/headers";
import { AxiomWebVitals } from "next-axiom";

import { AuthProvider } from "@skylar/auth";

import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Skylar",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Skylar",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AxiomWebVitals />
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <AuthProvider>
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
