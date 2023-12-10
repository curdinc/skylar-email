import { Inter, Montserrat } from "next/font/google";

import "~/styles/globals.css";

import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { AxiomWebVitals } from "next-axiom";

import { PostHogPageview } from "~/components/analytics/posthog-pageview";
import { Toaster } from "~/components/ui/toaster";
import { env } from "~/env";
import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/ui";
import { ClientProvider } from "./providers";

export const dynamic = "force-dynamic";

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
          "min-h-screen scroll-smooth bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <Suspense>
          <PostHogPageview />
        </Suspense>
        <AxiomWebVitals />
        <ClientProvider
          cookies={cookies().getAll()}
          headers={headers()}
          googleProviderClientId={env.NEXT_PUBLIC_GOOGLE_PROVIDER_CLIENT_ID}
        >
          {children}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}
