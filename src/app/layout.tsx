import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";

import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

import "./globals.css";

export const metadata: Metadata = {
  title: "Moving On",
  description: "Track packed boxes from one home to the next.",
  applicationName: "Moving On",
  appleWebApp: {
    capable: true,
    title: "Moving On",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f6f62",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* `suppressHydrationWarning` is scoped to <body>: silences attribute
          mismatches added by browser extensions (ColorZilla, Grammarly,
          LastPass, etc.) without masking real hydration bugs deeper in the tree. */}
      <body suppressHydrationWarning>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
