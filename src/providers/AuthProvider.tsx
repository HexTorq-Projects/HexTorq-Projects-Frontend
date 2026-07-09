import { useEffect, type ReactNode } from "react";
import { useMe } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Bootstraps the session: when a persisted token exists, fetches /auth/me to
 * refresh the user; clears the store if the token is invalid/expired.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const { data, isError } = useMe();

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (token && isError) clear();
  }, [token, isError, clear]);

  return <>{children}</>;
}
