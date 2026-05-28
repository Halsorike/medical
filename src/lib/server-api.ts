import { headers } from "next/headers";

export function getBaseUrl() {
  const requestHeaders = headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function getApiData<T>(path: string) {
  try {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { data: T };
    return payload.data;
  } catch (error) {
    console.warn(`[api] Failed to fetch ${path}`, error);
    return null;
  }
}
