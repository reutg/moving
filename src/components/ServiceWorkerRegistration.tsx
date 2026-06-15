"use client";

import { useEffect } from "react";

const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Service worker registration failed:", error);
    });
  }, []);

  return null;
};

export default ServiceWorkerRegistration;
