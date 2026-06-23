const DEFAULT_APP_BASE_URL = "http://localhost:3000";

const normalizeBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/$/, "");

export const getAppBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return DEFAULT_APP_BASE_URL;
};

export const appUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
};
