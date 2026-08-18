import { useEffect, type ReactNode } from "react";
import { useMe } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/api/client";

/**
 * Bootstraps the session: when a persisted token exists, fetches /auth/me to
 * refresh the user; clears the store ONLY if the token is explicitly invalid/expired (401).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const { data, error, isError } = useMe();

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    // Only log out if the backend explicitly returned a 401 Unauthorized status
    if (token && isError && error instanceof ApiError && error.status === 401) {
      clear();
    }
  }, [token, isError, error, clear]);

  return <>{children}</>;
}
