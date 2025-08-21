import { getSession } from "next-auth/react";

export const fetchProtectedData = async (url: string, options?: RequestInit) => {
  const session = await getSession();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};
