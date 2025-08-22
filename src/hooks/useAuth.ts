/* eslint-disable */
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      const expiry = (session as any)?.accessTokenExpires as number | undefined;
      if (expiry && Date.now() > expiry) {
        signOut({ callbackUrl: "/login" });
      }
    }
  }, [status, session, router]);

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    session,
  };
}
