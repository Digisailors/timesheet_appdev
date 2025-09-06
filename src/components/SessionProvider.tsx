/* eslint-disable */
"use client"

import { SessionProvider as NextAuthSessionProvider, useSession, signOut } from "next-auth/react"
import { ReactNode, useEffect } from "react"

declare global {
  interface Window {
    __wrappedForAuth__?: boolean;
  }
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <SessionExpiryWatcher>
        {children}
      </SessionExpiryWatcher>
    </NextAuthSessionProvider>
  )
}

function SessionExpiryWatcher({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    // Global client-side fetch interceptor for auth errors
    if (typeof window === "undefined") return;
    const originalFetch = window.fetch;
    if (!window.__wrappedForAuth__) {
      const wrapped = async (input: RequestInfo | URL, init?: RequestInit) => {
        const response = await originalFetch(input as any, init as any);
        try {
          if (response.status === 401 || response.status === 403) {
            signOut({ callbackUrl: "/login" });
            return response;
          }
          // Attempt to read a cloned response as JSON to detect token errors when backend returns 200
          const clone = response.clone();
          const contentType = clone.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const body = await clone.json().catch(() => undefined);
            const message = typeof body?.message === "string" ? body.message.toLowerCase() : "";
            if (message.includes("token is invalid") || message.includes("token expired") || message.includes("invalid token")) {
              signOut({ callbackUrl: "/login" });
            }
          } else if (contentType.includes("text/")) {
            const text = await clone.text().catch(() => "");
            const lower = text.toLowerCase();
            if (lower.includes("token is invalid") || lower.includes("token expired") || lower.includes("invalid token")) {
              signOut({ callbackUrl: "/login" });
            }
          }
        } catch (_) {
          // ignore parsing errors
        }
        return response;
      };
      window.__wrappedForAuth__ = true;
      window.fetch = wrapped as any;
    }
  }, []);

  useEffect(() => {
    // Also sign out immediately when the page becomes visible and token is expired
    const handleVisibility = () => {
      const exp = (session as any)?.accessTokenExpires as number | undefined;
      if (exp && Date.now() > exp) {
        signOut({ callbackUrl: "/login" });
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [session?.accessTokenExpires]);

  useEffect(() => {
    if (!session?.accessTokenExpires) return;
    const now = Date.now();
    const expireAt = session.accessTokenExpires as number;
    const msUntilExpiry = Math.max(0, expireAt - now);
    if (msUntilExpiry === 0) {
      signOut({ callbackUrl: "/login" });
      return;
    }
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [session?.accessTokenExpires]);

  return <>{children}</>;
}
