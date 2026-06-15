import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";

import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

import "./globals.css";

export const metadata: Metadata = {
  title: "GetMoving",
  description: "Track packed boxes from one home to the next.",
  applicationName: "GetMoving",
  appleWebApp: {
    capable: true,
    title: "GetMoving",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
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
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
