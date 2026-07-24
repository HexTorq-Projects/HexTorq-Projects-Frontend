import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReferralState {
  code: string | null;
  setCode: (code: string) => void;
  clear: () => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      code: null,
      setCode: (code) => set({ code }),
      clear: () => set({ code: null }),
    }),
    { name: "hextorq-referral" }
  )
);
