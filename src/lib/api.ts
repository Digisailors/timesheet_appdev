import { getSession, signOut } from "next-auth/react";

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
  if (response.status === 401) {
    // If backend says unauthorized, trigger logout
    await signOut({ callbackUrl: "/login" });
    return Promise.reject(new Error("Unauthorized"));
  }
  const data = await response.json();
  return data;
};
