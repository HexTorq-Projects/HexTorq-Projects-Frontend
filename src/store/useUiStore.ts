import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthMode = "login" | "register";

interface UiState {
  // enquiry modal
  enquiry: { open: boolean; projectId?: string; projectTitle?: string };
  openEnquiry: (projectId?: string, projectTitle?: string) => void;
  closeEnquiry: () => void;

  // auth modal (inline login prompt for wishlist / enquire)
  authModal: { open: boolean; mode: AuthMode; redirectTo?: string };
  openAuth: (mode?: AuthMode, redirectTo?: string) => void;
  closeAuth: () => void;

  // mobile filter drawer + nav
  mobileNavOpen: boolean;
  setMobileNav: (v: boolean) => void;
  filterDrawerOpen: boolean;
  setFilterDrawer: (v: boolean) => void;
  filterPanelCollapsed: boolean;
  setFilterPanelCollapsed: (v: boolean) => void;

  // grid density config
  gridColumns: number;
  setGridColumns: (cols: number) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      enquiry: { open: false },
      openEnquiry: (projectId, projectTitle) =>
        set({ enquiry: { open: true, projectId, projectTitle } }),
      closeEnquiry: () => set({ enquiry: { open: false } }),

      authModal: { open: false, mode: "login" },
      openAuth: (mode = "login", redirectTo) =>
        set({ authModal: { open: true, mode, redirectTo } }),
      closeAuth: () => set((s) => ({ authModal: { ...s.authModal, open: false } })),

      mobileNavOpen: false,
      setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
      filterDrawerOpen: false,
      setFilterDrawer: (filterDrawerOpen) => set({ filterDrawerOpen }),
      filterPanelCollapsed: false,
      setFilterPanelCollapsed: (filterPanelCollapsed) => set({ filterPanelCollapsed }),

      gridColumns: 3,
      setGridColumns: (gridColumns) => set({ gridColumns }),
    }),
    { name: "hextorq-ui" }
  )
);
