import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "@/api/types";

interface CartState {
  items: Project[];
  add: (project: Project) => void;
  remove: (projectId: string) => void;
  clear: () => void;
  has: (projectId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (project) =>
        set((state) =>
          state.items.some((item) => item.id === project.id)
            ? state
            : { items: [project, ...state.items] }
        ),
      remove: (projectId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== projectId) })),
      clear: () => set({ items: [] }),
      has: (projectId) => get().items.some((item) => item.id === projectId),
    }),
    { name: "hextorq-cart" }
  )
);
