import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminIdentity } from "@/api/types";

interface AdminAuthState {
  token: string | null;
  admin: AdminIdentity | null;
  setAuth: (token: string, admin: AdminIdentity) => void;
  clear: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      setAuth: (token, admin) => set({ token, admin }),
      clear: () => set({ token: null, admin: null }),
    }),
    { name: "hextorq-admin-auth" }
  )
);
