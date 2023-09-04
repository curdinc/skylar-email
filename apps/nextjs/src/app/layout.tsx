import { Inter, Montserrat } from "next/font/google";

import "~/styles/globals.css";

import { headers } from "next/headers";
import { AxiomWebVitals } from "next-axiom";

import { NextAuthProvider } from "@skylar/auth";

import { env } from "~/env";
import { siteConfig } from "~/lib/utils/config";
import { cn } from "~/lib/utils/ui";
import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const fontHeading = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "email manager",
    "email client",
    "inbox manager",
    "inbox zero",
    "superhuman",
    "hey",
    "gmail",
    "outlook",
    "yahoo",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          "bg-background min-h-screen scroll-smooth font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <AxiomWebVitals />
        <NextAuthProvider
          supabaseKey={env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
          supabaseUrl={env.NEXT_PUBLIC_SUPABASE_URL}
        >
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
